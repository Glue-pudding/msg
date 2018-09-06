// import commentInfor from './jsonData/commentInfor';
var Mock = require('mockjs');
const successInfor = require('./jsonData/success');
const commentInfor = require('./jsonData/commentInfor');
const menuList = require('./jsonData/menuList');
const newsList = require('./jsonData/newsList');
const newsDetail = require('./jsonData/newsDetail');
// const deleteNewsList = require('./jsonData/deleteNewsList');
const addAndEdit = require('./jsonData/addAndEdit');
const imgList = require('./jsonData/imgList');
const productList = require('./jsonData/productList');
const delProduct = require('./jsonData/delProduct');
const editProduct=require('./jsonData/editProduct');
const sortProduct=require('./jsonData/sortProduct');
const siteData = require('./jsonData/siteData');
const bannerList = require('./jsonData/bannerList');
module.exports = {
  getBanner:Mock.mock(bannerList),
  delBanner:Mock.mock(successInfor),
  saveBanner:Mock.mock(successInfor),
  sortBanner:Mock.mock(successInfor),
  getComment: Mock.mock(commentInfor),
  loadMenuList:Mock.mock(menuList),
  newsList:Mock.mock(newsList),
  loadImgList:Mock.mock(imgList),
  newsDel:Mock.mock(successInfor),
  newsDetail:Mock.mock(newsDetail),
  addAndEdit:Mock.mock(addAndEdit),
  newsSave:Mock.mock(successInfor),
  uploadImg:Mock.mock(successInfor),
  delImg:Mock.mock(successInfor),
  productList:Mock.mock(productList),
  delProduct:Mock.mock(delProduct),
  editProduct:Mock.mock(editProduct),
  sortProduct:Mock.mock(sortProduct),
  dataSave:Mock.mock(successInfor),
  dataGet:Mock.mock(siteData),
  addComment: Mock.mock({
    "error": 0,
    "message": "success",
    "result": []
  })
};