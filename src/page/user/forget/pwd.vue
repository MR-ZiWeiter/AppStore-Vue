<template>
  <div id="forget-pwd">
    <head-top :go-back='true' head-title="忘记密码"></head-top>
    <div class="p-a-all">
      <group>
        <x-input label-width="1.5rem" is-type="china-mobile" title="手机号:" required v-model="mobile" placeholder="请输入手机号"></x-input>
      </group>
      <group>
        <div v-if="codeTime==0" @click="sendCode" class="sendcode">发送验证码</div>
        <div v-else class="sendcode sended">{{codeTime}}s后重发</div>
        <x-input title="验证码:" class="weui-vcode" v-model="verification" placeholder="请输入验证码"> </x-input>
      </group>
      <group>
        <x-input type="password" label-width="1.5rem" title="新密码:" required v-model="onepassword" placeholder="请输入新密码"></x-input>
      </group>
      <group>
        <x-input type="password" label-width="1.5rem" title="重复密码:" required v-model="twopassword" placeholder="请输入重复密码"></x-input>
      </group>
      <div class="btn" @click="save">保存</div>
    </div>
  </div>
</template>
<script>
import { forget_pwd, forget_pwd_sms } from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: { headTop },
  data() {
    return {
      info: {},
      codeTime: 0,
      mobile: "",
      verification: "",
      onepassword: "",
      twopassword: ""
    };
  },
  beforeMount() {
    //console.log( this.$root.$children[0]);
    // this.getInfo();
  },
  methods: {
    onEnter(val) {
      console.log("click enter!", val);
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
      if (!this.mobile) {
        this.$vux.toast.text("手机号未填写", "middle");
        return false;
      }
      this.$vux.loading.show({
        text: "正在发送..."
      });
      let res = await forget_pwd_sms(this.mobile);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.codeTime = 60;
        this.setTime();
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async save() {
      if (
        !this.onepassword ||
        !this.twopassword ||
        !this.mobile ||
        !this.verification
      ) {
        this.$vux.toast.text("表单不完整!", "middle");
        return false;
      }
      if (this.onepassword != this.twopassword) {
        this.$vux.toast.text("重复密码错误", "middle");
        return false;
      }
      this.$vux.loading.show({ text: "提交中..." });
      let res = await forget_pwd(
        this.mobile,
        this.verification,
        this.onepassword,
        this.twopassword
      );
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.$router.push("/user");
        }, 2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#forget-pwd {
  .sendcode {
    display: inline-block;
    position: absolute;
    right: 0.2rem;
    z-index: 10;
    padding: 0.1rem 0.2rem;
    background: #ff4444;
    font-size: 0.24rem;
    color: #fff;
    border-radius: 0.1rem;
    top: 0.15rem;
  }
  .sended {
    background: #ccc;
  }
  .btn {
    width: 80%;
    margin: 0.3rem auto;
    text-align: center;
    background: #ff4444;
    color: #fff;
    padding: 0.2rem 0;
    border-radius: 0.1rem;
  }
}
</style>
<style lang="scss">
#forget-pwd {
  .weui-cell__hd {
    width: 1.5rem !important;
  }
  .weui-btn {
    font-size: 0.22rem;
  }
}
</style>
