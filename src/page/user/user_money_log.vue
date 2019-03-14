<template>
    <div id="user_money_log">
        <head-top :go-back='true' :head-title="title"></head-top>
        <div class="p-a-all">
            <div class="flex-box" v-if="setHtml(index).value" v-for="(item,index) in info" :key="index">
                <span>{{setHtml(index).value}}</span>
                <span :class="{price:setHtml(index).isred}">{{setHtml(index).icon}}{{item}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import { getBalanceDetail } from "src/service/getData";
import { mapState } from "vuex";
import headTop from "src/components/header/head";
export default {
  components: { headTop },
  data() {
    return {
      title: "变动详情",
      info: {}
    };
  },
  beforeMount(){
      this.getInfo();
  },
  computed:{
    ...mapState({
      appConfig: state => state.config.appConfig
    })
  },
  methods: {
    goto(url) {
      this.$router.push(url);
    },
    async getInfo() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await getBalanceDetail(this.$route.query.id);
      this.$vux.loading.hide();
      let that = this;
      if (res.code == 1) {
        this.info = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
        setTimeout(() => {
          this.$router.go(-1);
        }, 2000);
      }
    },
    setHtml(key) {
      var value = "";
      var isred = false;
      var icon = "";
      switch (key) {
        case "number":
          isred = true;
          value = "变动数量";
          break;
        case "order_no":
          value = "订单号";
          break;
        case "order_type":
          value = "订单类型";
          break;
        case "point":
          value = "消耗"+this.appConfig?this.appConfig.word.point:'积分';
          break;
        case "order_money":
          value = "订单金额";
          break;
        case "point":
          value = "订单消耗积分";
          break;
        case "order_status":
          value = "订单状态";
          break;
        case "pay_time":
          value = "支付时间";
          break;
        case "create_time":
          value = "创建时间";
          break;
        case "finish_time":
          value = "完成时间";
          break;
        case "fromtype":
          value = "变动类型";
          break;
        case "withdraw_no":
          value = "流水号";
          break;
        case "bank_name":
          value = "提现方式";
          break;
        case "account_number":
          value = "提现账号";
          break;
        case "realname":
          value = "取款人";
          break;
        case "mobile":
          value = "手机号";
          break;
        case "cash":
          value = "提现积分";
          break;
        case "status":
          value = "状态";
          break;
        case "ask_for_date":
          value = "申请提现时间";
          break;
        case "payment_date":
          value = "到账时间";
          break;
        case "account_type":
          value = "类型";
          break;
        case "text":
          value = "描述";
          break;
        case "user_name":
          value = "账号";
          break;
        case "real_name":
          value = "真实姓名";
          break;
        case "user_tel":
          value = "手机号";
          break;
        case "actual_cash":
          value = "预计到账";
          icon = "￥";
          isred = true;
          break;
        case "poundage":
          value = "手续费";
          icon = "￥";
          isred = true;
          break;
      }
      if (isred) {
        isred = "text-color-red";
      }
      return {
        value,
        isred,
        icon
      };
    }
  }
};
</script>
<style lang="scss" scoped>
#user_money_log {
  .p-a-all {
    background: #eee;
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
</style>


