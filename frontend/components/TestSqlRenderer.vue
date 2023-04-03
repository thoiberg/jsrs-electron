<script>
export default {
  data: function () {
    return {
      testData: [],
      errorMsg: null
    }
  },
  async mounted() {
    this.testData = await window.electronAPI.getAllTest()
  }
}
</script>

<template>
  <h1>First Renderer with test data</h1>
  <h2 :if="this.errorMsg">{{ this.errorMsg }}</h2>
  <h2 :if="this.testData">{{ this.testData }}</h2>
  <!-- < -->
</template>
