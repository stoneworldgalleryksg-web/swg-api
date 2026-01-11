import { DataTypes } from 'sequelize';
import sequelize from '../app_config/database.js';

const Category = sequelize.define('tbl_categories', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(180),
    unique: true
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  story: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'tbl_categories',
  timestamps: false
});

export default Category;