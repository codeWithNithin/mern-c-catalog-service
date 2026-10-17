import { body } from 'express-validator'

export default [
    body('name')
        .exists()
        .withMessage('product name is required!!')
        .isString()
        .withMessage('product name should be a string'),
    body('description')
        .exists()
        .withMessage('product description is required!!')
        .isString()
        .withMessage('product description should be a string'),
    body('priceConfiguration')
        .exists()
        .withMessage('price configuration is required !!'),
    body('priceConfiguration.*.priceType')
        .exists()
        .withMessage('priceType is required!!')
        .custom((value: 'base' | 'aditional') => {
            console.log('price type val', value)
            const allowedValues = ['base', 'aditional']
            if (!allowedValues.includes(value)) {
                throw new Error(
                    `${value} is invalid attribute for price type field. possible values are: [${allowedValues.join(',')}]`,
                )
            }
            return true
        }),
    body('attributes').exists().withMessage('Attributes field is required'),
    body('tenantId').exists().withMessage('tenant id is required!!').isString(),
    body('categoryId')
        .exists()
        .withMessage('categoryId is required!!')
        .isString(),
    // body("image").custom((value, { req }) => {
    //     if (!req.files) throw new Error("Product image is required");
    //     return true;
    // }),
]
