"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("blogs", "duration", {
      type: Sequelize.INTEGER,
      allowNull: true, // Atur sesuai kebutuhan
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("blogs", "duration");
  },
};
