import common from '../app_config/common.js';
import moment from 'moment';

export default {
  async up(queryInterface, Sequelize) {
    const hashedPassword = common.hashPassword('Admin@123');

    
    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    await queryInterface.bulkInsert('tbl_admins', [
      {
        full_name: 'Super Admin',
        email: 'admin@swg.com',
        password: hashedPassword,
        role: 'admin',
        is_active: 1,
        is_deleted: 0,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'tbl_admins',
      { email: 'admin@swgcom' },
      {}
    );
  },
};
