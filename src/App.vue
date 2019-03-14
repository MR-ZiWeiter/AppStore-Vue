<template>
  <div id="scroll_container" v-if="showlogin">
    <login v-on:hide="hide"></login>
  </div>
  <div v-else>
    <head-top></head-top>
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <svg-icon></svg-icon>
    <foot-guide v-if="showMainFooter"></foot-guide>
  </div>

</template>

<script>
import login from "./components/login/login";
import headTop from "src/components/header/header";
import svgIcon from "./components/common/svg";
import footGuide from "src/components/footer/footer";
import { setStore, getStore } from "./config/mUtils";
// import store from "src/store/";
import { mapMutations } from "vuex";
export default {
  components: {
    svgIcon,
    headTop,
    login,
    footGuide,
    notLogin: []
  },
  data() {
    return {
      showlogin_: false
    };
  },
  beforeMount() {
    let list = this.$router.options.routes[0].children;
    let notLogin = [];
    for (let i in list) {
      if (list[i].notLogin) {
        notLogin.push(list[i].path);
      }
    }
    this.notLogin = notLogin;
  },
  methods: {
    ...mapMutations(["SET_HEADER"]),
    hide() {
      this.showlogin = !this.showlogin;
    },
    isInArray(arr, value) {
      for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
          return true;
        }
      }
      return false;
    }
  },
  computed: {
    showlogin: {
      get: function() {
        if(this.isInArray(this.notLogin,this.$route.path)){
           return false;
        } else {
          return this.$route.fullPath.indexOf("login") < 0 && this.showlogin_;
        }
      },
      set: function(newValue) {
        this.showlogin_ = newValue;
      }
    },
    showMainFooter: {
      get: function() {
        if (
          this.$route.path == "/index" ||
          this.$route.path == "/category" ||
          this.$route.path == "/cart" ||
          this.$route.path == "/user"
        ) {
          return true;
        } else {
          return false;
        }
        //return this.$route.fullPath.indexOf("/msite") > -1;
      }
    }
  }
};
</script>

<style lang="scss">
@import url("http://at.alicdn.com/t/font_996464_kl41s2u5km.css");
@import "./style/common";
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}
.iconfont{
  font-size:0.4rem;
}
</style>
