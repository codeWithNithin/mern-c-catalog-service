import express from 'express'
import ProductController from './product.controller.js'
import ProductService from './product.service.js'
import asyncWrapper from '../common/utils/asyncWrapper.js'
import authenticate from '../common/middlewares/authenticate.js'
import { canAccess } from '../common/middlewares/canAccess.js'
import { Roles } from '../common/constant/index.js'
import productValidator from './product.validator.js'
import fileUpload from 'express-fileupload'
import createHttpError from 'http-errors'
import logger from '../config/logger.js'
import CloudinaryStorage from '../common/services/cloudinary.service.js'

const router = express.Router()

const productService = new ProductService()

const storage = new CloudinaryStorage()

const productController = new ProductController(productService, logger, storage)

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        useTempFiles: true,
        tempFileDir: '/tmp/',
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, 'File size exceeds the limit')
            next(error)
        },
    }),
    productValidator,
    asyncWrapper(productController.create.bind(productController)),
)

export default router
