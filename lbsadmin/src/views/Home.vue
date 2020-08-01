<template>
  <div class="home-container">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <HelloWorld style="width:100%;height:100%;" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  padding: 32px;
  height: 100%;
  background-color: rgb(240, 242, 245, 0.8);
  position: relative;
}
</style>
