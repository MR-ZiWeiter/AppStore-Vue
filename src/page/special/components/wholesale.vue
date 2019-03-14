<template>
    <div class="wholesale p-a-all"  @scroll="handleScroll">
        <div class="item" v-for="(item,index) in list" :key="index">
            <img :src="item.pic_cover_mid" alt="" :onerror="local_default_goods_img">
            <div class="item-info">
                <p style="height:38%;" class="ellipsis-2 font-size-14">{{item.goods_name}}</p>
                <p style="height:29%;">
                    <clocker v-if="now<item.start_time" :time="item.start_time|date">
                        <span class="end time-label">%_D1</span>
                        <span class="end time-label">%_D2</span>
                        <span>天</span>
                        <span class="end time-label">%_H1</span>
                        <span class="end time-label">%_H2</span>
                        <span>:</span>
                        <span class="end time-label">%_M1</span>
                        <span class="end time-label">%_M2</span>
                        <span>:</span>
                        <span class="end time-label">%_S1</span>
                        <span class="end time-label">%_S2</span>
                    </clocker>
                    <clocker v-else-if="now<item.end_time&&item.stock>0" :time="item.end_time|date">
                        <span class="time-label">%_D1</span>
                        <span class="time-label">%_D2</span>
                        <span>天</span>
                        <span class="time-label">%_H1</span>
                        <span class="time-label">%_H2</span>
                        <span>:</span>
                        <span class="time-label">%_M1</span>
                        <span class="time-label">%_M2</span>
                        <span>:</span>
                        <span class="time-label">%_S1</span>
                        <span class="time-label">%_S2</span>
                    </clocker>
                    <clocker v-else>
                        <span class="end time-label">0</span>
                        <span class="end time-label">0</span>
                        <span>天</span>
                        <span class="end time-label">0</span>
                        <span class="end time-label">0</span>
                        <span>:</span>
                        <span class="end time-label">0</span>
                        <span class="end time-label">0</span>
                        <span>:</span>
                        <span class="end time-label">0</span>
                        <span class="end time-label">0</span>
                    </clocker>
                </p>
                <div style="height:33%;" class="flex-box">
                    <div>
                        <p class="price">限时价</p>
                        <p class="price" v-if="item.max_price==item.min_price">{{item.max_price}}</p>
                        <p class="price" v-else>{{item.min_price}} - {{item.max_price}}</p>
                    </div>
                    <div class="btn end" v-if="now<item.start_time">即将开始</div>
                    <div class="btn" v-else-if="now<item.end_time&&item.stock>0" @click="goto('/goods?id='+item.goods_id)">去抢购</div>
                    <div class="btn end" v-else-if="item.stock==0">已售罄</div>
                    <div class="btn end" v-else>已结束</div>
                </div>
            </div>
        </div>
        <div v-if="list.length==0" style="padding-top:20%;text-align:center;">没有批发商品</div>
    </div>
</template>
<script>
import {
  goodsList,
  WholesaleGoodsList,
  WholesaleSoon
} from "src/service/getData";
import { dateFormat } from "vux";
export default {
  props: ["type"],
  data() {
    return {
      list: [],
      page: 1,
      page_count: 1,
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  computed: {
    now() {
      return new Date().getTime() / 1000;
    }
  },
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  beforeMount() {
    this.getList();
  },
  methods: {
      handleScroll() {
      let dom = this.$el;
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.page++;
        if (this.page<=this.page_count) {
          this.getList();
        }
      }
    },
    goto(url) {
      this.$router.push(url);
    },
    async getList() {
      let res;
      this.$vux.loading.show({ text: "获取中..." });
      if (this.type == 0) {
        res = await WholesaleGoodsList(this.page);
      } else {
        res = await WholesaleSoon(this.page);
      }
      this.$vux.loading.hide();
      if (res.code == 1) {
        let that = this;
        for (let i in res.data.data) {
          that.list.push(res.data.data[i]);
        }
        this.page_count = res.data.page_count;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wholesale {
  top: 4.05rem;
  padding: 0.1rem;
}
.item {
  padding: 0.2rem;
  background: #fff;
  border-radius: 0.1rem;
  display: flex;
  margin-bottom: 0.2rem;
  img {
    width: 2.3rem;
    height: 2.3rem;
    background: #eee;
  }
  .item-info {
    width: calc(100% - 2.48rem);
    margin-left: 0.2rem;
    .btn {
      color: #fff;
      background: linear-gradient(#ff7d67, #fe555b);
      text-align: center;
      padding: 0.1rem 0.2rem;
      border-radius: 0.3rem;
      font-size: 0.28rem;
    }
  }
}
.end {
  background: linear-gradient(#8c8c8c, #aeaeae) !important;
}
.time-label {
  color: #fff;
  padding: 0.05rem 0.1rem;
  font-size: 0.26rem;
  background: linear-gradient(#ff7d67, #fe555b);
  text-align: center;
  border-radius: 0.1rem;
}
</style>
