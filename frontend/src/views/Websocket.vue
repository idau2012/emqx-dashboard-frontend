<template>
  <div class="websocket-view">
    <div class="page-title">{{ $t('leftbar.websocket') }}</div>

    <el-card @keyup.enter.native="mqttConnect">
      <div slot="header">
        <span>{{ $t('websocket.connect') }}</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>{{ $t('websocket.host') }}:</label>
          <el-input v-model="host" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>{{ $t('websocket.port') }}:</label>
          <el-input v-model.number="port" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>{{ $t('websocket.clientID') }}:</label>
          <el-input v-model="clientId" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>{{ $t('websocket.username') }}:</label>
          <el-input v-model="username" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>{{ $t('websocket.password') }}:</label>
          <el-input v-model="password" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>{{ $t('websocket.keepAlive') }}:</label>
          <el-input v-model.number="keepalive" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-checkbox v-model="clean">{{ $t('websocket.cleanSession') }}</el-checkbox>
        <el-checkbox
          style="margin-left: 50px"
          :disabled="client.connected || loading"
          v-model="isSSL"
          @change="handleSSL">SSL
        </el-checkbox>
      </el-row>

      <el-row class="connect-area">
        <el-col :span="24">
          <el-button
            type="success"
            size="small"
            :disabled="loading || client.connected"
            @keyup.enter.native="mqttConnect"
            @click="mqttConnect">
            {{ $t('websocket.connect') }}
          </el-button>

          <el-button
            class="close-btn"
            type="danger"
            size="small"
            :loading="loading && client.connected"
            :disabled="!loading && !client.connected"
            @keyup.enter.native="disconnectSwitch"
            @click="disconnectSwitch">
            {{ $t('websocket.disconnect') }}
          </el-button>

          <div class="connect-state">{{ $t('websocket.currentState') }}:
            <span :style="client.connected ? 'color: #42d885' : ''">
          {{ getStatus }}
          </span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card style="max-height: 450px">
      <div slot="header">
        <span>{{ $t('websocket.subscribe') }}</span>
      </div>
      <el-row :gutter="20" @keyup.enter.native="mqttSubscribe">
        <el-col :span="12">
          <label>{{ $t('websocket.topic') }}:</label>
          <el-input v-model="subTopic" size="small"></el-input>
          <label>{{ $t('websocket.qoS') }}:</label>
          <el-select v-model.number="subQos" size="small">
            <el-option :value="0"></el-option>
            <el-option :value="1"></el-option>
            <el-option :value="2"></el-option>
          </el-select>
          <div class="between">
            <el-button
              type="success"
              size="small"
              @keyup.enter.native="mqttSubscribe"
              @click="mqttSubscribe">
              {{ $t('websocket.subscribe') }}
            </el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <label>{{ $t('websocket.subscribe') }}:</label>
          <el-table :data="subscriptions" :max-height="320">
            <el-table-column prop="topic" min-width="150" :label="$t('websocket.topic')">
            </el-table-column>
            <el-table-column prop="qos" min-width="120" :label="$t('websocket.qoS')">
            </el-table-column>
            <el-table-column prop="time" min-width="180" :label="$t('websocket.time')">
            </el-table-column>
            <el-table-column width="90" :label="$t('websocket.oper')">
              <template scope="props">
                <el-button
                  title="Unsubscribe"
                  class="unsubscribe"
                  size="mini"
                  type="text"
                  @click="mqttCacheScuscribe(props.row.topic)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <el-card style="max-height: 800px;padding-bottom: 20px">
      <div slot="header">
        <span>{{ $t('websocket.messages') }}</span>
      </div>
      <el-row :gutter="20" @keyup.enter.native="mqttPublish">
        <el-col :span="6">
          <label>{{ $t('websocket.topic') }}:</label>
          <el-input v-model="publishTopic" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <label>{{ $t('websocket.messages') }}:</label>
          <el-input v-model="publishMessage" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <label>{{ $t('websocket.qoS') }}:</label>
          <el-select v-model.number="publishQos" size="small" style="display: block;">
            <el-option :value="0"></el-option>
            <el-option :value="1"></el-option>
            <el-option :value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" style="margin-top: 21px">
          <el-checkbox v-model="publishRetain" style="margin-right: 15px;">
            {{ $t('websocket.retained') }}
          </el-checkbox>
          <el-button
            type="success"
            size="small"
            @click="mqttPublish"
            @keyup.enter.native="mqttPublish">
            {{ $t('websocket.send') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <label>{{ $t('websocket.messagesAlreadySent') }}:
            <i
              title="clear message"
              class="fa fa-refresh refresh-btn"
              aria-hidden="true">
           </i>
          </label>
          <el-table border :data="publishedMessages" :max-height="600">
            <el-table-column prop="message" min-width="100" :label="$t('websocket.messages')">
            </el-table-column>
            <el-table-column prop="topic" :label="$t('websocket.topic')">
            </el-table-column>
            <el-table-column prop="qos" min-width="120" :label="$t('websocket.qoS')">
            </el-table-column>
            <el-table-column prop="time" min-width="180" :label="$t('websocket.time')">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <label>{{ $t('websocket.messagesReceived') }}:
            <i
              title="clear message"
              class="fa fa-refresh refresh-btn"
              aria-hidden="true"
              @click="clearMessage">
            </i>
          </label>
          <el-table border :data="receivedMessages" :max-height="600">
            <el-table-column prop="message" min-width="100" :label="$t('websocket.messages')">
            </el-table-column>
            <el-table-column prop="topic" :label="$t('websocket.topic')">
            </el-table-column>
            <el-table-column prop="qos" min-width="120" :label="$t('websocket.qoS')">
            </el-table-column>
            <el-table-column prop="time" width="180" :label="$t('websocket.time')">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>


<script>
/*
* https://www.npmjs.com/package/mqtt
* MQTT.js 2.13.0版本中
* 连接中： 网络不可达时 ==> 尝试重连 ==> 触发 reconnect ==> 无限重连
* 使用IP地址连接时： IP地址格式错误 ==> 未能捕捉到WS库的校验报错 ==> 不会触发任何事件 ==> 连接状态锁死
*   以上两条 ==> 用户期望可以手动终止，客户端也应该超时终止
* 发布时： 非法发布(非法主题) ==> 服务器断开连接 ==> 客户端触发 reconnect ==> 回调函数error值为空
* 其中 Qos, Topic, Message等必须是Number, String/Buffer, String/Buffer ==> 防止因为ElementUI 下拉选择切换
* 导致Qos变为String ==> 强制类型转换相关值后再发送 or 使用vue绑定修饰符
* */
import NProgress from 'nprogress'
import mqtt from 'mqtt'
import dateformat from 'dateformat'
import {
  Card, Row, Col, Input, Checkbox, Button, Select, Option, Table, TableColumn,
} from 'element-ui'

import MQTTConnect from '../common/MQTTConnect'

export default {
  name: 'websocket-view',
  components: {
    'el-card': Card,
    'el-row': Row,
    'el-col': Col,
    'el-input': Input,
    'el-checkbox': Checkbox,
    'el-button': Button,
    'el-select': Select,
    'el-option': Option,
    'el-table': Table,
    'el-table-column': TableColumn,
  },
  data() {
    return {
      retryTimes: 0,
      loading: false,
      sending: false,
      host: window.location.hostname,
      port: 8083,
      username: '',
      isSSL: false,
      password: '',
      keepalive: 60,
      clean: true,
      clientId: `mqttjs_${Math.random().toString(16).substr(2, 10)}`,
      subQos: 0,
      publishQos: 0,
      publishMessage: 'Hello world!',
      subTopic: '/World',
      publishTopic: '/World',
      publishRetain: false,
      receivedMessages: [],
      publishedMessages: [],
      subscriptions: [],
      client: {},
    }
  },
  computed: {
    getStatus() {
      if (this.client.connected) {
        return this.$t('websocket.connected')
      }
      if (this.loading) {
        return this.$t('websocket.connecting')
      }
      return this.$t('websocket.disconnected')
    },
    supportWebSocket() {
      return window.WebSocket
    },
  },
  methods: {
    handleSSL() {
      this.port = this.isSSL ? 8084 : 8083
    },
    now() {
      return dateformat(new Date(), 'yyyy-mm-dd hh:MM:ss')
    },
    disconnectSwitch() {
      // connecting
      if (this.loading && !this.client.connected) {
        this.loading = false
        NProgress.done()
        this.client.end()
        this.client = {}
      } else {
        this.mqttDisconnect()
      }
    },
    mqttConnect() {
      if (!this.supportWebSocket) {
        this.$message.error(this.$t('websocket.notSupport'))
        return
      }
      // prevent the connect from keyboard event
      if (this.client.connected || this.loading) {
        return
      }
      NProgress.start()
      this.loading = true
      this.retryTimes = 0
      const options = {
        keepalive: this.keepalive,
        username: this.username,
        password: this.password,
        clientId: this.clientId,
        clean: this.clean,
        connectTimeout: 4000,
      }
      const protocol = this.isSSL ? 'wss' : 'ws'
      this.client = mqtt.connect(`${protocol}://${this.host}:${this.port}/mqtt`, options)
      this.client.on('connect', () => {
        this.loading = false
        NProgress.done()
      })
      this.client.on('reconnect', () => {
        if (this.retryTimes > 1) {
          if (this.sending) {
            this.$message.error(this.$t('websocket.connectError'))
          } else {
            this.$message.error(`${this.$t('websocket.connectFailure')} ${this.host}:${this.port}`)
          }
          this.retryTimes = 0
          this.sending = false
          this.loading = false
          NProgress.done()
          this.client.end()
          this.client = {}
        }
        // trigger by sending illegal topic
        if (this.sending) {
          this.$message.error(this.$t('websocket.connectError'))
        }
        this.retryTimes += 1
      })
      this.client.on('error', (error) => {
        this.$message.error(error.toString() || this.$t('error.networkError'))
        // to prevent reconnect
        this.retryTimes = 0
        this.client.end()
        NProgress.done()
      })
      this.client.on('message', (topic, message, packet) => {
        this.receivedMessages.unshift({
          topic,
          message: message.toString(),
          qos: packet.qos,
          time: this.now(),
        })
      })
    },
    mqttDisconnect() {
      if (this.client.connected) {
        NProgress.start()
        this.client.end()
        this.client.on('close', () => {
          this.loading = false
          this.reset()
          this.client = {}
          NProgress.done()
        })
      } else {
        this.$message.error(this.$t('websocket.connectLeave'))
      }
    },
    mqttSubscribe() {
      if (this.client.connected) {
        this.subscriptions.forEach((x, index) => {
          if (x.topic === this.subTopic) {
            this.subscriptions.splice(index, index + 1)
          }
        })
        NProgress.start()
        this.client.subscribe(this.subTopic,
        { qos: this.subQos },
        (error) => {
          if (error) {
            NProgress.done()
            this.$message.error(error.toString())
          } else {
            this.subscriptions.unshift({
              topic: this.subTopic,
              qos: this.subQos,
              time: this.now(),
            })
            this.$message.success(this.$t('websocket.subscribeSuccess'))
            NProgress.done()
          }
        })
      } else {
        this.$message.error(this.$t('websocket.connectLeave'))
      }
    },
    mqttPublish() {
      if (this.client.connected) {
        NProgress.start()
        const options = { qos: this.publishQos,
          retain: this.publishRetain }
        // to mark which trigger the reconnect
        this.sending = true
        this.client.publish(this.publishTopic,
        this.publishMessage, options, (error) => {
          if (error) {
            NProgress.done()
            this.$message.error(error.toString())
          } else {
            this.publishedMessages.unshift({
              message: this.publishMessage,
              topic: this.publishTopic,
              qos: this.publishQos,
              time: this.now(),
            })
            this.$message.success(this.$t('websocket.messageSendOut'))
            NProgress.done()
          }
        })
      } else {
        this.$message.error(this.$t('websocket.connectLeave'))
      }
    },
    mqttCacheScuscribe(topic) {
      if (!this.client.connected) {
        this.$message.error(this.$t('websocket.connectLeave'))
        return
      }
      this.client.unsubscribe(topic, (error) => {
        if (error) {
          this.$message.error(`${this.$t('websocket.unsubscribeFailure')} ${error.toString()}!`)
          return
        }
        this.subscriptions.forEach((element, index) => {
          if (element.topic === topic) {
            this.subscriptions.splice(index, 1)
            // clear message which in this topic
          }
        })
      })
    },
    reset() {
      this.subscriptions = []
      this.receivedMessages = []
      this.publishedMessages = []
      this.publishMessage = 'Hello world!'
      this.subTopic = '/World'
      this.publishTopic = '/World'
    },
    clearMessage(received = true) {
      if (received) {
        this.receivedMessages = []
      } else {
        this.publishedMessages = []
      }
    },
    loadConnect() {
      if (MQTTConnect.client && MQTTConnect.client.connected) {
        this.client = MQTTConnect.client
        Object.keys(MQTTConnect.options).forEach((item) => {
          this[item] = MQTTConnect.options[item]
        })
      }
    },
    stashConnect() {
      MQTTConnect.client = this.client
      Object.keys(MQTTConnect.options).forEach((item) => {
        MQTTConnect.options[item] = this[item]
      })
    },
  },
  created() {
    this.loadConnect()
  },
  beforeRouteLeave(to, from, next) {
    if (this.client.connected) {
      this.stashConnect()
    }
    next()
  },
}
</script>


<style lang="scss">
.websocket-view {
  .el-select {
    width: 100%;
  }
  .refresh-btn {
    font-size: 12px;
    margin-left: 8px;
    cursor: pointer;
  }
  .connect-state {
    display: inline-block;
  }
  .el-table {
    margin-top: 5px;
    /* 增加内边距 */
    border-width: 0 !important;
  }
  .el-card {
    margin-top: 24px;
  }
  .el-input,
  .el-checkbox {
    margin: 5px 0 20px;
  }
  .el-button {
    display: inline-block;
    min-width: 80px;
    &.unsubscribe {
      text-align: left;
      padding-left: 6px;
    }
  }
}
</style>
