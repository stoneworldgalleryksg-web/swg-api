module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_forgot_password', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      user_type: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false
      },
      forgot_pwd_token: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      expire_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      is_used: {
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
    await queryInterface.dropTable('tbl_forgot_password');
  }
};
