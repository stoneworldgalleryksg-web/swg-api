import { DataTypes } from 'sequelize';

const Admin = (sequelize) => sequelize.define('tbl_admins', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING(150)
  },
  email: {
    type: DataTypes.STRING(150),
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  profile_picture: {
    type: DataTypes.STRING(255)
  },
  role: {
    type: DataTypes.ENUM('admin', 'sub_admin'),
    defaultValue: 'admin'
  },
  is_active: {
    type: DataTypes.TINYINT(1),
    defaultValue: 1
  },
  is_deleted: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0
  },
  last_login: {
    type: DataTypes.DATE
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tbl_admins',
  timestamps: false
});

export default Admin;
