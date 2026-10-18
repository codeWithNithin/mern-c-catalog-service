import type { NextFunction, Response } from 'express'
import type { ToppingService } from './topping.service.js'
import type { Request } from 'express-jwt'
import type { FileStorage } from '../common/types/storage.js'
import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'
import type { Topping } from './topping.types.js'
import type { UploadedFile } from 'express-fileupload'
import { v4 as uuidv4 } from 'uuid'

export class ToppingController {
    constructor(
        private toppingService: ToppingService,
        private storage: FileStorage,
    ) {}

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const toppings = await this.toppingService.getAll(
                req.query.tenantId as string,
            )

            // todo: add error handling
            const readyToppings = toppings.map((topping) => {
                return {
                    id: topping._id,
                    name: topping.name,
                    price: topping.price,
                    tenantId: topping.tenantId,
                    image: this.storage.getObjectUri(topping.image),
                }
            })
            res.status(200).json(readyToppings)
        } catch (err) {
            const error = createHttpError(500, `internal server err: ${err}`)
            return next(error)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req)

        if (!result.isEmpty()) {
            next(createHttpError(400, result.array()[0]?.msg as string))
        }

        const image = req.files!.image as unknown as UploadedFile
        const imageName = uuidv4()

        console.log('image', image)
        console.log('image name', imageName)

        await this.storage.upload({
            filename: imageName,
            fileData: image.data.buffer,
            tempFilePath: image.tempFilePath,
        })

        const savedTopping = await this.toppingService.create({
            ...req.body,
            image: imageName,
            tenantId: req.body.tenantId,
        } as Topping)

        res.json({ id: savedTopping._id })
    }
}
