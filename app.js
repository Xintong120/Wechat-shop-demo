/**
 * 小程序应用主入口文件
 *
 * 功能概述：
 * 1. 应用初始化和配置加载
 * 2. 版本更新检测和网络状态监控
 * 3. 界面适配参数计算
 * 4. 用户登录和信息管理
 * 5. 分享和邀请机制处理
 * 6. 全局状态和数据管理
 *
 * 当前状态：已修改为前端demo模式，使用模拟数据替代真实API调用
 */

// 引入第三方API接口库，用于与后端服务器通信
const WXAPI = require('apifm-wxapi')
// 引入配置文件，包含域名、商户ID、版本等全局配置
const CONFIG = require('config.js')
// 引入认证工具模块，处理用户登录、注册、token管理等
const AUTH = require('utils/auth')

App({
  /**
   * 小程序启动时的初始化函数
   * 执行时机：小程序冷启动时触发，只执行一次
   */
  onLaunch: function() {
    console.log('=== 小程序启动 ===')

    // ==================== API客户端初始化 ====================
    /**
     * 初始化WXAPI客户端
     * 支持两种配置方式：
     * 1. 扩展配置（ext.json）中的subDomain - 用于多商户模式
     * 2. config.js中的默认配置
     */
    const subDomain = wx.getExtConfigSync().subDomain
    if (subDomain) {
      // 多商户模式：使用扩展配置的域名
      WXAPI.init(subDomain)
    } else {
      // 单商户模式：使用默认配置
      WXAPI.init(CONFIG.subDomain)
      WXAPI.setMerchantId(CONFIG.merchantId)
    }

    const that = this;

    // ==================== 版本更新检测 ====================
    /**
     * 检测小程序新版本并提示用户更新
     * 确保用户始终使用最新版本的功能和修复
     */
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 用户确认更新，应用新版本并重启小程序
            updateManager.applyUpdate()
          }
        }
      })
    })

    // ==================== 网络状态监控 ====================
    /**
     * 初次加载时判断网络情况
     * 无网络状态下需要调整应用行为，如禁用网络请求、显示离线提示等
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          // 无网络连接，设置全局状态并提示用户
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });

    /**
     * 监听网络状态变化
     * 网络从有到无或从无到有时需要相应处理
     * 可根据业务需求进行调整，如重新加载数据、恢复网络请求等
     */
    wx.onNetworkStatusChange(function(res) {
      if (!res.isConnected) {
        // 网络断开
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000
        })
      } else {
        // 网络恢复
        that.globalData.isConnected = true
        wx.hideToast()
      }
    })

    // ==================== 配置数据加载 ====================
    /**
     * 使用模拟配置数据 - 前端demo模式
     * 在开发/演示环境下使用本地模拟数据，避免依赖后端服务
     */
    const mockConfig = {
      mallName: '演示商城',           // 商城名称
      share_profile: '优质商品，值得拥有', // 分享描述
      shopMod: '0',                  // 0为普通模式，1为多店模式
      show_buy_dynamic: '1',         // 是否显示购买动态
      hidden_goods_index: '',        // 首页隐藏的商品ID
      share_pic: '/images/share.png' // 分享图片路径
    }

    // 将模拟配置保存到本地存储
    Object.keys(mockConfig).forEach(key => {
      wx.setStorageSync(key, mockConfig[key])
    })

    // 配置加载完成回调（如果页面定义了该回调）
    if (this.configLoadOK) {
      this.configLoadOK()
    }

    // ==================== 界面适配参数计算 ====================
    /**
     * 计算导航栏高度，适配不同设备的胶囊按钮位置
     * 微信小程序的导航栏需要根据设备型号动态计算高度
     */
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    console.log("小程序胶囊信息", menuButtonObject)

    wx.getSystemInfo({
      success: res => {
        // 状态栏高度
        let statusBarHeight = res.statusBarHeight,
          // 胶囊按钮与顶部的距离
          navTop = menuButtonObject.top,
          // 导航栏总高度 = 状态栏高度 + 胶囊高度 + 上下边距
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight)*2;

        // 保存到全局数据，供页面使用
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.menuButtonObject = menuButtonObject;
        console.log("navHeight", navHeight);
      },
      fail(err) {
        console.log("获取系统信息失败:", err);
      }
    })
  },

  /**
   * 小程序显示时的回调函数
   * 执行时机：小程序启动、从后台进入前台、分享进入等场景
   * @param {Object} e - 启动参数，包含路径、查询参数、分享信息等
   */
  onShow (e) {
    console.log('=== 小程序显示 ===', e)

    // ==================== 分享和邀请人处理 ====================
    /**
     * 处理分享邀请机制
     * 当用户通过分享链接进入小程序时，保存邀请人信息
     * 支持群分享获取积分功能（分销奖励）
     */
    if (e && e.query && e.query.inviter_id) {
      // 保存邀请人ID到本地存储
      wx.setStorageSync('referrer', e.query.inviter_id)

      // 如果是从群分享进入，处理群分享奖励
      if (e.shareTicket) {
        wx.getShareInfo({
          shareTicket: e.shareTicket,
          success: res => {
            // 获取登录凭证
            wx.login({
              success(loginRes) {
                if (loginRes.code) {
                  // 调用API获取群分享积分奖励
                  WXAPI.shareGroupGetScore(
                    loginRes.code,          // 登录凭证
                    e.query.inviter_id,     // 邀请人ID
                    res.encryptedData,      // 加密数据
                    res.iv                  // 初始向量
                  ).then(_res => {
                    console.log('群分享奖励结果:', _res)
                  }).catch(err => {
                    console.error('获取群分享奖励失败:', err)
                  })
                } else {
                  console.error('登录失败！' + loginRes.errMsg)
                }
              }
            })
          }
        })
      }
    }

    // ==================== 自动登录流程 ====================
    /**
     * 检查用户登录状态并执行相应逻辑
     * 支持多种登录模式：自动注册模式、仅登录模式
     */
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        // 用户未登录，需要进行登录流程
        if (CONFIG.openIdAutoRegister) {
          // 自动注册模式：用户不存在时自动注册新用户
          console.log('执行自动注册登录')
          AUTH.authorize().then(aaa => {
            // 绑定分销商（如果开启了三级分销）
            if (CONFIG.bindSeller) {
              AUTH.bindSeller()
            }
            // 获取用户信息并触发登录成功回调
            this.getUserApiInfo().then(() => {
              if (this.loginOK) {
                this.loginOK()
              }
            })
          })
        } else {
          // 仅登录模式：只允许已注册用户登录
          console.log('执行仅登录模式')
          AUTH.login20241025().then(res => {
            if (res.code == 0) {
              // 登录成功
              console.log('登录成功')
              if (CONFIG.bindSeller) {
                AUTH.bindSeller()
              }
              this.getUserApiInfo().then(() => {
                if (this.loginOK) {
                  this.loginOK()
                }
              })
            } else {
              // 用户未注册
              console.log('用户未注册')
              if (this.loginFail) {
                this.loginFail()
              }
            }
          })
        }
      } else {
        // 用户已登录
        console.log('用户已登录，获取用户信息')
        if (CONFIG.bindSeller) {
          AUTH.bindSeller()
        }
        this.getUserApiInfo()
      }
    })
  },
  /**
   * 获取当前用户信息
   * 在demo模式下使用模拟用户数据替代真实API调用
   * @returns {Promise} 返回用户信息设置结果
   */
  async getUserApiInfo() {
    console.log('获取用户信息 - 使用模拟数据')

    // 设置模拟用户数据到全局状态
    this.globalData.apiUserInfoMap = {
      base: {
        id: 1,                         // 用户ID
        nick: '演示用户',               // 用户昵称
        avatarUrl: '/images/default.png', // 头像URL
        mobile: '13800138000'          // 手机号
      }
    }

    console.log('用户信息设置完成:', this.globalData.apiUserInfoMap)
  },

  /**
   * 初始化昵称头像弹窗
   * 检查用户信息完整性，如果缺少昵称或头像则弹出完善信息弹窗
   * @param {Object} _this - 页面实例，用于调用setData更新界面
   */
  initNickAvatarUrlPOP(_this) {
    console.log('检查用户信息完整性')

    // 延迟3秒执行，避免启动时立即弹出影响用户体验
    setTimeout(() => {
      // 检查用户信息是否存在且昵称/头像是否完整
      if (this.globalData.apiUserInfoMap &&
          (!this.globalData.apiUserInfoMap.base.nick ||
           !this.globalData.apiUserInfoMap.base.avatarUrl)) {

        console.log('用户信息不完整，弹出完善弹窗')

        // 更新页面数据，显示完善信息弹窗
        _this.setData({
          nickPopShow: true,    // 显示弹窗
          popnick: this.globalData.apiUserInfoMap.base.nick || '',     // 当前昵称
          popavatarUrl: this.globalData.apiUserInfoMap.base.avatarUrl || '', // 当前头像
        })
      } else {
        console.log('用户信息完整，无需弹出弹窗')
      }
    }, 3000) // 3秒后弹出
  },

  /**
   * 全局数据对象
   * 存储应用级别共享的数据和状态
   */
  globalData: {
    isConnected: true,              // 网络连接状态：true-已连接，false-断开
    sdkAppID: CONFIG.sdkAppID,      // 腾讯实时音视频应用ID，用于音视频功能
    navHeight: 0,                   // 导航栏高度（动态计算）
    navTop: 0,                      // 导航栏顶部位置
    windowHeight: 0,                // 窗口高度
    menuButtonObject: null,         // 胶囊按钮信息对象
    apiUserInfoMap: undefined,      // 当前登录用户信息映射表
                                    // 包含：base（基础信息）、ext（扩展信息）、idcard（身份证）、saleDistributionTeam（分销团队）
  }
})
