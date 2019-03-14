<template>
  <div id="recharge-list">
    <head-top :go-back='true' head-title="充值记录" :rightMenu="true"></head-top>
    <div class="p-a-all" @scroll="handleScroll">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="flex-box">
          <div class="price"> ￥{{item.recharge_money}} </div>
          <p>{{getPayType(item.pay_type)}}</p>
          
        </div>
        <div class="flex-box">
          <p class="font-size-13 text-color-999">{{item.create_time|date}}</p>
          <div class="text-color-999">{{getStatus(index)}}</div>
        </div>
      </div>
      <div v-if="list.length==0" style="padding-top:20%;text-align:center;color:#666;">没有记录</div>
    </div>
  </div>
</template>
<script>
import { rechargeList } from "src/service/getData";
import headTop from "src/components/header/head";
import { dateFormat } from "vux";
export default {
  components: { headTop },
  data() {
    return {
      list: [],
      page: 1,
      page_count: 1
    };
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
    getPayType(type) {
      switch (type) {
        case 0:
          return "银行卡";
        case 1:
          return "支付宝";
        case 2:
          return "微信";
      }
    },
    getStatus(index) {
     
      let obj = this.list[index];
      if (obj.xx_status !== null) {
        switch (obj.xx_status) {
          case 0:
            return "待审核";
          case 1:
            return "已完成";
        }
      } else if (obj.pay_status!==null) {
        switch (obj.pay_status) {
          case 0:
            return "未支付";
          case 1:
            return "已支付";
        }
      }else{
        return '未支付';
      }
    },
    handleScroll() {
      let dom = this.$el.children[1];
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.page++;
        if (this.page <= this.page_count) {
          this.getList();
        }
      }
    },
    async getList() {
      this.$vux.loading.show({ text: "加载中" });
      let res = await rechargeList(this.page);
      this.$vux.loading.hide();
      if (res.code == 1) {
        let that = this;
        this.page_count = res.data.page_count;
        for (let i in res.data.list) {
          that.list.push(res.data.list[i]);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.item {
  padding: 0.2rem 0.3rem;
  background: #fff;
  margin-bottom: 0.05rem;
}
.flex-box {
  width: 100%;
}
</style>
