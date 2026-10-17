import mongoose from 'mongoose'

export interface PriceConfiguration {
    [key: string]: {
        priceType: 'base' | 'additional'
        availableOptions: {
            [key: string]: number
        }
    }
}

export interface Product {
    _id?: mongoose.Types.ObjectId
    name: string
    description: string
    categoryId: mongoose.Schema.Types.ObjectId
    tenantId: string
    image: string
    priceConfiguration: PriceConfiguration
    attributes: []
    isPublish?: boolean
}

export interface Filter {
    tenantId?: string
    categoryId?: mongoose.Types.ObjectId
    isPublish?: boolean
}

export interface PaginateQuery {
    page: number
    limit: number
}

export enum ProductEvents {
    PRODUCT_CREATE = 'PRODUCT_CREATE',
    PRODUCT_UPDATE = 'PRODUCT_UPDATE',
    PRODUCT_DELETE = 'PRODUCT_DELETE',
}
