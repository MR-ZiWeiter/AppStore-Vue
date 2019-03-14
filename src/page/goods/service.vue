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
      <service-bottom v-if="Object.keys(info).length > 0" :info="info" :collects="collects" @bottom="bottom_emit"></service-bottom>
    </div>
    <div class="p-a-all" style="bottom:1.2rem;">
      <good-info v-if="Object.keys(info).length > 0" :info="info" :comment="comment"></good-info>
    </div>
    <div v-transfer-dom>
      <popup v-model="goodcheck">
        <skuInfo v-if="Object.keys(info).length > 0&&sku_type" :info="info" :type="sku_type"></skuInfo>
      </popup>
    </div>
    <actionsheet theme="ios" @on-click-menu="clickmenu" v-model="actions" :menus="menus"></actionsheet>
  </div>
</template>
<script>
var intval = null;
import { serviceDetail, serviceEvaluateList } from "src/service/getData";
import { imgBaseUrl } from "src/config/env";
import { dateFormat, TransferDom } from "vux";
import goodInfo from "./components/index";
import serviceBottom from "./components/service_bottom";
import skuInfo from "./components/sku";
export default {
  directives: {
    TransferDom
  },
  components: { goodInfo, serviceBottom, skuInfo },
  data() {
    return {
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
  // mounted() {},
  beforeMount() {
    this.getInfo();
    this.getComment();
  },

  methods: {
    bottom_emit(data) {
      this.sku_type = data;
      this.goodcheck = true;
    },
    goto(url) {
      this.$router.push(url);
    },
    async getComment() {
      let that = this;
      this.$vux.loading.show({ text: "正在获取中......" });
      let res = await serviceEvaluateList(this.$route.query.id, 0, 1, 5);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.comment = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async getInfo() {
      let that = this;
      this.$vux.loading.show({ text: "正在获取中......" });
      let res = await serviceDetail(this.$route.query.id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data.goods_detail;
        this.collects = res.data.goods_detail.collects;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },

    clickmenu(menuKey, menuItem) {
      this.$router.push("/" + menuKey);
    },
    back() {
      this.$router.go(-1);
    },
   
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
    top: calc(100% - 1.21rem);
    background: #fff;
    height: 1.2rem;
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
  .vux-slider {
    position: fixed;
    top: 0;
    width: 100%;
  }
  .description {
    top: 0.9rem;
    padding: 0.2rem;
    background: #fff;
    img {
      width: 100%;
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
