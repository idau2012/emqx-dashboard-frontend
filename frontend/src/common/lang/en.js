import enLocale from 'element-ui/lib/locale/lang/en'


export default {
  ...enLocale,
  // leftbar
  leftbar: {
    // MONITORING
    monitoring: 'MONITORING',
    overview: 'Overview',
    clients: 'Clients',
    sessions: 'Sessions',
    routes: 'Routes',
    subscriptions: 'Subscriptions',
    // MANAGEMENT
    management: 'MANAGEMENT',
    plugins: 'Plugins',
    listeners: 'Listeners',
    // TOOLS
    tools: 'TOOLS',
    websocket: 'Websocket',
    api: 'HTTP API',
    // ADMIN
    admin: 'ADMIN',
    users: 'Users',
  },
  // overview
  overview: {
    // Broker
    broker: 'Broker',
    systemName: 'System Name',
    version: 'Version',
    uptime: 'Uptime',
    systemTime: 'System Time',
    // Nodes
    nodes: 'Nodes',
    name: 'Name',
    erlangProcesses: 'Erlang Processes',
    cpuInfo: 'CPU Info',
    memoryInfo: 'Memory Info',
    maxFds: 'MaxFds',
    status: 'Status',
    // Stats
    stats: 'Stats',
    clientsCount: 'Clients/Count',
    clientsMax: 'Clients/Max',
    retainedCount: 'Retained/Count',
    retainedMax: 'Retained/Max',
    routesCount: 'Routes/Count',
    routesMax: 'Routes/Max',
    sessionsCount: 'Sessions/Count',
    subscribersCount: 'Subscribers/Count',
    topicsCount: 'Topics/Count',
    topicsMax: 'Topics/Max',
    // Metrics
    metrics: 'Metrics',
    packetsData: 'The packets data',
    messagesData: 'The messages data',
    bytesData: 'The bytes data',
  },
  // Clients
  clients: {
    clientId: 'ClientId',
    username: 'Username',
    ipAddr: 'IPAddr',
    port: 'Port',
    cleanSess: 'CleanSess',
    protoVer: 'ProtoVer',
    keepalive: 'Keepalive(s)',
    connectedAt: 'ConnectedAt',
  },
  // sessions
  sessions: {
    clientId: 'ClientId',
    cleanSess: 'CleanSess',
    maxInflight: 'MaxInflight',
    inflightQueue: 'InflightQueue',
    messageQueue: 'MessageQueue',
    messageDropped: 'MessageDropped',
    awaitingRel: 'AwaitingRel',
    awaitingAck: 'AwaitingAck',
    awaitingComp: 'AwaitingComp',
    createdAt: 'CreatedAt',
  },
  // routes
  routes: {
    topic: 'Topic',
    node: 'Node',
  },
  // subscriptions
  subscriptions: {
    clientId: 'ClientId',
    topic: 'Topic',
    qoS: 'QoS',
  },
  // plugins
  plugins: {
    name: 'Name',
    version: 'Version',
    description: 'Description',
    status: 'Status',
    stopped: 'Stopped',
    running: 'Running',
    oper: 'Oper',
    start: 'Start',
    stop: 'Stop',
    config: 'Config',
    back: 'Back',
    confirm: 'Confirm',
    cancel: 'Cancel',
    advancedConfig: 'Advanced Config',
    add: 'Add',
  },
  // listeners
  listeners: {
    protocol: 'Protocol',
    listenOn: 'Listen On',
    maxClients: 'Max Clients',
    currentClients: 'Current Clients',
  },
  // websocket
  websocket: {
    // Connect
    connect: 'Connect',
    host: 'Host',
    port: 'Port',
    clientID: 'Client ID',
    username: 'Username',
    password: 'Password',
    keepAlive: 'Keep Alive',
    cleanSession: 'Clean Session',
    disconnect: 'Disconnect',
    currentState: 'Current State',
    // Subscribe
    subscribe: 'Subscribe',
    topic: 'Topic',
    qoS: 'QoS',
    date: 'Date',
    oper: 'Oper',
    // Messages
    messages: 'Messages',
    retained: 'Retained',
    send: 'send',
    messagesAlreadySent: 'Messages already sent',
    messagesReceived: 'Messages received',
    time: 'Time',
  },
  // http_api
  httpApi: {
    introduction: 'Introduction',
    reference: 'Reference',
    method: 'Method',
    path: 'Path',
    description: 'Description',
  },
  // users
  users: {
    newUser: 'New User',
    editUser: 'Edit User',
    username: 'Username',
    remark: 'Remark',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    changePassword: 'Change Password',
    dontChangePassword: 'Don\'t Change Password',
    oper: 'Oper',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    confirmDelete: 'Confirm Delete',
  },
}
