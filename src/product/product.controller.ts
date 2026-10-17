import type { NextFunction, Request, Response } from 'express'
import type ProductService from './product.service.js'
import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'

class ProductController {
    constructor(private productService: ProductService) {}

    create(req: Request, response: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            next(createHttpError(400, result.array()[0]?.msg as string))
        }

        // const {
        //     name,
        //     description,
        //     categoryId,
        //     tenantId,
        //     priceConfiguration,
        //     attributes,
        //     isPublish,
        // } = req.body

        //    await this.productService.create({
        //         name,
        //         description,
        //         categoryId,
        //         tenantId,
        //         priceConfiguration,
        //         attributes,
        //         isPublish
        //     })
    }
}

export default ProductController
