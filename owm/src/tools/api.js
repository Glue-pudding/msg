// const prefix = '/api'
module.exports = {
    //新闻模块
    NEWS_LIST:'/api/news/list', //获取新闻列表
    DELETE_NEWS_LIST:'/api/news/delete',  //删除新闻
    NEWS_DETAIL:'/api/news/get', //获取新闻详情
    ADD_AND_EDIT:'/api/news/save', //添加和编辑

    SAVE_SITE_DATA:'/api/data/save',    //保存网站数据
    GET_SITE_DATA:'/api/data/get',      //获取网站数据
    
    GET_COMMENT:"/comment/get/:id",
    LOAD_PAGE_LIST:'/api/page/list',
    LOAD_IMG_LIST:"/api/image/list",  //  获取图片列表
    UPLOAD_NEW_IMG:'/api/image/upload',   //上传图片
    DELETE_IMG:'/api/image/delete',       //删除图片
    
    //banner模块
    GET_BANNER_LIST:'/api/banner/list',     //获取banner列表
    SAVE_BANNER_LIST:'/api/banner/save',    //新增编辑banner列表
    DEL_BANNER_LIST:"/api/banner/delete",   //删除banner列表项
    SORT_BANNER_LIST:'/api/banner/sort',    //banner列表排序

    //产品模块
    PRODUCT_LIST:"/api/product/list" , //获取产品列表
    DELETE_PRODUCT_LIST:"/api/product/delete" ,  //删除产品
    PRODUCT_ADD_AND_EDIT:'/api/product/save', //添加和编辑
    PRODUCT_SORT:"/api/product/sort",   //产品排序
}
