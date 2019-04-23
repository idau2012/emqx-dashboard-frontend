// export function schema2Form(schema = []) {
//
// }

function getRule(type) {
  const ruleMap = {
    url: 'url',
  }
  return ruleMap[type] || 'string'
}

function getRule2(value) {
  const { type, required, enum: enumValue } = value
  const rule = {}
  if (required) {
    rule.required = true
  }
  rule.type = type
  rule.enum = type === 'enum' ? enumValue : undefined

  // if (type === 'object') {
  //   rule = {
  //     required,
  //     validator: (rule, value, callback, source) => {
  //       try {
  //         const data = JSON.parse(value)
  //         source[key] = {}
  //       } catch (e) {
  //
  //       }
  //     },
  //   }
  // }
  return Object.keys(rule).length > 0 ? rule : undefined
}

export function params2Form2(params = {}) {
  const model = []
  const rules = {
    config: {},
  }

  Object.entries(params).forEach((item) => {
    const [key, value] = item
    const { description, enum: enumValue, default: defaultValue } = value
    let { type } = value
    const $attrs = {
      placeholder: description,
    }
    if (type === 'enum') {
      type = 'emq-select'
      $attrs.field = { options: enumValue.map($ => ({ value: $, label: $ })) }
    }
    model.push({
      key,
      type,
      label: key,
      prop: key,
      defaultValue,
      $attrs,
    })
    rules.config[key] = getRule2(value)
  })

  return { model, rules }
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
    rules[`params.${key}`] = { required: true, message: `${key} is required` }
  })

  return { model, rules, resource }
}

export default {}
