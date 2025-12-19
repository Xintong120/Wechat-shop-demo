const WXAPI = require('apifm-wxapi')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
const MOCK_DATA = require('../../utils/mock-data.js')
const APP = getApp()

Page({
  data: {
    inputVal: "", // 搜索框内容
    goodsRecommend: [], // 推荐商品
    kanjiaList: [], //砍价商品列表
    pingtuanList: [], //拼团商品列表
    loadingHidden: false, // loading
    selectCurrent: 0,
    categories: [],
    goods: [],
    loadingMoreHidden: true,
    coupons: [],
    curPage: 1,
    pageSize: 20
  },
  tabClick(e) {
    // 商品分类点击
    const category = this.data.categories.find(ele => {
      return ele.id == e.currentTarget.dataset.id
    })
    if (category.vopCid1 || category.vopCid2) {
      wx.navigateTo({
        url: '/pages/goods/list-vop?cid1=' + (category.vopCid1 ? category.vopCid1 : '') + '&cid2=' + (category.vopCid2 ? category.vopCid2 : ''),
      })
    } else {
      wx.setStorageSync("_categoryId", category.id)
      wx.switchTab({
        url: '/pages/category/category',
      })
    }
  },
  tabClickCms(e) {
    // 文章分类点击
    const category = this.data.cmsCategories[e.currentTarget.dataset.idx]
    wx.navigateTo({
      url: '/pages/cms/list?categoryId=' + category.id,
    })
  },
  toDetailsTap: function(e) {
    console.log(e);
    const id = e.currentTarget.dataset.id
    const supplytype = e.currentTarget.dataset.supplytype
    const yyId = e.currentTarget.dataset.yyid
    if (supplytype == 'cps_jd') {
      wx.navigateTo({
        url: `/packageCps/pages/goods-details/cps-jd?id=${id}`,
      })
    } else if (supplytype == 'vop_jd') {
      wx.navigateTo({
        url: `/pages/goods-details/vop?id=${yyId}&goodsId=${id}`,
      })
    } else if (supplytype == 'cps_pdd') {
      wx.navigateTo({
        url: `/packageCps/pages/goods-details/cps-pdd?id=${id}`,
      })
    } else if (supplytype == 'cps_taobao') {
      wx.navigateTo({
        url: `/packageCps/pages/goods-details/cps-taobao?id=${id}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/goods-details/index?id=${id}`,
      })
    }
  },
  tapBanner(e) {
    const item = e.currentTarget.dataset.item
    if (item.linkType == 1) {
      // 跳小程序
      wx.navigateToMiniProgram({
        appId: item.appid,
        path: item.linkUrl || '',
      })
    } else {
      if (item.linkUrl) {
        wx.navigateTo({
          url: item.linkUrl
        })
      }
    }
  },
  adClick: function(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  bindTypeTap: function(e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  onLoad: function(e) {
    wx.showShareMenu({
      withShareTicket: true,
    })
    const that = this
    // 读取分享链接中的邀请人编号
    if (e && e.inviter_id) {
      wx.setStorageSync('referrer', e.inviter_id)
    }
    // 读取小程序码中的邀请人编号
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene)
      if (scene) {        
        wx.setStorageSync('referrer', scene.substring(11))
      }
    }
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        TOOLS.showTabBarBadge()
      } else {
        getApp().loginOK = () => {
          TOOLS.showTabBarBadge()
        }
      }
    })
    this.initBanners()
    this.cmsCategories()
    // 使用模拟数据
    this.setData({
      goodsRecommend: MOCK_DATA.goodsRecommend
    })
    that.getCoupons()
    that.getNotice()
    that.kanjiaGoods()
    that.pingtuanGoods()
    this.adPosition()
    // 读取系统参数
    this.readConfigVal()
    getApp().configLoadOK = () => {
      this.readConfigVal()
    }
  },
  readConfigVal() {
    const mallName = wx.getStorageSync('mallName')
    if (!mallName) {
      return
    }
    this.categories()
    wx.setNavigationBarTitle({
      title: mallName
    })
    this.setData({
      mallName:wx.getStorageSync('mallName')?wx.getStorageSync('mallName'):'',
      show_buy_dynamic: wx.getStorageSync('show_buy_dynamic'),
      hidden_goods_index: wx.getStorageSync('hidden_goods_index'),
    })
    const shopMod = wx.getStorageSync('shopMod')
    const shopInfo = wx.getStorageSync('shopInfo')
    if (shopMod == '1' && !shopInfo) {
      wx.redirectTo({
        url: '/pages/shop/select'
      })
    }
  },
  async miaoshaGoods(){
    // 使用模拟数据
    const miaoshaGoods = MOCK_DATA.miaoshaGoods.map(ele => {
      const _now = new Date().getTime()
      if (ele.dateStart) {
        ele.dateStartInt = new Date(ele.dateStart.replace(/-/g, '/')).getTime() - _now
      }
      if (ele.dateEnd) {
        ele.dateEndInt = new Date(ele.dateEnd.replace(/-/g, '/')).getTime() - _now
      }
      return ele
    })
    this.setData({
      miaoshaGoods: miaoshaGoods
    })
  },
  async initBanners(){
    // 使用模拟数据
    this.setData({
      banners: MOCK_DATA.banners
    })
  },
  onShow: function(e){
    this.setData({
      navHeight: APP.globalData.navHeight,
      navTop: APP.globalData.navTop,
      windowHeight: APP.globalData.windowHeight,
      menuButtonObject: APP.globalData.menuButtonObject //小程序胶囊信息
    })
    this.setData({
      shopInfo: wx.getStorageSync('shopInfo')
    })
    // 获取购物车数据，显示TabBarBadge
    TOOLS.showTabBarBadge()
    this.goodsDynamic()
    this.miaoshaGoods()
    const refreshIndex = wx.getStorageSync('refreshIndex')
    if (refreshIndex) {
      this.onPullDownRefresh()
      wx.removeStorageSync('refreshIndex')
    }
  },
  async goodsDynamic(){
    // 使用模拟数据 - 空数组
    this.setData({
      goodsDynamic: []
    })
  },
  async categories(){
    // 使用模拟数据
    this.setData({
      categories: MOCK_DATA.categories,
      curPage: 1
    });
    this.getGoodsList(0);
  },
  async getGoodsList(categoryId, append) {
    wx.showLoading({
      title: ''
    })
    // 使用模拟数据
    setTimeout(() => {
      wx.hideLoading()
      let goods = [];
      if (append) {
        goods = this.data.goods
      }
      // 模拟分页
      const startIndex = (this.data.curPage - 1) * this.data.pageSize
      const endIndex = startIndex + this.data.pageSize
      const pageGoods = MOCK_DATA.goods.slice(startIndex, endIndex)

      goods = goods.concat(pageGoods)
      this.setData({
        loadingMoreHidden: pageGoods.length < this.data.pageSize,
        goods: goods,
      });
    }, 500) // 模拟网络延迟
  },
  getCoupons: function() {
    // 使用模拟数据
    this.setData({
      coupons: MOCK_DATA.coupons
    });
  },
  onShareAppMessage: function() {    
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + wx.getStorageSync('share_profile'),
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
    }
  },
  onShareTimeline() {    
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + wx.getStorageSync('share_profile'),
      query: 'inviter_id=' + wx.getStorageSync('uid'),
      imageUrl: wx.getStorageSync('share_pic')
    }
  },
  getNotice: function() {
    // 使用模拟数据
    this.setData({
      noticeList: MOCK_DATA.noticeList
    });
  },
  onReachBottom: function() {
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.getGoodsList(0, true)
  },
  onPullDownRefresh: function() {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(0)
    wx.stopPullDownRefresh()
  },
  // 获取砍价商品
  async kanjiaGoods(){
    // 使用模拟数据
    this.setData({
      kanjiaList: MOCK_DATA.kanjiaList
    })
  },
  goCoupons: function (e) {
    wx.switchTab({
      url: "/pages/coupons/index"
    })
  },
  pingtuanGoods(){ // 获取团购商品列表
    // 使用模拟数据
    this.setData({
      pingtuanList: MOCK_DATA.pingtuanList
    })
  },
  goSearch(){
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },
  goNotice(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/notice/show?id=' + id,
    })
  },
  async adPosition() {
    // 使用模拟数据 - 空数据，不显示广告
    this.setData({
      adPositionIndexPop: null,
      adPositionIndexLivePic: null
    })
  },
  clickAdPositionIndexLive() {
    if (!this.data.adPositionIndexLivePic || !this.data.adPositionIndexLivePic.url) {
      return
    }
    wx.navigateTo({
      url: this.data.adPositionIndexLivePic.url,
    })
  },
  closeAdPositionIndexPop() {
    this.setData({
      adPositionIndexPop: null
    })
  },
  clickAdPositionIndexPop() {
    const adPositionIndexPop = this.data.adPositionIndexPop
    this.setData({
      adPositionIndexPop: null
    })
    if (!adPositionIndexPop || !adPositionIndexPop.url) {
      return
    }
    wx.navigateTo({
      url: adPositionIndexPop.url,
    })
  },
  async cmsCategories() {
    // 使用模拟数据
    this.setData({
      cmsCategories: MOCK_DATA.cmsCategories
    })
  },
})
