import events from './events'

import { getter as eventGetter } from './events'

import { getter as resGetter } from './resource'

const dict = { ...events }

export { events, eventGetter, resGetter }

export default dict
