import express from 'express'
import ProductController from './product.controller.js'
import ProductService from './product.service.js'
import asyncWrapper from '../common/utils/asyncWrapper.js'

const router = express.Router()

const productService = new ProductService()

const productController = new ProductController(productService)

router.post('/', asyncWrapper(productController.create.bind(productController)))

export default router
