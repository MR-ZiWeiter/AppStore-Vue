<template>
  <div>
    <head-top :go-back='true' head-title="新闻资讯" :rightMenu="true"></head-top>
    <div class="trademark-topic p-a-all">
      <div class="item" v-for="(item,index) in list" :key="index" @click="goto('/article?id='+item.article_id)">
        <div class="flex-box">
          <div class="left">
            <p class="text-color-333 ellipsis-2">{{item.short_title}}</p>
            <p class="ellipsis-2 font-size-12 text-color-999">{{item.title}}</p>
          </div>
          <img :src="item.image" alt="">
        </div>
        <div class="font-size-12 text-color-999 rows">
          <i class="iconfont icon-in_zhengyan_fill"></i>{{item.click}}
          <i class="iconfont icon-shoucang"></i>{{item.share_count}}
        </div>
      </div>
    </div>
    <!-- <div class="p-a-all">
            <div class="item" v-for="(item,index) in list" :key="index" @click="goto('/article?id='+item.article_id)">
                <div class="img-size-box">
                    <div class="bg-img" :style="{'background-image':'url('+item.image+')'}"></div>
                </div>
                <p class="ellipsis">{{item.short_title}}</p>
            </div>
        </div> -->
  </div>
</template>
<script>
import { getArticleList } from "src/service/getData";
import headTop from "src/components/header/head";
import { dateFormat } from "vux";
export default {
  components: { headTop },
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  data() {
    return {
      page: 1,
      list: [],
      page_count: 1
    };
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    goto(url) {
      this.$router.push(url);
    },
    async getList() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await getArticleList(this.page);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
        let that = this;
        this.page_count = res.data.page_count;
        for (let i in res.data.data) {
          that.list.push(res.data.data[i]);
        }
      } else {
        this.$vux.toast.text(res.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.p-a-all {
  
}
.trademark-topic {
  background: #fff;
  .item {
    padding: 0.2rem;
    border-bottom: 1px solid #ddd;
    .left {
      width: calc(100% - 1.8rem);
    }
    img {
      width: 1.6rem;
      height: 1.6rem;
      background: #eee;
    }
    i {
      font-size: 0.28rem;
      color: #999;
      margin: 0 0.1rem;
    }
  }
}
</style>
