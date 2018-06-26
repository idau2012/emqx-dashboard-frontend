import dateformat from 'dateformat'
import HowLong from 'how-long'

function howLong(createAt, size = 3) {
  if (!createAt) {
    return 'N/A'
  }
  if (createAt.toString().length === 10) {
    createAt *= 1000
  }
  const time = HowLong(Date.now(), createAt, ['years', 'months', 'days', 'hours', 'minutes', 'seconds'])
  const date = []
  // 0 hours 20 minutes 12 seconds or 0 days 20 h 12 minutes
  Object.keys(time).forEach((key, index) => {
    if (time[key] !== 0 && date.length < size) {
      date.push(`${time[key]} ${key}`)
    } else if (date.length < size && index > size - 1) {
      date.push(`${time[key]} ${key}`)
    }
  })
  return date.join(' ')
}

function dateFormat(date) {
  if (!date) {
    return ''
  }
  if (date.toString().length === 10) {
    return dateformat(date * 1000, 'yyyy-mm-dd HH:MM:ss')
  }
  return dateformat(date, 'yyyy-mm-dd HH:MM:ss')
}

export default { howLong, dateFormat }
