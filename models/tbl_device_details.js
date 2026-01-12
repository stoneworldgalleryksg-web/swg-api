import { DataTypes } from 'sequelize';

const DeviceDetails = (sequelize) => sequelize.define('tbl_device_details', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  device_token: {
    type: DataTypes.STRING(255)
  },
  token: {
    type: DataTypes.TEXT
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
  tableName: 'tbl_device_details',
  timestamps: false
});

export default DeviceDetails;
