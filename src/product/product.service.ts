import { paginationLabels } from '../config/pagination.js'
import productModel from './product.model.js'
import type { Filter, PaginateQuery, Product } from './product.types.js'

class ProductService {
    async create(productData: Product) {
        return (await productModel.create(productData)) as Product
    }

    async findById(id: string): Promise<Product | null> {
        return await productModel.findById(id)
    }

    async findByIdAndDelete(id: string) {
        return (await productModel.findByIdAndDelete(id)) as Product
    }

    async findByIdAndUpdate(id: string, data: Partial<Product>) {
        console.log('req body', { id, data })
        return (await productModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true },
        )) as Product
    }

    async find(q: string, filters: Filter, paginateQuery: PaginateQuery) {
        // to check for case insensitivity.. or converting it into lower case
        const searchQueryRegexp = new RegExp(q, 'i')

        const matchQuery = {
            ...filters,
            name: searchQueryRegexp,
        }

        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: '$category',
            },
        ])

        return productModel.aggregatePaginate(aggregate, {
            ...paginateQuery,
            customLabels: paginationLabels,
        })
    }
}

export default ProductService
