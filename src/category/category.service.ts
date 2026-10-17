import categoryModel from './category.model.js'
import type { Category } from './category.types.js'

export default class CategoryService {
    async create(category: Category) {
        return await categoryModel.create(category)
    }
}
