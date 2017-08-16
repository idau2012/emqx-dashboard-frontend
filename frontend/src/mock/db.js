'use strict'

const faker = require('faker')
const dateformat = require('dateformat')

const monitoring_nodes = []
for (let i = 1; i < 5 ; i++) {
  monitoring_nodes.push({
    'name': `node${i}@127.0.0.1`,
    'process_used': faker.random.number({min:100, max:200}),
    'process_available': faker.random.number({min:600, max:700}),
    'load1': faker.random.number({min:1, max:10}),
    'load5': faker.random.number({min:1, max:10}),
    'load15': faker.random.number({min:5, max:10}),
    'memory_used': `${faker.random.number({min:10, max:50})}M`,
    'memory_total': '200M',
    'max_fds': '1024',
    'clients': faker.random.number({min:7000, max:10000}),
    'node_status': faker.random.arrayElement(['Running', 'Stoped'])
  })
}

const management_nodes = []
for (let i = 1; i < 5 ; i++) {
  management_nodes.push({
    'name': `node${i}`,
    'version': '2.0.6',
    'otp': 'R18/7.3',
    'uptime': '38 days',
    'node_status': faker.random.arrayElement(['Running', 'Stoped'])
  })
}

const stats = [JSON.parse('{"clients/count":0,"clients/max":1,"retained/count":3,"retained/max":3,"routes/count":2,"routes/max":3,"sessions/count":0,"sessions/max":1,"subscribers/count":9,"subscribers/max":10,"subscriptions/count":9,"subscriptions/max":10,"topics/count":0,"topics/max":0}')]

const plugins = []
const pluginNames = [
  'emqx_auth_http',
  'emqx_auth_clientid',
  'emqx_auth_ldap',
  'emqx_auth_mongo',
  'emqx_auth_mysql',
  'emqx_auth_pgsql',
  'emqx_auth_redis',
  'emqx_auth_username',
  'emqx_backend_mongo',
  'emqx_backend_mysql',
  'emqx_backend_pgsql',
  'emqx_backend_redis',
  'emqx_bridge_kafka',
  'emqx_dashboard',
  'emqx_modules',
  'emqx_recon',
  'emqx_reloader',
  'emqx_retainer',
]
const pluginDescriptions = [
  'EMQ X Authentication with ClientId/Password',
  'EMQ X Authentication/ACL with HTTP API',
  'EMQ X Authentication/ACL with LDAP',
  'EMQ X Authentication/ACL with MongoDB',
  'EMQ X Authentication/ACL with MySQL',
  'EMQ X Authentication/ACL with PostgreSQL',
  'EMQ X Authentication/ACL with Redis',
  'EMQ X Authentication with Username/Password',
  'EMQ X Mongodb Backend',
  'EMQ X MySQL Backend',
  'EMQ X PostgreSQL Backend',
  'EMQ X Redis Backend',
  'EMQ X Kafka Bridge',
  'EMQ X Dashboard',
  'EMQ X Modules',
  'Recon Plugin',
  'Reloader Plugin',
  'EMQ X Retainer',
]
for (let i = 1; i < 19 ; i++) {
  plugins.push({
    'id': i,
    'name': pluginNames[i-1],
    'version': '2.1.0',
    'description': pluginDescriptions[i-1],
    'active': faker.random.boolean()
  })
}

const users = []
for (let i = 1; i < 15 ; i++) {
  users.push({
    'id': i,
    'username': `test${i}`,
    'password': 'public',
    'email': `test${i}@163.com`,
    'remark': 'viewer',
    'created_at': faker.date.between('2017-01-02', '2017-02-20')
  })
}

const nodes = []
for (let i =1; i< 8; i++) {
  const jsonData = `{"name":"emqx@127.0.0.1","otp_release":"R19/8.1","total_memory":"62.76M","used_memory":"51.72M","process_available":262144,"process_used":405,"max_fds":1024,"cluster_status":"${faker.random.arrayElement(['Running', 'Stoped'])}","load1":"0.00","load5":"0.00","load15":"0.00"}`
  nodes.push(JSON.parse(jsonData))
}

const clients = []
for (let i = 1; i < 8; i++) {
  clients.push({
    'client_id': `emqttd_${faker.random.number({min:10000000, max:20000000})}`,
    'username': faker.internet.userName(),
    'ipaddress': faker.internet.ip(),
    'port': faker.random.number({min:2000, max:5000}),
    'clean_sess': faker.random.arrayElement(['true', 'false']),
    'proto_ver': 4,
    'keepalive': faker.random.number({min:0, max:120}),
    'connected_at': dateformat(faker.date.between('2017-01-02', '2017-02-20'), 'yyyy-mm-dd hh:MM:ss'),
  })
}

