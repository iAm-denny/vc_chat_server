module.exports = (sequelize, Datatypes) => {
  const Messages = sequelize.define("Messages", {
    id: {
      type: Datatypes.UUID,
      defaultValue: Datatypes.UUIDV4,
      primaryKey: true,
    },
    message: {
      type: Datatypes.TEXT,
      allowNull: false,
    },
    read: {
      type: Datatypes.BOOLEAN,
      defaultValue: false,
    },
  });
  Messages.associate = (models) => {
    Messages.belongsTo(models.Rooms, {
      onDelete: "cascade",
      foreignKey: "room_id",
    });
  };
  return Messages;
};
