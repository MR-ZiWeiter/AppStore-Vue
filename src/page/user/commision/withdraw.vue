<template>
  <div id="withdraw">
    <head-top head-title="申请提现" :go-back='true' :rightMenu="true"></head-top>
    <div class="p-a-all">
      <div class="top">
        <p>可提现总收益 :
          <span class="price"> {{info.commission_cash}} </span>
        </p>
        <p>佣金总收益 :
          <span class="price"> {{info.commission}} </span>
        </p>
      </div>
      <div v-if="checkAccount" @click="show=true" class="p-10 m-b-10 bg-white flex-box">
        <div>
          <p>{{checkAccount.account_type_name}}</p>
          <p v-if="checkAccount.account_type==2">{{checkAccount.mobile}}</p>
          <p v-if="checkAccount.account_type==1||checkAccount.account_type==3">{{checkAccount.branch_bank_name}}{{checkAccount.account_number}}</p>
        </div>
        <i class="iconfont icon-right font-size-14 text-color-999"></i>
      </div>
      <div class="account flex-box" v-else>
        <span>请添加提现账号</span>
        <i class="iconfont icon-right"></i>
      </div>
      <input type="text" class="number" v-model="money" placeholder="请输入提取收益">
      <div class="remark">
        <p style="padding-top: 10px;">最低提取收益为{{info.withdraw_cash_min}},必须为{{info.withdraw_multiple}}的整倍数</p>
        <p>提现手续费{{info.poundage}},个人所得税:{{info.tax}}%</p>
      </div>
      <div class="text-align-center" style="padding:0.2rem 0.3rem;">
        <div class="btn" v-if="appConfig.commission.value==0" @click="add">立即提取</div>
        <p>注:可提现收益为交易成功后7天且未提取的收益</p>
      </div>
    </div>
    <actionsheet v-model="show" :menus="options" @on-click-menu="menuclick" :close-on-clicking-mask="false" show-cancel @on-click-mask="show=false;"></actionsheet>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import {
  UserAccount,
  getCointWithdrawInfo,
  addCointowithdraw
} from "src/service/getData";
import { mapState } from "vuex";
export default {
  components: {
    headTop
  },
  data() {
    return {
      money: "",
      info: {},
      checkAccount: "",
      account: [],
      options: {},
      show: false
    };
  },
   computed:{
    ...mapState({
      appConfig: state => state.config.appConfig
    })
  },
  watch: {
    money(value) {
      if (!value) {
        this.money = "";
        return false;
      }
      let reg = /^\d+\.?\d{0,2}$/;
      if (!reg.test(value)) {
        this.money = parseFloat(value);
      }
      value = parseFloat(value);

      if (value < 0) {
        this.money = 0;
      }
      if (value > parseFloat(this.info.commission_cash)) {
        this.money = parseInt(this.info.commission_cash);
      }
    }
  },
  beforeMount() {
    this.getInfo();
    this.getAccount();
  },
  methods: {
    menuclick(key, item) {
      this.checkAccount = this.account[key];
    },
    async add() {
      if (!this.checkAccount) {
        this.$vux.toast.text("为选择提现账户", "middle");
        return false;
      }
      let cash = this.money ? parseInt(this.money) : 0;
      let min =
        parseFloat(this.info.poundage) +
        parseFloat(this.info.withdraw_multiple);
      min = min + parseFloat(this.info.tax) / 100 * cash;
      if (cash < min) {
        this.$vux.toast.text("当前最小提现收益为" + min.toFixed(2), "middle");
        return false;
      }

      this.$vux.loading.show({ text: "提交中..." });
      let res = await addCointowithdraw(this.checkAccount.id, this.money);
      this.$vux.loading.hide();

      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeou(() => {
          this.$router.go(-1);
        }, 2000);
      }
    },
    async getInfo(type) {
      this.$vux.loading.show({
        text: "正在获取..."
      });
      let res = await getCointWithdrawInfo();
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async getAccount() {
      let that = this;
      let res = await UserAccount("get");
      if (res.code == 1) {
        this.account = res.data;
        if(res.data.length==0){
           this.$vux.confirm.show({
              title: '提醒',
              content: '是否前往添加提现账户',
              onCancel () {
                 that.$router.go(-1);
              },
              onConfirm () {
                that.$router.push('/withdraw_account_add');
              }
            })
        }
        for (let i in res.data) {
          if (res.data[i].is_default == 1) {
            that.checkAccount = res.data[i];
          }
          if (res.data[i].account_type == 1) {
            that.options[i] =
              res.data[i].branch_bank_name +
              "(" +
              res.data[i].account_number +
              ")";
          } else if (res.data[i].account_type == 2) {
            that.options[i] =
              res.data[i].account_type_name + "(" + res.data[i].mobile + ")";
          } else if (res.data[i].account_type == 3) {
            that.options[i] =
              res.data[i].account_type_name +
              "(" +
              res.data[i].account_number +
              ")";
          }
        }
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.btn {
  padding: 0.2rem;
  background: #eec242;
  color: #fff;
  border-radius: 0.1rem;
  margin-bottom: 0.2rem;
}
.remark {
  padding: 0.2rem 0.3rem;
  p {
    color: #701414;
  }
}
.top {
  padding: 0.2rem 0.2rem 0.1rem;
  background: #fff;
  margin-bottom: 0.2rem;
  p {
    margin-bottom: 0.2rem;
  }
}
.account {
  padding: 0.2rem 0.3rem;
  background: #fff;
  margin-bottom: 0.2rem;
  i {
    font-size: 0.26rem;
    color: #999;
  }
}
.number {
  width: 100%;
  background: #fff;
  padding: 0.2rem 0.3rem;
  font-size: 0.3rem;
}
</style>
