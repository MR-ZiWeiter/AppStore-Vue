<template>
  <div id="header" v-if="visible">
    <x-header :left-options="{showBack:goBack,backText: ''}" :class="{white:color!='#333'}" :style="headBg">
      <span style="font-size:0.4rem;" :style="{color:color}">{{headTitle}}</span>
      <div v-if="customRight" slot="right" @click="rightClick">
        <span :style="{color:textcolor}" v-if="rightTitle">{{rightTitle}}</span>
        <i v-else class="iconfont" :class="rightIcon"></i>
      </div>
      <span v-if="rightMenu" class="menu" @click="menushow">
        <i class="iconfont icon-caidan"></i>
      </span>
    </x-header>
    <actionsheet  theme="ios" @on-click-menu="clickmenu" v-model="actions" :menus="menus"></actionsheet>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import store from "src/store/";
import { XHeader } from "vux";
export default {
  components: {
    XHeader
  },
  data() {
    return {
      headBg: { background: "#fafafa" },
      color: "#333",
      actions: false,
      menus: { index: "首页", category: "分类", cart: "购物车", user: "我的" }
    };
  },
  mounted(){
    //  console.log(this.actions);
  },
  props: [],
  computed: {
    ...mapState({
      visible: state => state.head.headerProp.visible,
      signinUp: state => state.head.headerProp.signinUp,
      headTitle: state => state.head.headerProp.headTitle,
      goBack: state => state.head.headerProp.goBack,
      ori_transparent: state => state.head.headerProp.ori_transparent,
      transparent: state => state.head.headerProp.transparent,
      textcolor: state => state.head.headerProp.textcolor,
      borderBottom: state => state.head.headerProp.borderBottom,
      rightAction: state => state.head.headerProp.rightAction,
      rightIcon: state => state.head.headerProp.rightIcon,
      customRight: state => state.head.headerProp.customRight,
      rightTitle: state => state.head.headerProp.rightTitle,
      bgcolor: state => state.head.headerProp.background,
      rightMenu:state=>state.head.headerProp.rightMenu
    })
    //origin_transparent: this.transparent,
  },
  watch: {
     actions(val){
      console.log(val);
    },
    bgcolor(data) {
      if (data == "#fafafa") {
        this.color = "#333";
      } else {
        this.color = "#fafafa";
      }

      this.headBg.background = data;
    }
  },
  methods: {
    //...mapActions(['getUserInfo'])
    menushow(){
      this.actions=true
    },
    back() {
      this.$router.go(-1);
    },
    clickmenu(menuKey, menuItem) {
      this.actions=false;
      this.$router.push("/" + menuKey);
    },
    rightClick() {
      if (this.rightAction) {
        this.rightAction();
      }
    }
  }
};
</script>
<style lang="scss" scoped>

#header {
 
  background: #eee;
  .iconfont {
    font-size: 0.5rem;
  }
  .overwrite-title-demo {
    margin-top: 5px;
  }
  .vux-header {
    z-index: 3000;
    padding: 0 !important;
    background: rgb(250, 250, 250);
  }
  .menu{
    position: absolute;
    right: 0.2rem;
    z-index: 100;
  }
}
</style>

<style>
</style>