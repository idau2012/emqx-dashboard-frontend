<template>
  <div class="websocket-view">
    <div class="page-title">Websocket</div>

    <el-card class="box-card blank-top" v-show="!client.connected">
      <div slot="header">
        <span>Connect</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>Host:</label>
          <el-input v-model="host" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Port:</label>
          <el-input v-model="port" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Client ID:</label>
          <el-input v-model="clientId" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>Username:</label>
          <el-input v-model="username" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Password:</label>
          <el-input v-model="password" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Keep Alive:</label>
          <el-input v-model="keepalive" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-checkbox v-model="clean">Clean Session</el-checkbox>
      </el-row>
      <el-row :gutter="20" type="flex" align="middle">
        <el-col :span="8">
          <el-button type="success" icon="check" size="small"
                     :loading="loading" @click="mqttConnect">
            Connect</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card blank-top" style="max-height: 450px" v-show="client.connected">
      <div slot="header">
        <span>Subscribe</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <label>Topic:</label>
          <el-input v-model="subTopic" size="small"></el-input>
          <label>QoS:</label>
          <el-select v-model="subQos" size="small" style="display: block;">
            <el-option value="0"></el-option>
            <el-option value="1"></el-option>
            <el-option value="2"></el-option>
          </el-select>
          <div class="between">
            <el-button type="success" icon="check" size="small"
                       :disabled="!client.connected"
                       @click="mqttSubscribe"
            >Subscribe</el-button>
            <el-button type="success" class="btn-close" title="Close the connect" icon="close" size="small"
                       @click="mqttDisconnect"
            >Disconnect</el-button>
          </div>
        </el-col>

        <el-col :span="12">
          <label>Subscribes:</label>
          <el-table :data="subscriptions" :max-height="320">
            <el-table-column prop="topic" label="Topic"></el-table-column>
            <el-table-column prop="qos" width="70" label="QoS"></el-table-column>
            <el-table-column prop="time" width="180" label="Date"></el-table-column>
          </el-table>
        </el-col>

      </el-row>
    </el-card>
    <el-card class="box-card blank-middle" style="max-height: 800px;padding-bottom: 20px" v-show="client.connected">
      <div slot="header">
        <span>Messages</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <label>Topic:</label>
          <el-input v-model="publishTopic" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <label>Message:</label>
          <el-input v-model="publishMessage" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <label>QoS:</label>
          <el-select v-model="publishQos" size="small" style="display: block;">
            <el-option value="0"></el-option>
            <el-option value="1"></el-option>
            <el-option value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" style="margin-top: 21px">
          <el-checkbox v-model="publishRetain" style="margin-right: 15px;">Retained</el-checkbox>
          <el-button type="success" icon="check" size="small"
            :disabled="!client.connected"
            @click="mqttPublish"
          >Send</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <label>Messages already sent:</label>
          <el-table :data="publishedMessages" border :max-height="600">
            <el-table-column prop="message" label="Message"></el-table-column>
            <el-table-column prop="topic" label="Topic"></el-table-column>
            <el-table-column prop="qos" label="QoS" width="70"></el-table-column>
            <el-table-column prop="time" label="Date" width="180"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <label>Messages received:</label>
          <el-table :data="receivedMessages" border :max-height="600">
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
import NProgress from 'nprogress'
import mqtt from 'mqtt'
import dateformat from 'dateformat'
import { Card, Row, Col, Input, Checkbox, Button, Select, Option, Table, TableColumn, Message } from 'element-ui'

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
      loading: false,
      host: '127.0.0.1',
      port: '8083',
      username: '',
      password: '',
      keepalive: 60,
      clean: true,
      clientId: `mqttjs_${Math.random().toString(16).substr(2, 10)}`,
      subTopic: '/World',
      subQos: 0,
      publishTopic: '/World',
      publishQos: 0,
      publishMessage: 'Hello world!',
      publishRetain: false,
      receivedMessages: [],
      publishedMessages: [],
      subscriptions: [],
      client: {},
    }
  },
  beforeCreate() {
    NProgress.start()
  },
  mounted() {
    NProgress.done()
  },
  methods: {
    now() {
      return dateformat(new Date(), 'yyyy-mm-dd hh:MM:ss')
    },
    mqttConnect() {
      NProgress.start()
      this.loading = true
      let retryTimes = 0
      const options = {
        keepalive: this.keepalive,
        username: this.username,
        password: this.password,
        clientId: this.clientId,
        clean: this.clean,
        connectTimeout: 4000,
      }
      this.client = mqtt.connect(`ws://${this.host}:${this.port}/mqtt`, options)
      this.client.on('connect', () => {
        Message.success('Connect success')
        NProgress.done()
      })
      this.client.on('reconnect', () => {
        if (retryTimes > 2) {
          Message.error(`Connect failure with ${this.host}:${this.port}`)
          retryTimes = 0
          this.loading = false
          this.client.end()
        }
        retryTimes += 1
      })
      this.client.on('error', (error) => {
        Message.error(error)
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
          this.subscriptions = []
          this.receivedMessages = []
          this.publishedMessages = []
          Message.success('Disconncet success')
          this.loading = false
          NProgress.done()
        })
      } else {
        Message.error('Please connect!')
      }
    },
    mqttSubscribe() {
      if (this.client.connected) {
        let isSubscribe = false
        this.subscriptions.forEach((x) => {
          if (x.topic === this.subTopic) {
            isSubscribe = true
          }
        })
        if (isSubscribe) {
          Message.error(`Topic '${this.subTopic}' is subscribed`)
          return
        }
        NProgress.start()
        this.client.subscribe(this.subTopic, { qos: this.subQos }, (error) => {
          if (error) {
            NProgress.done()
            Message.error(error)
          } else {
            this.subscriptions.unshift({
              topic: this.subTopic,
              qos: this.subQos,
              time: this.now(),
            })
            Message.success('Subscribe success!')
            NProgress.done()
          }
        })
      } else {
        Message.error('Could not subscribe before connect!')
      }
    },
    mqttPublish() {
      if (this.client.connected) {
        NProgress.start()
        const options = { qos: this.publishQos, retain: this.publishRetain }
        this.client.publish(this.publishTopic, this.publishMessage, options, (error) => {
          if (error) {
            NProgress.done()
            Message.error(error)
          } else {
            this.publishedMessages.unshift({
              message: this.publishMessage,
              topic: this.publishTopic,
              qos: this.publishQos,
              time: this.now(),
            })
            Message.success('Send success!')
            NProgress.done()
          }
        })
      } else {
        Message.error('Could not send message before connect!')
      }
    },

  },
}
</script>


