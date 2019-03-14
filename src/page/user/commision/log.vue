<template>
  <div id="commision-log">
    <head-top head-title="收益明细" :go-back='true' :rightMenu="true"></head-top>
    <div class="p-a-all" v-if="appConfig.commission&&appConfig.commission.value==0">
      <tab>
        <tab-item selected @on-item-click="checked=0">收益明细</tab-item>
        <tab-item @on-item-click="checked=1">提现记录</tab-item>
      </tab>
      <log-one :type="0"></log-one>
      <log-two :class="{hide:checked!=1}"></log-two>
    </div>
    <div v-else>
      <log-one :type="1"></log-one>
    </div>
   
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import logOne from "./components/log_1";
import logTwo from "./components/log_2";
import { mapState } from "vuex";
export default {
  components: {
    headTop,
    logOne,
    logTwo
  },
  data() {
    return {
      checked: 0,
    };
  },
  computed: {
    ...mapState({
      appConfig: state => state.config.appConfig
    })
  }
};
</script>
<style lang="scss" scoped>
.p-a-all{
  top:0;
}
.hide {
  display: none;
}
</style>

