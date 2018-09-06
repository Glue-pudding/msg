let prefix ="/api";
module.exports = {
    "/api/comment/get/:id": "/getComment",
    "/comment/add.action": "/addComment",
    "/api/page/list":"/loadMenuList",
    // "/api/news/list":"/loadNewsList",
    // "/api/news/delete":"/deleteNewsList",
    // "/api/news/get":"/newsDetail",
    // "/api/news/save":"/addAndEdit",

    "/api/image/list":"/loadImgList", //加载图片列表
    "/api/image/upload":'/uploadImg', //图片上传 
    "/api/image/delete":'/delImg',  //图片删除 
    "/api/data/get":"/dataGet",     //网站数据获取
    "/api/data/save":"/dataSave",  //网站数据保存
    "/api/website/list":'/siteList', //网站模板列表 
    "/api/product/list":'/productList', // 产品列表 
    "/api/product/sort":'/sortProduct', //产品排序 
    "/api/product/save":'/editProduct', //产品编辑或新增 
    "/api/product/delete":'/delProduct',    //删除产品
    "/api/banner/save":"/saveBanner", //保存banner
    "/api/banner/delete":"/delBanner", //删除banner
    "/api/banner/list":"/getBanner",    //获取banner列表
    "/api/banner/sort":"/sortBanner",   //banner排序
    "/api/news/list":"/newsList",       //新闻列表
    "/api/news/save":"/addAndEdit",       //新闻保存
    "/api/news/delete":"/newsDel",      //新闻删除
    "/api/news/get":"/newsDetail",      //单条新闻信息获取
  }