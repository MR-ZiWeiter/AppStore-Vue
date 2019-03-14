<template>
  <div class="reg p-a-all">
    <head-top :go-back='true' head-title="快速注册"></head-top>
    <div class="content">
      <tab v-if="Object.keys(reg_type).length > 1">
        <tab-item v-if="reg_type.plain" :selected="check_reg_type==='plain'" @on-item-click="checkreg('plain')">账户注册</tab-item>
        <tab-item v-if="reg_type.mobile" :selected="check_reg_type==='mobile'" @on-item-click="checkreg('mobile')">手机号注册</tab-item>
      </tab>
      
      <div class="box" v-if="check_reg_type=='plain'">
        <i class="iconfont icon-tubiao-"></i>
        <input type="text" v-model="username" placeholder="请输入账号">
      </div>
      <div class="box" v-if="check_reg_type=='mobile'">
        <i class="iconfont icon-phone_icon"></i>
        <input v-model="user_tel" type="text" placeholder="请输入手机号">
      </div>
      <div class="box" style="justify-content: space-between;" v-if="check_reg_type=='mobile'">
        <div class="rows">
          <i class="iconfont icon-yanzhengma"></i>
          <input v-model="Code" style="width:2rem" type="text" placeholder="请输入验证码">
        </div>
        <button v-if="codeTime" class="send-btn" style="background:#999">{{codeTime}}秒后重发</button>
        <button v-else class="send-btn" @click="sendCode">发送验证码</button>
      </div>
      <div class="box">
        <i class="iconfont icon-42"></i>
        <input type="password" v-model="Password" placeholder="请输入密码">
      </div>
      <div class="box">
        <i class="iconfont icon-42"></i>
        <input type="password" v-model="Password1" placeholder="请确认密码">
      </div>
      <div class="box" v-if="appConfig.reg&&appConfig.reg.is_openinvite==1">
        <i class="iconfont icon-yaoqingma"></i>
        <input type="text" v-model="pid" placeholder="请输入邀请码">
      </div>
      <div class="reg-box">
        <x-button @click.native="regBtnClick" text="注册" :gradients="['#ff4444', '#fbac47']"></x-button>
      </div>
    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import { sendSmsRegisterCode, register } from "src/service/getData";
