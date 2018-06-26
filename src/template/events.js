/**
 * EMQ X 事件列表
 */
const events = {
  // Bridge Kafka
  on_client_connected: {
    label: 'on_client_connected',
    value: 'on_client_connected',
    en: 'On Client Connected',
    zh: '客户端连接',
  },
  on_client_disconnected: {
    label: 'on_client_disconnected',
    value: 'on_client_disconnected',
    en: 'On Client Disconnected',
    zh: '客户端断开连接',
  },
  on_client_subscribed: {
    label: 'on_client_subscribed',
    value: 'on_client_subscribed',
    en: 'On Client Subscribed',
    zh: 'client 订阅',
  },
  on_client_unsubscribed: {
    label: 'on_client_unsubscribed',
    value: 'on_client_unsubscribed',
    en: 'On Client UnSubscribed',
    zh: 'client 取消订阅',
  },
  on_session_subscribed: {
    label: 'on_session_subscribed',
    value: 'on_session_subscribed',
    en: 'On Session Subscribed',
    zh: 'Session 订阅',
  },
  on_session_unsubscribed: {
    label: 'on_session_unsubscribed',
    value: 'on_session_unsubscribed',
    en: 'On Session UnSubscribed',
    zh: 'Session 取消订阅',
  },
  on_message_publish: {
    label: 'on_message_publish',
    value: 'on_message_publish',
    en: 'On Publish',
    zh: '发布消息',
  },
  on_message_delivered: {
    label: 'on_message_delivered',
    value: 'on_message_delivered',
    en: 'On delivered',
    zh: '消息拥塞',
  },
  on_message_acked: {
    label: 'on_message_acked',
    value: 'on_message_acked',
    en: 'On Acked',
    zh: '消息确认',
  },
  // webhook
  on_session_created: {
    label: 'on_session_created',
    value: 'on_session_created',
    en: 'On Session Created',
    zh: '创建会话',
  },
  on_session_terminated: {
    label: 'on_session_terminated',
    value: 'on_session_terminated',
    en: 'On Session Terminated',
    zh: '会话终止',
  },
}

const dict = {
  auth: ['on_client_connected'],
  acl: ['on_client_subscribed', 'on_client_publish', 'on_session_subscribed', 'on_message_publish'],
  webhook: [
    'on_client_connected',
    'on_client_disconnected',
    'on_client_subscribe',
    'on_client_unsubscribe',
    'on_session_created',
    'on_session_subscribed',
    'on_session_unsubscribed',
    'on_session_terminated',
    'on_message_publish',
    'on_message_delivered',
    'on_message_acked',
  ],
  kafka: [
    'on_client_connected',
    'on_client_disconnected',
    'on_session_subscribed',
    'on_session_unsubscribed',
    'on_message_publish',
    'on_message_delivered',
    'on_message_acked',
  ],
}

const lang = window.localStorage.getItem('language') || window.EMQ_DASHBOARD_CONFIG.lang || 'en'

function getter(key = 'all') {
  const list = dict[key]
  if (!list) {
    return Object.values(events).map(($) => {
      // eslint-disable-next-line no-underscore-dangle
      $._label = $.label
      $.label = $[lang]
      return $
    })
  }
  const data = []
  list.forEach((key) => {
    if (events[key]) {
      data.push({
        value: events[key].value,
        label: events[key][lang],
        _label: events[key].label,
      })
    }
  })
  return data
}

export { getter }

export default {
  events,
  all: getter(),
  auth: getter('auth'),
  webhook: getter('webhook'),
  kafka: getter('kafka'),
  backend: getter('backend'),
}
