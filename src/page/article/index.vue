<template>
  <div id="artice">
    <head-top :go-back='true' :head-title="headtitle" :rightMenu="true"></head-top>
    <div class="p-a-all" v-if="info.public_time">
      <div class="title text">{{info.short_title}}</div>
      <div class="flex-box text">
        <span>发布者 : {{info.publisher_name}}</span>
        <span class="font-size-13 text-color-999">{{info.public_time|date}} </span>
      </div>
      <div class="content" v-html="info.content"></div>
    </div>
  </div>
</template>
<script>
import { getAdminArticle, getArticle } from "src/service/getData";
import headTop from "src/components/header/head";
import { dateFormat } from "vux";
export default {
  components: { headTop },
  data() {
    return {
      headtitle: this.$route.query.title ? this.$route.query.title : "文章",
      id: this.$route.query.id,
      info: {}
    };
  },
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      this.$vux.loading.show({ text: "获取中..." });
      let res;
      if (this.id) {
        res = await getArticle(this.id);
      } else {
        res = await getAdminArticle(this.headtitle);
      }
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
      } else {
        this.$vux.toast.text(res.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#artice {
  .p-a-all {
    background: #eee;
    .text {
      background: #fff;
      color: #333;
      padding: 0.2rem 0.3rem;
      margin-bottom: 1px;
      font-size: 0.28rem;
      p {
        text-indent: 0.26rem !important;
      }
      img {
        width: 100% !important;
      }
    }
    .title {
      font-size: 0.4rem;
      font-weight: bold;
    }
  }
}
</style>
<style lang="scss">
#artice {
  .content {
    background: #fff;
    color: #333;
    padding: 0.2rem 0.3rem;
    margin-bottom: 1px;
    font-size: 0.28rem;
    p {
      display: flex;
    }
    span {
      // display: inline-flex;
    }
    p,
    span {
      font-size: 0.28rem !important;
      text-indent: 0.3rem !important;
      line-height: 0.5rem!important;
    }
    img {
      width: 100% !important;
      margin:0.1rem 0;
    }
  }
}
</style>



