import moment from 'moment';
import CODES from '../../../../../app_config/status_code.js';
import GLOBALS from '../../../../../app_config/constants.js';
import middleware from '../../../../../middleware/headerValidator.js';
import Category from '../../../../../models/tbl_categories.js';
import cloudinaryService from '../../../../../utils/cloudinaryService.js';
import { Op } from 'sequelize';
import localizify from 'localizify';
import category from '../controller/categoryController.js';
const { t } = localizify;

const categoryModel = {

    async categoryCount(req , res) {
        try {
            const count = await Category.count({
                where: { is_deleted: 0 }
            });
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_category_count_fetched'), { total_categories : count });
        } catch (error) {
            console.error('Category count error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_category_count_fetch_failed'), null);
        }
    },

    async createCategory(req, res) {
        try {
            const { name, story } = req.body;
            
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            
            const existingCategory = await Category.findOne({ 
                where: { 
                    [Op.or]: [{ name }, { slug }],
                    is_deleted: 0 
                } 
            });
            
            if (existingCategory) {
                return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_category_already_exists'), null);
            }

            let imageUrl = null;
            if (req.file) {
                try {
                    const uploadResult = await cloudinaryService.uploadImage(req.file, 'categories');
                    imageUrl = uploadResult.secure_url;
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError);
                    return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_image_upload_failed'), null);
                }
            }
            const categoryData = {
                name,
                slug,
                story: story || null,
                image: imageUrl,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            const category = await Category.create(categoryData);
            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_category_created'), category);
        } catch (error) {
            console.error('Create category error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_category_create_failed'), null);
        }
    },

    async listCategory(req, res) {
        try {
            const { page = 1, search = '' } = req.body;
            const limit = GLOBALS.PER_PAGE;
            const offset = (parseInt(page) - 1) * limit;

            const whereCondition = {
                is_deleted: 0,
                ...(search && {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { slug: { [Op.like]: `%${search}%` } }
                    ]
                })
            };

            const { count, rows } = await Category.findAndCountAll({
                where: whereCondition,
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });

            if (count === 0) {
                return middleware.sendApiResponse(res, 0, t('rest_keywords_no_data_found'), {
                    per_page: limit,
                    totalRowCount: 0,
                    category: []
                });
            }

            const formattedRows = rows.map(row => ({
                ...row.toJSON(),
                status: row.is_active === 1 ? 'Active' : 'Inactive',
                created_at: row.created_at ? moment(row.created_at).format('DD-MM-YYYY HH:mm:ss') : null,
                updated_at: row.updated_at ? moment(row.updated_at).format('DD-MM-YYYY HH:mm:ss') : null
            }));

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_categories_fetched'), {
                per_page: limit,
                totalRowCount: count,
                category: formattedRows
            });
        } catch (error) {
            console.error('List categories error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_categories_fetch_failed'), null);
        }
    },

    async categoryDetail(req, res) {
        try {
            const { id } = req.body;

            const category = await Category.findOne({
                where: { id, is_deleted: 0 }
            });

            if (!category) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, t('rest_keywords_category_not_found'), null);
            }

            const formattedCategory = {
                ...category.toJSON(),
                status: category.is_active === 1 ? 'Active' : 'Inactive',
                created_at: category.created_at ? moment(category.created_at).format('DD-MM-YYYY HH:mm:ss') : null,
                updated_at: category.updated_at ? moment(category.updated_at).format('DD-MM-YYYY HH:mm:ss') : null
            };

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_category_fetched'), formattedCategory);
        } catch (error) {
            console.error('Get category error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_category_fetch_failed'), null);
        }
    },

    async updateCategory(req, res) {
        try {
            const { id, name, story, is_active } = req.body;

            const category = await Category.findOne({
                where: { id, is_deleted: 0 }
            });

            if (!category) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, t('rest_keywords_category_not_found'), null);
            }

            const updateData = {
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            };

            if (name && name !== category.name) {
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                
                const existingCategory = await Category.findOne({
                    where: {
                        [Op.or]: [{ name }, { slug }],
                        id: { [Op.ne]: id },
                        is_deleted: 0
                    }
                });

                if (existingCategory) {
                    return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_category_already_exists'), null);
                }

                updateData.name = name;
                updateData.slug = slug;
            }

            if (story !== undefined) {
                updateData.story = story;
            }

            if (req.file) {
                try {
                    const uploadResult = await cloudinaryService.uploadImage(req.file, 'categories');
                    updateData.image = uploadResult.secure_url;
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError);
                    return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_image_upload_failed'), null);
                }
            }

            if (is_active !== undefined) {
                updateData.is_active = is_active;
            }

            await Category.update(updateData, { where: { id } });

            const updatedCategory = await Category.findOne({
                where: { id, is_deleted: 0 }
            });

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_category_updated'), updatedCategory);
        } catch (error) {
            console.error('Update category error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_category_update_failed'), null);
        }
    },

    async deleteCategory(req, res) {
        try {
            const { id } = req.body;

            const category = await Category.findOne({
                where: { id, is_deleted: 0 }
            });

            if (!category) {
                return middleware.sendApiResponse(res, CODES.NOT_FOUND, t('rest_keywords_category_not_found'), null);
            }

            await Category.update(
                { 
                    is_deleted: 1,
                    updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                },
                { where: { id } }
            );

            return middleware.sendApiResponse(res, CODES.SUCCESS, t('rest_keywords_category_deleted'), null);
        } catch (error) {
            console.error('Delete category error:', error);
            return middleware.sendApiResponse(res, CODES.INVALID_REQUEST, t('rest_keywords_category_delete_failed'), null);
        }
    },

    async getCategoryById(req, res) {
        return this.categoryDetail(req, res);
    }

};

export default categoryModel;