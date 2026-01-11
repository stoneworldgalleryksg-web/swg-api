module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_users', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: Sequelize.STRING(100)
      },
      last_name: {
        type: Sequelize.STRING(100)
      },
      email: {
        type: Sequelize.STRING(150),
        unique: true,
        allowNull: false
      },
      mobile: {
        type: Sequelize.STRING(15)
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      profile_password: {
        type: Sequelize.STRING(255)
      },
      profile_picture: {
        type: Sequelize.STRING(255)
      },
      role: {
        type: Sequelize.ENUM('owner', 'tenant', 'family', 'guest'),
        defaultValue: 'tenant'
      },
      is_approved: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1
      },
      is_deleted: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0
      },
      last_login: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('tbl_users');
  }
};
