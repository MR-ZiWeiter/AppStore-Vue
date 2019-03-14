<template>
  <div id="userinfo">
    <head-top :go-back='true' head-title="账户信息" :rightMenu="true"></head-top>
    <div class="p-a-all">
      <div class="box">
        <div id="pick-avatar" class="flex-box">
          <span>头像</span>
           <img class="headimg" :src="userInfo.url+userInfo.user_headimg" alt="" :onerror="default_headimg">
        </div>
        <div class="flex-box" @click="edit('nickname','请输入昵称','请输入2-16个字符,可包含汉字字母数字')">
          <span>昵称</span>
          <span class="rows">{{userInfo.nick_name}}
            <i class="material-icons">
              chevron_right
            </i>
          </span>
        </div>
        <div class="flex-box" >
          <span>真实姓名</span>
          <span class="rows" > {{userInfo.real_name}}</span>
        </div>
        <div class="flex-box" @click="goto('/realname_auth')">
          <span>实名认证</span>
          <span class="rows">
            <span class="font-size-14 text-color-999" v-if="userInfo.auth_status==-1">未实名认证</span>
            <span class="font-size-14 text-color-999" v-if="userInfo.auth_status==0">等待审核</span>
            <span class="font-size-14 text-color-999" v-if="userInfo.auth_status==1">实名认证通过</span>
            <span class="font-size-14 text-color-999" v-if="userInfo.auth_status==2">实名认证未通过</span>
            <i class="material-icons">
              chevron_right
            </i>
          </span>
        </div>
        <div class="flex-box" v-if="userInfo.user_tel">
          <span>手机号</span>
          <span>{{userInfo.user_tel}}</span>
        </div>
        <div class="flex-box" v-else @click="goto('/bindmobile')">
          <span>绑定手机号</span>
          <span>{{userInfo.user_tel}}</span>
        </div>
         <div class="flex-box" @click="goto('/qrcode')">
          <span>我的邀请码</span>
          <span class="rows">{{userInfo.promoter_no}}
            <i class="material-icons">
              chevron_right
            </i>
          </span>
        </div>
      </div>
      <div class="box">
        <div class="flex-box" @click="goto('/setpwd')">
          <span>登陆密码</span>
          <span class="rows">修改
            <i class="material-icons">
              chevron_right
            </i>
          </span>
        </div>
        <div class="flex-box" @click="showpay">
          <span>支付密码</span>
          <span class="rows">{{userInfo.paypwd?'修改':'添加'}}
            <i class="material-icons">
              chevron_right
            </i>
          </span>
        </div>
        <div class="flex-box" v-if="userInfo.paypwd" @click="goto('/forgetpaypwd')">
          <span>重置支付密码</span>
          <span></span>
        </div>
      </div>
    </div>
    <avatar-cropper :dataUrl="headerUrl" @uploading="handleUploading" @uploaded="handleUploaded" @completed="handleCompleted" @error="handlerError" trigger="#pick-avatar" :uploadFormData="{type:'avatar'}" :uploadFormName="'value'" :upload-url="this.host+'user/editUserInfo'" />
    <div v-transfer-dom>
      <popup v-model="paypwd_show" class="pwd-box">
        <popup-header :right-text="'取消'" :title="pay_title" :show-bottom-border="false" @on-click-right="paypwd_show = false"></popup-header>
        <pwd-box ref="setpwd" @input-ok="setpwd"></pwd-box>
      </popup>
    </div>
  </div>
</template>
<script>
import pwdBox from "src/components/common/pwd";
import headTop from "src/components/header/head";
import {
  userinfo,
  editPayPassword,
  addPayPassword,
  editUserInfo
} from "src/service/getData";
import AvatarCropper from "src/components/common/AvatarCropper";
import { baseUrl } from "src/config/env";
import { mapState } from "vuex";
export default {
  components: { headTop, AvatarCropper, pwdBox },
  data() {
    return {
      headerUrl: "",
      userInfo: {},
      host: "",
      paypwd_show: false,
      pay_title: "请输入支付密码",
      oldpaypwd: "",
      default_headimg:
        'this.src="' + window.default_headimg + '";this.onerror = null'
    };
  },
  beforeMount() {
    this.host = baseUrl;
    this.getUser();
  },
  methods: {
    edit(field,title, placeholder) {
      let that = this;
      this.$vux.confirm.prompt(placeholder, {
        title: title,
        onCancel() {},
        onConfirm(value) {
          // value = value.replace(/(^\s*)|(\s*$)/g, "");
          let reg= /^[\w\u4e00-\u9fa5]{2,16}$/;
          if (reg.test( value)) {
            that.editInfo(field,value);
          } else {
            that.$vux.toast.text('昵称非法', "middle");
          }
        }
      });
    },
    async editInfo(field, value) {
      this.$vux.loading.show({ text: "修改中" });
      let res = await editUserInfo(field, value);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        this.getUser();
      }
    },
    showpay() {
      if (this.userInfo.paypwd == 0) {
        this.pay_title = "请输入支付密码";
      } else if (this.userInfo.paypwd == 1 && this.oldpaypwd == "") {
        this.pay_title = "请输入旧支付密码";
      } else if (this.userInfo.paypwd == 1 && this.oldpaypwd != "") {
        this.pay_title = "请输入新支付密码";
      }
      this.paypwd_show = true;
    },
    setpwd(data) {
      this.$refs.setpwd.clear();
      this.paypwd_show = false;
      if (this.userInfo.paypwd == 0) {
        this.addpaypwd(data);
      } else if (this.userInfo.paypwd == 1 && this.oldpaypwd == "") {
        this.oldpaypwd = data;
        this.showpay();
      } else if (this.userInfo.paypwd == 1 && this.oldpaypwd != "") {
        this.editpaypwd(this.oldpaypwd, data);
      }
    },
    async addpaypwd(data) {
      this.$vux.loading.show({ text: "添加中..." });
      let res = await addPayPassword(data, data);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      this.getUser();
    },
    async editpaypwd(old, data) {
      this.$vux.loading.show({ text: "修改中..." });
      let res = await editPayPassword(old, data, data);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      this.oldpaypwd = "";
    },
    goto(url) {
      this.$router.push(url);
    },
    handleUploading(form, xhr) {
      this.message = "uploading...";
    },
    handleUploaded(response) {
      if (response.status == "success") {
        this.user.avatar = response.url;
        // Maybe you need call vuex action to
        // update user avatar, for example:
        // this.$dispatch('updateUser', {avatar: response.url})
        this.message = "user avatar updated.";
      }
    },
    handleCompleted(response, form, xhr) {
      this.message = "upload completed.";
      if (response.code == "1") {
        this.getUser();
      } else {
        this.$vux.toast.text(response.msg, "middle");
      }
    },
    handlerError(message, type, xhr) {
      this.message = "Oops! Something went wrong...";
    },
    async getUser() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await userinfo();
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.userInfo = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#userinfo {
  .material-icons{
    font-size:0.4rem;
    color:#999;
  }
  .p-a-all {
    background: #eee;
    .box {
      margin-bottom: 0.2rem;
      .flex-box {
        font-size: 0.3rem;
        padding: 0.3rem;
        background: #fafafa;
        margin-bottom: 1px;
        align-items: center;
        .headimg {
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
          background: #eee;
        }
        span:last-child {
          color: #999;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.pwd-box {
  .vux-popup-header-right {
    position: absolute;
    right: 15px;
  }
}
</style>