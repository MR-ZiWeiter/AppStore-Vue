<template>
  <div class="login p-a-all">
    <!-- <head-top :go-back='true' :head-title="profiletitle" ></head-top> -->
    <div class="top">
      <i @click="close" style="font-size:0.6rem;" class="material-icons">{{icon}}</i>
    </div>
    <h3 class="title">欢迎登陆{{appname}}</h3>
    <div class="input">
      <div class="box">
        <i class="iconfont icon-xingmingyonghumingnicheng iconfont-left"></i>
        <input type="text" v-model="data.UserName" placeholder="请输入账号">
      </div>
      <div class="box flex-box">
        <i class="iconfont icon-Password iconfont-left"></i>
        <input :type="pwdInput" v-model="data.Password" placeholder="请输入密码">
        <i @click="changePwd" class="iconfont" :class="pwdicon"></i>
      </div>
      <div class="login-box" @click="toLogin">
        <x-button text="登陆" :gradients="['#ff4444', '#fbac47']"></x-button>
      </div>
      <div class="login-box" v-if="isreg" @click="reg" style="padding-top:0">
        <x-button text="注册" :gradients="['#fbac47', '#ff4444']"></x-button>
      </div>
      <p style="text-align:center;color:#ff4444;margin-top:0.3rem;" @click="goto('/forgetpwd')">忘记密码</p>
      <div class="bottom" v-if="device_type!='web' && appConfig.party">
        <div class="title">使用以下账号登陆</div>
        <div class="line"></div>
        <div class="icon-box">
          <img src="../../images/qq.png" v-if="appConfig.party.qq" alt="" @click="qqlogin">
          <img src="../../images/weixin.png" v-if="appConfig.party.wx" alt="" @click="wxlogin">
        </div>
      </div>

    </div>

  </div>
