<template>
  <div class="reg p-a-all">
    <div class="text-color-333 top">欢迎注册</div>
    <div class="text-color-666" style="font-size:0.26rem;margin-top:0.1rem;">{{appConfig.key_words}}</div>
    <div class="content" style="padding-top:0.3rem">
      <tab v-if="Object.keys(reg_type).length > 1">
        <tab-item v-if="reg_type.plain" :selected="check_reg_type==='plain'" @on-item-click="checkreg('plain')">账户注册</tab-item>
        <tab-item v-if="reg_type.mobile" :selected="check_reg_type==='mobile'" @on-item-click="checkreg('mobile')">手机号注册</tab-item>
      </tab>
      <div class="form">
        <group v-if="check_reg_type=='plain'">
          <x-input class="border-bottom" :class="{input:focus==1}" @on-blur="focus=0" @on-focus="focus=1" placeholder="请输入字母+数字" label-width="0.8rem" :title='`<i class="iconfont icon-tubiao- "></i>`' v-model="username"></x-input>
        </group>
        <group v-if="check_reg_type=='mobile'">
          <x-input class="border-bottom" :class="{input:focus==1}" @on-blur="focus=0" @on-focus="focus=1" placeholder="请输入手机号" label-width="0.8rem" :title='`<i class="iconfont icon-phone_icon "></i>`' v-model="user_tel"></x-input>
        </group>
        <group v-if="check_reg_type=='mobile'">
          <x-input :title='`<i class="iconfont icon-yanzhengma "></i>`' :class="{input:focus==2}" @on-blur="focus=0" @on-focus="focus=2" label-width="0.8rem" placeholder="请输入验证码" v-model="Code" class="weui-vcode border-bottom">
            <button slot="right" v-if="codeTime" class="send-btn" style="background:#999">{{codeTime}}秒后重发</button>
            <button slot="right" v-else class="send-btn" @click="sendCode">发送验证码</button>
          </x-input>
        </group>
        <group>
          <x-input class="border-bottom" :class="{input:focus==3}" @on-blur="focus=0" @on-focus="focus=3" :type="pwdInput" placeholder="请输入密码" label-width="0.8rem" :title='`<i class="iconfont icon-Password "></i>`' v-model="Password">
          </x-input>
        </group>
        <group>
          <x-input class="border-bottom" :class="{input:focus==4}" @on-blur="focus=0" @on-focus="focus=4" :type="pwdInput" placeholder="请确认密码" label-width="0.8rem" :title='`<i class="iconfont icon-Password "></i>`' v-model="Password1">
          </x-input>
        </group>
        <group v-if="appConfig.reg&&appConfig.reg.is_openinvite==1">
          <x-input :title='`<i class="iconfont icon-yaoqingma "></i>`' :class="{input:focus==5}" @on-blur="focus=0" @on-focus="focus=5" label-width="0.8rem" placeholder="请输入邀请码" v-model="pid" class="weui-vcode">
          </x-input>
        </group>
      </div>

      <div class="reg-box">
        <div class="btn login-btn" @click="regBtnClick">注册</div>
        <div class="btn reg-btn" @click="goto('/login')">登陆</div>
        <!-- <x-button @click.native="regBtnClick" text="注册" :gradients="['#ff4444', '#fbac47']"></x-button> -->
      </div>
    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import { sendSmsRegisterCode, register } from "src/service/getData";
import { setStore, getStore } from "src/config/mUtils";
import { mapState } from "vuex";
export default {
  components: { headTop },
  data() {
    return {
      pwdInput: "password",
      pwdicon: "icon-in_biyan_fill",
      focus: 0,
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
    setStore("pid", this.pid);
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
    goto(url) {
      this.$router.push(url);
    },
    changePwd() {
      if (this.pwdInput == "password") {
        this.pwdInput = "text";
        this.pwdicon = "icon-in_zhengyan_fill";
      } else {
        this.pwdInput = "password";
        this.pwdicon = "icon-in_biyan_fill";
      }
    },
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

      let regtext = "^.*";
      let toast = "密码必须包含";
      for (let i in this.pwd_complexity) {
        if (that.pwd_complexity[i] == "number") {
          regtext = regtext + "(?=.*\\d)";
          toast += "数字,";
        } else if (that.pwd_complexity[i] == "upper_case") {
          regtext = regtext + "(?=.*[A-Z])";
          toast += "大写字母,";
        } else if (that.pwd_complexity[i] == "letter") {
          regtext = regtext + "(?=.*[a-z])";
          toast += "小写字母,";
        } else if (that.pwd_complexity[i] == "symbol") {
          regtext = regtext + "(?=.*[!@#$%^&*? ])";
          toast += "字符";
        }
      }
      regtext = regtext + ".*$";

      let ret = new RegExp(regtext).test(that.Password);
      if (ret && this.pwd_complexity.length > 0) {
        return true;
      } else {
        this.$vux.toast.text(toast, "middle");
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
        if (
          this.name_keyword != "" &&
          that.username.indexOf(that.name_keyword[i]) > -1
        ) {
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
      if (!this.check_username()) {
        return false;
      }
      if (!this.check_pwd()) {
        return false;
      }
      if (this.appConfig.reg && this.appConfig.reg.is_openinvite) {
        if (!this.pid && this.appConfig.reg.is_requireinvite == 1) {
          this.$vux.toast.text("邀请码必填", "middle");
          return false;
        }
      }

      this.$vux.loading.show({ text: "正在提交..." });
      let res = await register(
        this.username,
        this.user_tel,
        this.Password,
        this.Code,
        this.pid,
        getStore('device_type')
      );
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        await setStore("token", res.data.token);
        setTimeout(() => {
          if (getStore("device_type") == "web") {
            this.$router.push("/download");
          } else {
            this.$router.go('/user');
          }
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
  background: #fff;
  padding: 0.6rem;

  .top {
    padding-top: 1rem;
    font-size: 0.54rem;
  }
  .border-bottom {
    border-bottom: 1px solid #ccc;
  }
  .content {
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
  .send-btn {
    background: #ff4444;
    color: #fafafa;
    font-size: 0.24rem;
    padding: 0.1rem 0.2rem;
    border-radius: 0.1rem;
  }
  .btn {
    text-align: center;
    width: 100%;
    height: 0.8rem;
    line-height: 0.8rem;
    border-radius: 0.5rem;
    font-size: 0.32rem;
  }
  .login-btn {
    background: #ff4444;
    color: #fff;
    box-shadow: 0 0 20px #ff4444;
    margin-bottom: 0.3rem;
  }
  .reg-btn {
    border: 2px solid #ff4444;
    color: #ff4444;
  }
}
</style>
<style lang="scss">
.reg {
  .vux-tab {
    background-color: #fff !important;
  }
  .iconfont {
    font-size: 0.35rem;
  }
  .input {
    border-bottom: 0.01rem solid #ff4444 !important;
    i,
    input {
      color: #ff4444 !important;
    }
  }
  button.weui-btn {
    font-size: 0.24rem !important;
    background: #ff4444;
  }
  .weui-cells:before,
  .weui-cells:after {
    border-color: #fff !important;
  }
}
</style>

