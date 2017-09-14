<template>
  <div class="websocket-view">
    <div class="page-title">Websocket</div>

    <el-card class="box-card blank-top"  @keyup.enter.native="mqttConnect">
      <div slot="header">
        <span>Connect</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>Host:</label>
          <el-input v-model="clientOption.host" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Port:</label>
          <el-input v-model="clientOption.port" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Client ID:</label>
          <el-input v-model="clientOption.clientId" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>Username:</label>
          <el-input v-model="clientOption.username" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Password:</label>
          <el-input v-model="clientOption.password" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Keep Alive:</label>
          <el-input v-model="clientOption.keepalive" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
          <el-checkbox v-model="clientOption.clean">Clean Session</el-checkbox>
      </el-row>

      <el-row type="flex" justify="start" align="middle" class="connect-area">
        <el-button type="success" class="connect-btn" :icon="loading ? 'loading': 'check'" size="small"
                   :disabled="loading || client.connected"
                   @keyup.enter.native="mqttConnect"
                   @click="mqttConnect">Connect</el-button>

        <el-button type="success" icon="close" size="small"
                   :disabled="!loading && !client.connected" class="close-btn"
                   @keyup.enter.native="disconnectSwitch"
                   :loading="loading && client.connected" @click="disconnectSwitch">Disconnect</el-button>

        <div class="connect-state">Current State:
          <span :style="client.connected ? 'color: #42d885' : ''">
          {{ getStatus }}</span>
        </div>
      </el-row>
    </el-card>

    <el-card class="box-card blank-top" style="max-height: 450px">
      <div slot="header">
        <span>Subscribe</span>
      </div>
      <el-row :gutter="20" @keyup.enter.native="mqttSubscribe">
        <el-col :span="12">
          <label>Topic:</label>
          <el-input v-model="clientOption.subTopic" size="small"></el-input>
          <label>QoS:</label>
          <el-select v-model="clientOption.subQos" size="small" style="display: block;">
            <el-option value="0"></el-option>
            <el-option value="1"></el-option>
            <el-option value="2"></el-option>
          </el-select>
          <div class="between">
            <el-button type="success" icon="check" size="small"
                       @keyup.enter.native="mqttSubscribe"
                       @click="mqttSubscribe"
            >Subscribe</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <label>Subscribes:</label>
          <el-table :data="clientOption.subscriptions" :max-height="320">
            <el-table-column prop="topic" label="Topic" min-width="160"></el-table-column>
            <el-table-column prop="qos" width="70" label="QoS"></el-table-column>
            <el-table-column prop="time" min-width="180" label="Date"></el-table-column>
            <el-table-column prop="time" width="70" label="Oper">
              <template scope="props">
                <el-button size="mini" type="text" icon="close" style="color: #a7a7a7" title="Unsubscribe"
                           @click="mqttCacheScuscribe(props.row.topic)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card blank-middle" style="max-height: 800px;padding-bottom: 20px">
      <div slot="header">
        <span>Messages</span>
      </div>
      <el-row :gutter="20" @keyup.enter.native="mqttPublish">
        <el-col :span="6">
          <label>Topic:</label>
          <el-input v-model="clientOption.publishTopic" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <label>Message:</label>
          <el-input v-model="clientOption.publishMessage" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <label>QoS:</label>
          <el-select v-model="clientOption.publishQos" size="small" style="display: block;">
            <el-option value="0"></el-option>
            <el-option value="1"></el-option>
            <el-option value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" style="margin-top: 21px">
          <el-checkbox v-model="clientOption.publishRetain" style="margin-right: 15px;">Retained</el-checkbox>
          <el-button type="success" icon="check" size="small"
            @click="mqttPublish" @keyup.enter.native="mqttPublish"
          >Send</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <label>Messages already sent:
            <i class="fa fa-refresh refresh-btn" aria-hidden="true"
               @click="clearMessage(false)"
               title="clear message"></i>
          </label>
          <el-table :data="clientOption.publishedMessages" border :max-height="600">
            <el-table-column prop="message" label="Message"></el-table-column>
            <el-table-column prop="topic" label="Topic"></el-table-column>
            <el-table-column prop="qos" label="QoS" width="70"></el-table-column>
            <el-table-column prop="time" label="Date" width="180"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <label>Messages received:
            <i class="fa fa-refresh refresh-btn" aria-hidden="true"
               @click="clearMessage"
               title="clear message"></i>
          </label>
          <el-table :data="clientOption.receivedMessages" border :max-height="600">
            <el-table-column prop="message" label="Message"></el-table-column>
            <el-table-column prop="topic" label="Topic"></el-table-column>
            <el-table-column prop="qos" label="QoS" width="70"></el-table-column>
            <el-table-column prop="time" label="Date" width="180"></el-table-column>
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
* 导致Qos变为String ==> 强制类型转换相关值后再发送
* */
import NProgress from 'nprogress'
import mqtt from 'mqtt'
import dateformat from 'dateformat'
import { Card, Row, Col, Input, Checkbox, Button, Select, Option, Table, TableColumn } from 'element-ui'

