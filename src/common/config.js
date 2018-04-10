import Axios from './api'

class Config {
  /**
   * 导入说明
   * 支持导入 JSON 格式配置备份文件，备份文件分为 Services 与 Cluster 两种
   * 支持备份整个 Service: 包含多个 instances，初始化 Service 时支持单选、多选一起初始化 instances
   * 支持备份单个 instances 为一个 Services 文件
   * 文件示例：
   * { type: 'service', feature: { nodeName: 'emqx@127.0.0.1', version: 2.4.1, createAt: '2018-04-10 13:50:00', owner: 'wivwiv', host: '127.0.0.1:18083' }, name: 'emqx_auth_pgsql_ins', payload: [], description: '普通服务备份文件'}
   * { type: 'cluster', feature: { nodeName: 'emqx@127.0.0.1', version: 2.4.1, createAt: '2018-04-10 13:50:00', owner: 'wivwiv', host: '127.0.0.1:18083' }, payload: [], description: '整体服务配置文件' }
   * { type: 'instance', service: 'emqx_auth_pgsql_ins', id: '569676D142204F442000006F70000', descr: 'Auth for PGSQL', conf: {} }
   * @param config
   * @param service
   * @returns {boolean}
   */
  // constructor() {}
  /**
   *
   * @param config
   * @param service
   */
  static validate(config = {}, service = {}) {
    const data = {
      type: config.type,
    }
    if (config.type === 'service') {
      data.errors = this.validateSchema(config)
    } else if (config.type === 'cluster') {
    
    } else {
      throw new Error('Not a valid config file')
    }
    const errors = this.validateSchema(config, service)
  }
  // Constructor from rules
  static rulesConstructor(schema = []) {
    const rules = {}
    schema.forEach((item) => {
      rules[item.key] = []
      if (item.required) {
        rules[item.key].push({
          required: true, message: `${item.key} is required`,
        })
      }
      if (typeof item.default === 'number') {
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
        errors.push(`${key} must be in ${item.default.join(', ')}`)
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
    } else {
      throw new Error('Not a valid config file')
    }
  }
}

export default Config
