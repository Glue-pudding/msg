export const menus = [
    // { key: '/app/dashboard/index', title: '首页', icon: 'mobile', },
    {
        key: '/app/home', title: '首页管理', icon: 'home',
        sub: [
            { key: '/app/home/banner', title: 'Banner位', icon: '', },
            { key: '/app/home/contact', title: '联系方式', icon: '', }
        ],
    },
    { key: '/app/news/manage', title: '新闻管理', icon: 'line-chart', },
    { 
        key: '/app/garden', title: '园区服务管理', icon: 'pay-circle-o', 
        sub: [
            { key: '/app/garden/GardenIntro', title: '园区简介', icon: ''},
            { key: '/app/garden/IndustrialDirection', title: '园区产业方向', icon: ''},
            { key: '/app/garden/PolicyServices', title: '政策服务', icon: ''},
            { key: '/app/garden/SupportingFacilities', title: '配套设施', icon: ''}
        ]
    },
    {
        key: '/app/company', title: '入驻企业管理', icon: 'home',
        sub: [
            { key: '/app/company/infor', title: '入驻企业', icon: '', },
            { key: '/app/company/type', title: '企业类型', icon: '', }
        ],
    },
    { key: '/app/person/infor', title: '人才展示管理', icon: 'pay-circle-o', },
];