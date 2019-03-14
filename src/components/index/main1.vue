<template>
  <div class="main-index">
    <!-- 搜索框 -->
    <!-- <div class="search-box">
      <div class="search-input">
        <i class="iconfont icon-sousuo"></i>{{search.shop}}</div>
    </div> -->
    <!-- 轮播图 -->
    <swiper :list="banner" v-if="banner.length>0" v-model="banner_index" height="3.6rem"></swiper>
    <!-- 公告 -->
    <div class="marquee" v-if="marquee_list.length>0">
      <marquee>
        <marquee-item v-for="(item,i) in marquee_list" :key="i" @click.native="openNotice(item.id)">{{item.notice_title}}</marquee-item>
      </marquee>
    </div>
    <!-- 分类菜单 -->
    <div class="menu-list">
      <div class="item" v-for="(item,index) in menulist" :key="index">
        <img :src="item.img" alt="" @click="goto(item.url)">
        <p>{{item.title}}</p>
      </div>
    </div>
    <!-- 单行广告 -->
    <div class="menu">
      <div class="img-size-box" :style="{width:(100/moremenu.length+'%')}" v-for="(item,index) in moremenu" :key="index" @click="goto(item.url)">
        <div class="bg-img" :style="{'background-image':'url('+item.img+')'}"></div>
      </div>
    </div>
    <!-- 热销 -->
    <div class="hot-sale" :style="hotSaleBg" v-if="hotlist.length>0">
      <p class="text-color-black">热销推荐</p>
      <p class="font-size-12 text-color-666">根据你的喜好,精心为你挑选</p>
      <div class="list">
        <div class="item" v-for="(item,index) in hotlist" :key="index" @click="goto(item.url)">
          <div class="img-size-box">
            <div class="bg-img" :style="{'background-image':'url('+item.img+')'}"></div>
          </div>
          <p class="ellipsis">{{item.title}}</p>
        </div>
      </div>
    </div>
    <!-- 限时抢购 -->
    <div class="flash-sale" :style="flashSaleBg" v-if="flashlist.detail&&flashlist.detail.goods_list.length>0">
      <p class="time">
        <clocker :time="flashlist.detail.end_time|date">
          <span>%D 天</span>
          <span>%H 小时</span>
          <span>%M 分 %S 秒</span>
        </clocker>
      </p>
      <div class="list">
        <div class="item" v-for="(item,index) in flashlist.detail.goods_list" :key="index" @click="goto('/goods?id='+item.goods_id)">
          <div class="img-size-box">
            <div class="bg-img" :style="{'background-image':'url('+item.url+item.picture_info.pic_cover_small+')'}"></div>
          </div>
          <p>{{item.goods_name}}</p>
          <p class="ellipsis">
            <span class="font-size-12">限时</span>
            <span class="font-size-15">￥{{item.discount}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 拼团 -->
    <div class="assemble" :style="assembleBg" v-if="1==0">
      <div class="button">
        查看更多
        <i class="iconfont icon-right"></i>
      </div>
      <div class="list">
        <div class="item" v-for="(item,index) in assemblelist" :key="index">
          <div class="img-size-box">
            <div class="bg-img" :style="{'background-image':'url('+item.img+')'}"></div>
          </div>
          <div class="ellipsis text-align-center">
            <span class="font-size-12">{{item.title.field1}}人团</span>
            <span>￥{{item.title.field2}}</span>
          </div>
          <p class="text-align-center">单买价{{item.title.field3}}</p>
        </div>
      </div>
    </div>
    <!-- 专区 -->
    <div class="arrondi" v-if="1==0">
      <!-- 标题 -->
      <div class="top">
        <p class="text-color-black">{{arrondi.title}}</p>
        <p class="small-text">{{arrondi.small_title}}</p>
      </div>
      <!-- 轮播图 -->
      <swiper :list="arrondi.banner" v-model="arrondi.banner_index" height="2.6rem"></swiper>
      <!-- 商品 -->
      <div class="list">
        <div class="item" v-for="(item,index) in arrondi.goods" :key="index">
          <div class="img-size-box">
            <div class="bg-img" :style="{'background-image':'url('+item.img+')'}"></div>
          </div>
          <p class="ellipsis text-align-center font-size-13">{{item.title.field1}}</p>
          <div class="text-align-center ">
            <span class="font-size-11 color-red">￥</span>
            <span class="font-size-14 color-red">{{item.title.field2}}</span>
            <span class="font-size-11">￥</span>
            <span class="font-size-11">{{item.title.field3}}</span>
          </div>
        </div>
      </div>
      <!-- 广告位 -->
      <div class="advert">
        <div class="item" v-for="(item,index) in arrondi.advert" :key="index">
          <div class="img-box">
            <img :src="item.img" alt="">
          </div>
          <div class="title">{{item.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getNotice } from "src/service/getData";
import { imgBaseUrl } from "src/config/env";
import { Marquee, MarqueeItem, Divider,dateFormat } from "vux";
export default {
  components: {
    Marquee,
    MarqueeItem,
    Divider
  },
  props: ["info"],
  data() {
    return {
      search: { shop: "补水面膜" },
      banner: [],
      banner_index: 0,
      menulist: [],
      moremenu: [],
      hotSaleBg: {
        "background-image":
          "url(" + require("../../images/resource/9.png") + ")"
      },
      hotlist: [],
      flashSaleBg: {
        "background-image":
          "url(" + require("../../images/resource/8.png") + ")"
      },
      flashlist: {},
      assembleBg: {
        "background-image":
          "url(" + require("../../images/resource/13.png") + ")"
      },
      assemblelist: [],
      arrondi: {},
      marquee_list: []
    };
  },
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {
    info: {
      handler(data) {
        this.banner = [];
        this.banner_index = 0;
        this.menulist = [];
        this.moremenu = [];
        this.hotlist = [];
        this.flashlist = {};
        this.setInfo();
      },
      deep: true
    }
  },
  beforeMount() {
    this.setInfo();
    this.getNoticeList();
  },
  methods: {
    openNotice(id) {
      this.$router.push("/notice?id=" + id);
    },
    async getNoticeList() {
      let res = await getNotice();
      if (res.code == 1) {
        this.marquee_list = res.data.data;
      }
    },
    goto(url) {
      this.$router.push(url);
    },
    setInfo() {
      let that = this;
      for (let i in this.info.banner) {
        let obj = {
          url: that.info.banner[i].url,
          img: imgBaseUrl + that.info.banner[i].image
        };
        that.banner.push(obj);
      }

      for (let i in this.info.menu) {
        let obj = {
          url: that.info.menu[i].url,
          img: imgBaseUrl + that.info.menu[i].image,
          title: that.info.menu[i].title
        };
        that.menulist.push(obj);
      }

      for (let i in this.info.adv) {
        let obj = {
          url: that.info.adv[i].url,
          img: imgBaseUrl + that.info.adv[i].image,
          title: that.info.adv[i].title
        };
        that.moremenu.push(obj);
      }

      for (let i in this.info.hotsale) {
        let obj = {
          url: that.info.hotsale[i].url,
          img: imgBaseUrl + that.info.hotsale[i].image,
          title: that.info.hotsale[i].title
        };
        that.hotlist.push(obj);
      }

      if (this.info.flashsale.length > 0) {
        this.flashlist = this.info.flashsale[0];
      }
      // for (let i in this.info.flashsale) {
      //   let obj = {
      //     url: that.info.flashsale[i].url,
      //     img: imgBaseUrl + that.info.flashsale[i].image,
      //     title: that.info.flashsale[i].title
      //   };
      //   that.flashlist.push(obj);
      // }
    }
  }
};
</script>
<style lang="scss" scoped>
.main-index {
  .color-red {
    color: #e74066;
  }
  .marquee {
    padding: 0.2rem 0.3rem;
    background: #fff;
    margin-bottom: 0.02rem;
  }
  .search-box {
    padding: 0.2rem 0.3rem;
    background: #efedf0;
    .search-input {
      background: #fff;
      height: 0.56rem;
      line-height: 0.56rem;
      padding: 0 0.3rem;
      border-radius: 0.2rem;
      i {
        color: #ea728b;
        margin-right: 0.2rem;
      }
    }
  }
  .menu {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 0.2rem 0.2rem;
    background: #fff;
    .img-size-box {
      padding: 0 0.1rem;
      .bg-img {
        padding-top: 62%;
      }
    }
  }
  .hot-sale {
    margin-bottom: 0.2rem;
    height: 7.3rem;
    padding: 0.4rem 0.5rem;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    p {
      text-align: center;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 33.3333%;
        padding: 0.1rem;
        .img-size-box {
          padding: 0;
          border: 1px solid #eee;
        }
      }
      p {
        background: #eee;
        font-size: 0.24rem;
        padding: 0.1rem 0;
      }
    }
  }
  .menu-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0.2rem 0;
    background: #fff;
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
  .flash-sale {
    height: 5.4rem;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 0 0.2rem;
    margin-bottom: 0.2rem;
    .time {
      text-align: center;
      padding-top: 1.5rem;
      padding-bottom: 0.2rem;
      font-size: 0.4rem;
      color: #fff;
      span{
        color:#fff;
      }
    }
    .list {
      overflow-y: auto;
      white-space: nowrap;
      .item {
        display: inline-block;
        width: 33.3333%;
        padding: 0.1rem;
        .img-size-box {
          padding: 0;
        }
        p {
          color: #fff;
          text-align: center;
          font-size: 0.24rem;
        }
        span {
          color: #fff;
        }
      }
    }
  }
  .assemble {
    height: 5rem;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 0 0.2rem;
    margin-bottom: 0.2rem;
    padding-top: 1.5rem;
    position: relative;
    .button {
      position: absolute;
      top: 0.2rem;
      right: 0.2rem;
      color: #fff;
      font-size: 0.24rem;
      display: flex;
      align-items: center;
      padding: 0.1rem 0.2rem;
      background: #ffa3ca;
      border-radius: 0.5rem;
      i {
        color: #fff;
        font-size: 0.24rem;
      }
    }
    .list {
      overflow-y: auto;
      white-space: nowrap;
      .item {
        display: inline-block;
        width: 33.3333%;
        padding: 0.1rem;
        .img-size-box {
          padding: 0;
        }
        p {
          color: #999;
          text-decoration: line-through;
          font-size: 0.26rem;
        }
        span {
          color: #d71880;
        }
      }
    }
  }
  .arrondi {
    .top {
      background: #fff;
      text-align: center;
      padding: 0.2rem;
      .small-text {
        color: #999;
        font-size: 0.16rem;
        letter-spacing: 0.1rem;
      }
    }
    .list {
      margin-bottom: 0.2rem;
      background: #fff;
      overflow-y: auto;
      white-space: nowrap;
      .item {
        display: inline-block;
        width: 33.3333%;
        padding: 0.1rem;
        .img-size-box {
          padding: 0;
        }
      }
    }
    .advert {
      .item {
        display: flex;
        margin-bottom: 0.2rem;
        flex-wrap: wrap;
        .img-box {
          width: 100%;
          max-height: 3.6rem;
          overflow: hidden;
          font-size: 0;
        }
        img {
          width: 100%;
        }
        .title {
          width: 100%;
          font-size: 0.3rem;
          color: #101010;
          background: #fff;
          padding: 0.1rem 0.2rem;
        }
      }
    }
  }
}
</style>
