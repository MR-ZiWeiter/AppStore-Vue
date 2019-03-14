<template>
    <div>
        <div class="header">筛选</div>
        <div class="bottom">
            <div @click="reset">重置</div>
            <div @click="confirm">确认</div>
        </div>
        <div class="p-a-all">
            <div class="item">
                <p>价格</p>
                <div class="box">
                    <div class="label " :class="{checked:mipe==''&&mape==''}" @click="setPrice('','')">全部</div>
                    <div class="label" :class="{checked:mipe==item[0]&&mape==item[1]}" @click="setPrice(item[0],item[1])" v-for="(item,index) in info.category_price_grades" :key="index" v-if="item[1]>0">￥{{item[0]}} - ￥{{item[1]}}</div>
                </div>
            </div>
            <div class="item" v-if="info.category_brands">
                <p>品牌</p>
                <div class="box">
                    <div class="label" :class="{checked:brand_id==''}" @click="brand_id=''">全部</div>
                    <div class="label" :class="{checked:brand_id==item.brand_id}" @click="brand_id=item.brand_id" v-for="(item,index) in info.category_brands" :key="index">{{item.brand_name}}</div>
                </div>
            </div>
            <div class="item" v-for="(items,index) in info.attr_or_spec" :key="index">
                <p>{{items.attr_value_name}}</p>
                <div class="box">
                    <div class="label" :class="{checked:!spec[items.attr_value_id]}" @click="delSpec(items.attr_value_id)">全部</div>
                    <div class="label" :class="{checked:spec[items.attr_value_id]==item.value_str}" @click="setSpec(items.attr_value_id,item.value_str)" v-for="(item,key) in items.value_items" :key="key">{{item.value}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: ["info", "history"],
  data() {
    return {
      mipe: "",
      mape: "",
      brand_id: "",
      spec: {}
    };
  },
  beforeMount() {
    if (Object.keys(this.history).length>0) {
      this.mipe = this.history.mipe;
      this.mape = this.history.mape;
      this.brand_id = this.history.brand_id;
      this.spec = this.history.spec;
    }
  },
  methods: {
    setPrice(mipe, mape) {
      this.mipe = mipe;
      this.mape = mape;
    },
    setSpec(attr_value_id, value_str) {
      this.$set(this.spec, attr_value_id, value_str);
    },
    delSpec(attr_value_id) {
      this.$set(this.spec, attr_value_id, "");
    },
    reset() {
      this.mipe = "";
      this.mape = "";
      this.brand_id = "";
      this.spec = {};
    },
    confirm() {
      //   let attr='';
      //   for(let i in this.spec){
      //       attr=attr+this.spec[i]+';';
      //   }
      //   if(attr){
      //       attr=attr.substring(0,attr.length-1);
      //   }
      let obj = {
        mipe: this.mipe,
        mape: this.mape,
        brand_id: this.brand_id,
        spec: this.spec
      };
      this.$emit("screen", obj);
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  text-align: center;
  height: 0.9rem;
  line-height: 0.9rem;
  background: #fff;
}
.p-a-all {
  top: 0.91rem;
  bottom: 0.9rem;
  .item {
    padding: 0.2rem 0.3rem 0.05rem;
    background: #fff;
    margin-bottom: 0.02rem;
    .box {
      display: flex;
      flex-wrap: wrap;
      padding-top: 0.1rem;
    }
  }
  .label {
    max-width: 40%;
    min-width: 20%;
    text-align: center;
    font-size: 0.26rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 0.15rem;
    padding: 0.1rem 0.15rem;
    background: #eee;
    margin-bottom: 0.15rem;
  }
  .label.checked {
    background: #ff4e00;
    color: #fff;
  }
}
.bottom {
  position: absolute;
  bottom: 0;
  padding: 0;
  display: flex;
  width: 100%;
  div {
    width: 50%;
    text-align: center;
    padding: 0.2rem 0;
  }
  div:first-child {
    background: #e8e8e8;
  }
  div:last-child {
    color: #fff;
    background: #ff4e00;
  }
}
</style>
