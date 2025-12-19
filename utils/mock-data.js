// 模拟数据文件 - 用于前端demo展示
module.exports = {
  // 轮播图数据
  banners: [
    {
      id: 1,
      picUrl: '/images/banner1.jpg',
      linkType: 0,
      linkUrl: ''
    },
    {
      id: 2,
      picUrl: '/images/banner2.jpg',
      linkType: 0,
      linkUrl: ''
    },
    {
      id: 3,
      picUrl: '/images/banner3.jpg',
      linkType: 0,
      linkUrl: ''
    }
  ],

  // 商品分类
  categories: [
    { id: 1, name: '手机数码', icon: '/images/icon/phone.png', level: 1 },
    { id: 2, name: '电脑办公', icon: '/images/icon/computer.png', level: 1 },
    { id: 3, name: '服装鞋包', icon: '/images/icon/clothes.png', level: 1 },
    { id: 4, name: '家居用品', icon: '/images/icon/home.png', level: 1 },
    { id: 5, name: '美妆护肤', icon: '/images/icon/beauty.png', level: 1 },
    { id: 6, name: '食品饮料', icon: '/images/icon/food.png', level: 1 },
    { id: 7, name: '图书文具', icon: '/images/icon/book.png', level: 1 },
    { id: 8, name: '运动户外', icon: '/images/icon/sport.png', level: 1 }
  ],

  // 推荐商品
  goodsRecommend: [
    {
      id: 1001,
      name: 'Apple iPhone 15 Pro',
      pic: '/images/goods/iphone15.jpg',
      price: 7999,
      originalPrice: 8999,
      sellNum: 1250
    },
    {
      id: 1002,
      name: '华为Mate 50 Pro',
      pic: '/images/goods/huawei.jpg',
      price: 5999,
      originalPrice: 6999,
      sellNum: 890
    },
    {
      id: 1003,
      name: 'MacBook Air M2',
      pic: '/images/goods/macbook.jpg',
      price: 8999,
      originalPrice: 9999,
      sellNum: 456
    },
    {
      id: 1004,
      name: '小米13 Ultra',
      pic: '/images/goods/xiaomi.jpg',
      price: 4999,
      originalPrice: 5499,
      sellNum: 1234
    }
  ],

  // 秒杀商品
  miaoshaGoods: [
    {
      id: 2001,
      name: '秒杀商品1',
      pic: '/images/goods/miaosha1.jpg',
      price: 99,
      originalPrice: 199,
      dateStart: '2025-12-19 10:00:00',
      dateEnd: '2025-12-19 12:00:00'
    },
    {
      id: 2002,
      name: '秒杀商品2',
      pic: '/images/goods/miaosha2.jpg',
      price: 149,
      originalPrice: 299,
      dateStart: '2025-12-19 14:00:00',
      dateEnd: '2025-12-19 16:00:00'
    }
  ],

  // 砍价商品
  kanjiaList: [
    {
      id: 3001,
      name: '砍价商品1',
      pic: '/images/goods/kanjia1.jpg',
      price: 299,
      originalPrice: 599,
      process: 75
    },
    {
      id: 3002,
      name: '砍价商品2',
      pic: '/images/goods/kanjia2.jpg',
      price: 199,
      originalPrice: 399,
      process: 60
    }
  ],

  // 拼团商品
  pingtuanList: [
    {
      id: 4001,
      name: '拼团商品1',
      pic: '/images/goods/pingtuan1.jpg',
      price: 89,
      originalPrice: 129,
      pingtuanPrice: 89
    },
    {
      id: 4002,
      name: '拼团商品2',
      pic: '/images/goods/pingtuan2.jpg',
      price: 159,
      originalPrice: 259,
      pingtuanPrice: 159
    }
  ],

  // 优惠券
  coupons: [
    {
      id: 1,
      name: '新用户优惠券',
      money: 50,
      moneyHreshold: 200
    },
    {
      id: 2,
      name: '满减券',
      money: 30,
      moneyHreshold: 150
    }
  ],

  // 公告列表
  noticeList: [
    {
      id: 1,
      title: '商城开业大优惠',
      dateAdd: '2025-12-19'
    },
    {
      id: 2,
      title: '新品上架通知',
      dateAdd: '2025-12-18'
    },
    {
      id: 3,
      title: '双12活动预告',
      dateAdd: '2025-12-17'
    }
  ],

  // 商品列表
  goods: [
    {
      id: 1001,
      name: 'Apple iPhone 15 Pro 256GB',
      pic: '/images/goods/iphone15.jpg',
      price: 7999,
      originalPrice: 8999,
      sellNum: 1250
    },
    {
      id: 1002,
      name: '华为Mate 50 Pro 512GB',
      pic: '/images/goods/huawei.jpg',
      price: 5999,
      originalPrice: 6999,
      sellNum: 890
    },
    {
      id: 1003,
      name: 'MacBook Air M2 13英寸',
      pic: '/images/goods/macbook.jpg',
      price: 8999,
      originalPrice: 9999,
      sellNum: 456
    },
    {
      id: 1004,
      name: '小米13 Ultra 512GB',
      pic: '/images/goods/xiaomi.jpg',
      price: 4999,
      originalPrice: 5499,
      sellNum: 1234
    },
    {
      id: 1005,
      name: '戴尔XPS 13 笔记本',
      pic: '/images/goods/dell.jpg',
      price: 6999,
      originalPrice: 7999,
      sellNum: 234
    },
    {
      id: 1006,
      name: '华为P60 Pro',
      pic: '/images/goods/huawei-p60.jpg',
      price: 4999,
      originalPrice: 5999,
      sellNum: 567
    }
  ],

  // CMS分类
  cmsCategories: [
    { id: 1, name: '商城资讯', type: 'index' },
    { id: 2, name: '使用帮助', type: 'index' },
    { id: 3, name: '关于我们', type: 'index' }
  ]
}
