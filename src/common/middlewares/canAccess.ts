import type { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'

export const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const roleFromToken = req.auth!.role

        if (!roles.includes(roleFromToken)) {
            const error = createHttpError(
                403,
                "You don't have enough permissions",
            )

            next(error)
            return
        }
        next()
    }
}
