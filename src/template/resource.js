/**
 * EMQ X IO 资源
 */

import { objectMerge } from '../common/utils'

const libs = {
  net: {
    host: {
      en: 'host',
      zh: '地址',
      type: 'host',
      value: '127.0.0.1',
    },
    port: {
      en: 'port',
      zh: '端口',
      type: 'number',
      value: null,
    },
  },
  protocol: {
    protocol: {
      en: 'protocol',
      zh: '协议',
      value: ['http', 'https'],
    },
  },
  db: {
    user: {
      en: 'user',
      zh: '用户名',
      value: 'root',
    },
    password: {
      en: 'password',
      zh: '密码',
      value: 'root',
    },
    database: {
      en: 'database',
      zh: '数据库名',
      value: 'platform',
    },
    ssl: {
      en: 'ssl',
      zh: 'ssl',
      value: false,
    },
    pool: {
      en: 'pool',
      zh: '连接池',
      type: 'number',
      value: 8,
    },
  },
  certs: {
    certfile: {
      en: 'certfile',
      zh: 'certfile',
      type: 'file',
      value: '',
    },
    keyfile: {
      en: 'keyfile',
      zh: 'keyfile',
      type: 'file',
      value: '',
    },
  },
  security: {
    salt: {
      en: 'salt',
      zh: '加密 salt',
      value: '',
    },
  },
  hash: {
    password_hash: {
      en: 'hash',
      zh: '加密方式',
      value: ['plain', 'md5', 'sha', 'sha256', 'bcrypt'],
    },
  },
  // 关系数据库
  sql: {
    insert: {
      value: 'insert into mqtt_message (username, client_id, payload) values ( {{username}}, {{client_id}},' +
      ' {{payload}} )',
    },
    query: {
      value: 'select password from mqtt_user where username = {{username}} limit 1',
    },
    updata: {
      value: 'update mqtt_user set state = 1 where username = {{username}}',
    },
    delete: {
      value: '',
    },
  },
  http: {
    method: {
      en: 'method',
      zh: '请求方式',
      value: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    header: {
      en: 'header',
      zh: '请求头',
      value: {
        'Content-Type': 'application/json',
        token: '',
      },
    },
    query: {
      en: 'URL params',
      zh: 'URL 参数',
      value: {
        client_id: '{{client_id}}',
        username: '{{username}}',
      },
    },
    body: {
      en: 'body',
      zh: '请求体',
      value: {
        client_id: '{{client_id}}',
        username: '{{username}}',
      },
    },
  },
}

const resource = {
  mysql: {
    ...libs.net,
    ...libs.db,
    ...libs.sql,
    ...libs.certs,
    ...libs.hash,
    ...libs.security,
  },
  pgsql: {
    ...libs.net,
    ...libs.db,
    ...libs.sql,
    ...libs.certs,
    ...libs.hash,
    ...libs.security,
  },
  mongo: {
    ...libs.net,
    ...libs.db,
    ...libs.certs,
    ...libs.hash,
    ...libs.security,
  },
  http: {
    url: {
      en: 'url',
      zh: '服务器地址',
      value: 'http://127.0.0.1:80/server',
    },
    ...libs.http,
  },
  kafka: {
    ...libs.net,
  },
}

function getter(key = '', diff) {
  if (key && resource[key]) {
    if (diff) {
      return objectMerge(resource[key], diff)
    }
    return resource[key]
  }
}

export { getter }

export default resource
