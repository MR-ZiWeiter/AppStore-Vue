<template>
  <div id="secondlist">
    <head-top :go-back='true' head-title="二手市场" :rightMenu="true"></head-top>
    <div class="p-a-all">
      <div class="item" v-for="(items,key) in list" :key="key">
        <div @click="goto('/goods?id='+item.goods_id)" class="goods flex-box" v-for="(item,key) in items.order_item_list" :key="key">
          <img :src="item.picture.pic_cover_small" alt="" :onerror="local_default_goods_img">
          <div class="good-info">
            <p class="ellipsis">{{item.goods_name}}</p>
            <p class="font-size-12 text-color-999">{{item.sku_name}}</p>
            <p class="price font-size-12">
              <span class="text-color-999 font-size-12"> x {{item.num}}</span>
            </p>
            <div class="time">{{items.create_time}}</div>
          </div>
        </div>
        <p style="color:#ff4444;padding:0.2rem 0;text-align:right">转售价:￥{{items.toprice}}</p>
        <div class="buttons">
          <div @click="read(key)">查看联系方式</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { AlertModule } from 'vux'
import { ResellerOrderList } from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: { headTop },
  data() {
    return {
      page: 1,
      list: [],
      page_count: 1,
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    goto(url) {
      this.$router.push(url);
    },
    read(index){
      let that=this;
      AlertModule.show({
        title: '查看联系方式',
        content: that.list[index].user_tel,
        onShow () {
        },
        onHide () {
        }
      })
    },
    async getList() {
      this.$vux.loading.show({ text: "处理中..." });
      let res = await ResellerOrderList();
      this.$vux.loading.hide();
      // this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        this.list = res.data.data;
        this.page_count = res.data.page_count;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#secondlist {
  .p-a-all {
    background: #eee;
    .item {
      padding: 0.3rem;
      margin-bottom: 1px;
      font-size: 0.3rem;
      background: #fff;
      margin-bottom: 0.1rem;
    }
    button {
      height: 0.8rem;
      font-size: 0.3rem;
      color: #666;
      margin-top: 1rem;
    }
  }
  .item .goods:last-child {
    border-bottom: 0;
  }
  .goods {
    background: #fafafa;
    padding: 0.2rem;
    border-bottom: 1px solid #eee;
    p {
      font-size: 0.28rem;
      text-align: right;
    }
    img {
      width: 1.5rem;
      height: 1.5rem;
      background: #eee;
    }
    .time {
      font-size: 0.24rem;
      color: #666;
      background-color: #eeeeee;
      padding: 0.03rem 0.06rem;
    }
  }
   .buttons {
    display: flex;
    justify-content: flex-end;
    padding: 0.2rem 0.3rem;
    background: #fff;
    div {
      font-size: 0.26rem;
      padding: 0.1rem;
      color: #333;
      border: 1px solid #999;
      border-radius: 0.1rem;
      margin-left: 0.15rem;
      box-shadow: 3px 3px 0 0 #ded6d6;
    }
  }
}
</style>

