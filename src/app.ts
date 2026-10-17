import express from 'express'
import { globalErrorHandler } from './common/middlewares/globalErrHandler.js'
import cookieParser from 'cookie-parser'
import categoryRouter from './category/category.router.js'
import productRouter from './product/product.router.js'

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use('/category', categoryRouter)
app.use('/product', productRouter)

app.use(globalErrorHandler)

export default app
