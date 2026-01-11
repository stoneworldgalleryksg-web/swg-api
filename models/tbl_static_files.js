import { DataTypes } from 'sequelize';
import sequelize from '../app_config/database.js';

const StaticFile = sequelize.define('tbl_static_files', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  file_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_active: {
    type: DataTypes.TINYINT(1),
    defaultValue: 1
  },
  is_deleted: {
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
  tableName: 'tbl_static_files',
  timestamps: false
});

export default StaticFile;