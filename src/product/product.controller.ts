import type { NextFunction, Request, Response } from 'express'
import type ProductService from './product.service.js'
import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'
import type { UploadedFile } from 'express-fileupload'
import { v4 as uuidv4 } from 'uuid'
import type { Logger } from 'winston'
import type CloudinaryStorage from '../common/services/cloudinary.service.js'
import { ProductEvents, type Filter, type Product } from './product.types.js'
import { Roles } from '../common/constant/index.js'
import mongoose from 'mongoose'
import type { MessageProducerBroker } from '../common/types/broker.js'
import { mapToObject } from '../utils.js'

class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
        private storage: CloudinaryStorage,
        private broker: MessageProducerBroker,
    ) {}

    async create(req: Request, response: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            next(createHttpError(400, result.array()[0]?.msg as string))
        }

        try {
            // TODO: UPLOAD IMAGE TO CLOUDINARY
            const image = req.files!.image as unknown as UploadedFile
            const imageName = uuidv4()

            console.log('image', image)
            console.log('image name', imageName)

            await this.storage.upload({
                filename: imageName,
                fileData: image.data.buffer,
                tempFilePath: image.tempFilePath,
            })

            const {
                name,
                description,
                categoryId,
                tenantId,
                priceConfiguration,
                attributes,
                isPublish,
            } = req.body

            const newProduct = await this.productService.create({
                name,
                description,
                categoryId,
                tenantId,
                priceConfiguration: JSON.parse(priceConfiguration),
                attributes: JSON.parse(attributes),
                isPublish,
                image: imageName,
            })

            await this.broker.sendMessage(
                'product',
                JSON.stringify({
                    event_type: ProductEvents.PRODUCT_CREATE,
                    data: {
                        id: newProduct._id,
                        // todo: fix the typescript error
                        priceConfiguration: mapToObject(
                            newProduct.priceConfiguration as unknown as Map<
                                string,
                                unknown
                            >,
                        ),
                    },
                }),
            )

            response.status(200).json({ id: newProduct._id })
        } catch (err) {
            console.log('err', err)
        }
    }
    async findById(req: Request, res: Response, next: NextFunction) {
        const { productId } = req.params
        const exisingProduct = await this.productService.findById(
            productId as string,
        )

        if (!exisingProduct) {
            return next(createHttpError(404, 'Product not found'))
        }

        const url = this.storage.getObjectUri(exisingProduct.image)
        console.log('url', url)
        console.log('result', exisingProduct)

        res.status(200).json({ data: exisingProduct, url })
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { productId } = req.params

        const exisitngProduct = await this.productService.findById(
            productId as string,
        )

        if (!exisitngProduct) {
            return next(createHttpError(404, 'Product not found'))
        }

        // delete the image that u stored for this particular id from cloudinary
        await this.storage.delete(exisitngProduct.image)

        await this.productService.findByIdAndDelete(productId as string)

        res.json({ id: productId })
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0]?.msg as string))
        }

        const {
            name,
            description,
            categoryId,
            tenantId,
            priceConfiguration,
            attributes,
            isPublish,
        } = req.body

        const { productId } = req.params

        const exisitngProduct = await this.productService.findById(
            productId as string,
        )
        if (!exisitngProduct) {
            return next(createHttpError(404, 'Product not found'))
        }

        //    check if the one who updating the product is admin or not?
        // .if admin then give direct permission to update
        // if not, then cehck if product id matches with manager that is creating the id...
        if (req.auth!.role !== Roles.ADMIN) {
            const tenant = req.auth?.tenantId
            if (exisitngProduct.tenantId !== tenant) {
                return next(
                    createHttpError(
                        403,
                        'You are not allowed to access this product',
                    ),
                )
            }
        }

        let imageName: string | undefined
        let oldImage: string | undefined

        if (req.files?.image) {
            oldImage = exisitngProduct.image

            const image = req.files.image as UploadedFile
            imageName = uuidv4()

            await this.storage.upload({
                filename: imageName,
                fileData: image.data.buffer,
                tempFilePath: image.tempFilePath,
            })

            await this.storage.delete(oldImage as string)
        }

        const product = {
            name,
            description,
            categoryId,
            tenantId,
            priceConfiguration: JSON.parse(priceConfiguration) as string,
            attributes: JSON.parse(attributes) as string,
            isPublish,
            image: imageName,
        }

        await this.productService.findByIdAndUpdate(
            productId as string,
            product as unknown as Product,
        )

        res.json({ id: productId })
    }

    async find(req: Request, res: Response) {
        const { q, tenantId, categoryId, isPublish } = req.query

        const filters: Filter = {}

        if (isPublish === 'true') {
            filters.isPublish = true
        }

        if (tenantId) filters.tenantId = tenantId as string

        if (
            categoryId &&
            mongoose.Types.ObjectId.isValid(categoryId as string)
        ) {
            filters.categoryId = new mongoose.Types.ObjectId(
                categoryId as string,
            )
        }

        // todo: add logging
        const products = await this.productService.find(q as string, filters, {
            page: req.query.page
                ? Number.parseInt(req.query.page as string)
                : 1,
            limit: req.query.limit
                ? Number.parseInt(req.query.limit as string)
                : 10,
        })

        const finalProducts = (products.data as Product[]).map(
            (product: Product) => {
                return {
                    ...product,
                    image: this.storage.getObjectUri(product.image),
                }
            },
        )

        console.log('get all products resp', finalProducts)

        res.json({
            data: finalProducts,
            total: products.total,
            pageSize: products.limit,
            currentPage: products.page,
        })
    }
}

export default ProductController