</template>
<script>
import headTop from "src/components/header/head";
import { login, oauthLogin } from "src/service/getData";
import { setStore, getStore } from "src/config/mUtils";
import { mapState } from "vuex";
export default {
  components: {
    headTop
  },
  data() {
    return {
      pwdInput: "password",
      pwdicon: "icon-in_biyan_fill",
      visibility: false,
      password: "",
      phone: "",
      icon: "keyboard_arrow_left",
      data: {
        UserName: "",
        Password: ""
      },
      device_type: getStore("device_type"),
      appname: appname,
      isreg: false
    };
  },
  computed: {
    ...mapState({
      appConfig: state => state.config.appConfig
    })
  },
  mounted() {
    // if (this.$route.path == '/login') {
    //   this.icon = 'keyboard_arrow_left'
    // }
    if (this.appConfig.reg && this.appConfig.reg.is_register == 1) {
      this.isreg = true;
    }
  },
  methods: {
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) {
        return unescape(r[2]); //返回参数值
      } else {
        return null;
      }
    },
    wxlogin1() {
      window.location.href=window.imgBaseUrl+"appapi/User/wxLogin";
    },
    qqlogin() {
      let that = this;
      var s = auths["weixin"];
      if (!s.authResult) {
        s.login(
          function(e) {
            // 获取登录操作结果
            s.getUserInfo(
              function(e) {
                that.outhLogin({
                  type: 1,
                  openid: s.userInfo.openid,
                  unionid: s.userInfo.unionid,
                  userInfo: JSON.stringify(s.userInfo)
                });
                console.log("获取用户信息成功： " + JSON.stringify(s.userInfo));
              },
              function(e) {
                console.log("获取用户信息失败： " + e.message + " - " + e.code);
              }
            );
          },
          function(e) {
            console.log("登录认证失败！ ");
          }
        );
      } else {
        that.outhLogin({
          type: 1,
          openid: s.userInfo.openid,
          unionid: s.userInfo.unionid,
          userInfo: JSON.stringify(s.userInfo)
        });
        console.log("已经登录认证！ ");
      }
    },
    wxlogin() {
      let self = this;
      var s = auths["weixin"];
      if (!s.authResult) {
        s.login(
          function(e) {
            // 获取登录操作结果
            s.getUserInfo(
              function(e) {
                self.outhLogin({
                  type: 1,
                  openid: s.userInfo.openid,
                  unionid: s.userInfo.unionid,
                  userInfo: JSON.stringify(s.userInfo)
                });
                console.log("获取用户信息成功： " + JSON.stringify(s.userInfo));
              },
              function(e) {
                console.log("获取用户信息失败： " + e.message + " - " + e.code);
              }
            );
          },
          function(e) {
            console.log("登录认证失败！ ");
          }
        );
      } else {
        // console.log(s);
        self.outhLogin({
          type: 1,
          openid: s.userInfo.openid,
          unionid: s.userInfo.unionid,
          userInfo: JSON.stringify(s.userInfo)
        });
        console.log("已经登录认证！ ");
      }
    },
    async outhLogin(userInfo) {
      let that = this;
      let res = await oauthLogin(
        userInfo.type,
        userInfo.openid,
        userInfo.unionid
      );
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        localStorage.clear();
        localStorage.setItem("token", data.data.token);

        setTimeout(() => {
          this.$router.go(-1);
        });
      } else if (res.code == 20001) {
        this.$router.push("/outh");
      }
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
    async toLogin() {
      let _self = this;
      this.$vux.loading.show({
        text: "正在登录..."
      });
      let res = await login(this.data.UserName, this.data.Password);
      this.$vux.loading.hide();
      if (res.code == 1) {
        await setStore("token", res.data.token);
      }
      this.$vux.toast.show({
        text: res.msg,
        position: "middle",
        type: "text",
        onHide() {
          if (res.code == 1) {
            _self.clear();
            _self.$emit("hide");
            _self.$router.go(-1);
          }
        }
      });
    },
    reg() {
      this.clear();
      this.$router.push("/reg");
      this.$emit("hide");
    },
    clear() {
      this.visibility = false;
      this.password = "";
      this.phone = "";
      this.code = "+86";
    },
    goto(url) {
      this.$router.push(url);
    },
    close() {
      this.clear();
      this.$router.go(-1);
      // if (this.icon != 'clear') {
      //   this.$router.go(-1)
      // } else {
      //   this.$emit('hide')
      // }
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  font-size: 0.25rem;
  background: #fff;
  .iconfont-left{
    position: absolute;
    font-size: 0.45rem;
  }
  .title {
    font-size: 0.4rem;
    text-align: center;
    padding: 0.5rem 0;
  }
  .width-100 {
    width: 100%;
  }
  .top {
    height: 0.9rem;
    padding-left: 0.2rem;
    display: flex;
    align-items: center;
  }
  .input {
    position: relative;
    width: calc(100% - 2.8rem);
    padding: 0.5rem 0.8rem;
    .box {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ccc;
      // padding:0.2rem 0;
      input {
        height: 1rem;
        padding-left: 0.7rem;
      }
      input,
      select {
        background: #fff;
      }
      select {
        margin-right: 0.2rem;
      }
      option {
        display: inline-block;
        font-size: 0.1rem;
      }
    }
    .login-box {
      text-align: center;
      padding-top: 1rem;
      margin-bottom: 0.5rem;
      button {
        font-size: 0.3rem;
        color: #fff;
        height: 0.7rem;
        width: 100%;
        border-radius: 0.5rem;
      }
    }
    .bottom {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: 2rem;
      .title {
        background: #f4f4f4;
        padding: 0 0.2rem;
        z-index: 1;
        font-size: 0.23rem;
        color: #999;
      }
      .line {
        position: absolute;
        margin-top: 0.18rem;
        width: 4rem;
        height: 1px;
        background: #eee;
        z-index: 0;
      }
      .icon-box {
        display: flex;
        position: absolute;
        margin-top: 1rem;
        width: 4rem;
        justify-content: space-around;
        img {
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }
}
</style>
<style lang="less">
.iconfont {
  font-size: 0.35rem;
}
</style>
