<template>
    <div id="wholesale">
        <head-top :go-back='true' head-title="批发专区" :rightMenu="true"></head-top>
        <div class="p-a-all">
            <img src="../../images/wholesale.png" style="width:100%;" alt="" srcset="">
            <tab :line-width="3" custom-bar-width="1.3rem">
                <tab-item @on-item-click="check=0" selected>正在抢购</tab-item>
                <tab-item @on-item-click="check=1">下期预告</tab-item>
            </tab>
            <whole-sale :type="1" :class="{hide:check==0}"></whole-sale>
            <whole-sale :type="0" :class="{hide:check==1}"></whole-sale>
        </div>
    </div>
</template>
<script>
import {
  goodsList,
  WholesaleGoodsList,
  WholesaleSoon
} from "src/service/getData";
import headTop from "src/components/header/head";
import { dateFormat } from "vux";
import wholeSale from './components/wholesale';
export default {
  components: { headTop ,wholeSale},
  data() {
    return {
        check:0,
      list: [],
      page: 1,
      page_count: 1
    };
  },
  computed: {
    now() {
      return new Date().getTime() / 1000;
    }
  },
  methods: {
    goto(url) {
      this.$router.push(url);
    },
  }
};
</script>
<style lang="scss" scoped>

.hide{
    display: none;
}
.p-a-all {
  background: #eee;
  top: 0.9rem;
  padding-top: 0;
  font-size: 0;
  //   padding: 0.2rem 0.1rem;
}
</style>
<style lang="scss">
#wholesale {
  .vux-clocker-tpl {
    font-size: 1px;
  }
  .vux-tab-container{
        border-bottom: 0.02rem solid #ccc;
  }
  .vux-tab {
    .vux-tab-ink-bar {
      background: rgba(0, 0, 0, 0) !important;
    }
    .vux-tab-bar-inner {
      background: #ff4444;
    }
    .vux-tab-item{
        font-size:0.3rem!important;
    }
  }
}
</style>
