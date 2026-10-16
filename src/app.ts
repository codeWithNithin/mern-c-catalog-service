import express from 'express'
import { globalErrorHandler } from './common/middlewares/globalErrHandler.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(globalErrorHandler)

export default app
