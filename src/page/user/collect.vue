<template>
    <div id="collect">
        <head-top :go-back='true' head-title="我的收藏" :rightMenu="true"></head-top>
        <tab>
            <tab-item selected @on-item-click="onItemClick">全部</tab-item>
            <tab-item @on-item-click="onItemClick">本周</tab-item>
            <tab-item @on-item-click="onItemClick">本月</tab-item>
            <tab-item @on-item-click="onItemClick">本年</tab-item>
        </tab>
        <div class="p-a-all" @scroll="handleScroll">
            <div class="item" v-for="(item,index) in list" :key="index">
                <p class="title" @click="goto('/goods?id='+item.goods_id)">{{item.fav_time}}</p>
                <div class="rows">
                    <img :src="item.goods_image" alt="" @click="goto('/goods?id='+item.goods_id)" :onerror="local_default_goods_img">
                    <div class="box">
                        <p class="title" @click="goto('/goods?id='+item.goods_id)">{{item.log_msg}}</p>
                        <div class="flex-box">
                            <span class="price font-size-13">￥{{item.promotion_price}}</span>
                            <span @click="delFav(item.goods_id)">取消收藏</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="list.length==0" style="padding-top:20%;text-align:center">没有收藏过商品</div>
        </div>
    </div>
</template>
<script>
import { myCollection, cancelFavorites } from "src/service/getData";
import headTop from "src/components/header/head";
import { imgBaseUrl } from "src/config/env";
export default {
  components: { headTop },
  data() {
    return {
      page: 1,
      type: 0,
      isnext: true,
      list: [],
      imgBaseUrl: imgBaseUrl,
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    onItemClick(index) {
      if (this.type == index) {
        return false;
      }
      this.type = index;
      this.page = 1;
      this.list = [];
      this.isnext=true;
      this.getList();
    },
    handleScroll() {
      let dom = this.$el.children[2];
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.page++;
        if (this.isnext) {
          this.getList();
        }
      }
    },
    goto(url) {
      this.$router.push(url);
    },
    async delFav(id) {
      this.$vux.loading.show({ text: "提交中......" });
      let res = await cancelFavorites(id, "goods");
      this.$vux.loading.hide();
      this.page = 1;
      this.list = [];
      this.isnext=true;
      this.getList();
    },
    async getList() {
      this.$vux.loading.show({ text: "正在获取中..." });
      let res = await myCollection(this.page, this.type);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.isnext = res.data.page_count>this.page;
        let that = this;
        for (let i in res.data.data) {
          that.list.push(res.data.data[i]);
        }
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#collect {
  .p-a-all {
    top: 1.7rem;
    background: #eee;
    .item {
      padding: 0.3rem;
      margin-bottom: 1px;
      font-size: 0.3rem;
      background: #fafafa;
      .title {
        font-size: 0.26rem;
        color: #666;
        padding: 0.1rem 0;
      }
      img {
        width: 1rem;
        height: 1rem;
        display: inline-block;
        background: #eee;
      }
      .box {
        display: inline-block;
        width: calc(100% - 1.1rem);
        height: 1rem;
        padding: 0 0.1rem;
      }
    }
    button {
      height: 0.8rem;
      font-size: 0.3rem;
      color: #666;
      margin-top: 1rem;
    }
  }
}
</style>
