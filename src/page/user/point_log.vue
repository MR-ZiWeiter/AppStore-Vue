 <template>
  <div id="point" class="page ">
    <head-top :head-title="(appConfig.word?appConfig.word.point:'积分')+'明细'" background="#ff4444" :go-back='true'></head-top>
    <div class="p-a-all" @scroll="handleScroll">
      <div class="list" v-if="list.length>0">
        <div class="item flex-box" v-for="(item,index) in list" :key="index" @click="goto('/user_money_log?id='+item.id)">
          <div>
            <p>{{item.text}}</p>
            <p class="time">{{item.time}}</p>
          </div>
          <div class="rows" :class="{price:item.sign==0,green:item.sign==1}">{{item.sign?'+':'-'}}{{Math.abs(item.number)}}
          </div>
        </div>
      </div>
      <div class="no_log" v-else>
        <!-- <img src="../../images/no-log.png"> -->
        <p>暂无明细记录</p>
      </div>
      <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
      <transition name="router-slid" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

  </div>
</template>

<script>
import headTop from "src/components/header/head";
import alertTip from "src/components/common/alertTip";
import { getBalanceLog } from "src/service/getData";
import { mapState } from "vuex";
export default {
  data() {
    return {
      showAlert: false,
      alertText: null,
      list: [],
      info: { point: 0 },
      PageNo: 1,
      PageSize: 10,
      isnext: true
    };
  },
  components: {
    headTop,
    alertTip
  },
   computed:{
    ...mapState({
      appConfig: state => state.config.appConfig
    })
  },
  mounted() {
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
      let res = await getBalanceLog(1, this.PageNo);
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
#point {
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
</style>
