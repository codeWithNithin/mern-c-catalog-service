import app from './app.js'
import logger from './config/logger.js'
import config from 'config'

function startServer(): void {
    try {
        const PORT: number = config.get('server.port') || 5502

        app.listen(PORT, () => {
            logger.info('server running at PORT', { port: PORT })
        })
    } catch (err) {
        logger.error('err from server', { err: err })
    }
}

startServer()
