<template>
  <div id="search">
    <div class="header">
      <span class="back" @click="back">
        <i class="iconfont icon-left"></i>
      </span>
      <div class="search-box">
        <i class="iconfont icon-sousuo"></i>
        <input type="text" @keyup.enter="search" v-model="searchCode" placeholder="搜索商品">
        <i class="iconfont icon-chuyidong" @click="clear" v-if="searchCode"></i>
      </div>
      <!-- <selector :options="options" v-model="checked"></selector> -->
    </div>
    <div class="history">
      <div class="goods-log">
        <div class="flex-box m-b-10"><div>商品搜索记录</div><div @click="del">清空</div></div>
        <span @click="searchGood(item)" v-for="(item,index) in goods" :key="index">{{item}}</span>
      </div>
      <!-- <div class="shop-log" v-if="store.length>0">
        <p>店铺搜索记录</p>
        <span v-for="(item,index) in store" :key="index">{{item}}</span>
      </div> -->
    </div>
  </div>
</template>
<script>
import {getStore,setStore} from "src/config/mUtils";
export default {
  data() {
    return {
      searchCode: "",
      goods: [],
      store: [],
      options: [{ key: 0, value: "搜索商品" }, { key: 1, value: "搜索店铺" }],
      checked: 0
    };
  },
  mounted(){
   let goods=JSON.parse(getStore('goods'));
   this.goods=goods?goods:[];
  },
  methods: {
    del(){
      this.goods=[];
      setStore('goods',this.goods);
    },
    clear() {
      this.searchCode = "";
    },
    back() {
      this.$router.go(-1);
    },
    searchGood(key){
      this.$router.push("/searchgoods?sear_name=" + key);
    },
    search() {
      if (this.searchCode) {
        this.goods.push(this.searchCode);
        setStore('goods',this.goods);
        this.$router.push("/searchgoods?sear_name=" + this.searchCode);
      } else {
        this.$vux.toast.text("请输入关键词", "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.text-align-right {
  text-align: right;
}

#search {
  .header {
    position: relative;
    height: 0.9rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1px;
    z-index: 10;
    .back {
      height: 0.9rem;
      line-height: 0.9rem;
      padding: 0 0.2rem;
      display: inline-block;
    }
    .search-box {
      width: calc(100% - 1.2rem);
      margin-right: 0.3rem;
      background: #eee;
      border-radius: 0.4rem;
      color: #999;
      font-size: 0.24rem;
      padding: 0 0.2rem;
      input {
        padding: 0.05rem 0.2rem;
        background: #eee;
        border-radius: 0.4rem;
        width: 85%;
      }
    }
  }
  .history {
    background: #fff;
    padding: 0.2rem;
    p {
      padding-bottom: 0.2rem;
    }
    span {
      display: inline-block;
      padding: 0.1rem 0.2rem;
      background: #eee;
      margin-right: 0.2rem;
      margin-bottom: 0.2rem;
      color: #999;
      font-size: 0.26rem;
      border-radius: 0.1rem;
    }
  }
}
</style>
<style>
#search option {
  appearance: none;
  min-height: 0.2rem;
  line-height: 0.2rem;
  font-size: 0.12rem;
}
</style>
