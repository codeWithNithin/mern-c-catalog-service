import app from './app.js'
import { createMessageProducerBroker } from './common/factories/brokerFactory.js'
import type { MessageProducerBroker } from './common/types/broker.js'
import { initDb } from './config/db.js'
import logger from './config/logger.js'
import config from 'config'

async function startServer() {
    let messageProducerBroker: MessageProducerBroker | null = null

    try {
        const PORT: number = config.get('server.port') || 5502

        await initDb()

        logger.info('data base connected successfully')

        // connect kafka
        messageProducerBroker = createMessageProducerBroker()
        await messageProducerBroker.connect()

        app.listen(PORT, () => {
            logger.info('server running at PORT', { port: PORT })
        })
    } catch (err) {
        console.log('err', err)
        if (messageProducerBroker) {
            await messageProducerBroker.disconnect()
        }
        logger.error('err from server', { err: err })
    }
}

startServer()
