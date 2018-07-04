<template>
  <div class="sql-editor">
    <textarea ref="textarea" :disabled="disabled"></textarea>
  </div>
</template>


<script>
/* eslint-disable */
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/lesser-dark.css'

import 'codemirror/mode/sql/sql'

export default {
  name: 'sql-editor',

  props: {
    value: {},
    mode: {
      type: String,
      default: 'text/x-mysql',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      sqlEditor: false,
    }
  },

  watch: {
    value(value) {
      const editor_value = this.sqlEditor.getValue()
      if (value !== editor_value) {
        this.sqlEditor.setValue(this.value)
      }
    },
    disabled() {
      this.sqlEditor.options.readOnly = this.disabled
    },
  },

  methods: {
    getValue() {
      return this.sqlEditor.getValue()
    },
  },

  mounted() {
    this.sqlEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: this.mode,
      // gutters: ['CodeMirror-lint-markers'],
      theme: 'lesser-dark',
      lint: false,
      readOnly: this.disabled,
    })
    this.sqlEditor.setValue(this.value)
    this.sqlEditor.on('change', cm => {
      const value = cm.getValue()
      this.$emit('changed', value)
      this.$emit('input', value)
    })
  },
}
</script>


<style scoped>
  .sql-editor {
    height: 100%;
    position: relative;
  }

  .sql-editor >>> .CodeMirror-lint-markers {
    width: 0;
  }

  .sql-editor >>> .CodeMirror {
    height: 150px;
  }

  .sql-editor >>> .CodeMirror-scroll {
    height: 150px;
    padding: 0;
    margin: 0;
  }

  .sql-editor >>> .cm-s-rubyblue span.cm-string {
    color: #F08047;
  }
</style>
