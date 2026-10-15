import config from 'config'
import express from 'express'
import { globalErrorHandler } from './common/middlewares/globalErrHandler.js'

const app = express()

app.get('/', (req, res) => {
    res.send(config.get('server.port'))
})

app.use(globalErrorHandler)

export default app
