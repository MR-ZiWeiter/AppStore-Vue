<template>
  <div id="good-info">

    <div v-if="top" class="header-one flex-box">
      <span class="back" @click="back">
        <i class="iconfont icon-left"></i>
      </span>
      <span @click="actions=true">
        <i class="iconfont icon-caidan"></i>
      </span>
    </div>

    <div class="bottom ">
      <good-bottom v-if="Object.keys(info).length > 0&&info.is_wholesale==0" :info="info" :collects="collects" @bottom="bottom_emit"></good-bottom>
      <wholesale-bottom v-else :info="info" @bottom="bottom_emit"></wholesale-bottom>
    </div>
    <div class="p-a-all" style="bottom:1rem;">
      <good-info @share="share=true;" :comment="comment"></good-info>
    </div>
    <div v-transfer-dom>
      <popup v-model="goodcheck">
        <skuInfo v-if="Object.keys(info).length > 0&&sku_type" :info="info" :type="sku_type" @popup="goodcheck=false"></skuInfo>
      </popup>
    </div>
    <actionsheet theme="ios" @on-click-menu="clickmenu" v-model="actions" :menus="menus"></actionsheet>
    <share-page v-if="share" @hideShare="share=false"></share-page>
  </div>
</template>
<script>
var intval = null;
import { goodsdetail, addCart, goodsEvaluateList } from "src/service/getData";
import { imgBaseUrl } from "src/config/env";
import { dateFormat, TransferDom } from "vux";
import sharePage from "./components/share";
import goodInfo from "./components/index";
import goodBottom from "./components/good_bottom";
import wholesaleBottom from "./components/service_bottom";
import skuInfo from "./components/sku";
import store from "src/store/";
import { mapMutations } from "vuex";
export default {
  directives: {
    TransferDom
  },
  components: { goodInfo, goodBottom, skuInfo, wholesaleBottom, sharePage },
  data() {
    return {
      share: false,
      data: {},
      local_default_goods_img:
        'this.src="' + require("src/images/resource/good.gif") + '"',
      collects: 0,
      imgurl: imgBaseUrl,
      info: {},
      actions: false,
      menus: { index: "首页", category: "分类", cart: "购物车", user: "我的" },
      comment: {},
      goodcheck: false,
      top: true,
      page: 0,
      check: [{ text: "默认" }],
      sku_type: "goods"
    };
  },
  beforeMount() {
    this.getInfo();
    this.getComment();
  },
  destroyed() {
    this.SET_GOODINFO();
    this.SET_GOODCHECK();
    this.SET_GOODNUM(1);
  },
  methods: {
    ...mapMutations(["SET_GOODINFO", "SET_GOODCHECK", "SET_GOODNUM"]),
    bottom_emit(data) {
      this.sku_type = data; 
      this.goodcheck = true;
    },
    goto(url) {
      this.$router.push(url);
    },
    async getComment() {
      let that = this;
      let res = await goodsEvaluateList(this.$route.query.id, 0, 1, 5);
      if (res.code == 1) {
        this.comment = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async getInfo() {
      let that = this;
      this.$vux.loading.show({ text: "加载中" });
      let res = await goodsdetail(this.$route.query.id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
        this.collects = res.data.collects;
        this.SET_GOODINFO(this.info);
        this.SET_GOODCHECK();
        this.SET_GOODNUM(1);
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },

    clickmenu(menuKey, menuItem) {
      this.$router.push("/" + menuKey);
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
#good-info {
  .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: calc(100% - 1.01rem);
    background: #fff;
    height: 1rem;
    text-align: center;
  }
  .header-one {
    padding: 0.2rem 0.3rem;
    position: relative;
    z-index: 10;
    span {
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 50%;
      background: #aaa;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        color: #fff;
        font-size: 0.4rem;
      }
    }
  }
  .header-two {
    padding: 0.2rem 0.3rem;
    position: relative;
    z-index: 11;
    background: #f4f4f4;
    i {
      font-size: 0.4rem;
    }
    .menu {
      span {
        display: inline-block;
        padding: 0 0.2rem;
      }
      span.checked {
        color: #f5326e;
      }
    }
  }
}
</style>
<style lang="scss">
#good-info {
  // .vux-slider {
  //   position: fixed;
  //   top: 0;
  //   width: 100%;
  // }
  .description {
    top: 0.9rem;
    padding: 0.2rem;
    background: #fff;
    img {
      max-width: 100%;
      margin: 0 auto;
    }
    p {
      display: flex !important;
      flex-wrap: wrap !important;
      font-size: 0.3rem !important;
      line-height: 0.5rem;
    }
    h1,
    h2,
    h3 {
      display: flex !important;
      flex-wrap: wrap !important;
    }
  }
}
</style>
