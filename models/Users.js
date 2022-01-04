module.exports = (sequelize, Datatypes) => {
  const Users = sequelize.define("Users", {
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
    status: {
      type: Datatypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    tagline: {
      type: Datatypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    socket_id: {
      type: Datatypes.STRING,
      allowNull: true,
    },
  });
  Users.associate = (models) => {
    Users.hasMany(models.UsersNoti, {
      onDelete: "cascade",
      foreignKey: "user_id",
    });
    Users.hasMany(models.UsersNoti, {
      onDelete: "cascade",
      foreignKey: "receiver_id",
    });

    Users.hasMany(models.Friends, {
      onDelete: "cascade",
      foreignKey: "user_id",
    });
    Users.hasMany(models.Friends, {
      onDelete: "cascade",
      foreignKey: "friend_id",
    });
    Users.hasMany(models.Messages, {
      onDelete: "cascade",
      foreignKey: "sender_id",
    });
    Users.hasMany(models.Messages, {
      onDelete: "cascade",
      foreignKey: "receiver_id",
    });
    Users.hasMany(models.Rooms, {
      onDelete: "cascade",
      foreignKey: "user_id",
    });
    Users.hasMany(models.Rooms, {
      onDelete: "cascade",
      foreignKey: "user2_id",
    });
  };
  return Users;
};