const sessions = []
for (let i = 1; i < 8; i++) {
  sessions.push({
    'client_id': `emqttd_${faker.random.number({min:10000000, max:20000000})}`,
    'clean_sess': faker.random.arrayElement(['true', 'false']),
    'max_inflight': 100,
    'inflight_queue': 0,
    'message_queue': 0,
    'message_dropped': faker.random.number({min:0, max:10}),
    'awaiting_rel': 0,
    'awaiting_ack': 0,
    'awaiting_comp': 0,
    'created_at': dateformat(faker.date.between('2017-01-02', '2017-02-20'), 'yyyy-mm-dd hh:MM:ss'),
  })
}

const brokers = []
for (let i = 1; i < 7; i++) {
  const jsonData = '{"sysdescr":"EMQ X","version":"2.2","uptime":"53 days,18 hours, 27 minutes, 0 seconds","datetime":"2017-08-16 11:31:09"}'
  let objectData = JSON.parse(jsonData)
  objectData.uptime = `${faker.random.number({min:50, max:100})} days,1${i} hours, ${i}7 minutes, 0 seconds`
  objectData.datetime = dateformat(new Date(), 'yyyy-mm-dd hh:MM:ss')
  brokers.push(objectData)
}

const topics = []
for (let i = 1; i < 1001; i++) {
  topics.push({
    'topic': `/test${i}`,
    'subTopicCount': faker.random.number({min:200, max:10000}),
  })
}

const routers = []
for (let i = 1; i < 1001; i++) {
  routers.push({
    'topic': `/test${i}`,
    'node': faker.random.arrayElement(['node1', 'node2', 'node3', 'node4']),
  })
}

const subscriptions = []
for (let i = 1; i < 1001; i++) {
  subscriptions.push({
    'client_id': `emqttd_${faker.random.number({min:10000000, max:20000000})}`,
    'topic': `/test${i}`,
    'qos': faker.random.arrayElement([0, 1, 2]),
  })
}

const alerts = { 'status': 'success', 'data': [] }
for (let i = 1; i < 2; i++) {
  alerts.data.push(
    {
      'labels': {
        'alertname': 'instance_down',
        'instance': 'emqx@192.168.10.1',
        'job': 'node-exporter',
        'monitor': 'emq-monitor',
        'severity': 'critical'
      },
      'annotations': {
        'summary': 'Instance emqx@192.168.1.2 down',
        'description': 'emqx@192.168.1.2 of job node-exporter has been down for more than 5 minutes.',
        'value': 'instance_down'
      },
      'startsAt': '2017-03-22T21:45:17.803+08:00',
    }, {
      'labels': {
        'alertname': 'too_many_clients',
        'instance': 'emqx@192.168.10.2',
        'job': 'node-exporter',
        'monitor': 'emq-monitor',
        'severity': 'major'
      },
      'annotations': {
        'summary': 'Instance emqx@192.168.1.2 down',
        'description': 'emqx@192.168.1.2 of job node-exporter has been down for more than 5 minutes.',
        'value': '240000'
      },
      'startsAt': '2017-03-22T22:45:17.803+08:00',
    }, {
      'labels': {
        'alertname': 'high_cpu_used',
        'instance': 'emqx@192.168.10.3',
        'job': 'node-exporter',
        'monitor': 'emq-monitor',
        'severity': 'minor'
      },
      'annotations': {
        'summary': 'Instance emqx@192.168.1.2 down',
        'description': 'emqx@192.168.1.2 of job node-exporter has been down for more than 5 minutes.',
        'value': '60%'
      },
      'startsAt': '2017-03-22T20:45:17.803+08:00',
    }, {
      'labels': {
        'alertname': 'high_mem_used',
        'instance': 'emqx@192.168.10.4',
        'job': 'node-exporter',
        'monitor': 'emq-monitor',
        'severity': 'warning'
      },
      'annotations': {
        'summary': 'Instance emqx@192.168.1.2 down',
        'description': 'emqx@192.168.1.2 of job node-exporter has been down for more than 5 minutes.',
        'value': '80%'
      },
      'startsAt': '2017-03-22T17:45:17.803+08:00',
    }
  )
}


module.exports = {
  users,
  monitoring_nodes,
  management_nodes,
  plugins,
  clients,
  sessions,
  topics,
  routers,
  subscriptions,
  alerts,
  brokers,
  nodes,
  stats,
}
