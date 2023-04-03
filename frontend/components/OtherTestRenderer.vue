<script>
export default {
  data: function () {
    return {
      testData: [],
      errorMsg: null
    }
  },
  async mounted() {
    // const sql = 'SELECT * FROM other_test;'
    // sendAsync(sql)
    //   .then((result) => {
    //     this.testData = result
    //   })
    //   .catch((err) => (this.errorMsg = err))
  }
}
</script>

<template>
  <h1>Test renderer with Other Test data</h1>
  <h2 :if="this.errorMsg">{{ this.errorMsg }}</h2>
  <h2 :if="this.testData">{{ this.testData }}</h2>
  <!-- < -->
</template>
