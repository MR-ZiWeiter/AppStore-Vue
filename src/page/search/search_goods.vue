<template>
  <div id="searchGoods">
    <search-head @search="search" :title="code"></search-head>
    <div class="menu">
      <span @click="obyzdshow=true" class="checked">{{menu_1}}
        <i class="iconfont icon-down_arrows"></i>
      </span>
      <span @click="setsort">{{sorttext}}</span>
      <span @click="screen_show=true">筛选
      </span>
    </div>
    <div class="sort" v-if="obyzdshow">
      <div @click="setobyzd('','默认')" class="flex-box" :class="{checked:obyzd==''}">
        <span>默认</span>
        <i class="iconfont icon-duihao"></i>
      </div>
      <div @click="setobyzd('ng.sales','销售量')" class="flex-box " :class="{checked:obyzd=='ng.sales'}">
        <span>销售量</span>
        <i class="iconfont icon-duihao"></i>
      </div>
      <div @click="setobyzd('ng.is_new','新品')" class="flex-box " :class="{checked:obyzd=='ng.is_new'}">
        <span>新品</span>
        <i class="iconfont icon-duihao"></i>
      </div>
      <div @click="setobyzd('ng.promotion_price','价格')" class="flex-box " :class="{checked:obyzd=='ng.promotion_price'}">
        <span>价格</span>
        <i class="iconfont icon-duihao"></i>
      </div>
    </div>
    <div class="mask" @click="obyzdshow=false" v-if="obyzdshow"></div>
    <div class=" p-a-all" @scroll="handleScroll">
      <good-list :list="list" v-if="list.length>0"></good-list>
      <div v-if="list.length==0" class="no-search">没有搜索到商品</div>
    </div>
    <div v-transfer-dom>
      <popup v-model="screen_show" position="right" width="80%">
        <screen-page :info="info" :history="screen_data" @screen="screen"></screen-page>
      </popup>
    </div>
  </div>
