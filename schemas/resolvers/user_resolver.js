const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { transporter } = require("../../mail");
const {
  UsersPending,
  Users,
  UsersNoti,
  Friends,
  sequelize,
  Rooms,
} = require("../../models");
const { decodedToken } = require("../../middlewares/decodedToken");

require("dotenv").config();

const generateTagLine = () => {
  return Math.random().toString(36).substr(2, 5);
};
let mailOptions = {
  from: "justinscold@gmail.com",
  subject: "Hello ✔ From Vc chat",
};
const userResolvers = {
  Query: {
    user: async (parent, args, context) => {
      const user = decodedToken(context.headers.authorization);
      if (user) {
        return user;
      } else {
        return { message: "user need authenticate" };
      }
    },
    getnotis: async (parent, args, context) => {
      const user = decodedToken(context.headers.authorization);
      if (user) {
        // let { page, limit } = args.input;
        // page = page ? page : 0;
        // limit = limit ? limit : 10;
        // const offset = page * limit;

        // ------- pagination
        // const raw_query =
        //   "SELECT users.username, users.profile_img, users.id, usersnotis.read, usersnotis.createdAt, usersnotis.receiver_id, usersnotis.user_id FROM usersnotis JOIN users ON  usersnotis.user_id  = users.id  WHERE usersnotis.receiver_id = ? LIMIT ?, ?";

        // const notis = await sequelize.query(raw_query, {
        //   replacements: [user.id, offset, limit],
        //   type: sequelize.QueryTypes.SELECT,
        // });
        const raw_query =
          "SELECT users.username, users.profile_img, users.id, usersnotis.read, usersnotis.createdAt, usersnotis.receiver_id, usersnotis.user_id FROM usersnotis JOIN users ON  usersnotis.user_id  = users.id  WHERE usersnotis.receiver_id = ?";

        const notis = await sequelize.query(raw_query, {
          replacements: [user.id],
          type: sequelize.QueryTypes.SELECT,
        });

        return notis;
      } else {
        return { message: "user need authenticate" };
      }
    },
    FriendList: async (parent, args, context) => {
      const user = decodedToken(context.headers.authorization);

      if (user) {
        const raw_query =
          "SELECT users.username, users.profile_img, users.id, users.email, friends.room_id FROM friends JOIN users ON  friends.friend_id  = users.id  WHERE friends.user_id = ?";
        const friends = await sequelize.query(raw_query, {
          replacements: [user.id],
          type: sequelize.QueryTypes.SELECT,
        });

        return { message: "success", users: friends };
      } else {
        return { message: "user need authenticate" };
      }
    },
  },

  Mutation: {
    createUser: async (parent, args) => {
      const { email, username, password, profile_img } = args.input;
      const tagline = generateTagLine();
      const searchUser = await Users.findOne({
        where: {
          email,
        },
      });

      if (searchUser === null) {
        const checkUserExistOrNot = await UsersPending.findOne({
          where: {
            email,
          },
        });
        if (checkUserExistOrNot != null) {
          await UsersPending.destroy({
            where: {
              email,
            },
          });
        }

        mailOptions.to = email;
        let otp_code = otpGenerator.generate(6, {
          upperCaseAlphabets: true,
          lowerCaseAlphabets: true,
          specialChars: false,
          digits: true,
        });
        try {
          bcrypt.hash(password, 10).then(async (hash) => {
            await UsersPending.create({
              email,
              username,
              password: hash,
              profile_img,
              otp_code: otp_code,
              tagline: tagline,
            });
            mailOptions.html = `
            Hello please do not share this with anyone <br />
            <h3>OTP code </h3>
            <p>${otp_code}</p>
            `;
            transporter.sendMail(mailOptions, (err, data) => {
              if (err) {
                return console.log("Error occurs");
              }
              return { message: "success" };
            });
            return { message: "success" };
          });
          return { message: "success" };
        } catch (err) {
          console.log("err", err);
          return { message: err };
        }
      } else {
        return { message: "user already exist" };
      }
    },

    checkOtp: async (parent, args) => {
      const { otp_code, email } = args.input;
      try {
        const findUser = await UsersPending.findOne({
          where: {
            email,
            otp_code,
          },
        });
        if (findUser === null) {
          return { message: "unsuccess" };
        } else {
          const { email, username, password, profile_img, tagline, id } =
            findUser.dataValues;

          await UsersPending.destroy({
            where: {
              email,
              id,
            },
          });
          const user = await Users.create({
            email,
            username,
            password,
            profile_img,
            tagline,
            status: "active",
          });
          const accessToken = jwt.sign(
            {
              id: user.id,
              email: user.email,
              username: user.username,
              profile_img: user.profile_img,
              status: "active",
              tagline: user.tagline,
            },
            process.env.JWT_SECRET
          );

          return { message: "success", token: accessToken };
        }
      } catch (err) {
        console.log("err", err);
        return { message: "unsuccess" };
      }
    },

    login: async (parent, args) => {
      const { email, password } = args.input;
      try {
        const user = await Users.findOne({
          where: {
            email: email,
          },
        });
        if (!user) {
          return { message: "Password doesn't match" };
        }
        return bcrypt.compare(password, user.password).then((match) => {
          if (!match) {
            return { message: "Password doesn't match" };
          }

          const accessToken = jwt.sign(
            {
              id: user.id,
              email: user.email,
              username: user.username,
              profile_img: user.profile_img,
              status: "active",
              tagline: user.tagline,
            },
            process.env.JWT_SECRET
          );

          return { message: "success", token: accessToken };
        });
      } catch (err) {
        console.log("err", err);
        return { message: "unsuccess" };
      }
    },
    requestFriend: async (parent, args, context) => {
      const { username, tagline } = args.input;

      try {
        const auth_user = decodedToken(context.headers.authorization);
        const user = await Users.findOne({
          where: {
            username,
            tagline,
          },
        });

        if (!user) {
          return {
            message: "not found",
          };
        }
        const checkFriendOrNot = await Friends.findOne({
          where: {
            user_id: auth_user.id,
            friend_id: user.id,
          },
        });

        if (checkFriendOrNot) {
          return { message: "already friend" };
        }
        if (user.id === auth_user.id) {
          return {
            message: "can't add self",
          };
        }
        if (user && user.id != auth_user.id) {
          const searchUser = await UsersNoti.findOne({
            where: {
              user_id: auth_user.id,
              receiver_id: user.id,
            },
          });
          if (searchUser) {
            await UsersNoti.destroy({
              where: {
                user_id: auth_user.id,
                receiver_id: user.id,
              },
            });
          }
          await UsersNoti.create({
            user_id: auth_user.id,
            receiver_id: user.id,
          });
          return { message: "success" };
        } else {
          return {
            message: "can't add self",
          };
        }
      } catch (err) {
        console.log("err", err);
        return { message: "unsuccess" };
      }
    },
    responseFriend: async (parent, args, context) => {
      const { status, sender_id } = args.input;
      try {
        const auth_user = decodedToken(context.headers.authorization);
        if (status === "accpeted") {
          await UsersNoti.destroy({
            where: {
              receiver_id: auth_user.id,
              user_id: sender_id,
            },
          });
          const room = await Rooms.create({
            user_id: auth_user.id,
            user2_id: sender_id,
          });

          await Friends.create({
            user_id: auth_user.id,
            friend_id: sender_id,
            room_id: room.room_id,
          });
          await Friends.create({
            user_id: sender_id,
            friend_id: auth_user.id,
            room_id: room.room_id,
          });
          return { message: "success" };
        } else if (status === "decline") {
          await UsersNoti.destroy({
            where: {
              receiver_id: auth_user.id,
              user_id: sender_id,
            },
          });
          return { message: "success" };
        }
      } catch (err) {
        console.log("err", err);
        return { message: "unsuccess" };
      }
    },
    updateNoti: async (parent, args, context) => {
      try {
        const auth_user = decodedToken(context.headers.authorization);

        await UsersNoti.update(
          {
            read: true,
          },
          {
            where: {
              read: false,
              receiver_id: auth_user.id,
            },
          }
        );
        return { message: "success" };
      } catch (err) {
        console.log("err", err);
        return { message: "unsuccess" };
      }
    },
  },
  getUserOrNot: {
    __resolveType(obj) {
      if (obj.id) {
        return "User";
      }
      if (obj.message) {
        return "responsesMessage";
      }
      return null;
    },
  },
};

module.exports = { userResolvers };
