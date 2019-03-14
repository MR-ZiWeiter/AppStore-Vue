<template>
    <div id="withdraw_detail">
        <head-top :go-back='true' head-title="提现详情" :rightMenu="true"></head-top>
        <div class="p-a-all">
            <div class="flex-box">
                <span>出账金额</span>
                <span class="price">￥{{info.actual_cash}}</span>
            </div>
            <div class="flex-box">
                <span>提现单号</span>
                <span>{{info.withdraw_no}}</span>
            </div>
            <div class="flex-box">
                <span>当前状态</span>
                <span>{{info.status}}</span>
            </div>
            <div class="flex-box">
                <span>类型</span>
                <span>{{info.type}}</span>
            </div>
            <div class="flex-box">
                <span>提现金额</span>
                <span>￥{{info.cash}}</span>
            </div>
            <div class="flex-box">
                <span>手续费</span>
                <span>￥{{info.poundage}}</span>
            </div>
            <div class="flex-box" v-if="info.taxshow">
                <span>个人所得税</span>
                <span>￥{{info.tax}}</span>
            </div>
            <div class="flex-box">
                <span>提现申请时间</span>
                <span>{{info.ask_for_date}}</span>
            </div>
            <!-- <div class="flex-box">
                <span>提现到账时间</span>
                <span>{{info.payment_date}}</span>
            </div> -->
            <div class="flex-box">
                <span>提现方式</span>
                <span>{{info.bank_name}}</span>
            </div>
            <div class="flex-box">
                <span>提现账号</span>
                <span>{{info.account_number}}</span>
            </div>
            <div class="flex-box">
                <span>手机号</span>
                <span>{{info.mobile}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import headTop from "src/components/header/head";
import { getWithdrawLog } from "src/service/getData";
import { dateFormat } from "vux";
export default {
  components: { headTop },
  data() {
    return {
      info: {}
    };
  },
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      this.$vux.loading.show({ text: "正在获取......" });
      let res = await getWithdrawLog(
        this.$route.query.id,
        this.$route.query.type
      );
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#withdraw_detail {
  .flex-box {
    width: 100%;
    padding: 0.2rem;
    background: #fff;
    font-size: 0.3rem;
    margin-bottom: 0.05rem;
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
