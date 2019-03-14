<template>
  <div class="login">
    <div class="text-color-333 top">欢迎登陆</div>
    <div class="text-color-666" style="font-size:0.26rem;margin-top:0.1rem;">{{appConfig.key_words}}</div>
    <div class="form">
      <group>
        <x-input class="border-bottom" :class="{input:focus==1}" @on-blur="focus=0" @on-focus="focus=1" placeholder="请输入账号" label-width="0.8rem" :title='`<i class="iconfont icon-xingmingyonghumingnicheng "></i>`' v-model="data.UserName"></x-input>
      </group>
      <group>
        <x-input class="border-bottom" :class="{input:focus==2}" @on-blur="focus=0" @on-focus="focus=2" :type="pwdInput" placeholder="请输入密码" label-width="0.8rem" :title='`<i class="iconfont icon-Password "></i>`' v-model="data.Password">
          <i @on-focus="focus==2" slot="right" @click="changePwd" class="iconfont icon-in_biyan_fill" :class="pwdicon"></i>
        </x-input>
      </group>
    </div>
    <div style="margin-top:1rem;">
      <div class="btn login-btn" @click="toLogin">登陆</div>
      <div class="btn reg-btn" v-if="isreg" @click="reg">注册</div>
    </div>
    <div class="flex-box" style="margin-top:0.3rem;justify-content: space-around;">
      <span class="price" @click="goto('/index')">返回首页</span>
      <span class="price" @click="goto('/forgetpwd')">忘记密码</span>
    </div>
    <!-- <p style="text-align:center;color:#ff4444;margin-top:0.3rem;" @click="goto('/forgetpwd')">忘记密码</p> -->
    <div class="bottom" v-if="device_type!='web' && appConfig.party&&(appConfig.party.qq==1||appConfig.party.wx==1)">
      <div class="title">使用以下账号登陆</div>
      <div class="line"></div>
      <div class="icon-box">
        <img src="../../images/qq.png" v-if="appConfig.party.qq" alt="" @click="qqlogin">
        <img src="../../images/weixin.png" v-if="appConfig.party.wx" alt="" @click="wxlogin">
      </div>
    </div>
  </div>
</template>
<script>
var loading;
import { login, oauthLogin } from "src/service/getData";
import { setStore, getStore } from "src/config/mUtils";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      focus: 0,
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
    if (this.appConfig.reg && this.appConfig.reg.is_register == 1) {
      this.isreg = true;
    }
  },
  methods: {
    ...mapMutations(["SET_USERINFO"]),
    getDevice() {
      if (typeof plus != "undefined") {
        return plus.os.name.toLowerCase();
      } else {
        return "web";
      }
    },
    async toLogin() {
      let _self = this;
      this.$vux.loading.show({
        text: "正在登录..."
      });
      let res = await login(this.data.UserName, this.data.Password,this.device_type);
      this.$vux.loading.hide();
      if (res.code == 1) {
        await setStore("token", res.data.token);
      }
      console.log(res.data.token)
      console.log(getStore('token'))
      this.$vux.toast.show({
        text: res.msg,
        position: "middle",
        type: "text",
        onHide() {
          if (res.code == 1) {
            _self.clear();
            _self.$emit("hide");
            if (_self.$route.path == "/login" || _self.$route.path == "/reg") {
              _self.$router.push("/user");
            } else {
              _self.$router.go(-1);
            }
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
      // window.myvue.$root.$children[0].showlogin = false;
      this.$router.push(url);
    },
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
      window.location.href = window.imgBaseUrl + "appapi/User/wxLogin";
    },
    qqlogin() {
      let that = this;
      var s = auths["qq"];
      if (!s.authResult) {
        s.login(
          function(e) {
            // 获取登录操作结果
            s.getUserInfo(
              function(e) {
                that.outhLogin({
                  type: 2,
                  openid: s.authResult.openid,
                  userInfo: JSON.stringify(s.userInfo)
                });
                console.log("获取用户信息成功： " + JSON.stringify(s.userInfo));
              },
              function(e) {}
            );
          },
          function(e) {}
        );
      } else {
        that.outhLogin({
          type: 2,
          openid: s.authResult.openid,
          userInfo: JSON.stringify(s.userInfo)
        });
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
      this.SET_USERINFO(userInfo);
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        localStorage.setItem("token", res.data.token);

        setTimeout(() => {
          if (this.$route.path == "/login" || this.$route.path == "/reg") {
            this.$router.push("/user");
          } else {
            this.$router.go(-1);
          }
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
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  background: #fff;
  padding: 0.6rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .top {
    padding-top: 1rem;
    font-size: 0.54rem;
  }
  .form {
    margin-top: 0.9rem;
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
  .border-bottom {
    border-bottom: 1px solid #ccc;
  }
  .bottom {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 1rem;
    .title {
      background: #fff;
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
      background: #ccc;
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
</style>
<style lang="scss">
.login {
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
  .weui-cells:before,
  .weui-cells:after {
    border-color: #fff !important;
  }
}
</style>
