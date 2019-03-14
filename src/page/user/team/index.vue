<template>
  <div id="team">
    <head-top :go-back='true' head-title="我的团队" :rightMenu="true"></head-top>
    <div class="p-a-all" >
      <div class="item" v-for="(item,index) in list" :key="index" >
        <img :src="item.user_headimg" alt=""  @click="goto('/teaminfo?id='+item.promoter_id)">
        <div  @click="goto('/teaminfo?id='+item.promoter_id)">
        <!-- <span v-if="!item.is_yes" class="font-size-12 text-color-999">(未成交)</span> -->
          <p>用户名：{{item.user_name}}</p>
          <p class="text-color-999 font-size-12">等级：<span class="text-color-999 font-size-12" style="color:#FF9800">{{ item.agent_name || item.level_name}}</span></p>
          <p class="text-color-999 font-size-12">团队：<span  class="text-color-999 font-size-12" style="color:#FF9800">{{item.num }} (人)</span><span class="text-color-999 font-size-12" style="color:#FF9800;margin-left:0.3rem;">{{item.salenum || 0}} (台)</span></p>
          <p class="text-color-999 font-size-12">注册时间:{{item.reg_time}}</p>
        </div>
        <i class="iconfont icon-phone_icon" v-if="item.user_tel"  @click="call(item.user_tel)"></i>
      </div>
      <div v-if="list.length==0" style="padding-top:20%;text-align:center">没有团队成员</div>
    </div>
  </div>
</template>
<script>
import { teamlist } from "src/service/getData";
import headTop from "src/components/header/head";
import { dateFormat } from "vux";
export default {
  components: { headTop },
  data() {
    return {
      list: [],
      isnext:true
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
    handleScroll() {
      let dom = this.$el.children[1];
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.PageNo++;
        if (this.isnext) {
          this.getList();
        }
      }
    },
    goto(url){
      this.$router.push(url);
    },
    call: function(phone) {
      window.location.href = "tel://" + phone;
    },
    async getList() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await teamlist();
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.isnext=res.data.length>0;
        let that=this;
        for(let i in res.data){
          that.list.push(res.data[i]);
        }
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.p-a-all {
  .item {
    background: #fff;
    margin-bottom: 0.2rem;
    padding: 0.2rem 0.3rem;
    display: flex;
    align-items: center;
    img {
      width: 1rem;
      height: 1rem;
      margin-right: 0.2rem;
      background: #eee;
      border-radius: 50%;
    }
    .iconfont {
      position: absolute;
      right: 0.3rem;
    }
    div p:first-child {
      color: #333;
    }
    div p {
      margin: 0.05rem;
    }
  }
}
</style>
