module.exports = (sequelize, Datatypes) => {
  const UsersNoti = sequelize.define("UsersNoti", {
    id: {
      type: Datatypes.UUID,
      defaultValue: Datatypes.UUIDV4,
      primaryKey: true,
    },
    read: {
      type: Datatypes.BOOLEAN,
      defaultValue: false,
    },
  });
  return UsersNoti;
};
