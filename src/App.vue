<template>
  <div>
    <div id="app">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;

        overflow-x: hidden; /* 隐藏底部滑动条 */
    }
</style>
