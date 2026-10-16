import app from './app.js'
import { initDb } from './config/db.js'
import logger from './config/logger.js'
import config from 'config'

async function startServer() {
    try {
        const PORT: number = config.get('server.port') || 5502

        await initDb()

        logger.info('data base connected successfully')

        app.listen(PORT, () => {
            logger.info('server running at PORT', { port: PORT })
        })
    } catch (err) {
        logger.error('err from server', { err: err })
    }
}

startServer()