<style>
.websocket-view {
  padding-top: 20px;
}
.websocket-view .page-title {
  padding: 10px 0 ;
}
.websocket-view .el-table {
  margin-top: 5px;
}
.websocket-view .blank-top {
  margin-top: 70px;
}
.websocket-view .btn-close:hover {
  background-color: #ff6d6d !important;
  color: #ffffff !important;
  border-color: #ff6d6d !important;
}
.websocket-view .blank-middle {
  margin-top: 20px;
}
.websocket-view .el-input,
.websocket-view .el-checkbox {
  margin: 5px 0 20px;
}
.websocket-view .el-checkbox__label {
  color: #ddd;
}
.websocket-view .el-checkbox__inner:hover {
  border-color: #227D51;
}
.websocket-view .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #37363b;
  border-color: #ddd;
}
.websocket-view .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #ddd;
}
.websocket-view .el-checkbox.is-focus {
  border-color: #37363b;
}
.websocket-view .between {
  display: flex;
  justify-content: space-between;
}
.websocket-view .el-button--small.el-button--success {
  background-color: transparent;
  border-color: #5d5d60;
  color: #fff;
  padding: 8px 14px;
}
.websocket-view .el-input__inner {
  background-color: transparent;
  color: #fff;
  border-color: #5d5d60
}
.websocket-view .el-input__inner:focus {
  border-color: #a7a7a7;
}
.websocket-view .el-button--small.el-button--success:hover {
  border-color: #a7a7a7;
}
.websocket-view .el-select .el-input__inner:focus {
  border-color: #a7a7a7;
}
</style>
