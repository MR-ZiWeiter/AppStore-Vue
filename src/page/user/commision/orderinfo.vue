<template>
    <div id="commision-log">
        <head-top head-title="订单明细" :go-back='true' :rightMenu="true"></head-top>
        <div class="p-a-all">
            <div class="top">
                <img :src="info.url+info.user_headimg" alt="">
                <span>{{info.nick_name}}</span>
                <span class="price">(购买者)</span>
            </div>
            <div class="flex-box">
                <span>订单号</span>
                <span>{{info.order_no}}</span>
            </div>
            <!-- <div class="flex-box">
                <span>订单类型</span>
                <span>{{info.out_trade_no}}</span>
            </div> -->
            <div class="flex-box">
                <span>订单金额</span>
                <span class="price">{{parseFloat(info.goods_money).toFixed(2)}}积分</span>
            </div>
            <div class="flex-box">
                <span>可分成总金额</span>
                <span class="price">{{parseFloat(info.goods_commission).toFixed(2)}}积分</span>
            </div>
            <div class="flex-box">
                <span>佣金比例</span>
                <span>{{info.commission_rate}}%</span>
            </div>
            <div class="flex-box">
                <span>佣金</span>
                <span class="price">{{parseFloat(info.commission).toFixed(2)}}积分</span>
            </div>
            <div class="flex-box">
                <span>是否发放</span>
                <span>{{info.is_issue}}</span>
            </div>
            <div class="flex-box">
                <span>创建时间</span>
                <span>{{info.create_time}}</span>
            </div>  
            <div class="flex-box">
                <span>完成时间</span>
                <span>{{info.finish_time}}</span>
            </div>      
        </div>
    </div>
</template>
<script>
import { userAccountRecordsOrderDetail } from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: {
    headTop
  },
  data() {
    return {
      info: {}
    };
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await userAccountRecordsOrderDetail(
        this.$route.query.id,
        this.$route.query.type
      );
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
        setTimeout(() => {
          this.$router.go(-1);
        }, 2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.p-a-all {
    background: #eee;
  .top {
    display: flex;
    align-items: center;
    padding: 0.2rem 0.3rem;
    background: #fff;
    border-bottom: 1px solid #ccc;
    img {
      width: 1rem;
      height: 1rem;
      background: #eee;
      border-radius: 50%;
      margin-right: 0.2rem;
    }
  }
  .flex-box {
    width: 100%;
    padding: 0.2rem 0.3rem;
    background: #fff;
    font-size: 0.3rem;
    margin-bottom: 0.02rem;
    span:last-child {
      color: #666;
      font-size: 0.26rem;
    }
    .price {
      color: #ff4444 !important;
    }
  }
}
.hide {
  display: none;
}
</style>

