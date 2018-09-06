export const menus = [
    // { key: '/app/dashboard/index', title: '首页', icon: 'mobile', },
    {
        key: '/app/business', title: '企业信息', icon: 'home',
        sub: [
            { key: '/app/business/basicInfor', title: '基本信息', icon: '', },
            { key: '/app/business/personInfor', title: '人才信息', icon: '', },
            { key: '/app/business/houseInfor', title: '住宿信息', icon: '', },
        ],
    },
    { key: '/app/data/report', title: '数据直报', icon: 'line-chart', },
    { key: '/app/checkInfor', title: '账单明细', icon: 'pay-circle-o', },
    { key: '/app/maintain', title: '报修反馈', icon: 'tool', },
];