<template>
  <div>
    <div class="swiper-bg"></div>
    <swiper @click.native="gotobanner" :list="banner" v-if="banner.length>0" :show-desc-mask="false" v-model="banner_index" height="2.82rem"></swiper>
    <div class="menu-list">
      <div class="item" v-for="(item,index) in menulist" :key="index">
        <img :src="item.img" alt="" @click="goto(item.url)">
        <p>{{item.title}}</p>
      </div>
    </div>
    <div class="marquee" v-if="marquee_list.length>0">
      <img src="../../images/yx/hot@2x.png" style="width:1rem;" alt="">
      <div class="line"></div>
      <marquee>
        <marquee-item v-for="(item,i) in marquee_list" :item-height="120" :key="i" @click.native="openNotice(item.id)">
          <div class="label">公告</div>{{item.notice_title}}</marquee-item>
      </marquee>
    </div>
    <div class="flex-box type-title" @click="goto('/recommend')" v-if="hotlist.length>0">
      <span>推荐宝贝</span>
      <span class="font-size-12 text-color-666">查看更多</span>
    </div>
    <div class="goods-list" v-if="hotlist.length>0">
      <div class="item" v-for="(item,index) in hotlist" :key="index" @click="goto(item.url)">
        <div class="img-size-box">
          <div class="bg-img" :style="{'background-image':'url('+item.img+'),url('+item.default_img+')'}"></div>
        </div>
        <div class="info">
          <p class="label-box">
              <span class="label" v-if="item.is_hot">热卖</span>
              <span class="label" v-if="item.is_recommend">精品</span>
              <span class="label" v-if="item.is_new">新品</span>
               <span class="label" v-for="(group_item,group_index) in item.gorup_list" :key="group_index">{{group_item.group_name}}</span>
            </p>
          <p class="ellipsis font-size-13">{{item.title}}</p>
          <p class="price font-size-12">{{item.price}}</p>
        </div>
      </div>
    </div>
    <!-- <img style="width:100%;" src="../../images/yx/trademark@2x.png" alt="" @click="search">
    <div class="flex-box type-title" @click="no_start()">
      <span>商标交易</span>
      <span class="font-size-12 text-color-666">查看更多</span>
    </div>
    <div class="trademark-icon" @click="no_start()">
      <div><img src="../../images/trademark/25045481@2x.png" alt=""></div>
      <div><img src="../../images/trademark/25552724@2x.png" alt=""></div>
      <div><img src="../../images/trademark/25684489@2x.png" alt=""></div>
      <div><img src="../../images/trademark/25721916@2x.png" alt=""></div>
      <div><img src="../../images/trademark/25767056@2x.png" alt=""></div>
      <div><img src="../../images/trademark/25778216@2x.png" alt=""></div>
      <div><img src="../../images/trademark/25887466@2x.png" alt=""></div>
      <div><img src="../../images/trademark/26255235@2x.png" alt=""></div>
      <div><img src="../../images/trademark/26320860@2x.png" alt=""></div>
      <div><img src="../../images/trademark/26409062@2x.png" alt=""></div>
    </div> -->

    <div class="flex-box type-title" @click="goto('/news')">
      <span>最新资讯</span>
      <span class="font-size-12 text-color-666">查看更多</span>
    </div>
    <div class="trademark-topic">
      <div class="item" v-for="(item,index) in articleList" :key="index"  @click="goto('/article?id='+item.article_id)">
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
  </div>
