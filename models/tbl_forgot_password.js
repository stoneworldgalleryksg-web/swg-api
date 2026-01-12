import { DataTypes } from 'sequelize';

const ForgotPassword = (sequelize) => sequelize.define('tbl_forgot_password', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  user_type: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false
  },
  forgot_pwd_token: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  expire_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_used: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0
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
  tableName: 'tbl_forgot_password',
  timestamps: false
});

export default ForgotPassword;
