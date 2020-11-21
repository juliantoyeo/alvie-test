module.exports = (sequelize, DataTypes) => {
  const CultureDerobee = sequelize.define('CultureDerobee', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    
    name: { type: DataTypes.STRING, allowNull: true },
    code: { type: DataTypes.STRING, allowNull: true },
  }, {
    underscored: true,
    tableName: 'culture_derobees',
  });

  return CultureDerobee;
};