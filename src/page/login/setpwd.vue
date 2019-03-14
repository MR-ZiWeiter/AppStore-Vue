<template>
    <div id="outh">
        <head-top :go-back='true' head-title="设置密码"></head-top>
        <div class="p-a-all">
            <group>
                <x-input type="password" label-width="1.5rem" title="密码:" required v-model="onepassword" placeholder="请输入密码"></x-input>
            </group>
            <group>
                <x-input type="password" label-width="1.5rem" title="重复密码:" required v-model="twopassword" placeholder="请输入重复密码"></x-input>
            </group>
            <div class="btn" @click="save">保存</div>
        </div>
    </div>
</template>
<script>
import {
  qq_oauthBindLogin,
  wx_oauthBindLogin
} from "src/service/getData";
import headTop from "src/components/header/head";
import { getStore } from "../../config/mUtils";
import { mapState, mapActions } from "vuex";
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
  mounted(){
    if(!this.userInfo){
      this.$vux.toast.text('无效参数!','middle');
      setTimeout(()=>{
        this.$router.go(-1);
      },1000);
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
    })
  },
  methods: {
    
    async save() {
      
      if (this.onepassword != this.twopassword) {
        this.$vux.toast.text("重复密码错误", "middle");
        return false;
      }
      let userInfo = this.$route.params.data;

      this.$vux.loading.show({ text: "提交中..." });
      let res = {};

      if (userInfo.type == 1) {
        res = await wx_oauthBindLogin(
          userInfo.mobile,
          userInfo.code,
          userInfo.device_type,
          userInfo.openid,
          userInfo.userInfo,
          userInfo.unionid,
          this.onepassword
        );
      } else {
        res = await qq_oauthBindLogin(
          userInfo.mobile,
          userInfo.code,
          userInfo.device_type,
          userInfo.openid,
          userInfo.userInfo,
          this.onepassword
        );
      }
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");

      if (res.code == 1) {
        localStorage.clear();
        localStorage.setItem("token", data.data.token);
        setTimeout(() => {
          this.$router.push("/user");
        }, 2000);
      }  
    }
  }
};
</script>
<style lang="scss" scoped>
#outh {
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
#outh {
  .weui-cell__hd {
    width: 1.5rem !important;
  }
  .weui-btn {
    font-size: 0.22rem;
  }
}
</style>
