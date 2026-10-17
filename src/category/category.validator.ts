import { checkSchema } from 'express-validator'

export default checkSchema({
    name: {
        exists: {
            errorMessage: 'category name is required!!',
        },
        isString: {
            errorMessage: 'Category name should be a string',
        },
    },

    priceConfiguration: {
        exists: {
            errorMessage: 'price configuration is required !!',
        },
    },

    'priceConfiguration.*.priceType': {
        exists: {
            errorMessage: 'priceType is required!!',
        },
        custom: {
            options: (value: string) => {
                const allowedValues = ['base', 'aditional']

                if (!allowedValues.includes(value)) {
                    throw new Error(
                        `${value} is invalid attribute for price type field. possible values are: [${allowedValues.join(', ')}]`,
                    )
                }

                return true
            },
        },
    },

    attributes: {
        exists: {
            errorMessage: 'Attributes field is required',
        },
    },
})
