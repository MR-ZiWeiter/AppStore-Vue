<template>
  <div id="get_coupon">
    <head-top :go-back='true' head-title="优惠券"></head-top>
    <div class="p-a-all">
      <div class="box" v-for="(item,index) in list" :key="index">
        <div class="center">
          <p class="font-size-15 text-color-333">{{item.coupon_name}}</p>
          <p class="font-size-12 text-color-999">{{item.range_type==0?'指定':'全部'}}商品满{{item.at_least}}减{{item.money}}元</p>
        </div>
        <div class="right" @click="getcoupon(item.coupon_type_id)">
          <x-button text="领取" :gradients="['#ff4444', '#fbac47']"></x-button>
        </div>
      </div>
      <div v-if="list.length==0" style="padding-top:20%;text-align:center">没有可领取的优惠券</div>
    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import { getCouponList, getCoupon } from "src/service/getData";
export default {
  components: { headTop },
  data() {
    return {
      page: 1,
      list: [],
      isnext: true
    };
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    async getcoupon(id) {
      this.$vux.loading.show({
        text: "领取中..."
      });
      let res = await getCoupon(id);
      this.$vux.loading.hide();
      let that = this;

      if (res.code == 1&&res.data > 0) {
          this.$vux.toast.text("领取成功", "middle");
      }else{
         this.$vux.toast.text("领取失败", "middle");
      }
    },
    async getList() {
      this.$vux.loading.show({
        text: "正在获取..."
      });
      let res = await getCouponList(this.page);
      this.$vux.loading.hide();
      let that = this;
      if (res.code == 1) {
        let list = res.data;
        let that = this;
        for (let i in list) {
          that.list.push(list[i]);
        }
        this.isnext = res.data.length > 0 ? true : false;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#get_coupon {
  .p-a-all {
    background: #eee;
    padding: 0.15rem 0.3rem;
    top: 0.9rem;
    .box {
      background: #fff;
      padding: 0.4rem;
      position: relative;
      display: flex;
      align-items: center;

      .right {
        width: 1.3rem;
        display: flex;
        justify-content: flex-end;
        button {
          font-size: 0.24rem;
        }
      }
    }
    .box::before {
      position: absolute;
      height: 0.06rem;
      border-bottom-left-radius: 0.06rem;
      border-bottom-right-radius: 0.06rem;
      right: 0;
      bottom: 0;
      left: 0;
      content: "";
      background: #ff4444;
    }

    .box::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 0.5rem;
      position: absolute;
      display: block;
      z-index: 9;
      background-image: linear-gradient(
          -45deg,
          #eee 25%,
          transparent 25%,
          transparent
        ),
        linear-gradient(-135deg, #eee 25%, transparent 25%, transparent),
        linear-gradient(-45deg, transparent 75%, #eee 75%),
        linear-gradient(-135deg, transparent 75%, #eee 75%);
      background-size: 0.2rem 0.8rem;
      background-repeat: repeat-x, repeat-x;
    }
  }
}
</style>
<style scoped>
#get_coupon .box .center {
  width: calc(100% - 1.3rem);
}
</style>

