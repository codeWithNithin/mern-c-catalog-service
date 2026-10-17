import type { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import type CategoryService from './category.service.js'
import type { Logger } from 'winston'

export default class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {}
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = validationResult(req)

            if (!result.isEmpty()) {
                next(createHttpError(400, result.array()[0]?.msg as string))
            }

            const { name, priceConfiguration, attributes } = req.body

            const category = await this.categoryService.create({
                name,
                priceConfiguration,
                attributes,
            })

            this.logger.info('category has been created', { id: category?._id })

            res.json({ id: category._id })
        } catch (err) {
            this.logger.error(err)
            const error = createHttpError(500, 'Internal server err')
            next(error)
        }
    }
}
