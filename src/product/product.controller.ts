import type { NextFunction, Request, Response } from 'express'
import type ProductService from './product.service.js'
import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'
import type { UploadedFile } from 'express-fileupload'
import { v4 as uuidv4 } from 'uuid'
import type { Logger } from 'winston'
import type CloudinaryStorage from '../common/services/cloudinary.service.js'

class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
        private storage: CloudinaryStorage,
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

            response.status(200).json({ id: newProduct._id })
        } catch (err) {
            console.log('err', err)
        }
    }
}

export default ProductController
