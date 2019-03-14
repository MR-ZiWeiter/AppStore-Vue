<template>
  <div id="comment">
    <head-top :go-back='true' head-title="商品评论" :rightMenu="true"></head-top>
    <div class="p-a-all comment-box" @scroll="handleScroll">
      <div class="top">
        <span @click="check=index" v-for="(item,index) in comments_top" :key="index" :class="{checked:index==check}">{{item.name}}</span>
      </div>
      <ul class="judge-box" v-if="list.length>0">
        <li class="judge-item" v-for="(item,index) in list" :key="index">
          <div class="flex-box">
            <span class="font-size-13 flex text-color-666">
              <img  :src="url+item.user_img" class="avatar" alt="" :onerror="default_headimg">
              {{item.is_anonymous?item.member_name.substring(0,1)+'***(匿名)':item.member_name}}
              <span class="price">[{{item.explain_type==1?'好评':(item.explain_type==2?'中评':'差评')}}]</span>
            </span>
            <span class="font-size-12 text-color-999">{{item.addtime|date}}</span>
          </div>
          <div class="p-v-10 border-top-1px">
            <p class="text-color-666" v-html="item.content"></p>
            <div class="img-box">
              <img :src="url+img" v-if="img" alt="" v-for="(img,img_index) in item.image" :key="img_index">
            </div>
          </div>
          <div class="agent" v-if="item.again_addtime">
            <div class="flex-box">
              <span class="font-size-13 price">追加评价</span>
              <span class="font-size-12 text-color-999" >{{item.again_addtime|date}}</span>
            </div>
            <p class="text-color-666" v-html="item.again_content"></p>
            <div class="img-box">
              <img :src="url+img" v-if="img" alt="" v-for="(img,img_index) in item.again_image" :key="img_index">
            </div>
          </div>
        </li>
      </ul>
      <div v-else style="padding-top:20%;text-align:center;">还没有人评论</div>
    </div>
  </div>
</template>
<script>
import { goodsEvaluateList, serviceEvaluateList } from "src/service/getData";
import headTop from "src/components/header/head";
import { dateFormat } from "vux";
import { imgBaseUrl } from "src/config/env";
export default {
  components: { headTop },
  data() {
    return {
      url: imgBaseUrl,
      comments_top: [
        { name: "全部评价" },
        { name: "好评" },
        { name: "中评" },
        { name: "差评" },
        { name: "订单晒图" }
      ],
      check: 0,
      list: [],
      page: 1,
      page_count: 1,
      default_headimg:
        'this.src="' + window.default_headimg + '";this.onerror = null'
    };
  },
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {
    check(val) {
      this.page = 1;
      this.list = [];
      this.getList();
    }
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    handleScroll() {
      let dom = this.$el.children[1];
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.page++;
        if (this.page_count >= this.page) {
          this.getList();
        }
      }
    },
    async getList() {
      this.$vux.loading.show({ text: "获取中..." });
      let res;
      if (this.$route.query.type == "service") {
        res = await serviceEvaluateList(
          this.$route.query.id,
          this.check,
          this.page,
          10
        );
      } else {
        res = await goodsEvaluateList(
          this.$route.query.id,
          this.check,
          this.page,
          10
        );
      }

      this.$vux.loading.hide();
      if (res.code == 1) {
        let that = this;
        this.page_count = res.data.page_count;
        for (let i in res.data.data) {
          res.data.data[i].content= res.data.data[i].content.replace(/\n/g,'<br/>');
          res.data.data[i].again_content= res.data.data[i].again_content.replace(/\n/g,'<br/>');
          res.data.data[i].image = res.data.data[i].image.split(",");
          res.data.data[i].again_image = res.data.data[i].again_image.split(
            ","
          );
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
#comment {
  .comment-box {
    .flex {
      align-items: center;
    }
    .avatar {
      width: 0.5rem;
      height: 0.5rem;
      background: #eee;
      display: inline-block;
      border-radius: 50%;
      margin-right: 0.1rem;
    }
    .img-box {
      margin-top: 0.2rem;
      img {
        width: 1.5rem;
        height: 1.5rem;
        display: inline-block;
        background: #eee;
        margin-right: 0.2rem;
      }
    }
    p {
      display: flex;
    }
    .top {
      padding: 0.2rem 0.3rem;
      background: #fff;
      margin-bottom: 0.2rem;
      span {
        display: inline-block;
        margin-right: 0.15rem;
        padding: 0.15rem 0.2rem;
        font-size: 0.24rem;
        background: #eee;
      }
      span.checked {
        color: #fff;
        background: #f5326e;
      }
    }
    .judge-box {
      .judge-item {
        background: #fff;
        margin-bottom: 0.1rem;
        padding: 0.2rem 0.3rem;
        .user-header {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          margin-right: 0.2rem;
        }
        .rows:first-child {
          padding-bottom: 0.2rem;
          border-bottom: 1px solid #eee;
        }
      }
    }
  }
}
</style>


