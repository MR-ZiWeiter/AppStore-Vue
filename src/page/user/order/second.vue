<template>
  <div id="second">
    <head-top head-title="二次转售" :go-back='true' :rightMenu="true"></head-top>
    <tab custom-bar-width="1rem">
      <!-- <tab-item :selected="check==3" @on-item-click="onItemClick(3)">全部</tab-item> -->
      <tab-item :selected="check==0" @on-item-click="onItemClick(0)">可转售</tab-item>
      <tab-item :selected="check==1" @on-item-click="onItemClick(1)">转售中</tab-item>
      <tab-item :selected="check==2" @on-item-click="onItemClick(2)">已转售</tab-item>
    </tab>
    <order-list></order-list>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import orderList from "./components/second";
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
      this.$router.replace("order_second?type=" + index);
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
#second {
  background: #eee;
  .p-a-all {
    top: 1.71rem;
  }
}
</style>
<style lang="scss">
#second {
  .vux-tab-item {
    flex: 0 0 33.33333% !important;
  }
}
</style>
