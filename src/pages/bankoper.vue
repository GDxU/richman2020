<template>
  <section class="container indexcolor">
    <div class="backee"></div>
    <div class="toplayer">
      <div class="flex-row">
        <div class="clearfix fixpos">
          <p v-show="status===0">目前暂无记录哦！</p>
          <p v-show="status===1">点击加载更多</p>
          <p v-show="status===2">正在获取数据中</p>
          <p v-show="status===3">系统维护</p>
        </div>
        <div v-show="operationPage === 1" class="flex-wrap">
          <div class="rech-top">
            <p>用户名：<span class="red">admin0</span></p>
            <p class="rech-top-right">账户余额：<span class="red" id="balance">{{balance}}</span>元</p>
          </div>
          <div class="rech-money">
            <span class="fl">你的支付宝账号：</span>
            <input type="text" inputmode="latin text" pattern="[\.0-9A-Za-z@]" placeholder="支付宝账号"
                   id="account"
                   v-model="alipay_account_num"/>
          </div>
          <div class="rech-money">
            <span class="fl">请输入充值金额：</span>
            <input type="tel" inputmode="numeric" pattern="[0-9]" placeholder="请输入充值金额" id="money"
                   v-model="refill_amount"/>
            <span class="fl">&nbsp;元</span>
          </div>
        </div>

        <div v-show="operationPage === 4" class="flex-wrap">
          <div class="rech-top">
            <p>撤单</p>
          </div>
          <div class="rech-money">

          </div>
          <div class="rech-money">
          </div>
        </div>
        <div v-show="operationPage === 0" class="flex-wrap">
          <div class="device">
            <div class="top">
              <div class="badge_vip">VIP1</div>
              <div class="device-overlay"></div>
              <div class="editable" :class="edit_status?'active':''">
                <div class="editable__circle">
                  <div class="editable__rotater">
                    <div class="editable__rotater-item">
                      <i class="fa fa-camera"></i>
                    </div>
                  </div>
                  <div class="editable__rotater">
                    <div class="editable__rotater-item">
                      <i class="fa fa-comments"></i>
                    </div>
                  </div>
                  <div class="editable__rotater">
                    <div class="editable__rotater-item">
                      <i class="fa fa-video-camera"></i>
                    </div>
                  </div>
                  <div class="editable__rotater">
                    <div class="editable__rotater-item">
                      <i class="fa fa-user"></i>
                    </div>
                  </div>
                </div>
                <div class="editable__cont">
                  <img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/142996/profile/profile-512_5.jpg"
                       class="editable__cont-img">
                  <span class="editable__cont-edit js-edit" @click="edit_toggle">
                                <i class="fa fa-pencil-square-o"></i>
                                 </span>
                </div>
              </div>
            </div>
            <div class="mid">
              <div class="mid-block">
                <h2 class="mid-number">77</h2>
                <h3 class="mid-text">晋级礼包</h3>
              </div>
              <div class="mid-block">
                <h2 class="mid-number">666</h2>
                <h3 class="mid-text">生日礼金</h3>
              </div>
              <div class="mid-block">
                <h2 class="mid-number">666</h2>
                <h3 class="mid-text">专属客服</h3>
              </div>
            </div>

            <div class="mid">
              <div class="mid-block">
                <h2 class="mid-number">Cell Phone</h2>
                <h3 class="mid-text">手机认证</h3>
              </div>
              <div class="mid-block">
                <h2 class="mid-number">Mail</h2>
                <h3 class="mid-text">邮箱认证</h3>
              </div>

              <div class="mid-block">
                <h2 class="mid-number">Real Name Verification</h2>
                <h3 class="mid-text">实名认证</h3>
              </div>
              <div class="mid-block">
                <h2 class="mid-number">Password</h2>
                <h3 class="mid-text">取款密码</h3>
              </div>
            </div>

            <div class="btm">
              <div class="btm-text">
                <p>1.晋级礼金：玩家达到晋级要求，通过【用户中心】-【我的优惠】-【vip礼金】进行自助晋级。</p>
                <p>2.生日礼金：当天通过【用户中心】-【我的优惠】-【生日礼金】进行领取。逾期视为放弃领取资格。</p>
                <p>3.节日礼金：不定期举行，福利部门主动电话联系VIP会员领取。</p>
                <p>4.再存优惠：自助通过【用户中心】-【我的优惠】-【存送优惠】进行领取。</p>
                <p>5.救援金：自助通过【用户中心】-【我的优惠】-【救援金】进行领取。</p>
              </div>
            </div>
            <div class="second">
              <h2 class="second__h">234234234!</h2>
              <span class="second__back">324234234324</span>
              <a href="https://codepen.io/suez/public/" target="_blank" class="second__other">24234</a>
            </div>
          </div>
        </div>
        <div v-show="operationPage === 2" class="flex-wrap">
          <div class="device">
            <div class="top-b">
              <h2>充币</h2>
            </div>
            <div class="mid">
              <button class="mid-block"
                      :class="currency_type === 'eth'?'active':''"
                      @click="depositeType"
                      data-symbol="eth">
                <h2 class="mid-number">----</h2>
                <h3 class="mid-text">ETH</h3>
              </button>
              <button class="mid-block"
                      :class="currency_type === 'btc'?'active':''"
                      @click="depositeType"
                      data-symbol="btc">
                <h2 class="mid-number">----</h2>
                <h3 class="mid-text">BTC</h3>
              </button>
              <button class="mid-block"
                      :class="currency_type === 'bch'?'active':''"
                      @click="depositeType"
                      data-symbol="bch">
                <h2 class="mid-number">----</h2>
                <h3 class="mid-text">BCH</h3>
              </button>
              <button class="mid-block"
                      :class="currency_type === 'xrp'?'active':''"
                      @click="depositeType"
                      data-symbol="xrp">
                <h2 class="mid-number">----</h2>
                <h3 class="mid-text">XRP</h3>
              </button>
            </div>
            <div class="btm">
              <div class="btm-text">
                <div class="flex-column">
                  <div class="qr-zone flex-column">
                    <vue-qrious value="https://blog.1stg.me/"/>
                    <p class="fl">https://blog.1stg.me/</p>
                    <br>
                    <span class="fl">&nbsp;{{currency_type|uppercase}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="operationPage === 3" class="flex-wrap">
          <div class="device">
            <div class="top-b">
              <h2>提币</h2>
            </div>
            <div class="mid">
              <button class="mid-block"
                      :class="currency_type === 'eth'?'active':''"
                      @click="depositeType"
                      data-symbol="eth">
                <h2 class="mid-number">----</h2>
                <h3 class="mid-text">ETH</h3>
              </button>
              <button class="mid-block"
                      :class="currency_type === 'btc'?'active':''"
                      @click="depositeType"
                      data-symbol="btc">
                <h2 class="mid-number">----</h2>
                <h3 class="mid-text">BTC</h3>
              </button>
              <button class="mid-block"
                      :class="currency_type === 'bch'?'active':''"
                      @click="depositeType"
                      data-symbol="bch">
                <h2 class="mid-number">----</h2>
                <h3 class="mid-text">BCH</h3>
              </button>
              <button class="mid-block"
                      :class="currency_type === 'xrp'?'active':''"
                      @click="depositeType"
                      data-symbol="xrp">
                <h2 class="mid-number">----</h2>
                <h3 class="mid-text">XRP</h3>
              </button>
            </div>
            <div class="btm">
              <div class="btm-text">
                <div class="flex-column">

                  <div class="col-3 input-effect">
                    <input type="text" inputmode="latin text" v-model="alipay_account_num"
                           pattern="[\.0-9A-Za-z@]" class="effect-22"
                           placeholder="">
                    <label>您的令牌钱包地址</label>
                    <span class="focus-bg"></span>
                  </div>
                  <!--    <span class="fl">你的代币金额：</span>
                      <i nput type="tel" inputmode="numeric" pattern="[0-9]" placeholder="你的代币金额"
                             id="token_refill_amount_draw"
                             v-model="refill_amount"/>-->
                  <div class="col-3 input-effect">
                    <input type="tel" v-model="refill_amount" pattern="[0-9]" class="effect-22"
                           placeholder="">
                    <label>你的代币金额</label>
                    <span class="focus-bg"></span>
                  </div>

                  <span class="fl">&nbsp;{{currency_type|uppercase}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="operationPage === 8" class="flex-wrap">
          <div class="device">
            <div class="top-b">
              <h2>PC推荐链接</h2>
            </div>
            <div class="mid">
              <div class="mid-block">
                <h2 class="mid-number">77</h2>
                <h3 class="mid-text" @click="copyLink">{{referralLink}}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-row">
        <div class="clear"></div>
        <ul class="operation_bank">
          <li>
            <button class="operation_btn" @click="eOperate" data-f="0">全部类型</button>
          </li>
          <li>
            <button class="operation_btn" @click="eOperate" data-f="1">在线充值</button>
          </li>
          <li>
            <button class="operation_btn" @click="eOperate" data-f="2">币充值</button>
          </li>
          <li>
            <button class="operation_btn" @click="eOperate" data-f="3">提币</button>
          </li>
          <!-- <li>
               <button class="operation_btn" @click="eOperate" data-f="3">投注记录</button>
           </li>
           <li>
               <button class="operation_btn" @click="eOperate" data-f="4">交易明细</button>
           </li>
           <li>
               <button class="operation_btn" @click="eOperate" data-f="5">我的优惠</button>
           </li>
           <li>
               <button class="operation_btn" @click="eOperate" data-f="6">派奖</button>
           </li>
           <li>
               <button class="operation_btn" @click="eOperate" data-f="7">购彩</button>
           </li>-->
          <li>
            <button class="operation_btn" @click="eOperate" data-f="8">邀请好友</button>
          </li>
          <li>
            <!--     <button class="operation_btn" @click="eOperate" data-f="9">账户安全</button>
             </li>
             <li>
                 <button class="operation_btn" @click="eOperate" data-f="10">活动</button>
             </li>

             <li>
                 <button class="operation_btn" @click="eOperate" data-f="11">拍卖</button>
             </li>

             -->
          <li>
            <nuxt-link to="/">Return</nuxt-link>
          </li>

        </ul>


        <!-- 加载中 -->
        <div class="loading" style="display: none"></div>
        <div class="loading-bg" style="display: none"></div>

        <div class="beet-odds-tips round" id="tip_pop" style="display: none; height:130px;">
          <div class="beet-odds-info f100">
            <div class="beet-money" id="tip_pop_content"
                 style="font-size: 120%; margin-top: 15px; color:#666;">
              号码选择有误
            </div>
          </div>
          <div class="beet-odds-info text-center">
            <button class="btn-que" style="width: 100%;" @click="tipOk"><span>确定</span></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { mapState } from 'vuex'
  import { EventBus } from '../plugins/EventBus'

  export default {
    layout : "default",
    data () {
      return {
        status : 0, //获取投注列表
        dataType : 0,
        operationPage : 0,
        pageIndex : 1, //初始第一页
        balance : 0,
        currency_type : "eth",
        refill_amount : 0,
        alipay_account_num : 0,
        account_f : "",
        referralLink : "",
        edit_status : false,
        token_types : {
          eth : {
            name : "ETH",
          },
          btc : {
            name : "BTC"
          },
          xrp : {
            name : "XRP"
          },
          bch : {
            name : "BCH"
          },
        },
        transType : {
          1 : '第三方支付', 2 : '银行转账', 3 : '快速入款', 4 : '人工入款', 5 : '取消出款',
          6 : '重覆出款', 7 : '存款优惠', 8 : '返点优惠', 9 : '活动优惠', 10 : '负数额度归零',
          11 : '其它', 12 : '优惠补点', 13 : '人工存提-紅利', 16 : '人工转点',
          17 : '汇款优惠', 18 : '首存优惠', 19 : '入款优惠', 20 : '派彩', 21 : '退水',
          22 : '退码', 23 : '返点', 24 : '微信入款', 25 : '支付宝入款', 26 : '退佣',
          27 : '退款', 30 : '出款', 31 : '人工转点', 32 : '公司入款误存', 33 : '出款',
          34 : '会员负数回冲', 35 : '扣除非法下注派彩', 36 : '放弃存款优惠', 37 : '其它',
          38 : '人工扣点', 39 : '人工存提', 40 : '人工存提', 41 : '银行手续费', 42 : '投注'
        },
      }
    },
    computed : {
      ak_sad : {
        get () {
          return this.token_types[this.currency_type].name;
        }
      },
    },
    methods : {
      copyLink (e) {
        const link = e.target.text;
      },
      eOperate (e) {
        this.operationPage = parseInt (e.target.dataset.f);
      },
      depositeType (e) {
        const u = e.target.dataset.symbol;
        if (u !== undefined) {
          this.currency_type = u;
        }
      },
      tipOk (e) {
        console.log (e);
      },
      edit_toggle (e) {
        //console.log (e.target);
        //console.log (e);
        this.edit_status = !this.edit_status;
        //const h = e.target.sta
      },
      setup () {

      }
    },
    mounted : function () {
      let self = this;
      this.$nextTick (self.setup);
    },
    created () {
    }
  }
</script>