</template>
<script>
import {  indexData,getArticleList } from "src/service/getData";
import { Marquee, MarqueeItem, Divider, dateFormat } from "vux";
export default {
  components: {
    Marquee,
    MarqueeItem,
    Divider
  },
  data() {
    return {
      default_goods_img: window.default_goods_img,
      info: {},
      banner_index: 0,
      banner: [],
      menulist: [
        {
          title: "推荐宝贝",
          url: "/recommend",
          img: require("../../images/yx/1@2x.png")
        },{
          title: "异业联盟",
          // url: "/searchgoods?sear_name=",
          img: require("../../images/yx/9@2x.png")
        },{
          title: "热卖专区",
          url: "/searchgoods?sear_name=",
          img: require("../../images/yx/3@2x.png")
        },{
          title: "新闻资讯",
          url: "/news",
          img: require("../../images/yx/4@2x.png")
        }, 
      ],
      marquee_list: [],
      hotlist: [],
      articleList:[]
    };
  },
  beforeMount() {
    // this.getInfo();
    // this.getNoticeList();
    this.getData();
    this.getArticle();
  },
  methods: {
    search(){
        window.open(window.searchadvurl);
      // windows.open('http://wsjs.saic.gov.cn');
    },
    no_start() {
      this.$vux.toast.text("即将上线", "middle");
    },
    async getData() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await indexData();
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
        this.setInfo();
      } else {
        this.$vux.toast.text(res.msg);
      }
    },
    gotobanner() {
      // this.$vux.toast.text("即将上线", "middle");
      this.goto(this.banner[this.banner_index].url);
    },
    openNotice(id) {
      this.$router.push("/notice?id=" + id);
    },
    goto(url) {
      if (!url) {
        this.$vux.toast.text("即将上线", "middle");
        return false;
      }
      this.$router.push(url);
    },
    async getNoticeList() {
      let res = await getNotice();
      if (res.code == 1) {
        this.marquee_list = res.data.data;
      }
    },
    setInfo() {
      let that = this;
      for (let i in this.info.slide.adv_list) {
        let obj = {
          url: that.info.slide.adv_list[i].adv_url,
          img: that.info.slide.adv_list[i].adv_image
        };
        that.banner.push(obj);
      }

      this.marquee_list = this.info.plat.data;

      let data = this.info.block_list;
      let goods = [];
      for (let i in data) {
        for (let j in data[i].goods_list) {
          let obj = {
            url: "/goods?id=" + data[i].goods_list[j].goods_id,
            img: data[i].goods_list[j].pic_cover_small,
            default_img: window.default_goods_img,
            title: data[i].goods_list[j].goods_name,
            price: data[i].goods_list[j].promotion_price,
            is_hot:data[i].goods_list[j].is_hot,
            is_new:data[i].goods_list[j].is_new,
            is_recommend:data[i].goods_list[j].is_recommend,
            gorup_list:data[i].goods_list[j].gorup_list
          };
          goods.push(obj);
        }
      }
      this.hotlist = goods;

      // for (let i in this.info.menu) {
      //   let obj = {
      //     url: that.info.menu[i].url,
      //     img: window.imgBaseUrl + that.info.menu[i].image,
      //     title: that.info.menu[i].title
      //   };
      //   that.menulist.push(obj);
      // }

      // for (let i in this.info.hotsale) {
      //   if (that.info.hotsale[i].info) {
      //     let obj = {
      //       url: that.info.hotsale[i].url,
      //       img: window.imgBaseUrl + that.info.hotsale[i].image,
      //       title: that.info.hotsale[i].info.goods_name,
      //       price: that.info.hotsale[i].info.promotion_price
      //     };
      //     that.hotlist.push(obj);
      //   }
      // }
    },
    async getArticle(){
      let res=await getArticleList();
      if(res.code==1){
        this.articleList=res.data.data;
      }
    },
    async getInfo(id) {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await indexpage(id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
        this.setInfo();
      } else {
        this.$vux.toast.text(res.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.menu-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0.2rem 0;
  background: #fff;
  border-bottom: 1px solid #eee;
  .item {
    width: 25%;
    text-align: center;
    margin-bottom: 0.2rem;
    img {
      width: 1rem;
      height: 1rem;
    }
    p {
      font-size: 0.24rem;
    }
  }
}
.label-box{
    .label{
      font-size: 0.24rem;
      color:#fff;
      background: #ff4444;
      padding:0.03rem 0.1rem;
    }
  }
.marquee {
  padding: 0.2rem 0.3rem;
  background: #fff;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  img {
    margin-right: 0.2rem;
    width: 1.07rem;
  }
  .line {
    width: 0.01rem;
    height: 0.3rem;
    background: #ccc;
    margin-right: 0.2rem;
  }
  .label {
    color: #ff6262;
    font-size: 0.2rem;
    background: #ffd0d0;
    padding: 0.03rem 0.05rem;
    border-radius: 0.1rem;
    margin-right: 0.1rem;
    display: inline;
  }
}
.type-title {
  padding: 0.2rem 0.3rem;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.goods-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 0.1rem;
  .img-size-box {
    padding: 0;
  }
  .item {
    width: 49.5%;
    font-size: 0;
    margin-bottom: 0.2rem;
    .info {
      background: #fff;
      padding: 0.1rem 0.2rem;
    }
  }
}
.trademark-icon {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0.2rem;
  background: #fff;
  margin-bottom: 0.2rem;

  div {
    width: 20%;
    padding: 0.1rem;
    border-bottom: 0.02rem solid #eee;
    border-right: 0.02rem solid #eee;
    img {
      width: 100%;
    }
  }
  div:nth-child(1),
  div:nth-child(6) {
    border-left: 0.02rem solid #eee;
  }
  div:nth-child(1),
  div:nth-child(2),
  div:nth-child(3),
  div:nth-child(4),
  div:nth-child(5) {
    border-top: 0.02rem solid #eee;
  }
}
.trademark-topic {
  background: #fff;
  .item {
    padding: 0.2rem;
    border-bottom: 1px solid #eee;
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
.swiper-bg{
  height: 2.82rem;
  position: absolute;
  width: 100%;
  background: #fff;
}
</style> 
<style lang="scss">
.marquee {
  .vux-marquee {
    width: calc(100% - 1.5rem) !important;
    .vux-marquee-box {
      li {
        display: flex;
        align-items: center;
      }
    }
  }
}
.vux-slider{
  border-bottom-left-radius: 50% 0.2rem;
  border-bottom-right-radius: 50% 0.2rem;
}
</style>
