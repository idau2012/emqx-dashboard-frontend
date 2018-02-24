import enLocale from 'element-ui/lib/locale/lang/en'


export default {
  ...enLocale,
  // globe
  select: {
    cluster: 'All Nodes',
    placeholder: 'Select Node',
  },
  // error
  error: {
    networkError: 'Network Error',
  },
  // success
  success: {
    createSuccess: 'Create Success',
  },
  // oper
  oper: {
    confirmDelete: 'Confirm Delete ?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    oper: 'Oper',
    edit: 'Edit',
    save: 'Save',
    create: 'Create',
    view: 'View',
    editSuccess: 'Edit success',
  },
  // leftbar
  leftbar: {
    // MONITORING
    monitoring: 'MONITORING',
    overview: 'Overview',
    clients: 'Clients',
    sessions: 'Sessions',
    topics: 'Topics',
    subscriptions: 'Subscriptions',
    // MANAGEMENT
    management: 'MANAGEMENT',
    plugins: 'Plugins',
    listeners: 'Listeners',
    // TOOLS
    tools: 'TOOLS',
    websocket: 'Websocket',
    api: 'HTTP API',
    applications: 'Applications',
    // ADMIN
    admin: 'ADMIN',
    users: 'Users',
    settings: 'Settings',
  },
  // overview
  overview: {
    // Broker
    broker: 'Broker',
    erlangOTPRelease: 'Erlang/OTP Release',
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
    topicsCount: 'Topics/Count',
    topicsMax: 'Topics/Max',
    clientsCount: 'Clients/Count',
    clientsMax: 'Clients/Max',
    retainedCount: 'Retained/Count',
    retainedMax: 'Retained/Max',
    sessionsCount: 'Sessions/Count',
    sessionsMax: 'Sessions/Max',
    subscribersCount: 'Subscribers/Count',
    subscribersMax: 'subscribers/Max',
    // Metrics
    metrics: 'Metrics',
    packetsData: 'The packets data',
    messagesData: 'The messages data',
    bytesData: 'The bytes data',
  },
  // Clients
  clients: {
    node: 'Node',
    clientId: 'ClientId',
    username: 'Username',
    ipAddr: 'IPAddr',
    port: 'Port',
    cleanSess: 'CleanSess',
    protoVer: 'ProtoVer',
    keepalive: 'Keepalive(s)',
    connectedAt: 'ConnectedAt',
    back: 'Back',
  },
  // sessions
  sessions: {
    clientId: 'ClientId',
    cleanSess: 'CleanSess',
    subscriptions: 'Subscriptions',
    maxInflight: 'MaxInflight',
    inflightLen: 'Inflight Len',
    mqueueLen: 'MqueueLen',
    mqueueDropped: 'MqueueDropped',
    awaitingRelLen: 'AwaitingRelLen',
    deliverMsg: 'DeliverMsg',
    enqueueMsg: 'EnqueueMsg',
    createdAt: 'CreatedAt',
  },
  // topics
  topics: {
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
    advancedConfig: 'Advanced Config',
    add: 'Add',
    configSuccess: 'Config success',
    configFailure: 'Config failure',
    notice: 'Are you sure you want to submit changes and apply them ?',
    giveUpNotice: 'Are you sure you want to give up the change and exit?',
    noticeTitle: 'Notice',
    cacheNotice: 'You have given up this change',
    emptyConfigOption: 'No Default Configuration',
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
    connectError: 'Error: Disconnect due to the illegal topic',
    connectFailure: 'Connect failed on',
    connectLeave: 'The client does not connect to the broker',
    subscribeSuccess: 'Subscribe success',
    unsubscribeFailure: 'Unsubscribe Failure',
    messageSendOut: 'Message send out',
    connected: 'CONNECTED',
    connecting: 'CONNECTING',
    disconnected: 'DISCONNECTED',
    notSupport: 'Your browser doesn\'t support WebSocket',
  },
  // http_api
  httpApi: {
    introduction: 'Introduction',
    desc: 'Apart from this help page, all URIs will serve only resources of type application/json, and will require HTTP basic authentication. The default user is admin / public.\n' +
    '<br/>' +
    'The emq_dashboard plugin provides a web management console. The Dashboard helps monitor broker\'s running status, statistics and metrics of MQTT packets.',
    reference: 'Reference',
    method: 'Method',
    path: 'Path',
    description: 'Description',
    back: 'Back',
    linkAddress: 'Request address',
    data: 'Response data',
  },
  // applications
  app: {
    appId: 'AppID',
    secret: 'AppSecret',
    newApp: 'New App',
    viewApp: 'View App',
    editApp: 'Edit App',
    create: 'Create',
    errors: 'Option Required',
    name: 'AppName',
    desc: 'Remark',
    expired: 'Expired date',
    status: 'Status',
    enable: 'Allowed',
    disable: 'Denied',
    enableText: 'Access allowed',
    disableText: 'Access barred',
    expiredText: 'Never expired',
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
    confirm: 'Confirm',
    confirmDelete: 'Confirm Delete ?',
    usernameRequired: 'Username required',
    remarkRequired: 'Remark required',
    usernameIllegal: 'Username illegal',
    passwordRequired: 'Password required',
    newPasswordRequired: 'new password required',
    passwordInconsistent: 'Password is inconsistent',
    authenticate: 'You have changed your password. Please re authenticate',
    createUser: 'Create user success',
  },
  // alert
  alert: {
    required: 'required',
    success: ' success',
    failure: ' failure',
    connect: 'Connect',
  },
  // login
  login: {
    title: 'LOG IN',
    username: 'Username',
    password: 'Password',
    remember: 'Remember',
    loginButton: 'Log In',
    error: 'Username Or Password Error',
    usernameRequired: 'Username Required',
    passwordRequired: 'Password Required',
  },
  // settings
  settings: {
    themes: 'Themes',
    language: 'Language',
    apply: 'Apply',
    success: 'Apply success',
  },
}
