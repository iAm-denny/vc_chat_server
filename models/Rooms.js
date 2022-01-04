module.exports = (sequelize, Datatypes) => {
  const Rooms = sequelize.define("Rooms", {
    room_id: {
      type: Datatypes.UUID,
      defaultValue: Datatypes.UUIDV4,
      primaryKey: true,
    },
  });
  Rooms.associate = (models) => {
    Rooms.hasMany(models.Friends, {
      onDelete: "cascade",
      foreignKey: "room_id",
    });
  };
  return Rooms;
};
