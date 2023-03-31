<script>
import sendAsync from '../../electron/message-control/renderer.js'

export default {
  data: function () {
    return {
      testData: [],
      errorMsg: null
    }
  },
  async mounted() {
    console.log("I'm a mountin'")
    const sql = 'SELECT * FROM test;'

    sendAsync(sql)
      .then((result) => {
        this.testData = result
      })
      .catch((err) => (this.errorMsg = err))
  }
}
</script>

<template>
  <h1>First Renderer with test data</h1>
  <h2 :if="this.errorMsg">{{ this.errorMsg }}</h2>
  <h2 :if="this.testData">{{ this.testData }}</h2>
  <!-- < -->
</template>
