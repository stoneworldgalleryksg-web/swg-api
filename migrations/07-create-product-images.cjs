module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_product_images', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      product_id: {
        type: Sequelize.BIGINT
      },
      image_url: {
        type: Sequelize.TEXT
      },
      is_primary: {
        type: Sequelize.TINYINT(1)
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
    await queryInterface.dropTable('tbl_product_images');
  }
};