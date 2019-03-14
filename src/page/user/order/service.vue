<template>
  <div id="order">
    <head-top head-title="服务订单" :go-back='true' :rightMenu="true"></head-top>
    <tab custom-bar-width="1rem">
      <tab-item :selected="check==0" @on-item-click="onItemClick">全部</tab-item>
      <tab-item :selected="check==1" @on-item-click="onItemClick">待付款</tab-item>
      <tab-item :selected="check==2" @on-item-click="onItemClick">待发货</tab-item>
      <tab-item :selected="check==3" @on-item-click="onItemClick">待收货</tab-item>
      <tab-item :selected="check==4" @on-item-click="onItemClick">已完成</tab-item>
      <!-- <tab-item :selected="check==5" @on-item-click="onItemClick">退款中</tab-item> -->
    </tab>
    <order-list></order-list>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import orderList from "./components/service";
export default {
  components: {
    headTop,
    orderList
  },
  data() {
    return {
      check: this.$route.query.type ? this.$route.query.type : 0
    };
  },
  methods: {
    onItemClick(index) {
      this.check = index;
      this.$router.replace("serviceorder?type=" + index);
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
#order {
  background: #eee;
  .p-a-all {
    top: 1.71rem;
  }
}
</style>
<style lang="scss">
#order {
  .vux-tab-item {
    flex: 0 0 20% !important;
  }
}
</style>
