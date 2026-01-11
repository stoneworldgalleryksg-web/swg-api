module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_categories', 'image', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.addColumn('tbl_categories', 'story', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('tbl_categories', 'image');
    await queryInterface.removeColumn('tbl_categories', 'story');
  }
};