import { setStore } from "src/config/mUtils";
import { mapState } from "vuex";
export default {
  components: { headTop },
  data() {
    return {
      codeTime: 0,
      setinv: "",
      user_tel: "",
      username: "",
      Password: "",
      Code: "",
      Password1: "",
      pid: "",
      type: "",
      check_reg_type: "plain",
      reg_type: {},
      name_keyword: [],
      pwd_len: 6,
      pwd_complexity: []
    };
  },
  computed: {
    ...mapState({
      appConfig: state => state.config.appConfig
    })
  },
  mounted() {
    this.pid = this.$route.query.id ? this.$route.query.id : "";
    if (this.appConfig.reg) {
      this.setConfig(this.appConfig.reg);
    }
  },
  watch: {
    appConfig(val) {
      this.setConfig(val.reg);
    }
  },
  methods: {
    check_pwd() {
      if (this.Password != this.Password1) {
        this.$vux.toast.text("重复密码不一致!");
        return false;
      }
      let upper_case = /[A-Z]+/;
      let number = /[0-9]+'/;
      let letter = /[a-z]+/;
      let symbol = /([^a-z0-9A-Z])+/;
      let that = this;

      if (this.pwd_len > 0 && this.Password.length < this.pwd_len) {
        this.$vux.toast.text("密码至少" + this.pwd_len + "位数!");
        return false;
      }

      let regtext='^.*';
      let toast='密码必须包含';
      for (let i in this.pwd_complexity) {
        if (that.pwd_complexity[i] == "number") {
          regtext=regtext+'(?=.*\\d)';
          toast+='数字,'
        } else if (that.pwd_complexity[i] == "upper_case") {
          regtext=regtext+'(?=.*[A-Z])';
          toast+='大写字母,'
        } else if (that.pwd_complexity[i] == "letter") {
          regtext=regtext+'(?=.*[a-z])';
          toast+='小写字母,'
        } else if (that.pwd_complexity[i] == "symbol") {
          regtext=regtext+'(?=.*[!@#$%^&*? ])';
          toast+='字符'
        }
      }
      regtext=regtext+'.*$';
      
      let ret = new RegExp(regtext).test(that.Password);
      if(ret&&this.pwd_complexity.length>0){
        return true;
      }else{
        this.$vux.toast.text(toast,'middle');
        return false;
      }
    },
    check_username() {
      if (this.check_reg_type == "plain" && !this.username) {
        this.$vux.toast.text("用户名必填!");
        return false;
      }
      if (this.name_keyword.length == 0) {
        return true;
      }
      let flag = true;
      let that = this;
      for (let i in this.name_keyword) {
        if (this.name_keyword!=""&&that.username.indexOf(that.name_keyword[i]) > -1) {
          that.$vux.toast.text(
            "用户名不能包含[" + that.name_keyword[i] + "]关键词"
          );
          flag = false;
          break;
        }
      }
      return flag;
    },
    setConfig(val) {
      let that = this;
      let reg_type = val.register_info.split(",");
      if (reg_type.length > 0) {
        this.check_reg_type = reg_type[0];
      }
      let obj = {};
      for (let i in reg_type) {
        obj[reg_type[i]] = true;
      }
      this.reg_type = obj;
      if (val.is_register == 0) {
        this.$vux.toast.text("未开放注册!");
        this.$router.go(-1);
      }
      this.name_keyword = val.name_keyword.split(",");
      this.pwd_len = val.pwd_len;
      this.pwd_complexity = val.pwd_complexity.split(",");
    },
    checkreg(type) {
      this.check_reg_type = type;
    },
    setTime() {
      if (this.codeTime > 0) {
        this.setinv = setInterval(() => {
          this.codeTime--;
          if (this.codeTime == 0) {
            clearInterval(this.setinv);
          }
        }, 1000);
      }
    },
    async sendCode() {
      this.$vux.loading.show({
        text: "正在发送..."
      });
      let res = await sendSmsRegisterCode(this.user_tel);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.codeTime = 60;
        this.setTime();
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async regBtnClick() {
      if(!this.check_username()){
        return false;
      }
      if (!this.check_pwd()) {
        return false;
      }
      if(this.appConfig.reg&&this.appConfig.reg.is_openinvite){
        if(!this.pid&&this.appConfig.reg.is_requireinvite==1){
          this.$vux.toast.text('邀请码必填', "middle");
          return false;
        }
      }

      this.$vux.loading.show({ text: "正在提交..." });
      let res = await register(
        this.username,
        this.user_tel,
        this.Password,
        this.Code,
        this.pid
      );
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        await setStore("token", res.data.token);
        setTimeout(() => {
          this.$router.go(-1);
        }, 2000);
      }
    }
  },
  beforeDestroy() {
    if (this.setinv) {
      clearInterval(this.setinv);
    }
  }
};
</script>
<style lang="less" scoped>
.reg {
  top:0.9rem;
  background: #fff;
  .content {
    width: calc(100% - 2rem);
    padding:0.5rem 1rem;
    select {
      background: #f5f5f5;
    }
    option {
      font-size: 0.1rem;
    }
    .first {
      display: flex;
      justify-content: space-between;
      font-size: 0.3rem;
    }
    .box {
      height: 1rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ccc;
      i {
        font-size: 0.4rem;
        margin-right: 0.2rem;
        color: #ff4444;
      }
      input {
        line-height: 0.95rem;
        background: #fff;
      }
      .send-btn {
        background: #1ba20a;
        color: #fafafa;
        font-size: 0.24rem;
        padding: 0.1rem 0.2rem;
        border-radius: 0.1rem;
      }
    }
    .display-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .reg-box {
      text-align: center;
      padding-top: 0.5rem;
      margin-bottom: 0.5rem;
      button {
        font-size: 0.3rem;
        color: #fff;
        height: 0.7rem;
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
.reg {
  .vux-tab {
    background-color: #fff !important;
  }
}
</style>

