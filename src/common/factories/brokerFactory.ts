import config from 'config'
import { KafkaProducerBroker } from '../../config/kafka.js'
import type { MessageProducerBroker } from '../types/broker.js'

let messageProducer: MessageProducerBroker | null = null

console.log('broker port', config.get('kafka.broker'))

export const createMessageProducerBroker = (): MessageProducerBroker => {
    // making singletone
    if (!messageProducer) {
        messageProducer = new KafkaProducerBroker('catalog-service', [
            config.get('kafka.broker'),
        ])
    }

    return messageProducer
}
