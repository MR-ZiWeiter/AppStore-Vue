<template>
    <div>
        <div class="header">
            <span class="back" @click="back">
                <i class="iconfont icon-left"></i>
            </span>
            <div class="search-box">
                <i class="iconfont icon-sousuo"></i>
                <input type="text" v-model="searchCode" @keyup.enter="search" placeholder="搜索商品">
                <i class="iconfont icon-chuyidong" @click="clear" v-if="searchCode"></i>
            </div>
            <span class="menu" @click="actions=true">
                <i class="iconfont icon-caidan"></i>
            </span>
        </div>
        <actionsheet theme="ios" @on-click-menu="clickmenu" v-model="actions" :menus="menus"></actionsheet>
    </div>

</template>
<script>
export default {
  props:['title'],
  data() {
    return {
      searchCode: "",
      actions: false,
      menus: { index: "首页", category: "分类", cart: "购物车", user: "我的" }
    };
  },
  mounted(){
    if(this.title){
      this.searchCode=this.title;
    }
  },
  methods: {
    search(){
      this.$emit('search',this.searchCode)
    },
    clear() {
      this.searchCode = "";
    },
    back() {
      this.$router.go(-1);
    },
    clickmenu(menuKey, menuItem) {
        this.$router.push('/'+menuKey);
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  height: 0.9rem;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1px;
  z-index: 10;
  .menu {
    margin-right: 0.2rem;
  }
  .back {
    height: 0.9rem;
    line-height: 0.9rem;
    padding: 0 0.2rem;
    display: inline-block;
  }
  .search-box {
    width: calc(100% - 2.5rem);
    background: #eee;
    border-radius: 0.4rem;
    color: #999;
    font-size: 0.24rem;
    padding: 0 0.2rem;
    position: relative;
    .icon-chuyidong {
      position: absolute;
      right: 0.2rem;
      top: 0.05rem;
    }
    input {
      padding: 0.05rem 0.2rem;
      background: #eee;
      border-radius: 0.4rem;
      width: 70%;
    }
  }
}
</style>
