<template>
  <div id="withdraw">
    <head-top :go-back='true' head-title="申请提现" :customRight="true" :rightTitle="'记录'" :rightAction="gotoLog"></head-top>
    <div class=" p-a-all">
      <div class="p-10 m-b-10 bg-white">可提现数量:
        <span class="price">{{info.balance}}</span>
      </div>
      <div v-if="checkAccount!={}" @click="show=true" class="p-10 m-b-10 bg-white flex-box">
        <div>
          <p>{{checkAccount.account_type_name}}</p>
          <p v-if="checkAccount.account_type==2">{{checkAccount.mobile}}</p>
          <p v-if="checkAccount.account_type==1||checkAccount.account_type==3">{{checkAccount.branch_bank_name}}{{checkAccount.account_number}}</p>
        </div>
        <i class="iconfont icon-right font-size-14 text-color-999"></i>
      </div>
      <div class="p-10 bg-white" v-else>
        前往添加提现账户
      </div>
      <input type="text" class="input" placeholder="请输入提取数量" v-model="money">
      <div class="remark">
        <p v-html="info.message"></p>
        <p>最低提取数量为{{info.withdraw_cash_min}}<span style="color: #701414;" v-if="info.withdraw_multiple">,必须为{{info.withdraw_multiple}}的整倍数</span></p>
        <p>提现手续费{{info.poundage}}%</p>
        <p>当前启用提现方式<span class="pay-type" v-for="(item,index) in info.withdraw_account" :key="index" v-if="item.is_checked==1">{{item.name}}</span></p>
      </div>
     
      <div  v-if="info.is_use==1">
        <div class="btn" v-if="info.auth" @click="getInfo(2)">立即提取</div>
        <div class="btn" v-else @click="goto('/realname_auth')">前往实名认证</div>
     </div>
      <div class="btn" style="background:#ccc" v-else>未开启提现</div>
    </div>
    <actionsheet v-model="show" :menus="options" @on-click-menu="menuclick" :close-on-clicking-mask="false" show-cancel @on-click-mask="show=false;"></actionsheet>

  </div>
</template>
<script>
import headTop from "src/components/header/head";
import { TransferDom, Radio } from "vux";
import { toWithdraw, UserAccount } from "src/service/getData";
export default {
  components: { headTop, Radio },
  directives: {
    TransferDom
  },
  data() {
    return {
      money: "",
      info: {},
      checkAccount: {},
      account: [],
      options: {},
      show: false,
      withdraw_cash_min:0,
    };
  },
  watch: {
    money(value) {
      if (!value) {
        this.money = "";
        return false;
      }
      let reg = /^\d+\.?\d{0,2}$/;
      if (!reg.test(value)) {
        this.money = parseFloat(value).toFixed(2);
      }
      value = parseFloat(value);

      if (value < 0) {
        this.money = 0;
      }
      if (value > parseFloat(this.info.balance)) {
        this.money = parseInt(this.info.balance);
      }
    }
  },
  beforeMount() {
    this.getInfo(1);
    this.getAccount();
  },
  methods: {
    checkPayType(){
      var flag=true;
      let that=this;
      for(let i in this.info.withdraw_account){
        if(that.info.withdraw_account[i].value==that.checkAccount.account_type){
          if(that.info.withdraw_account[i].is_checked==0){
            flag=false;
          }
          break;
        }
      }
      if(!flag){
        this.$vux.toast.text('未开启此提现方式!','middle');
      }
      return flag;
    },
     goto(url){
      this.$router.push(url);
    },
    gotoLog() {
      let url = "";
      if (this.$route.path == "/balance_withdraw") {
        url = "balancewithdraw";
      }
      this.$router.push("/withdraw_log?url=" + url);
      console.log(this.$route);
    },
    menuclick(key, item) {
      this.checkAccount = this.account[key];
    },
    async getInfo(type) {
      let bank_account_id = this.checkAccount.id ? this.checkAccount.id : 0;
      let cash = this.money ? parseInt(this.money) : 0;
      if (type == 2) {
        if(!this.checkPayType()){
          return ;
        }
        if (cash <this.withdraw_cash_min) {
          this.$vux.toast.text('提现金额不能低于'+this.withdraw_cash_min,'middle');
          return false;
        }
        if (!bank_account_id) {
          this.$vux.toast.text("没有选择银行卡!", "middle");
        }
      }
      this.$vux.loading.show({ text: "正在处理" });
      let res = await toWithdraw(type, bank_account_id, cash);
      this.$vux.loading.hide();
      if (res.code == 1) {
        if (type == 1) {
          this.info = res.data;
          this.withdraw_cash_min=parseFloat(res.data.withdraw_cash_min)
        } else {
          this.$vux.toast.text(res.msg, "middle");
          setTimeout(() => {
            this.$router.go(-1);
          });
        }
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
.input {
  padding: 0.2rem 0.3rem;
  background: #fff;
  width: 100%;
}
.remark {
  padding: 0.2rem 0.3rem;
  margin-bottom: 0.2rem;
  p {
    color: #701414;
  }
}
.btn {
  display: block;
  color: #fff;
  background: #eec242;
  padding: 0.2rem 0;
  border-radius: 0.1rem;
  text-align: center;
  margin: 0 0.2rem;
}
.pay-type{
  margin: 0 0.1rem;
  font-size: 0.24rem;
  background: #ff4444;
  color:#fff;
  padding:0.05rem 0.1rem;
}
</style>
