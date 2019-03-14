<template>
  <div id="qrcode">
    <head-top :go-back='true' head-title="我的推广二维码" :rightMenu="true"></head-top>
    <div class="p-a-all">
      <img :src="img" alt="">
    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import { getQrcode } from "src/service/getData";
export default {
  components: { headTop },
  data() {
    return {
      img: ""
    };
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      this.$vux.loading.show({
        text: "正在获取..."
      });
      let res = await getQrcode();
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.img = res.data.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.p-a-all {
  background: #e50112 ;
}
img {
  width: 100%;
}
</style>
