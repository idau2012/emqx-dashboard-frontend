<template>
  <div class="json-editor">
    <textarea ref="textarea"></textarea>
  </div>
</template>


<script>
/* eslint-disable */
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/lesser-dark.css'

require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

export default {
  name: 'jsonEditor',

  props: ['value'],

  data() {
    return {
      jsonEditor: false,
    }
  },

  watch: {
    value(value) {
      const editor_value = this.jsonEditor.getValue()
      if (value !== editor_value) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      }
    },
  },

  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    },
  },

  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'lesser-dark',
      lint: true,
    })
    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    this.jsonEditor.on('change', cm => {
      const value = cm.getValue()
      this.$emit('changed', value)
      this.$emit('input', value)
    })
  },
}
</script>


<style scoped>
  .json-editor {
    height: 100%;
    position: relative;
  }

  .json-editor >>> .CodeMirror-lint-markers {
    width: 0;
  }

  .json-editor >>> .CodeMirror {
    height: 200px;
  }

  .json-editor >>> .CodeMirror-scroll {
    height: 200px;
  }

  .json-editor >>> .cm-s-rubyblue span.cm-string {
    color: #F08047;
  }
</style>