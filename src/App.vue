<template>
  <div>
    <div id="bg"></div>
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
    #bg {
        background: url("assets/img/bg.jpg") center center no-repeat;
        width:100%;
        height:100%;
        position:fixed;
        background-size:100% 100%;

        top: 0;
        left: 0;

        filter:blur(2px); /*虚化值，越大越模糊*/
    }
</style>
