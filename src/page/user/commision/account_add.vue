<template>
  <div id="address-add">
    <head-top head-title="添加提现账户" :go-back='true' :rightMenu="true"></head-top>
    <div class="p-a-all">
      <group>
        <x-input label-width="1.5rem" title="真实姓名:" required v-model="realname" placeholder="请输入真实姓名"></x-input>
      </group>
      <group>
        <x-input label-width="1.5rem" title="手机号码:" required v-model="mobile" placeholder="请输入手机号"></x-input>
      </group>
      <div class="account_type flex-box" @click="account_type_show=true;">
       <div>
          <span>账户类型:</span>
           <span>{{account_type_name}}</span>
       </div>
        <i class="iconfont icon-xialajiantou text-color-999"></i>
      </div>
      <group v-if="account_type==1">
        <x-input label-width="1.5rem" title="开户行:" v-model="branch_bank_name" placeholder="请输入开户行"></x-input>
      </group>
      <group v-if="account_type==1">
        <x-input label-width="1.5rem" title="银行账号:" v-model="account_number" placeholder="请输入银行账号"></x-input>
      </group>
      <group v-if="account_type==3||account_type==2">
        <x-input label-width="1.5rem" title="提现账号:" v-model="account_number" placeholder="请输入提现账号"></x-input>
      </group>
      <div class="btn" @click="save">保存</div>
    </div>
    <actionsheet v-model="account_type_show" :menus="account_type_menu" @on-click-menu="checktype"></actionsheet>
  </div>
</template>
<script>
import { UserAccount, updateAccount } from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: {
    headTop
  },
  data() {
    return {
      account_type_menu: { 1: "银行卡", 2: "微信", 3: "支付宝" },
      account_type_show: false,
      realname: "",
      mobile: "",
      branch_bank_name: "",
      account_number: "",
      account_type: 1,
      account_type_name: "银行卡",
      id: this.$route.query.id
    };
  },
  beforeMount(){
    if(this.id){
      this.getInfo();
    }
  },
  methods: {
    checktype(key, val) {
      this.account_type = key;
      this.account_type_name = val;
    },
    async getInfo(){
      this.$vux.loading.show({ text: "获取中..." });
      let res = await UserAccount('get', this.id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        let obj = res.data;
        this.realname = obj.realname;
        this.mobile = obj.mobile;
        this.branch_bank_name = obj.branch_bank_name;
        this.account_number = obj.account_number;
        this.account_type = obj.account_type;
        this.account_type_name = obj.account_type_name;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async save() {
      if (!this.realname || !this.mobile) {
        this.$vux.toast.text("真实姓名和手机号必填!");
        return false;
      }
      this.$vux.loading.show({ text: "提交中..." });
      if (this.id) {
        var res = await updateAccount(
          this.id,
          this.realname,
          this.mobile,
          this.account_type,
          this.account_type_name,
          this.account_number,
          this.branch_bank_name
        );
      } else {
        var res = await UserAccount(
          "add",
          this.id,
          this.realname,
          this.mobile,
          this.account_type,
          this.account_type_name,
          this.account_number,
          this.branch_bank_name
        );
      }

      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.$router.go(-1);
        }, 2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.v-center {
  display: flex;
  align-items: center;
}
#address-add {
  .btn {
    width: calc(100% - 0.6rem);
    margin: 0.3rem;
    padding: 0.2rem;
    background: #eec242;
    text-align: center;
    color: #fff;
    border-radius: 0.1rem;
  }
  .account_type {
    padding: 0.2rem 0.3rem;
    background: #fff;
    margin-top: 0.15rem;
    span {
      margin-right: 0.15rem;
    }
  }
}
</style>
<style lang="scss">
#address-add {
  .weui-cell__hd {
    width: 1.5rem !important;
  }

  option {
    display: inline-block;
    font-size: 0.1rem;
  }
}
</style>

