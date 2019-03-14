<template>
    <div id="coupon">
        <head-top head-title="我的优惠券" :go-back='true'></head-top>
        <!-- <tab>
            <tab-item selected @on-item-click="onItemClick">优惠券</tab-item>
            <tab-item @on-item-click="onItemClick">已过期</tab-item>
        </tab> -->
        <div class="p-a-all">
          <list :list="list"></list>
        </div>
    </div>
</template>
<script>
import headTop from "src/components/header/head";
import list from "src/components/coupon/index"
import {getUidCoupon} from "src/service/getData";
export default {
  components: {
    headTop,
    list
  },
  data(){
    return {
      list:[],
      page_count:1,
      page:1
    }
  },
  beforeMount(){
    this.getList();
  },
  methods: {
    onItemClick(data) {
      console.log(data);
    },
    async getList(){
      this.$vux.loading.show({'text':'获取中...'});
      let res=await getUidCoupon(this.page_index);
      this.$vux.loading.hide();
      if(res.code==1){
        this.list=res.data.data;
        this.page_count=res.data.page_count;
      }
    }
  }

};
</script>
<style lang="scss" scoped>
#coupon {
  .p-a-all {
    background: #eee;
    // top: 1.8rem;
  }
  .vux-tab-container {
    .vux-tab-item {
      font-size: 0.3rem;
      line-height: 0.8rem;
    }
  }
}
</style>
<style lang="scss">
#coupon {
  .vux-tab-container {
    height: 1rem;
    .vux-tab{
        height: 0.9rem;
    }
    .vux-tab-selected{
        color:#ff4444;
    }
    .vux-tab-ink-bar{
       background:#ff4444;
    }
  }
}
</style>

