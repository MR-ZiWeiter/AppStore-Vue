<template>
    <div class="list" v-if="list.length>0">
        <div @click="check(index)" class="box" v-for="(item,index) in list" :key="index">
            <div class="left">
                <span>￥</span>{{item.money}}
                <p>满{{item.at_least}}元可用</p>
            </div>
            <div class="center">
                <p class="font-size-15 text-color-333">{{item.coupon_name}}</p>
                <p class="font-size-12 text-color-999">{{item.start_time}}-{{item.end_time}}</p>
                <p class="font-size-12 text-color-999">{{item.range_type}}</p>
            </div>
        </div>
        
    </div>
    <div v-else>
        <p style="text-align:center;margin-top:3rem;">没有优惠券</p>
    </div>
</template>
<script>
import {GetShopCouponList} from "src/service/getData";
export default {
    props:['list'],
    data(){
        return {
        }
    },
    mounted(){
    },
    methods:{
        check(index){
            this.$emit('coupon_check', this.list[index] );
        }
    }
};
</script>
<style lang="scss" scoped>
.list {
  position: relative;
  padding: 0.3rem;
  .box {
    margin-bottom: 0.2rem;
    background: #fff;
    padding: 0.3rem;
    position: relative;
    display: flex;
    align-items: center;
    .left {
      width: 1.5rem;
      color: #ff4444;
      font-size: 0.6rem;
      border-right: 1px dashed #666;
      span {
        color: #ff4444;
      }
      p {
        font-size: 0.22rem;
        color: #999;
      }
    }
    .center {
      padding-left: 0.2rem;
      width: calc(100% - 1.7rem);
    }
    // .right {
    //   width: 1.3rem;
    //   display: flex;
    //   justify-content: flex-end;
    //   button {
    //     font-size: 0.24rem;
    //   }
    // }
  }
  .box::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 0.2rem;
    display: block;
    z-index: 9;
    background-image: linear-gradient(
        -45deg,
        #ff4444 25%,
        transparent 25%,
        transparent
      ),
      linear-gradient(-135deg, #ff4444 25%, transparent 25%, transparent),
      linear-gradient(-45deg, transparent 75%, #ff4444 75%),
      linear-gradient(-135deg, transparent 75%, #ff4444 75%);
    background-size: 0.15rem 0.4rem;
    background-repeat: repeat-x, repeat-x;
  }
}
</style>
