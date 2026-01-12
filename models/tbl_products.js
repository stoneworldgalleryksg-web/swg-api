import { DataTypes } from 'sequelize';

const Product = (sequelize) => {
  const model = sequelize.define('tbl_products', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.BIGINT
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(220),
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  quantity: {
    type: DataTypes.INTEGER
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
  tableName: 'tbl_products',
  timestamps: false
  });

  model.associate = (models) => {
    model.belongsTo(models.tbl_categories, {
      foreignKey: 'category_id',
      as: 'category'
    });
    model.hasMany(models.tbl_product_images, {
      foreignKey: 'product_id',
      as: 'images'
    });
  };

  return model;
};

export default Product;
