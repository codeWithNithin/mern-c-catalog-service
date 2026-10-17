import productModel from './product.model.js'
import type { Product } from './product.types.js'

class ProductService {
    async create(productData: Product) {
        return (await productModel.create(productData)) as Product
    }
}

export default ProductService
