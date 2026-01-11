import moment from 'moment';
import CODES from '../../../../../app_config/status_code.js';
import GLOBALS from '../../../../../app_config/constants.js';
import middleware from '../../../../../middleware/headerValidator.js';
import Product from '../../../../../models/tbl_products.js';
import ProductImage from '../../../../../models/tbl_product_images.js';
import Category from '../../../../../models/tbl_categories.js';
import { Op } from 'sequelize';
import localizify from 'localizify';
import common from '../../../../../app_config/common.js';
import db from '../../../../../models/index.js';

const { t } = localizify;

const productModel = {


    // ===== Create Product =====
    async createProduct(req, res) {
        const transaction = await db.sequelize.transaction();

        try {
            const { name, description, price, quantity } = req.body;
            let { category_id } = req.body;
            const images = req.files;
            
            category_id = parseInt(category_id);
            
            if (isNaN(category_id) || category_id <= 0) {
                await transaction.rollback();
                return middleware.sendApiResponse(
                    res,
                    CODES.INVALID_REQUEST,
                    'Invalid category ID',
                    null
                );
            }
            
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            const existingProduct = await Product.findOne({
                where: {
                    [Op.or]: [{ name }, { slug }],
                    is_deleted: 0
                },
                transaction
            });

            if (existingProduct) {
                await transaction.rollback();
                return middleware.sendApiResponse(
                    res,
                    CODES.INVALID_REQUEST,
                    t('rest_keywords_product_already_exists'),
                    null
                );
            }

            const productData = {
                name,
                slug,
                category_id,
                description,
                price: price || 0,
                quantity: quantity || 0,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            };

            const product = await Product.create(productData, { transaction });

            if (!images || images.length === 0) {
                await transaction.rollback();
                return middleware.sendApiResponse(
                    res,
                    CODES.INVALID_REQUEST,
                    'Product images are required',
                    null
                );
            }

            await common.handleProductImages(product.id, images, transaction);
            await transaction.commit();

            return middleware.sendApiResponse(
                res,
                CODES.SUCCESS,
                t('rest_keywords_product_created'),
                product
            );
        } catch (error) {
            await transaction.rollback();
            console.error('Create product error:', error);

            return middleware.sendApiResponse(
                res,
                CODES.INVALID_REQUEST,
                t('rest_keywords_product_create_failed'),
                null
            );
        }
    },

    async listProduct(req, res) {
        try {
            const { page = 1, search = '' } = req.body;
            const limit = GLOBALS.PER_PAGE;
            const offset = (parseInt(page) - 1) * limit;

            const whereCondition = {
                is_deleted: 0,  
                ...(search && {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { slug: { [Op.like]: `%${search}%` } },
                        { description: { [Op.like]: `%${search}%` } }
                    ]
                })
            };

            const { count, rows } = await Product.findAndCountAll({
                where: whereCondition,
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name']
                    },
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['id', 'image_url', 'is_primary']
                    }
                ],
                limit,
                offset,
                order: [['created_at', 'DESC']],
                distinct: true
            });

            if (count === 0) {
                return middleware.sendApiResponse(res, 0, t('rest_keywords_no_data_found'), {
                    per_page: limit,
                    totalRowCount: 0,
                    products: []
                });
            }

            const formattedRows = rows.map(row => ({
                ...row.toJSON(),
                status: row.is_active === 1 ? 'Active' : 'Inactive',
                created_at: row.created_at ? moment(row.created_at).format('DD-MM-YYYY HH:mm:ss') : null,
                updated_at: row.updated_at ? moment(row.updated_at).format('DD-MM-YYYY HH:mm:ss') : null
            }));

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_products_fetched'), {
                per_page: limit,
                totalRowCount: count,
                products: formattedRows
            });
        } catch (error) {
            console.error('List products error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_products_fetch_failed'), null);
        }
    },

    async countProducts(req, res) {
        try {
            const count = await Product.count({
                where: { is_deleted: 0 }
            });
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_products_count'), { total_products: count });
        } catch (error) {
            console.error('Count products error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_products_count_failed'), null);
        }
    },

    async productDetails(req, res) {
        try {
            const { id } = req.body;

            const product = await Product.findOne({
                where: { id, is_deleted: 0 },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name']
                    },
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['id', 'image_url', 'is_primary']
                    }
                ]
            });

            if (!product) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, t('rest_keywords_product_not_found'), null);
            }

            const formattedProduct = {
                ...product.toJSON(),
                status: product.is_active === 1 ? 'Active' : 'Inactive',
                created_at: product.created_at ? moment(product.created_at).format('DD-MM-YYYY HH:mm:ss') : null,
                updated_at: product.updated_at ? moment(product.updated_at).format('DD-MM-YYYY HH:mm:ss') : null
            };

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_product_fetched'), product);
        } catch (error) {
            console.error('Get product error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_product_fetch_failed'), null);
        }
    },

    async updateProduct(req, res) {
        try {
            const { id, name, category_id, description, price, quantity, is_active, existing_files  } = req.body;
            console.log('Update Product - Req Body:', req.body);
            const existingImageIds = existing_files || [];
            const newImages = req.files || [];

            console.log('Existing Image IDs:', existingImageIds);

            console.log('New Images:', newImages);

            const product = await Product.findOne({
                where: { id, is_deleted: 0 }
            });

            if (!product) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, t('rest_keywords_product_not_found'), null);
            }

            const updateData = {
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            };

            if (name && name !== product.name) {
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                const existingProduct = await Product.findOne({
                    where: {
                        [Op.or]: [{ name }, { slug }],
                        id: { [Op.ne]: id },
                        is_deleted: 0
                    }
                });

                if (existingProduct) {
                    return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_product_already_exists'), null);
                }

                updateData.name = name;
                updateData.slug = slug;
            }

            if (category_id !== undefined) updateData.category_id = category_id;
            if (description !== undefined) updateData.description = description;
            if (price !== undefined && price !== '') updateData.price = price;
            if (quantity !== undefined && quantity !== '') updateData.quantity = quantity;
            if (is_active !== undefined) updateData.is_active = is_active;

            await Product.update(updateData, { where: { id } });

            // Handle images: KEEP existing_files, ADD req.files, DELETE rest
            if (existingImageIds.length > 0 || newImages.length > 0) {
                // Delete images NOT in existing_files list
                if (existingImageIds.length > 0) {
                    await ProductImage.destroy({
                        where: {
                            product_id: id,
                            id: { [Op.notIn]: existingImageIds }
                        }
                    });
                } else {
                    await ProductImage.destroy({ where: { product_id: id } });
                }

                if (newImages.length > 0) {
                    await common.handleProductImages(id, newImages);
                }
            }

            const updatedProduct = await Product.findOne({
                where: { id, is_deleted: 0 },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name']
                    },
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['id', 'image_url', 'is_primary']
                    }
                ]
            });

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_product_updated'), updatedProduct);
        } catch (error) {
            console.error('Update product error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_product_update_failed'), null);
        }
    },

    async deleteProduct(req, res) {
        try {
            const { id } = req.body;

            const product = await Product.findOne({
                where: { id, is_deleted: 0 }
            });

            if (!product) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, t('rest_keywords_product_not_found'), null);
            }

            await Product.update(
                {
                    is_deleted: 1,
                    updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                },
                { where: { id } }
            );

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_product_deleted'), null);
        } catch (error) {
            console.error('Delete product error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_product_delete_failed'), null);
        }
    },

    async deleteProductImage(req, res) {
        try {
            const { product_id, image_url } = req.body;

            const deleted = await ProductImage.destroy({
                where: {
                    product_id,
                    image_url
                }
            });

            if (deleted === 0) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, 'Image not found', null);
            }

            return middleware.sendApiResponse(res, CODES.SUCCESS, 'Image deleted successfully', null);
        } catch (error) {
            console.error('Delete image error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, 'Failed to delete image', null);
        }
    }

};

export default productModel;