import express from 'express'
import fileUpload from 'express-fileupload'
import { Roles } from '../common/constant/index.js'
import authenticate from '../common/middlewares/authenticate.js'
import { canAccess } from '../common/middlewares/canAccess.js'
import createHttpError from 'http-errors'
import toppingValidator from './topping.validator.js'
import asyncWrapper from '../common/utils/asyncWrapper.js'
import { ToppingService } from './topping.service.js'
import { ToppingController } from './topping.controller.js'
import CloudinaryStorage from '../common/services/cloudinary.service.js'

const router = express.Router()

const toppingService = new ToppingService()

const storage = new CloudinaryStorage()

const toppingController = new ToppingController(toppingService, storage)

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, 'File size exceeds the limit')
            next(error)
        },
    }),
    toppingValidator,
    asyncWrapper(toppingController.create.bind(toppingController)),
)

router.get('/', asyncWrapper(toppingController.get.bind(toppingController)))
