<template>
    <div id="commision-log-1" class="p-a-all" :class="{'top':type==0,'top-1':type==1}" @scroll="handleScroll">
      <div v-if="list.length==0" style="text-align: center;padding-top:40%;">还没有记录</div>
       <div class="flex-box" v-for="(item,index) in list" :key="index">
           <div>
               <p>{{item.type_name}}</p>
               <p class="font-size-13 text-color-999">{{item.create_time}}</p>
           </div>
           <span class="price">{{item.money}}</span>
       </div>
    </div>
</template>
<script>
import {commissionindex} from 'src/service/getData';
export default {
  props:['type'],
  data() {
    return {
      list: [],
      page:1,
      page_count:1
    };
  },
  beforeMount(){
    this.getList();
  },
  methods:{
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
      let res = await commissionindex( this.page);
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
.flex-box{
    padding:0.2rem 0.3rem;
    background: #fff;
    margin-bottom: 1px;
}
.top{
  top:1.7rem!important;
}
.top-1{
  top:1rem!important;
}
</style>
