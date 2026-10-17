import type { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'

export default class CategoryController {
    async create(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req)

        if (!result.isEmpty()) {
            next(createHttpError(400, result.array()))
        }
    }
}
