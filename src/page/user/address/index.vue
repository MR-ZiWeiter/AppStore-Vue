<template>
  <div id="address">
    <head-top head-title="我的收货地址" :go-back='true' :rightMenu="true"></head-top>
    <div class="p-a-all">
      <div class="list">
        <div class="item" v-for="(item,index) in list" :key="index">
          <div class="flex-box">
            <span>{{item.consigner}}</span>
            <span>{{item.mobile}}</span>
          </div>
          <p v-html="item.address_info"></p>
          <div class="flex-box btnlist">
            <div class="v-center" v-if="item.is_default==1"><i class="iconfont icon-xuanzhong"></i>默认地址</div>
            <div class="v-center" @click="setDefault(item.id)" v-else><i class="iconfont icon-iconzhenghe60">设为默认</i></div>
            <div>
              <span @click="edit(item.id)"><i class="iconfont icon-bianji"></i>编辑</span>
              <span @click="del(item.id,index)"><i class="iconfont icon-del"></i>删除</span>
            </div>
          </div>
        </div>
      </div>
      <x-button link="/address_add">新增收货地址</x-button>
    </div>
  </div>
</template>
<script>
import {getUserAddress,delAddress,defaultAddress} from 'src/service/getData';
import headTop from "src/components/header/head";
export default {
  components: {
    headTop
  },
  data() {
    return {
      list: []
    };
  },
  beforeMount(){
    this.getList();
  },
  methods:{
    edit(id){
      this.$router.push('/address_add?id='+id);
    },
    async getList(){
      this.$vux.loading.show({text:'获取中...'});
      let res=await getUserAddress();
      this.$vux.loading.hide();
      if(res.code==1){
        this.list=res.data.data;
      }else{
        this.$vux.toast.text(res.msg,'middle');
      }
    },
    async setDefault(id){
      this.$vux.loading.show({text:'处理中...'});
      let res=await defaultAddress('set',id);
      this.$vux.loading.hide();
      if(res.code==1){
        this.getList();
      }else{
        this.$vux.toast.text(res.msg,'middle');
      }
    },
    async del(id,index){
      this.$vux.loading.show({text:'处理中...'});
      let res=await delAddress(id);
      this.$vux.loading.hide();
      if(res.code==1){
       this.getList();
      //  delete this.list[index];
      }else{
        this.$vux.toast.text(res.msg,'middle');
      }
    }
    
  }
};
</script>
<style lang="scss" scoped>
.v-center{
  display: flex;
  align-items: center;
}
#address {
  button {
    background: #eec242;
    color: #fff;
    font-size: 0.3rem;
    margin: 1rem 0.3rem 0.3rem;
    width: calc(100% - 0.6rem);
  }
  .list{
    .item{
      background: #fff;
      padding:0.2rem 0.3rem;
      margin-bottom: 0.2rem;
      span,p{
        color:#333;
      }
      p{
        border-bottom: 1px solid #ccc;
        padding-bottom: 0.1rem;
      }
      .btnlist{
        padding-top:0.15rem;
      }
    }
  }
}
</style>
<style lang="scss">
#address{
  .iconfont{
    font-size:0.3rem;
  }
}
</style>
