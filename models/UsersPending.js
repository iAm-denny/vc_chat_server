module.exports = (sequelize, Datatypes) => {
  const UsersPending = sequelize.define("UsersPending", {
    id: {
      type: Datatypes.UUID,
      defaultValue: Datatypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    username: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    password: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    profile_img: {
      type: Datatypes.TEXT,
      allowNull: false,
    },
    otp_code: {
      type: Datatypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    tagline: {
      type: Datatypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  });
  return UsersPending;
};
