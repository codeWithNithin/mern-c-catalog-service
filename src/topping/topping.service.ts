import toppingModel from './topping.model.js'
import type { Topping } from './topping.types.js'

export class ToppingService {
    async create(topping: Topping) {
        return await toppingModel.create(topping)
    }

    async getAll(tenantId: string) {
        // todo: !Important, add pagination
        return await toppingModel.find({ tenantId })
    }
}
