import { DataTypes } from 'sequelize';
import sequelize from '../app_config/database.js';

const ProductImage = sequelize.define('tbl_product_images', {
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

ProductImage.associate = (models) => {
  ProductImage.belongsTo(models.tbl_products, {
    foreignKey: 'product_id',
    as: 'product'
  });
};

export default ProductImage;
