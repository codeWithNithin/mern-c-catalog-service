import type { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import type CategoryService from './category.service.js'
import type { Logger } from 'winston'
import type { Category, PriceConfig } from './category.types.js'

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

    async index(req: Request, res: Response) {
        // const sleep = (ms: number) =>
        //     new Promise((resolve) => setTimeout(resolve, ms));
        // await sleep(5000);
        const categories = await this.categoryService.getAll()
        this.logger.info(`Getting categories list`)
        res.json(categories)
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { categoryId } = req.params

        const category = await this.categoryService.getOne(categoryId as string)

        if (!category) {
            return next(createHttpError(404, 'Category not found'))
        }
        this.logger.info(`Getting category`, { id: category._id })
        res.json(category)
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0]?.msg as string))
        }

        const categoryId = req.params.id
        const updateData = req.body as Partial<Category>

        // Check if category exists
        const existingCategory = await this.categoryService.getOne(
            categoryId as string,
        )

        if (!existingCategory) {
            return next(createHttpError(404, 'Category not found'))
        }

        if (updateData.priceConfiguration) {
            // Convert existing Map to object if it's a Map
            const existingConfig =
                existingCategory.priceConfiguration instanceof Map
                    ? Object.fromEntries(existingCategory.priceConfiguration)
                    : existingCategory.priceConfiguration

            // Merge configurations
            const mergedConfig: PriceConfig = {
                ...existingConfig,
                ...updateData.priceConfiguration,
            }

            updateData.priceConfiguration = mergedConfig
        }

        const updatedCategory = await this.categoryService.update(
            categoryId as string,
            updateData,
        )

        this.logger.info(`Updated category`, { id: categoryId })

        res.json({
            id: updatedCategory?._id,
        })
    }
}
