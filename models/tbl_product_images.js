import { DataTypes } from 'sequelize';

const ProductImage = (sequelize) => {
  const model = sequelize.define('tbl_product_images', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.BIGINT
  },
  image_url: {
    type: DataTypes.TEXT
  },
  is_primary: {
    type: DataTypes.TINYINT(1)
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
  tableName: 'tbl_product_images',
  timestamps: false
  });

  model.associate = (models) => {
    model.belongsTo(models.tbl_products, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return model;
};

export default ProductImage;
