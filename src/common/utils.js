// export function schema2Form(schema = []) {
//
// }

function getRule(type) {
  const ruleMap = {
    url: 'url',
  }
  return ruleMap[type] || 'string'
}

export function params2Form(params = {}) {
  const model = []
  const rules = {}
  let resource = ''

  Object.entries(params).forEach((item) => {
    const [key, value] = item
    if (key === '$resource') {
      resource = value
      return
    }

    model.push({
      key,
      label: key,
      prop: key,
      rules: { type: getRule(value), required: true, message: `${key} is to required` },
      placeholder: value,
    })
    rules[`params.${key}`] = { required: true, message: `${key} is to required` }
  })

  return { model, rules, resource }
}

export default {}
