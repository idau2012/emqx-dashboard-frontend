function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

const isArray = Array.isArray

function isPlainObject(obj) {
  return isObject(obj) && (
    obj.constructor === Object
    || obj.constructor === undefined // obj = Object.create(null)
  )
}

/**
 * 深度合并对象
 * @param target
 * @param sources
 * @returns {*}
 */
function objectMerge(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isPlainObject(source) || isArray(source)) {
    Object.keys(source).forEach((key) => {
      if (isPlainObject(source[key]) || isArray(source[key])) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
          target[key] = {}
        } else if (isArray(source[key]) && !isArray(target[key])) {
          target[key] = []
        }
        objectMerge(target[key], source[key])
      } else if (source[key] !== undefined && source[key] !== '') {
        target[key] = source[key]
      }
    })
  }

  return objectMerge(target, ...sources)
}

export { objectMerge }

export default {}
