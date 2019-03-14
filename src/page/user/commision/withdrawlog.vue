<template>
  <div id="set">
    <head-top :go-back='true' head-title="分销订单记录" :rightMenu="true"></head-top>
    <tab>
      <tab-item :selected="check==0"  @on-item-click="onItemClick">推广奖励</tab-item>
      <tab-item :selected="check==1" @on-item-click="onItemClick">代理奖励</tab-item>
    </tab>
    <list-page></list-page>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import listPage from "./components/withdraw_log_list";
export default {
  components: { headTop, listPage },
  data() {
    return {
      check: this.$route.query.order_type,
    };
  },
  methods: {
    onItemClick(index) {
      this.check = index;
      var url='/withdrawlog?';
      let obj=this.$route.query;
      for(let i in obj){
        if(i!='order_type'){
          url=url+i+'='+obj[i]+'&';
        }
      }
      url=url+'order_type='+index;
       this.$router.replace(url);
    }
  },
};
</script>
<style lang="scss" scoped>
#set {
  .p-a-all {
    background: #eee;
    top:1.7rem;
  }
}
</style>
