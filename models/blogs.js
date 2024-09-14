"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class blogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
    },
    {
      sequelize,
      modelName: "blogs",
    }
  );
  return blogs;
};
