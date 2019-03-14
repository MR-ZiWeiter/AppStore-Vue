<template>
    <div>
      <!-- <head-top :go-back='true' head-title="登陆" ></head-top> -->
        <login></login>
    </div>
</template>
<script>
import login from "../../components/login/login";
import headTop from "src/components/header/head";
export default {
  components: {
    login,headTop
  }
};
</script>
<style lang="less" scoped>
</style>