import clientObject from '../store/mqttConnect'

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
      clientOption: {
        host: '127.0.0.1',
        port: '8083',
        username: '',
        password: '',
        keepalive: 60,
        clean: true,
        clientId: '',
        subQos: 0,
        publishQos: 0,
        publishMessage: 'Hello world!',
        subTopic: '/World',
        publishTopic: '/World',
        publishRetain: false,
        receivedMessages: [],
        publishedMessages: [],
        subscriptions: [],
      },
      client: {},
    }
  },
  created() {
    this.loadConnect()
  },
  computed: {
    getStatus() {
      if (this.client.connected) {
        return 'CONNECTED'
      }
      if (this.loading) {
        return 'CONNECTING'
      }
      return 'DISCONNECTED'
    },
  },
  methods: {
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
      // prevent the connect from keyboard event
      if (this.client.connected || this.loading) {
        return
      }
      NProgress.start()
      this.loading = true
      this.retryTimes = 0
      const options = {
        keepalive: this.clientOption.keepalive,
        username: this.clientOption.username,
        password: this.clientOption.password,
        clientId: this.clientOption.clientId,
        clean: this.clientOption.clean,
        connectTimeout: 4000,
      }
      console.log(options)
      this.client = mqtt.connect(`ws://${this.clientOption.host}:${this.clientOption.port}/mqtt`, options)
      this.client.on('connect', () => {
        this.loading = false
        clientObject.client = this.client
        clientObject.clientOption = this.clientOption
        NProgress.done()
      })
      this.client.on('reconnect', () => {
        if (this.retryTimes > 1) {
          if (this.sending) {
            this.$message.error('Error: Disconnect due to the illegal topic!')
          } else {
            this.$message.error(`Connect failure on ${this.clientOption.host}:${this.clientOption.port}!`)
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
          this.$message.error('Error: Failure due to a illegal topic!')
        }
        this.retryTimes += 1
      })
      this.client.on('error', (error) => {
        this.$message.error(error)
        // to prevent reconnect
        this.retryTimes = 0
        NProgress.done()
      })
      this.client.on('message', (topic, message, packet) => {
        this.clientOption.receivedMessages.unshift({
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
        this.$message.error('The client does not connect to the broker!')
      }
    },
    mqttSubscribe() {
      if (this.client.connected) {
        this.clientOption.subscriptions.forEach((x, index) => {
          if (x.topic === this.clientOption.subTopic) {
            this.clientOption.subscriptions.splice(index, index + 1)
          }
        })
        NProgress.start()
        this.client.subscribe(this.clientOption.subTopic,
        { qos: Number(this.clientOption.subQos) }, (error) => {
          if (error) {
            NProgress.done()
            this.$message.error(error.toString())
          } else {
            this.clientOption.subscriptions.unshift({
              topic: this.clientOption.subTopic,
              qos: this.clientOption.subQos,
              time: this.now(),
            })
            this.$message.success('Subscribe success.')
            NProgress.done()
          }
        })
      } else {
        this.$message.error('The client does not connect to the broker!')
      }
    },
    mqttPublish() {
      if (this.client.connected) {
        NProgress.start()
        const options = { qos: Number(this.clientOption.publishQos),
          retain: this.clientOption.publishRetain }
        // to mark which trigger the reconnect
        this.sending = true
        this.client.publish(this.clientOption.publishTopic,
        this.clientOption.publishMessage, options, (error) => {
          if (error) {
            NProgress.done()
            this.$message.error(error.toString())
          } else {
            this.clientOption.publishedMessages.unshift({
              message: this.clientOption.publishMessage,
              topic: this.clientOption.publishTopic,
              qos: this.clientOption.publishQos,
              time: this.now(),
            })
            this.$message.success('Message send out.')
            NProgress.done()
          }
        })
      } else {
        this.$message.error('The client does not connect to the broker!')
      }
    },
    mqttCacheScuscribe(topic) {
      if (!this.client.connected) {
        this.$message.error('The client does not connect to the broker!')
        return
      }
      this.client.unsubscribe(topic, (error) => {
        if (error) {
          this.$message.error(`Unsubscribe failure: ${error.toString()}!`)
          return
        }
        this.clientOption.subscriptions.forEach((element, index) => {
          if (element.topic === topic) {
            this.clientOption.subscriptions.splice(index, 1)
            // clear message which in this topic
          }
        })
      })
    },
    reset() {
      this.clientOption.subscriptions = []
      this.clientOption.receivedMessages = []
      this.clientOption.publishedMessages = []
      this.clientOption.publishMessage = 'Hello world!'
      this.clientOption.subTopic = '/World'
      this.clientOption.publishTopic = '/World'
    },
    loadConnect() {
      if (!clientObject.client.connected) {
        // reset
        this.clientOption.clientId = `mqttjs_${Math.random().toString(16).substr(2, 10)}`
      } else {
        // reload
        this.client = clientObject.client
        this.clientOption = clientObject.clientOption
      }
    },
    clearMessage(received = true) {
      if (received) {
        this.clientOption.receivedMessages = []
      } else {
        this.clientOption.publishedMessages = []
      }
    },
  },
}
</script>


<style lang="scss">
.websocket-view {
  padding-top: 20px;
  .el-select {
    width: 100%;
  }
}
.websocket-view .page-title {
  padding: 10px 0 ;
}
.websocket-view .el-table {
  margin-top: 5px;
}
.websocket-view .blank-top {
  margin-top: 60px;
}
.websocket-view .blank-middle {
  margin-top: 20px;
}
.websocket-view .el-input,.el-checkbox {
  margin: 5px 0 20px;
}
</style>
