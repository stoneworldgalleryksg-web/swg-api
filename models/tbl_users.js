import { DataTypes } from "sequelize";

const User = (sequelize) => sequelize.define(
  "tbl_users",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
    },
    last_name: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(15),
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profile_password: {
      type: DataTypes.STRING(255),
    },
    profile_picture: {
      type: DataTypes.STRING(255),
    },
    role: {
      type: DataTypes.ENUM("owner", "tenant", "family", "guest"),
      defaultValue: "tenant",
    },
    is_approved: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1,
    },
    is_deleted: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    last_login: {
      type: DataTypes.DATE,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "tbl_users",
    timestamps: false,
  }
);

export default User;
