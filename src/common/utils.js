import dateformat from 'dateformat'

import store from '../store'

class Config {
  static validate(config = {}, service = {}) {
    const data = {
      type: config.type,
    }
    if (config.type === 'service') {
      data.errors = this.validateSchema(config)
    } else if (config.type === 'cluster') {
      config.type = 'clusetr'
    } else {
      throw new Error('Not a valid config file')
    }
    return this.validateSchema(config, service)
  }
  
  // Constructor from rules
  static rulesConstructor(schema = []) {
    const rules = {}
    schema.forEach((item) => {
      if (item.required) {
        if (!rules[item.key]) {
          rules[item.key] = []
        }
        rules[item.key].push({
          required: true, message: `${item.key} is required`,
        })
      }
      if (typeof item.default === 'number') {
        if (!rules[item.key]) {
          rules[item.key] = []
        }
        rules[item.key].push({
          validator: this.validateNumber,
        })
      }
    })
    return rules
  }
  
  static validateNumber(rule, value, callback) {
    if (!value) {
      callback()
    }
    if (isNaN(Number(value))) {
      callback('must be Number')
    }
    callback()
  }
  
  static validateSchema(config = {}, schema = {}) {
    const errors = []
    Object.keys(schema).forEach((key) => {
      const item = schema[key]
      if (item.required && !config[key]) {
        errors.push(`${key} is required`)
      }
      if (!config[key]) {
        return
      }
      const schemaType = typeof item.default
      const configType = typeof config[key]
      if (schemaType !== 'object' && configType !== schemaType) {
        config[key] = item.default
        errors.push(`${key} must be ${schemaType}`)
      } else if (Array.isArray(config[key]) && !item.default.includes(config[key])) {
        config[key] = item.default[0]
        errors.push(`${key} must in ${item.default.join(', ')}`)
      }
    })
    return errors
  }
  
  // parse
  static configParse(config = {}) {
    const data = {
      type: config.type,
    }
    if (config.type === 'service') {
      data.name = config.name
    } else if (config.type === 'cluster') {
      console.log(1)
    } else {
      throw new Error('$i18n_not_a_valid_config_file')
    }
  }
  
  // export config
  static exportConfig(option = {}, payload) {
    if (!Array.isArray(payload) || payload.length === 0) {
      throw new Error('$i18n_payload_error')
    }
    const defaultOption = {
      type: 'service',
      description: '',
      feature: {
        createAt: dateformat('yyyy-mm-dd HH:MM:ss'),
        host: window.location.host,
        owner: store.state.user.username,
        nodeName: store.state.currentNode || '',
      },
    }
    const content = Object.assign(defaultOption, { ...option, payload })
    content.fileName = `EMQ X-${content.type} config-${content.name}-${content.description}-${dateformat('yyyymmddHHMM')}.json`
    return JSON.stringify(content, null, 4)
  }
  
  static renderDownload(fileName, content) {
    const aTag = document.createElement('a')
    aTag.download = fileName
    const blob = new Blob([content])
    aTag.href = URL.createObjectURL(blob)
    aTag.click()
  }
}

class Template {}

export { Config, Template }
