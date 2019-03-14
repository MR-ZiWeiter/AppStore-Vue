<template>
    <div class=" p-a-all" @scroll="handleScroll">
        <div class="list">
            <div class="item" v-for="(item,index) in list" :key="index">
                <p>{{item.goods_name}}</p>
                <div class="flex-box">
                    <span class="price">商品价格:({{item.goods_money}})</span>
                </div>
                <div class="flex-box">
                    <span class="text-color-666">订单号({{item.order_no}})</span>
                    <span>商品分成比例:({{item.goods_commission_rate}}%)</span>
                </div>
                <div class="flex-box">
                    <span class="text-color-666">佣金比例({{item.commission_rate}}%)</span>
                    <span class="price">佣金:({{item.commission_money|price}})</span>
                </div>
                <div class="flex-box">
                    <span class="text-color-666">创建时间({{item.create_time}})</span>
                    <span>{{item.is_issue}}</span>
                </div>
            </div>
            <div v-if="list.length==0" style="text-align: center;padding-top:20%;width:100%;">还没有记录</div>
        </div>
    </div>
</template>

<script>
import { getTeamOrderList } from "src/service/getData";
export default {
  data() {
    return {
      page: 1,
      list: [],
      page_count: 1,
      check: this.$route.query.order_type
    };
  },
  watch: {
    $route(val) {
      this.check = val.query.order_type;
      this.rush();
    }
  },
  filters: {
    price(val) {
      return parseFloat(val).toFixed(2);
    }
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    rush() {
      this.page = 1;
      this.page_count = 1;
      this.list = [];
      this.getList();
    },
    goto(url) {
      this.$router.push(url);
    },
    handleScroll() {
      let dom = this.$el;
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.page++;
        if (this.page <= this.page_count) {
          this.getList();
        }
      }
    },
    async getList() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await getTeamOrderList(
        this.$route.query.id,
        this.$route.query.type,
        this.page,
        this.check
      );
      this.$vux.loading.hide();
      if (res.code == 1) {
        let that = this;
        for (let i in res.data.list) {
          that.list.push(res.data.list[i]);
        }
        this.page_count = res.data.page_total;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.item {
  width: 100%;
  padding: 0.3rem;
  margin-bottom: 1px;
  font-size: 0.3rem;
  background: #fff;
  border-bottom: 1px solid #eee;
  p {
    font-size: 0.26rem;
    display: flex;
    color: #007aff;
  }
}
button {
  height: 0.8rem;
  font-size: 0.3rem;
  color: #666;
  margin-top: 1rem;
}
.list {
  display: flex;
  flex-wrap: wrap;
  .flex-box {
    width: 100%;

    span {
      font-size: 0.24rem;
    }
  }
}
</style>
