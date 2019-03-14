<template>
    <div class="home">
        <header-page></header-page>
        <main-html class="p-a-all"></main-html>
    </div>
</template>
<script>
import headerPage from "src/components/index/header";
import mainHtml from "src/components/index/main";
import { indexpage } from "src/service/getData";
export default {
  components: { headerPage, mainHtml },
  data() {
    return {
      isAddress: true,
      info: {},
      id:''
    };
  },
  beforeMount() {
    //this.getInfo();
  },
  methods: {
    async getInfo(id) {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await indexpage(id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
      }else{
          this.$vux.toast.text(res.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.p-a-all {
  top: 1rem;
  bottom: 1rem;
}
.home {
  padding-top: 0.9rem;
  .menulist {
    white-space: nowrap;
    padding: 0 0.2rem;
    height: 0.81rem;
    width: 100%;
    overflow-x: scroll;
    background: #fff;
    .item {
      display: inline-block;
      padding: 0.2rem;
    }
    .item.checked {
      color: #f5326e;
      border-bottom: 1px solid #f5326e;
      box-sizing: border-box;
    }
  }
}
</style>
 