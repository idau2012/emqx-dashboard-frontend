import events from './events'

import { getter as eventGetter } from './events'

import { getter as resGetter } from './resource'


const resourceDcit = {
  kafka: 'Kafka',
  pgsql: 'PostgresSQL',
  webhook: 'WebHook',
  mysql: 'MySQL',
  mongodb: 'MongoDB',
  redis: 'Redis',
  rabbitmq: 'RabbitMQ',
}

const method = ['GET', 'POST', 'PUT', 'DELETE'].map($ => ({ value: $, label: $ }))

const resource = Object.entries(resourceDcit).map($ => ({ value: $[0], label: $[1] }))


const dict = { ...events, method, resource }

export { events, eventGetter, resGetter }

export default dict
