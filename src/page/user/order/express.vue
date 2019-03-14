<template>
    <div id="express">
        <head-top :go-back='true' head-title="已发货订单" :rightMenu="true"></head-top>
        <div class="p-a-all">
            <!-- <div class="top">
                <p v-if="info.goods_packet_list.express_name">快递公司 : {{info.goods_packet_list.express_name}}</p>
                <p v-if="info.goods_packet_list.express_code">快递单号 : {{info.goods_packet_list.express_code}}</p>
            </div> -->
            <div class="bg-white">
                <timeline>
                    <timeline-item v-for="(item,index) in list" :key="index">
                        <p class="text-color-333">{{item.AcceptStation}}</p>
                        <p class="text-color-999">{{item.AcceptTime}}</p>
                    </timeline-item>
                </timeline>
            </div>

        </div>
    </div>
</template>
<script>
import headTop from "src/components/header/head";
import { getOrderGoodsExpressMessage } from "src/service/getData";
import { TimelineItem } from "vux";
export default {
  components: { headTop, TimelineItem },
  data() {
    return {
      info: {},
      list:[]
    };
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    goto(url) {
      this.$router.push(url);
    },
    async getInfo() {
      this.$vux.loading.show({ text: "正在获取中......" });
      let res = await getOrderGoodsExpressMessage(this.$route.query.id);
      this.$vux.loading.hide();
      if (res.code == 1&&res.data.Success) {
        this.info = res.data;
        this.list=res.data.Traces
        // if (res.data.express_info == -1) {
        //   this.$vux.toast.text('物流信息错误', "middle");
        //   setTimeout(() => {
        //     this.$router.go(-1);
        //   });
        // }
      } else {
        this.$vux.toast.text(res.msg, "middle");
        setTimeout(() => {
          this.$router.go(-1);
        },2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#express {
  .p-a-all {
    background: #eee;
    p{
      display: flex;
    }
  }
}
</style>
