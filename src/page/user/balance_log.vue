 <template>
  <div id="balance" class="page ">
    <head-top head-title="积分明细" background="#ff4444" :go-back='true' :rightMenu="true"></head-top>
    <div class="p-a-all" @scroll="handleScroll">
      <div class="list" v-if="list.length>0">
        <div class="item flex-box" v-for="(item,index) in list" :key="index" @click="goto('/user_money_log?id='+item.id)">
          <div>
            <p>{{item.text?item.text:item.type_name}}</p>
            <p class="time">{{item.time}}</p>
          </div>
          <div class="rows" :class="{price:item.sign==0,green:item.sign==1}">{{item.sign?'+':'-'}}{{Math.abs(item.number)}}
          </div>
        </div>
      </div>
      <div class="no_log" v-else>
        <p>暂无明细记录</p>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from "src/components/header/head";
import { getBalanceLog } from "src/service/getData";
export default {
  data() {
    return {
      showAlert: false,
      alertText: null,
      list: [],
      info: { balance: 0 },
      PageNo: 1,
      PageSize: 10,
      isnext: true
    };
  },
  components: {
    headTop
  },
  computed: {},
  beforeMount() {
    this.getLog();
  },
  methods: {
    handleScroll() {
      let dom = this.$el.children[1];
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.PageNo++;
        if (this.isnext) {
          this.getLog();
        }
      }
    },
    goto(url) {
      this.$router.push(url);
    },
    async getLog() {
      this.$vux.loading.show({
        text: "正在获取..."
      });
      let res = await getBalanceLog(2, this.PageNo);
      this.$vux.loading.hide();
      let that = this;
      if (res.code == 1) {
        let list = res.data.list.data;
        this.info = res.data.info;
        this.isnext = this.PageNo <= res.data.list.page_count;
        for (let i = 0; i < list.length; i++) {
          that.list.push(list[i]);
        }
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
  
<style lang="scss" scoped>
@import "src/style/mixin";
.empty-head + div {
  padding-top: 0.85rem;
}
.col-33{
  width: 33%;
}
.green {
  color: #09bb07;
}
.price {
  color: #ff4444;
}
#balance {
  .p-a-all {
    background: #eee;
  }
  .list {
    .item {
      background: #fafafa;
      font-size: 0.3rem;
      padding: 0.2rem 0.25rem;
      align-items: center;
      margin-bottom: 1px;
      .time {
        font-size: 0.22rem;
        color: #999;
      }
    }
  }
}

.content_container {
  padding: 0.3rem;
  background-color: #ff4444;
  .content {
    padding: 0.4rem;
    background-color: #fff;
    border-radius: 0.15rem;
    .content_header {
      @include fj;
      font-size: 0.3rem;
      .contetn_description {
        display: flex;
        align-items: center;
        img {
          @include wh(0.4rem, 0.4rem);
          margin-right: 0.2rem;
        }
        .content_title_style {
          color: $blue;
          font-size: 0.25rem;
        }
      }
      .content_title_style {
        color: #666;
      }
    }
    .content_num {
      span:nth-of-type(1) {
        @include sc(0.6rem, #333);
      }
      span:nth-of-type(2) {
        @include sc(0.3rem, #333);
      }
    }
  }
}
.deal_detail {
  @include sc(0.25rem, #999);
  line-height: 0.8rem;
  padding-left: 0.3rem;
  background: #eee;
}
.no_log {
  text-align: center;
  margin-top: 1rem;
  img {
    @include wh(100%, auto);
  }
  p {
    margin-top: 0.5rem;
    @include sc(0.3rem, #666);
  }
}
.router-slid-enter-active,
.router-slid-leave-active {
  transition: all 0.4s;
}
.router-slid-enter,
.router-slid-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>
<style lang="scss">
#balance {
  .material-icons {
    font-size: 0.4rem;
    color: #999;
  }
  .mu-raised-button {
    background: linear-gradient(to right, #ff4444, #fbac47);
    color: #fff;
    height: 0.8rem;
  }
  .mu-button-wrapper {
    padding: 0 0.8rem;
    color: #fff;
    font-size: 0.3rem;
  }
}
</style>
