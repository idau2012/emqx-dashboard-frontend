import zhLocale from 'element-ui/lib/locale/lang/zh-CN'


export default {
  ...zhLocale,
  // leftbar
  leftbar: {
    // MONITORING
    monitoring: '监控',
    overview: '首页',
    clients: '客户端',
    sessions: '会话',
    routes: '路由',
    subscriptions: '订阅',
    // MANAGEMENT
    management: '管理',
    plugins: '插件',
    listeners: '监听器',
    // TOOLS
    tools: '工具',
    websocket: 'Websocket',
    api: 'HTTP接口',
    // ADMIN
    admin: '管理员',
    users: '用户管理',
  },
  // overview
  overview: {
    // Broker
    broker: '代理信息',
    systemName: '系统名称',
    version: '版本',
    uptime: '运行时间',
    systemTime: '系统时间',
    // Nodes
    nodes: '节点信息',
    name: '节点名称',
    erlangProcesses: 'Erlang进程',
    cpuInfo: '处理器',
    memoryInfo: '内存',
    maxFds: '最大Fds',
    status: '状态',
    // Stats
    stats: '运行统计',
    clientsCount: '客户端连接数',
    clientsMax: '客户端最大连接数',
    retainedCount: '保有量',
    retainedMax: '最大保有量',
    routesCount: '路由数',
    routesMax: '最大路由数',
    sessionsCount: '会话数',
    subscribersCount: '最大会话数',
    topicsCount: '主题数',
    topicsMax: '最大主题数',
    // Metrics
    metrics: '度量指标',
    packetsData: '包数据',
    messagesData: '消息数据',
    bytesData: '字节数据',
  },
  // Clients
  clients: {
    clientId: '客户端ID',
    username: '用户名',
    ipAddr: 'IP地址',
    port: '端口',
    cleanSess: '清除会话标记',
    protoVer: '样机版本',
    keepalive: '连接时间(s)',
    connectedAt: '连接创建时间',
  },
  // sessions
  sessions: {
    clientId: '客户端ID',
    cleanSess: '清除会话标记',
    maxInflight: '最大消息数',
    inflightQueue: '消息队列',
    messageQueue: '缓存队列',
    messageDropped: '丢掉消息数',
    awaitingRel: '等待发送rel消息数',
    awaitingAck: '等待响应ack消息数',
    awaitingComp: '等待响应comp消息数',
    createdAt: '会话创建时间',
  },
  // routes
  routes: {
    topic: '主题',
    node: '节点',
  },
  // subscriptions
  subscriptions: {
    clientId: '客户端ID',
    topic: '主题',
    qoS: '服务质量',
  },
}
