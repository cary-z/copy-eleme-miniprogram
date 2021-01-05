// pages/eat/index.js 
const app = getApp();
const query = wx.createSelectorQuery();
const utils = require('../../utils');
// wx.cloud.init();
// const db = wx.cloud.database({
//     env: ''
// })

    // timer;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        scrollTop: 0,
        totop: true,
        food: [
            {"tab":"吃",
            "content": [
                {"name":"炒饭","url":"./img/caofan.jpg","introduction":"超级好吃的蛋炒饭","sales":50,"price":18,"count":0},
                {"name": "牛肉","url": "./img/niurou.jpg","introduction": "贼香的牛肉","sales": 20,"price": 25,"count": 0},
                {"name": "青菜","url": "./img/qingcai.jpg","introduction": "嫩菜心","sales": 30,"price": 8,"count": 0}
            ]},
            {"tab": "喝",
            "content": [
                {"name": "牛奶","url": "./img/niunai.jpg","introduction": "一盒牛奶","sales": 120,"price": 4,"count": 0},
                {"name": "可乐","url": "./img/kele.jpg","introduction": "快乐肥宅水","sales": 150,"price": 3,"count": 0},
                {"name": "雪碧","url": "./img/xuebi.jpg","introduction": "透心凉，心飞扬","sales": 80,"price": 3,"count": 0}
            ]},
            {"tab": "玩",
            "content": [
                {"name": "王者荣耀","url": "./img/wangzherongyao.jpg","introduction": "王者农药","sales": 10000,"price": 288,"count": 0},
                {"name": "LOL","url": "./img/LOL.jpg","introduction": "芜湖！起飞！","sales": 100000,"price": 488,"count": 0},
                {"name": "炉石传说","url": "./img/lushichuanshuo.jpg","introduction": "炉石战旗天下第一","sales": 5000,"price": 388,"count": 0}
            ]}
        ],
        pres: [
            {"icon_type": "icon-canyin","name": "外卖"},
            {"icon_type": "icon-dingdan","name": "订单"},
            {"icon_type": "icon-wodedangxuan","name": "我的"},
            {"icon_type": "icon-shoucang","name": "收藏"}
        ],
        shoppingcar: [],
        list: [],
        flag: {
            iconflag: true,
            listflag: true,
        },
        listheight: '',
        shopping: {
            commodities: 0,
            total: 0,
        },
        foodId: 0,
        presId: 0,
        mine: {
            "icon": ".icon-icon-test10",
            "content": [
              {
                "name": "昵称",
                "message": ""
              },
              {
                "name": "姓名",
                "message": ""
              },
              {
                "name": "性别",
                "message": ""
              },
              {
                "name": "微信号",
                "message": ""
              },
              {
                "name": "手机号码",
                "message": ""
              },
              {
                "name": "家庭地址",
                "message": ""
              }
            ]
        },
        timer: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (app.globalData.userInfo) {
            this.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo: true
            })
          } else if (this.data.canIUse){
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
              success: res => {
                app.globalData.userInfo = res.userInfo
                this.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
                })
              }
            })
          }
      const that = this;
    //   db.collection('food').get({
    //     success(res) {
    //       that.setData({
    //         food: res.data[0].food,
    //         pres: res.data[0].pres,
    //         // mine: res.data[0].mine,
    //         id: res.data[0]._id,
    //       })
          
    //     }
    //   })
      wx.getStorage({
          key: 'mine',
          success(res) {
            that.setData({
                mine: res.data
            })
          }
      });
      wx.getStorage({
        key: 'list',
        success(res) {
            that.setData({
                list: res.data
            })
        }
      });
      if (that.data.list.length > 0) {
        that.timing(0);
      }
      that.timer = setInterval(() => {
        let count = 0;
        for (let i = 0; i < that.data.list.length; i++) {
            if (that.data.list[i].remaining == '00:00' || that.data.list[i].remaining == null) {
                that.data.list[i].remaining = null;
                count++;
            } else {
                that.timing(i);
            }
        }
        that.setData({
            list: that.data.list,
        });
        if (count == that.data.list.length) {
            clearInterval(that.timer);
        }
    }, 500);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        const pages = getCurrentPages();
        const currPage = pages[pages.length - 1];
        if (currPage.data.index) {
            this.data.mine.content[currPage.data.index].message = currPage.data.value;
            this.setData({
                mine: this.data.mine
            })
            // this.sure();
            wx.setStorage({
              data: this.data.mine,
              key: 'mine',
            })
        }

    },

    //提交修改
    sure:function() {
        const that = this;
        db.collection('food').doc(that.data.id).update({
            data: {
                mine: that.data.mine
            },
            success:function(res) {
                wx.showLoading({
                  title: '修改成功',
                })
                setTimeout(() => {
                    wx.hideLoading({
                      success: (res) => {
                      },
                    })
                }, 500);
            }
        })
        // wx.cloud.callFunction({
        //     name: 'food',
        //     data: {
        //         _id: that.data.id,
        //         mine: that.data.mine
        //     },
        //     success:function(res) {
        //         console.log(res);
        //         wx.showLoading({
        //           title: '修改成功',
        //         })
        //     },
        //     fail: console.error
        // })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
    },
    changeOption: function(e) {
        const id = e.currentTarget.dataset.id;
        this.setData({
            foodId: id,
        });
    },
    changeModule: function(e) {
        const id = e.currentTarget.dataset.id;
        if (id == 3) {
            wx.showModal({
                title: "收藏",
                content: "暂无收藏"
            })
            return
        } else {
            wx.setNavigationBarTitle({
                title: this.data.pres[id].name,
            })
        }
        this.setData({
            foodId: 0,
            presId: id,
        });
    },
    //菜品数量加减
    add: function(e) {
        const { itemindex, parentindex } = e.currentTarget.dataset;
        this.data.food[parentindex].content[itemindex].count++;
        const { name, url, introduction, sales, price, count } = this.data.food[parentindex].content[itemindex];
        let flag = true;
        this.data.shoppingcar.forEach(value => {
            if (value.parentindex === parentindex && value.itemindex === itemindex) {
                value.count++;
                this.data.shopping.total += value.price;
                flag = false;
            }
        })
        if (flag) {
            this.data.shopping.total += price;
            this.data.shoppingcar.unshift({ name: name, url: url, introduction: introduction, sales: sales, price: price, count: count, parentindex: parentindex, itemindex: itemindex });
        }
        if (this.data.shoppingcar.length > 3) {
            this.data.listheight = '630rpx'
        }
        this.data.shopping.commodities++;
        this.setData({
            food: this.data.food,
            shoppingcar: this.data.shoppingcar,
            listheight: this.data.listheight,
            shopping: {
                commodities: this.data.shopping.commodities,
                total: this.data.shopping.total,
            }
        })
    },

    less: function(e) {
        const { itemindex, parentindex } = e.currentTarget.dataset;

        if (this.data.food[parentindex].content[itemindex].count > 0) {
            this.data.food[parentindex].content[itemindex].count--;
        }
        this.data.shoppingcar.forEach((value, index, arr) => {
            if (value.parentindex === parentindex && value.itemindex === itemindex) {
                value.count--;
                if (value.count === 0) {
                    arr.splice(index, 1);
                }
                this.data.shopping.total -= value.price;
            }
        })

        if (this.data.shoppingcar.length <= 3) {
            this.data.listheight = ''
        }
        if (this.data.shoppingcar.length === 0) {
            this.data.flag.listflag = true;
            this.data.flag.iconflag = true;
        }
        this.data.shopping.commodities--;
        this.setData({
            food: this.data.food,
            shoppingcar: this.data.shoppingcar,
            listheight: this.data.listheight,
            flag: {
                iconflag: this.data.flag.iconflag,
                listflag: this.data.flag.listflag
            },
            shopping: {
                commodities: this.data.shopping.commodities,
                total: this.data.shopping.total,
            }
        })
    },
    //购物车图标显示
    shoppingcarShow: function() {
        this.setData({
            flag: {
                iconflag: false,
                listflag: false
            }
        })
    },
    //购物车失去焦点
    shoppingcarHide: function() {
        this.setData({
            flag: {
                listflag: true,
                iconflag: true,
            },
        })
    },
    //购物车清空
    clearall: function() {
        this.data.shoppingcar.forEach(value => {
            this.data.food[value.parentindex].content[value.itemindex].count = 0;
        });
        this.data.shoppingcar = [];
        this.data.listheight = ''
        this.setData({
            shoppingcar: this.data.shoppingcar,
            listheight: this.data.listheight,
            food: this.data.food,
            flag: {
                listflag: true,
                iconflag: true,
            },
            shopping: {
                commodities: 0,
                total: 0,
            }

        })
    },
    //计时
    timing: function(id) {
        const nowtime = utils.countdown(new Date());
        let remaining = this.data.list[id].endtime - nowtime;
        let min = parseInt(remaining / 1000 / 60);
        let sec = parseInt(remaining / 1000 % 60);
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;
        remaining = remaining < 0 ? null : min + ':' + sec;
        this.data.list[id].remaining = remaining;
        this.setData({
            list: this.data.list
        })
    },

    //下单
    order: function() {
        let that = this;
        const span = 10; //分钟
        wx.showModal({
            title: '订单',
            content: '是否确认订单',
            success(res) {
                if (res.confirm) {
                    const time = utils.formatTime(new Date());
                    const startime = utils.countdown(new Date());
                    that.data.list.unshift({
                        id: that.data.list.length + 1,
                        shoppingcar: that.data.shoppingcar,
                        commodities: that.data.shopping.commodities,
                        total: that.data.shopping.total,
                        time: time,
                        endtime: startime + span * 60 * 1000
                    });
                    that.setData({
                        list: that.data.list,
                    });
                    wx.setStorage({
                        data: that.data.list,
                        key: 'list',
                      })
                    that.timing(0);

                    //开启定时器
                    clearInterval(that.timer);
                    that.timer = setInterval(() => {
                        let count = 0;
                        for (let i = 0; i < that.data.list.length; i++) {
                            if (that.data.list[i].remaining == '00:00' || that.data.list[i].remaining == null) {
                                that.data.list[i].remaining = null;
                                count++;
                            } else {
                                that.timing(i);
                            }
                        }
                        that.setData({
                            list: that.data.list,
                        });
                        if (count == that.data.list.length) {
                            clearInterval(that.timer);
                        }
                    }, 500);
                    that.setData({
                        foodId: 0,
                        presId: 1,
                        list: that.data.list,
                    });

                    that.clearall();
                }
            }
        })
    },

    //修改信息
    ChangeInformation: function(e) {
        wx.navigateTo({
            url: '/pages/eat/message?name=' + e.currentTarget.dataset.value + '&index=' + e.currentTarget.dataset.index,
        })

    },

    subscribe: function(e) {
        wx.requestSubscribeMessage({
            tmplIds: ['L0i21wIiYjSM21vs1QAzWcIPm71KbSTJ-8EUVMovarA'],
            success: res => {
                wx.cloud.callFunction({
                    name: 'add',
                    data: {
                        templated: 'L0i21wIiYjSM21vs1QAzWcIPm71KbSTJ-8EUVMovarA'
                    }
                })
            }
          })
    },

    //获取用户的openid
    getOpenid() {
        wx.cloud.callFunction({
        name: "getopenid"
        }).then(res => {
        let openid = res.result.openid
        console.log("获取openid成功", openid)
        this.send(openid)
        }).catch(res => {
        console.log("获取openid失败", res)
        })
    },
    //发送模板消息到指定用户,推送之前要先获取用户的openid
    send(openid) {
        wx.cloud.callFunction({
        name: "sendMsg",
        data: {
            openid: openid
        }
        }).then(res => {
        console.log("推送消息成功", res)
        }).catch(res => {
        console.log("推送消息失败", res)
        })
    }


    


})