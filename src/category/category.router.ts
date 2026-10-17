import express from 'express'
import CategoryController from './category.controller.js'
import categoryValidator from './category.validator.js'

const categoryRouter = express.Router()

const categoryController = new CategoryController()

categoryRouter.post('/', categoryValidator, categoryController.create)

export default categoryRouter
