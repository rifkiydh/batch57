"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class blogs extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  blogs.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      node_js: DataTypes.STRING,
      react_js: DataTypes.STRING,
      php: DataTypes.STRING,
      java: DataTypes.STRING,
      author: DataTypes.STRING,
      image: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "blogs",
    }
  );
  return blogs;
};
