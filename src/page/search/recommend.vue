<template>
    <div id="outh">
        <head-top :go-back='true' head-title="推荐商品" :rightMenu="true"></head-top>
        <div class="p-a-all" @scroll="handleScroll">
            <good-list :list="list" v-if="list.length>0"></good-list>
        </div>
    </div>
</template>
<script>
import { getGoodsList } from "src/service/getData";
import headTop from "src/components/header/head";
import goodList from "./components/list";
import { mapState, mapActions } from "vuex";
export default {
  components: { headTop, goodList },
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
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    handleScroll() {
      let dom = this.$el.children[1];
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.page++;
        if (this.page <= this.page_count) {
          this.getgoods();
        }
      }
    },
    async getList() {
      let that = this;
      this.$vux.loading.show({
        text: "正在获取"
      });
      let res = await getGoodsList();
      this.$vux.loading.hide();
      if (res.code == 1) {
        let list = res.data.data;
        this.page_count = res.data.page_count;
        for (let i in list) {
          that.list.push(list[i]);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#outh {
  .sendcode {
    display: inline-block;
    position: absolute;
    right: 0.2rem;
    z-index: 10;
    padding: 0.1rem 0.2rem;
    background: #ff4444;
    font-size: 0.24rem;
    color: #fff;
    border-radius: 0.1rem;
    top: 0.15rem;
  }
  .sended {
    background: #ccc;
  }
  .btn {
    width: 80%;
    margin: 0.3rem auto;
    text-align: center;
    background: #ff4444;
    color: #fff;
    padding: 0.2rem 0;
    border-radius: 0.1rem;
  }
}
</style>
<style lang="scss">
#outh {
  .weui-cell__hd {
    width: 1.5rem !important;
  }
  .weui-btn {
    font-size: 0.22rem;
  }
}
</style>
