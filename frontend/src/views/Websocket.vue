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
        <el-button type="success" class="connect-btn" icon="check" size="small"
                   :disabled="client.connected"
                   @keyup.enter.native="mqttConnect"
                   :loading="loading" @click="mqttConnect">Connect</el-button>

        <el-button type="success" icon="close" size="small"
                   :disabled="!client.connected"
                   @keyup.enter.native="mqttDisconnect"
                   :loading="loading" @click="mqttDisconnect">Disconnect</el-button>

        <div class="connect-state">Current State:
          <span :style="client.connected ? 'color: #42d885' : ''">
          {{ client.connected ? 'CONNECTED' : 'DISCONNECTED' }}</span>
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
            <el-table-column prop="time" min-width="150" label="Date"></el-table-column>
            <el-table-column prop="time" width="90" label="Oper">
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
  methods: {
    now() {
      return dateformat(new Date(), 'yyyy-mm-dd hh:MM:ss')
    },
    mqttConnect() {
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
      this.client = mqtt.connect(`ws://${this.clientOption.host}:${this.clientOption.port}/mqtt`, options)
      this.client.on('connect', () => {
        this.loading = false
        clientObject.client = this.client
        clientObject.clientOption = this.clientOption
        NProgress.done()
      })
      this.client.on('reconnect', () => {
        console.log('reconnect')
        if (this.retryTimes > 2) {
          this.$message.error(`Connect failure on ${this.clientOption.host}:${this.clientOption.port}`)
          this.retryTimes = 0
          console.log('give up')
          this.loading = false
          NProgress.done()
          this.client.end()
          this.client = {}
        }
        this.retryTimes += 1
      })
      this.client.on('error', (error) => {
        this.$message.error(error)
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
        this.$message.error('The client does not connect to the broker')
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
            this.$message.success('Subscribe success!')
            NProgress.done()
          }
        })
      } else {
        this.$message.error('The client does not connect to the broker')
      }
    },
    mqttPublish() {
      if (this.client.connected) {
        NProgress.start()
        const options = { qos: Number(this.clientOption.publishQos),
          retain: this.clientOption.publishRetain }
        this.client.publish(this.clientOption.publishTopic,
        this.clientOption.publishMessage, options, (error) => {
          if (error) {
            console.log('error')
            NProgress.done()
//            this.mqttDisconnect()
//            this.$message.error(error.toString())
          } else {
            this.clientOption.publishedMessages.unshift({
              message: this.clientOption.publishMessage,
              topic: this.clientOption.publishTopic,
              qos: this.clientOption.publishQos,
              time: this.now(),
            })
            this.$message.success('Send success!')
            NProgress.done()
          }
        })
      } else {
        this.$message.error('The client does not connect to the broker')
      }
    },
    mqttCacheScuscribe(topic) {
      if (!this.client.connected) {
        this.$message.error('The client does not connect to the broker')
        return
      }
      this.client.unsubscribe(topic, (error) => {
        if (error) {
          this.$message.error('Unsubscribe failure')
          return
        }
        this.clientOption.subscriptions.forEach((element, index) => {
          if (element.topic === topic) {
            this.clientOption.subscriptions.splice(index, 1)
            // clear message which in this topic
            console.log(element)
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
.websocket-view .connect-btn.el-button--small.el-button--success {
  color: #227D51;
  border-color: #227D51;
}
.websocket-view .is-disabled {
  background-color: #bfcbd9 !important;
  color: #ffffff !important;
  border-color: #bfcbd9 !important;
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
.websocket-view .el-checkbox {
  .el-checkbox__inner:hover {
    border-color: #42d885;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #42d885 !important;
    border-color: #42d885 !important;
  }
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
  border-color: #227D51;
  color: #227D51;
  padding: 8px 14px;
}
.websocket-view .el-input__inner {
  background-color: transparent;
  color: #fff;
  border-color: #5d5d60
}
.websocket-view .el-input__inner:focus {
  border-color: #a7a7a7 !important;
}
.websocket-view .el-button--small.el-button--success:hover,
.websocket-view .el-button--small.el-button--success.is-loading
{
  border-color: #42d885;
  background-color: #42d885;
  color: #fff;
}
.websocket-view .refresh-btn {
  font-size: 12px;
  margin-left: 8px;
  cursor: pointer;
}
.websocket-view .connect-area {
  button {
    margin-right: 20px;
  }
  .connect-state {
    span {
      margin-left: 12px;
      color: #ff6d6d;
    }
  }
}
</style>
