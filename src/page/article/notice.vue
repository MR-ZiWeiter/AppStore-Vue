<template>
    <div id="notice">
        <head-top :go-back='true' head-title="公告" :rightMenu="true"></head-top>
        <div class="p-a-all" v-if="info.create_time">
            <div class="title text">{{info.notice_title}}</div>
            <div class="flex-box text">
                <span></span>
                <span class="font-size-13 text-color-999">{{info.create_time|date}} </span>
            </div>
            <div class="text" v-html="info.notice_content"></div>
        </div>
    </div>
</template>
<script>
import {getNotice} from "src/service/getData";
import headTop from "src/components/header/head";
import { dateFormat } from "vux";
export default {
  components: { headTop },
  data() {
    return {
      headtitle: this.$route.query.title,
      info:{}
    };
  },
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  beforeMount(){
    this.getInfo();
  },
  methods:{
    async getInfo() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await getNotice(this.$route.query.id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
        if(!res.data){
           this.$vux.toast.text('未获取到信息','middle');
          this.$router.go(-1);
        }
      }else{
          this.$vux.toast.text(res.msg,'middle');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#notice {
  .p-a-all {
    background: #eee;
    .text {
      background: #fff;
      color: #333;
      padding: 0.2rem 0.3rem;
      margin-bottom: 1px;
    }
    .title {
      font-size: 0.4rem;
      font-weight: bold;
    }
  }
}
</style>


