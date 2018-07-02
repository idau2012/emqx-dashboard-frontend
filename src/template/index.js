import events from './events'

import { getter as eventGetter } from './events'

import { getter as resGetter } from './resource'

const resourceDcit = {
  kafka: 'Kafka',
  pgsql: 'PostgresSQL',
  webhook: 'WebHook',
  mysql: 'MySQL',
  mongo: 'MongoDB',
  redis: 'Redis',
  // rabbitmq: 'RabbitMQ',
}

const redisDatabase = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map($ => ({ value: $, label: $ }))

const booleanType = [{ label: 'false', value: false }, { label: 'true', value: true }]

const kafkaProduce = ['sync', 'async', 'sync_batched', 'async_batched'].map($ => ({ value: $, label: $ }))

const method = ['GET', 'POST', 'PUT', 'DELETE'].map($ => ({ value: $, label: $ }))

const resource = Object.entries(resourceDcit).map($ => ({ value: $[0], label: $[1] }))

const dict = { ...events, method, resource, kafkaProduce, booleanType, redisDatabase }

export { events, eventGetter, resGetter }

export default dict
