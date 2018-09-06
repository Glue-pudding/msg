module.exports = {
    code: 10000,
    message: "success",
    data:{
        "common": {
            "selectedMenuKey": "home",
            "logo": {
                "type": "text",
                "imgID": null,
                "word": "方不方"
            },
            "menu": [{
                "id": 1,
                "name": "首页",
                "isEditView": 0,
                "sort": 1,
                "isView": 1,
                "route": "home"
            }, {
                "id": 12,
                "name": "关于我们",
                "isEditView": 1,
                "sort": 12,
                "isView": 1,
                "route": "about"
            }, {
                "id": 13,
                "name": "服务案例",
                "isEditView": 1,
                "sort": 13,
                "isView": 1,
                "route": "product"
            }, {
                "id": 14,
                "name": "新闻资讯",
                "isEditView": 1,
                "sort": 14,
                "isView": 1,
                "route": "news"
            }, {
                "id": 15,
                "name": "联系我们",
                "isEditView": 1,
                "sort": 15,
                "isView": 1,
                "route": "connect"
            }],
            "imgList": [],//所有图片
            "bannerList":[],
            "homeBox": {
                "slider": {
                    "name": "轮播图",
                    "visible": true
                },
                "infor": {
                    "name": "信息简介",
                    "visible": true
                },
                "advance": {
                    "name": "优势介绍",
                    "visible": true
                },
                "product": {
                    "name": "案例展示",
                    "visible": true
                },
                "counter": {
                    "name": "数据信息",
                    "visible": true
                },
                "news": {
                    "name": "新闻资讯",
                    "visible": true
                }
            },
            "aboutBox": {
                "banner": {
                    "name": "Banner图",
                    "visible": true
                },
                "infor": {
                    "name": "公司简介",
                    "visible": true
                },
                "service": {
                    "name": "服务领域",
                    "visible": true
                },
                "team": {
                    "name": "团队信息",
                    "visible": true
                }
            },
            "productBox": {
                "banner": {
                    "name": "Banner图",
                    "visible": true
                },
                "classic": {
                    "name": "经典案例",
                    "visible": true
                },
                "list": {
                    "name": "产品一览",
                    "visible": true
                }
            },
            "newsBox": {
                "banner": {
                    "name": "Banner图",
                    "visible": true
                },
                "list": {
                    "name": "新闻列表",
                    "visible": true
                }
            },
            "connectBox": {
                "banner": {
                    "name": "Banner图",
                    "visible": true
                },
                "infor": {
                    "name": "联系方式",
                    "visible": true
                },
                "map": {
                    "name": "地图",
                    "visible": true
                }
            },
            "copyInfor": "owm site"
        },
        "connect": {
            "topObj": {
                "picId": 12,
                "title": "联系我们"
            },
            "infor": {
                "title": "联系方式",
                "address": {
                    "name": "联系地址",
                    "value": "杭州市西湖区文三路 553 号",
                    "icon": 8
                },
                "tel": {
                    "name": "联系电话",
                    "value": "400-063-9966",
                    "icon": 11
                },
                "mail": {
                    "name": "联系邮箱",
                    "value": "xiaop@bdp.cn",
                    "icon": 15
                }
            },
            "map": {
                "latitude": 30.270616,
                "longitude": 120.174534,
                "company": "浙江中小型企业大厦",
                "address": "杭州市西湖区文三路 553 号"
            }
        },
        "product": {
            "top": {
                "pic": "http://placehold.it/3608x366",
                "picId": 12,
                "title": "服务案例"
            },
            "infor": {
                "title": "经典案例",
                "productItem1": {
                    "title": "案例一",
                    "constants": "You can relay on our amazing features list and also our custome",
                    "productPic": "http://placehold.it/520x3050"
                },
                "productItem2": {
                    "title": "案例二",
                    "constants": "You can relay on our amazing features list and also our custome",
                    "productPic": "http://placehold.it/520x3050"
                }
            },
            "productList:":[]
        },
        "about": {
            "topObj": {
                "picId": 12,
                "title": "关于我们"
            }
        },
        "news": {
            "news": [],
            "count": "",
            "NewsDetail": {},
            "top": {
                "pic": "http://placehold.it/3608x366",
                "title": "新闻资讯",
                "picId": 12
            }
        }
    }
};