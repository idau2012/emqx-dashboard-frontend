<template>
  <div class="http-client">
    <el-card class="box-card">
      <div slot="header">
        <span>连接</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>Host:</label>
          <el-input v-model="host"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Port:</label>
          <el-input v-model="port"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Client ID:</label>
          <el-input v-model="clientId"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>用户名:</label>
          <el-input v-model="username"></el-input>
        </el-col>
        <el-col :span="8">
          <label>密码:</label>
          <el-input v-model="password"></el-input>
        </el-col>
        <el-col :span="8">
          <label>Keep Alive:</label>
          <el-input v-model="keepalive"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-checkbox v-model="clean">Clean Session</el-checkbox>
      </el-row>
      <el-row :gutter="20" type="flex" align="middle">
        <el-col :span="8">
          <el-button type="success" icon="check" size="small"
            :disabled="client.connected"
            @click="mqttConnect"
          >连接</el-button>
          <el-button icon="close" size="small"
            :disabled="!client.connected"
            @click="mqttDisconnect"
          >断开</el-button>
        </el-col>
        <el-col :span="8">
          <span>连接状态：</span>
          <strong :style="{ color: client.connected ? '#13CE66' : '#FF4949' }">
            {{ client.connected ? '连接成功' : '未连接' }}
          </strong>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <span>订阅</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="12" style="border-right: 1px solid #D3DCE6;">
          <label>Topic:</label>
          <el-input v-model="subTopic"></el-input>
          <label>QoS:</label>
          <div>
            <el-select v-model="subQos" style="display: block;">
              <el-option
                v-for="item in [0, 1, 2]"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <el-button type="success" icon="check" size="small"
            :disabled="!client.connected"
            @click="mqttSubscribe"
          >订阅</el-button>
        </el-col>
        <el-col :span="12">
          <label>订阅记录:</label>
          <el-table :data="subscriptions" border>
            <el-table-column prop="topic" label="Topic"></el-table-column>
            <el-table-column prop="qos" width="70" label="QoS"></el-table-column>
            <el-table-column prop="time" width="180" label="日期"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <span>消息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <label>Topic:</label>
          <el-input v-model="publishTopic"></el-input>
        </el-col>
        <el-col :span="6">
          <label>Message:</label>
          <el-input v-model="publishMessage"></el-input>
        </el-col>
        <el-col :span="6">
          <label>QoS:</label>
          <el-select v-model="publishQos" style="display: block;">
            <el-option
              v-for="item in [0, 1, 2]"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" style="padding-top: 25px;">
          <el-checkbox v-model="publishRetain" style="margin-right: 15px;">Retained</el-checkbox>
          <el-button type="success" icon="check" size="small"
            :disabled="!client.connected"
            @click="mqttPublish"
          >发送</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12" style="border-right: 1px solid #D3DCE6;">
          <label>发送的消息:</label>
          <el-table :data="publishedMessages" border>
            <el-table-column prop="message" label="Message"></el-table-column>
            <el-table-column prop="topic" label="Topic"></el-table-column>
            <el-table-column prop="qos" label="QoS" width="70"></el-table-column>
            <el-table-column prop="time" label="日期" width="180"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <label>收到的消息:</label>
          <el-table :data="receivedMessages" border>
            <el-table-column prop="message" label="Message"></el-table-column>
            <el-table-column prop="topic" label="Topic"></el-table-column>
            <el-table-column prop="qos" label="QoS" width="70"></el-table-column>
            <el-table-column prop="time" label="日期" width="180"></el-table-column>
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

export default {
  name: 'http-client',
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
      const options = {
        keepalive: this.keepalive,
        username: this.username,
        password: this.password,
        clientId: this.clientId,
        clean: this.clean,
      }
      this.client = mqtt.connect(`ws://${this.host}:${this.port}/mqtt`, options)
      this.client.on('connect', () => {
        this.$message.success('连接成功!')
        NProgress.done()
      })
      this.client.on('error', (error) => {
        this.$message.error(error)
        NProgress.done()
      })
      this.client.on('message', (topic, message, packet) => {
        this.receivedMessages.push({
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
          this.$message.success('断开连接成功!')
          NProgress.done()
        })
      } else {
        this.$message.error('未连接状态，不需要断开连接!')
      }
    },
    mqttSubscribe() {
      if (this.client.connected) {
        NProgress.start()
        this.client.subscribe(this.subTopic, { qos: this.subQos }, (error) => {
          if (error) {
            NProgress.done()
            this.$message.error(error)
          } else {
            this.subscriptions.push({
              topic: this.subTopic,
              qos: this.subQos,
              time: this.now(),
            })
            this.$message.success('订阅成功!')
            NProgress.done()
          }
        })
      } else {
        this.$message.error('连接成功后才能订阅!')
      }
    },
    mqttPublish() {
      if (this.client.connected) {
        NProgress.start()
        const options = { qos: this.publishQos, retain: this.publishRetain }
        this.client.publish(this.publishTopic, this.publishMessage, options, (error) => {
          if (error) {
            NProgress.done()
            this.$message.error(error)
          } else {
            this.publishedMessages.push({
              message: this.publishMessage,
              topic: this.publishTopic,
              qos: this.publishQos,
              time: this.now(),
            })
            this.$message.success('消息发送成功!')
            NProgress.done()
          }
        })
      } else {
        this.$message.error('连接成功后才能发布消息!')
      }
    },

  },
}
</script>


<style>
.websocket-view .el-table {
  margin-top: 5px;
}
.websocket-view .el-input,
.websocket-view .el-checkbox {
  margin: 5px 0 20px;
}

</style>
