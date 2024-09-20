"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Mengubah tipe kolom duration menjadi TEXT
    await queryInterface.changeColumn("blogs", "duration", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Jika rollback, kembalikan kolom duration ke INTEGER
    await queryInterface.changeColumn("blogs", "duration", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
