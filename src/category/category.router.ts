import express from 'express'
import CategoryController from './category.controller.js'
import categoryValidator from './category.validator.js'
import CategoryService from './category.service.js'
import logger from '../config/logger.js'
import asyncWrapper from '../common/utils/asyncWrapper.js'
import authenticate from '../common/middlewares/authenticate.js'
import { canAccess } from '../common/middlewares/canAccess.js'
import { Roles } from '../common/constant/index.js'
import updateCategoryValidator from './update-category.validator.js'

const categoryRouter = express.Router()

const categoryService = new CategoryService()
const categoryCtrl = new CategoryController(categoryService, logger)

categoryRouter.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWrapper(categoryCtrl.create.bind(categoryCtrl)),
)

categoryRouter.patch(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    updateCategoryValidator,
    asyncWrapper(categoryCtrl.update.bind(categoryCtrl)),
)

categoryRouter.get('/', asyncWrapper(categoryCtrl.index.bind(categoryCtrl)))
categoryRouter.get(
    '/:categoryId',
    asyncWrapper(categoryCtrl.getOne.bind(categoryCtrl)),
)

export default categoryRouter
