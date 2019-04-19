export const en = {
  rely_resource: 'Resource',
  actions_tips: 'Processing messages for hit rules',
  conditional_tips: 'Defining rule conditions and data processing ways through SQL',
  conditional: 'Rule condition',
  rule_engine: 'Rule Engine',
  message_rule: 'Message Rule',
  create: 'Create',
  rule_name: 'Rule Name',
  actions: 'Actions',
  action: 'Action',
  resource: 'Resource',
  oper: 'Operation',
  view: 'View',
  confirm: 'Confirm',
  delete: 'Delete',
  rule_details: 'Details',
  rule_desc: 'Description',
  confirm_stop_delete: 'Confirm to stop and remove ？',
  delete_success: 'Delete success',
  action_exists: 'Action already exists',
  cancel: 'Cancel',
  resource_mgmt: 'Resources',
  name: 'Name',
  resource_type: 'Resource Type',
  description: 'Description',
  create_success: 'Create success',
  type: 'Type',
  value: 'Value',
  edit: 'Edit',
  add: 'Add',

  basic_info: 'Basic Info',
  rule_name_required: 'rule name required',
  rule_sql: 'SQL',
  rule_descr_placeholder: 'e.g.message render to Webhook',
  rule_sql_tips_title: 'The SQL for conditional filtering and data processing. Examples:',
  sql_tips_html: `<p> 1. Select the message body to be sent to the "command/#" topic</p>
<code>select payload from "command/#"</code>
<p> 2. Select the "name" field in the body of the message sent to any topic. The body of the message needs to be in JSON format.</p>
<code> select payload.name from "#"</code>
<p> 3. Select the name field in the body of the message sent to the "t/a" topic, and the filter condition is name = EMQ'.</p>
<code>select payload.name as name from "t/a" when name = EMQ'</code>
<p> Detailed rules are documented</p>`,
  condition_screening: 'Condition Screening',
  topic_condition: 'Topic',
  message_publish_topic: 'Message topic',
  set_action: 'Action Handler',
  sql_required: 'SQL required',
  actions_required: 'actions required',
  rule_action_tips_title: 'Define action handlers',
  action_tips_html: `
<p> 1. Re-publish message to message server</p>

<span> Re-publishing messages to broker requires specifying the target theme</span>

<p> 2. Forwarding messages to Webhook</p>

<span> Forwarding messages to HTTP Webhook</span>`,
}

export const zh = {
  rely_resource: '关联资源',
  actions_tips: '处理命中规则的消息',
  conditional_tips: '使用 SQL 定义规则条件与数据处理方式',
  conditional: '条件',
  rule_engine: '规则引擎',
  message_rule: '消息规则',
  create: '新建',
  rule_name: '规则名称',
  actions: '响应动作',
  action: '动作',
  resource: '关联资源',
  oper: '操作',
  view: '查看',
  confirm: '确认',
  delete: '删除',
  rule_details: '规则详情',
  rule_desc: '规则描述',
  confirm_stop_delete: '确认停用并删除？',
  delete_success: '删除成功',
  action_exists: '动作已存在',
  cancel: '取消',
  resource_mgmt: '资源管理',
  name: '名称',
  resource_type: '资源类型',
  description: '备注',
  create_success: '创建成功',
  type: '类型',
  value: '值',
  edit: '编辑',
  add: '添加',

  basic_info: '基本信息',
  rule_name_required: '请输入规则名称',
  rule_sql: '规则 SQL',
  rule_descr_placeholder: 'e.g.消息转发到 Webhook',
  rule_sql_tips_title: '编写 SQL 进行条件过滤与数据处理，示例：',
  sql_tips_html: `<p>1. 选择发往 "command/#" 主题的消息体</p>
                <code>select payload from "command/#"</code>

                <p>2. 选择发往任意主题的消息体中的 "name" 字段，消息体需要为 JSON 格式</p>
                <code> select payload.name from "#"</code>

                <p>3. 选择发往 "t/a" 主题的消息体中的 name 字段, 过滤条件为 name = 'EMQ'</p>
                <code>select payload.name as name from "t/a" when name = 'EMQ'</code>

                <p>详细规则见文档</p>`,
  condition_screening: '条件筛选',
  topic_condition: '主题条件',
  message_publish_topic: '消息发布主题',
  set_action: '响应动作',
  sql_required: '请输入 SQL',
  actions_required: '动作不能为空',
  rule_action_tips_title: '定义动作',
  action_tips_html: `
<p>1. 重新发布消息至消息服务器</p>
<span>将消息重新发布到 broker 中，需要指定目标主题</span>
<p>2. 将消息转发至 Webhook</p>
<span>将消息转发至 HTTP Webhook</span>`,
}
