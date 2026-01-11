module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_categories', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(180),
        unique: true
      },
      is_active: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1
      },
      is_deleted: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('tbl_categories');
  }
};
