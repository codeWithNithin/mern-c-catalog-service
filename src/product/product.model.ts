import mongoose, { type AggregatePaginateModel } from 'mongoose'
import type { Product } from './product.types.js'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const attributeValueSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
    },
})

const priceConfigurationSchema = new mongoose.Schema({
    priceType: {
        type: String,
        enum: ['base', 'additional'],
    },
    availableOptions: {
        type: Map,
        of: Number,
    },
})

const productSchema = new mongoose.Schema<Product>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema,
        },
        attributes: [attributeValueSchema],
        tenantId: {
            type: String,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        isPublish: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    { timestamps: true },
)

productSchema.plugin(aggregatePaginate)
export default mongoose.model<Product, AggregatePaginateModel<Product>>(
    'Product',
    productSchema,
)
