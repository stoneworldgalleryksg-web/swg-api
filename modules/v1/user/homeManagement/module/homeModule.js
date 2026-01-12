import moment from 'moment';
import CODES from '../../../../../app_config/status_code.js';
import common from '../../../../../app_config/common.js';
import middleware from '../../../../../middleware/headerValidator.js';
import GLOBALS from '../../../../../app_config/constants.js';
import db from '../../../../../models/index.js';
import { Op } from 'sequelize';

const { tbl_products: Product, tbl_product_images: ProductImage, tbl_categories: Category } = db;

const homeModule = {
    
    async productDetail(data, res) {
        try {
            const { id } = data;
            
            const product = await Product.findOne({
                where: {
                    id,
                    is_deleted: 0,
                    is_active: 1
                },
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['id', 'image_url', 'is_primary']
                    },
                    {
                        model: Category,
                        as: 'category',
                        where: {
                            is_deleted: 0,
                            is_active: 1
                        },
                        attributes: ['id', 'name', 'slug', 'image', 'story']
                    }
                ]
            });
            
            if (!product) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, 'rest_keywords_product_not_found', null);
            }
            
            return middleware.sendApiResponse(res, CODES.SUCCESS, 'rest_keywords_product_fetched', product);
        } catch (error) {
            console.error('Product detail error:', error);
            return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_product_fetch_failed', null);
        }
    },
    
    async productListing(data, res) {
        try {
            const { page = 1, search = '' } = data;
            const limit = GLOBALS.PER_PAGE;
            const offset = (parseInt(page) - 1) * limit;
            
            const whereCondition = {
                is_deleted: 0,
                is_active: 1,
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
                        model: ProductImage,
                        as: 'images',
                        where: { is_primary: 1 },
                        required: false,
                        attributes: ['id', 'image_url', 'is_primary']
                    },
                    {
                        model: Category,
                        as: 'category',
                        where: {
                            is_deleted: 0,
                            is_active: 1
                        },
                        required: false,
                        attributes: ['id', 'name', 'slug']
                    }
                ],
                limit,
                offset,
                order: [['created_at', 'DESC']],
                distinct: true
            });
            
            if (count === 0) {
                return middleware.sendApiResponse(res, 0, 'rest_keywords_no_data_found', {
                    per_page: limit,
                    totalRowCount: 0,
                    products: []
                });
            }
            
            return middleware.sendApiResponse(res, CODES.SUCCESS, 'rest_keywords_products_fetched', {
                per_page: limit,
                totalRowCount: count,
                products: rows
            });
        } catch (error) {
            console.error('Product listing error:', error);
            return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_products_fetch_failed', null);
        }
    },
    
    async categoryListing(data, res) {
        try {
            const categories = await Category.findAll({
                where: {
                    is_deleted: 0,
                    is_active: 1
                },
                attributes: ['id', 'name', 'slug', 'image', 'story'],
                order: [['created_at', 'DESC']]
            });
            
            if (categories.length === 0) {
                return middleware.sendApiResponse(res, 0, 'rest_keywords_no_data_found', []);
            }
            
            const categoriesWithCount = await Promise.all(
                categories.map(async (category) => {
                    const productCount = await Product.count({
                        where: {
                            category_id: category.id,
                            is_deleted: 0,
                            is_active: 1
                        }
                    });
                    
                    return {
                        ...category.toJSON(),
                        total_products: productCount
                    };
                })
            );
            
            return middleware.sendApiResponse(res, CODES.SUCCESS, 'rest_keywords_categories_fetched', categoriesWithCount);
        } catch (error) {
            console.error('Category listing error:', error);
            return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_categories_fetch_failed', null);
        }
    },
    
    async productListByCategory(data, res) {
        try {
            const { categoryId, page = 1, search = '' } = data;
            const limit = GLOBALS.PER_PAGE;
            const offset = (parseInt(page) - 1) * limit;
            
            const whereCondition = {
                category_id: categoryId,
                is_deleted: 0,
                is_active: 1,
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
                        model: ProductImage,
                        as: 'images',
                        where: { is_primary: 1 },
                        required: false,
                        attributes: ['id', 'image_url', 'is_primary']
                    },
                    {
                        model: Category,
                        as: 'category',
                        where: {
                            is_deleted: 0,
                            is_active: 1
                        },
                        attributes: ['id', 'name', 'slug']
                    }
                ],
                limit,
                offset,
                order: [['created_at', 'DESC']],
                distinct: true
            });
            
            if (count === 0) {
                return middleware.sendApiResponse(res, 0, 'rest_keywords_no_data_found', {
                    per_page: limit,
                    totalRowCount: 0,
                    products: []
                });
            }
            
            return middleware.sendApiResponse(res, CODES.SUCCESS, 'rest_keywords_products_fetched', {
                per_page: limit,
                totalRowCount: count,
                products: rows
            });
        } catch (error) {
            console.error('Product list by category error:', error);
            return middleware.sendApiResponse(res, CODES.ERROR, 'rest_keywords_products_fetch_failed', null);
        }
    }
}

export default homeModule;