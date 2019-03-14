<template>
  <div id="category">
    <head-top :go-back='false' head-title="分类"></head-top>
    <div class="p-a-all" >
      <div class="left">
        <div @click="check=index" :class="{active:(index==check)}" v-for="(item,index) in list" :key="index">
          {{item.category_name}}
        </div>
      </div>
      <div class="right" v-if="list[check]">
        <div style="padding:0.2rem 0.3rem;color:#666;">
          <div class="btn" @click="goto('/searchgoods?category='+list[check].category_id)">{{list[check].category_name}}</div>
        </div>
        <div v-for="(items,index) in right" :key="index">
          <div class="flex-box " @click="goto('/searchgoods?category='+items.category_id)">
            <span>{{items.category_name}}</span>
            <i class="iconfont icon-right"></i>
          </div>
          <div class="item-box">
            <div class="col-33" @click="goto('/searchgoods?category='+item.category_id)" v-for="(item,key) in items.child_list" :key="key">
              <span>{{item.category_name}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import { goodsCategoryList } from "src/service/getData";
import { ButtonTab, ButtonTabItem } from "vux";
export default {
  components: {
    headTop,
    ButtonTab,
    ButtonTabItem
  },
  data() {
    return {
      type: this.$route.query.type?parseInt(this.$route.query.type):0,
      list: [],
      serviceList: [],
      check: 0,
      right: []
    };
  },
  watch: {
    check(value) {
      if (this.type == 0) {
        this.right = this.list[value].child_list;
      } else {
        this.right = this.serviceList[value].child_list;
      }
    }
  },
  async beforeMount() {
    this.getcategory();
  },
  methods: {
    upCategory() {
      this.$router.replace("category?type=" + this.type);
      this.check = 0;
      if (this.type == 0) {
        this.right = this.list[0].child_list;
      } else {
        this.right = this.serviceList[0].child_list;
      }
    },
    goto(url) {
      this.$router.push(url);
    },
    checkLeft(index) {
      this.left_index = index;
    },
    async getcategory() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await goodsCategoryList();
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.list = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#category {
  .btn {
    padding: 0.15rem 0.3rem;
    background: #ff4e00;
    color: #fff;
    text-align: center;
    font-size: 0.26rem;
    border-radius: 0.1rem;
  }
  .p-a-all {
    // top: 1rem;
    bottom: 1rem;
    justify-content: space-between;
    .col-33 {
      width: 33.3333333%;
    }
    .img-size-box {
      span {
        font-size: 0.25rem;
        color: #666;
      }
    }
    .left {
      width: 23%;
      overflow-y: auto;
      padding: 0.1rem;
      div {
        padding: 0.25rem 0.1rem;
        border-bottom: 1px solid #ccc;
        text-align: center;
        font-size: 0.24rem;
      }
      div.active {
        border-color: #ff4444;
      }
    }
    .right {
      background: #fff;
      height: 100%;
      width: 75%;
      overflow-y: auto;
      span {
        font-size: 0.26rem;
      }
      .flex-box {
        padding: 0.2rem;
        border-bottom: 1px solid #ccc;

        i {
          color: #666;
          font-size: 0.26rem;
        }
      }
      .item-box {
        border-bottom: 1px solid #ccc;
        display: flex;
        flex-wrap: wrap;
        .col-33 {
          text-align: center;
          padding: 0.2rem 0;
        }
      }
    }
  }
}
</style>
<style>
.vux-button-group {
  padding: 0.2rem;
}
.vux-button-group > a {
  font-size: 0.3rem !important;
}
.vux-button-group > a.vux-button-group-current {
  background: #ff4e00 !important;
}
.vux-button-group > a.vux-button-tab-item-first:after {
  border-color: #ff4e00 !important;
  border-top-left-radius: 0.5rem !important;
  border-bottom-left-radius: 0.5rem !important;
}
.vux-button-group > a.vux-button-tab-item-last:after {
  border-color: #ff4e00 !important;
  border-top-right-radius: 0.5rem !important;
  border-bottom-right-radius: 0.5rem !important;
}
</style>
