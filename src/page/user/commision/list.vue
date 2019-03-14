<template>
  <div id="set">
    <head-top :go-back='true' :head-title="$route.query.title" :rightMenu="true"></head-top>
    <div class="p-a-all" @scroll="handleScroll">
      <div class="list">
        <div class="item" v-for="(item,index) in list" :key="index" @click="goto('/commision_orderinfo?id='+item.id+'&type='+item.class,item.type)">
          <div class="flex-box">
            <span class="text-color-666">{{item.create_time}}</span>
            <span>{{item.money|price}}</span>
          </div>
          <div class="flex-box">
            <span class="text-color-666" style="color:#007aff">{{item.user_name}}</span>
            <!-- <span>{{item.money|price}}积分</span> -->
          </div>
        </div>
      </div>
      <div v-if="list.length==0" style="text-align: center;padding-top:20%;">还没有记录</div>
    </div>
  </div>
</template>
<script>
import { getCommissionDetail } from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: { headTop },
  data() {
    return {
      page: 1,
      list: [],
      page_count: 1
    };
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
    goto(url, type) {
      if (!type) {
        return false;
      }
      this.$router.push(url);
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
      this.$vux.loading.show({ text: "获取中..." });
      let res = await getCommissionDetail(this.$route.query.id, this.page);
      this.$vux.loading.hide();
      if (res.code == 1) {
        let that = this;
        for (let i in res.data.data) {
          that.list.push(res.data.data[i]);
        }
        this.page_count = res.data.page_count;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#set {
  .p-a-all {
    background: #eee;
    .item {
      padding: 0.3rem;
      margin-bottom: 1px;
      font-size: 0.3rem;
      background: #fafafa;
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
      .item {
        width: 100%;
        padding: 0.3rem;
        background: #fff;
        border-bottom: 1px solid #eee;
        span:last-child {
          color: #ff4444;
        }
      }
    }
  }
}
</style>
