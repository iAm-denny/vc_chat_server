module.exports = (sequelize, Datatypes) => {
  const Friends = sequelize.define("Friends", {
    id: {
      type: Datatypes.UUID,
      defaultValue: Datatypes.UUIDV4,
      primaryKey: true,
    },
  });
  return Friends;
};