</template>
<script>
import searchHead from "src/components/header/search_head";
import screenPage from "src/components/common/screen";
import {
  goodsSearchList,
  goodsList,
  serviceList,
  serviceSearchList
} from "src/service/getData";
import goodList from "./components/list"
export default {
  components: { searchHead, screenPage ,goodList},
  data() {
    return {
      screen_show: false,
      menu_1: "默认",
      obyzd: "",
      st: "desc",
      sorttext: "降序",
      obyzdshow: false,
      menu: 0,
      goods: [],
      list: [],
      page: 1,
      page_count: 1,
      code: this.$route.query.sear_name,
      category: this.$route.query.category,
      info: {},
      screen_data: {},
      no_point:this.$route.query.no_point?this.$route.query.no_point:0
    };
  },
  watch: {
    obyzd(value) {
      this.obyzdshow = false;
      this.page = 1;
      this.list = [];
      this.getgoods();
    },
    st() {
      this.list = [];
      this.page = 1;
      this.getgoods();
    }
  },
  beforeMount() {
    this.getgoods();
  },
  methods: {
    handleScroll() {
      let dom = this.$el.children[2];
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.page++;
        if (this.page<=this.page_count) {
          this.getgoods();
        }
      }
    },
    search(code) {
      this.screen_data = {};
      this.info = {};
      this.code = code;
      this.category = "";
      this.list = [];
      this.page = 1;
      this.getList();
    },
    screen(data) {
      this.screen_show = false;
      this.screen_data = data;
      this.page = 1;
      this.list = [];
      this.getgoods();
    },
    setsort() {
      if (this.st == "desc") {
        this.st = "asc";
        this.sorttext = "升序";
      } else {
        this.st = "desc";
        this.sorttext = "降序";
      }
      this.obyzdshow = false;
    },
    getgoods() {
      if (this.category) {
        this.getListCategory();
      } else {
        this.getList();
      }
    },
    async getListCategory() {
      let that = this;
      this.$vux.loading.show({
        text: "正在获取"
      });
      let attr = "";
      for (let i in this.screen_data.spec) {
        attr = attr + this.spec[i] + ";";
      }
      if (attr) {
        attr = attr.substring(0, attr.length - 1);
      }
      let res;
      if (this.$route.path == "/search_service_goods") {
        res = await serviceList(
          this.$route.query.category,
          this.page,
          this.obyzd,
          this.st,
          this.screen_data.mipe,
          this.screen_data.mape,
          this.screen_data.brand_id,
          attr
        );
        this.$vux.loading.hide();
        if (res.code == 1) {
          this.info = res.data;
          let list = res.data.data;
          this.page_count = res.data.page_count;
          for (let i in list) {
            that.list.push(list[i]);
          }
        }
      } else {
        res = await goodsList(
          this.$route.query.category,
          this.page,
          this.obyzd,
          this.st,
          this.screen_data.mipe,
          this.screen_data.mape,
          this.screen_data.brand_id,
          attr
        );
        this.$vux.loading.hide();
        if (res.code == 1) {
          this.info = res.data;
          let list = res.data.good_list.data;
          this.page_count = res.data.good_list.page_count;
          for (let i in list) {
            that.list.push(list[i]);
          }
        }
      }
    },
    async getList() {
      let that = this;
      this.$vux.loading.show({
        text: "正在获取"
      });
      let res = {};
      if (this.$route.path == "/search_service_goods") {
        res = await serviceSearchList(
          this.code,
          this.page,
          this.st,
          "",
          this.obyzd
         
        );
      } else {
        res = await goodsSearchList(
          this.code,
          this.page,
          this.st,
          "",
          this.obyzd,
           this.no_point
        );
      }

      this.$vux.loading.hide();
      if (res.code == 1) {
        let list = res.data.search_good_list.data;
        this.page_count = res.data.search_good_list.page_count;
        for (let i in list) {
          that.list.push(list[i]);
        }
      }
    },
    setobyzd(index, text) {
      this.obyzd = index;
      this.menu_1 = text;
      this.obyzdshow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.none {
  display: none;
}
.no-search {
  text-align: center;
  padding-top: 40%;
}
#searchGoods {
  .mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 6;
  }
  .sort {
    position: relative;
    z-index: 9;
    background: #fff;
    width: 100%;
    padding: 0.2rem 0.3rem;
    margin-top: 1px;
    i {
      display: none;
    }
    .flex-box {
      padding: 0.2rem 0;
    }
    .checked {
      span,
      i {
        color: #f5326e;
        display: inline-block;
      }
    }
  }
  .menu {
    position: relative;
    z-index: 9;
    height: 0.9rem;
    background: #fff;
    display: flex;
    justify-content: space-between;
    span {
      display: inline-flex;
      width: 33.3333%;
      justify-content: center;
      align-items: center;
      height: 0.9rem;
      color: #666;
      font-size: 0.26rem;
      i {
        font-size: 0.24rem;
        color: #666;
      }
    }
    span.checked {
      color: #f5326e;
      i {
        color: #f5326e;
      }
    }
  }
  .p-a-all {
    top: 1.8rem;
    padding: 0.1rem;
  }
  .goods {
    width: 100%;
    .item {
      display: inline-block;
      width: calc(50% - 0.1rem);
      margin: 0 0.05rem;
      background: #fff;
      margin-bottom: 0.2rem;
      .img-size-box {
        padding: 0;
      }
      .title {
        padding: 0.1rem 0.2rem;
        color: #333;
        font-size: 0.26rem;
      }
      .comment {
        padding: 0 0.2rem 0.1rem;
        font-size: 0.24rem;
        color: #666;
      }
      .price {
        display: flex;
        align-items: center;
        padding: 0 0.2rem 0.1rem;
        span {
          color: #ff4444;
        }
        .express {
          margin-left: 0.2rem;
          font-size: 0.2rem;
          border: 1px solid #ff4444;
          padding: 0.02rem 0.05rem;
        }
      }
    }
  }
}
</style>
