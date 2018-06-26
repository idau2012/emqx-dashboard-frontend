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
  on_session_subscribed: {
    label: 'on_session_subscribed',
    value: 'on_session_subscribed',
    en: 'On Subscribed',
    zh: '客户端订阅',
  },
  on_session_unsubscribed: {
    label: 'on_session_unsubscribed',
    value: 'on_session_unsubscribed',
    en: 'On UnSubscribed',
    zh: '客户端取消订阅',
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

export default events
