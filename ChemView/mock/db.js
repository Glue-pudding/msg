
// import successInfor from './jsonData/successInfor.js';
var Mock = require('mockjs');
const commentInfor = require('./jsonData/commentInfor.js');
const successInfor = require('./jsonData/successInfor.js');
const getPriceDetail = require('./jsonData/getPriceDetail.js')
const getVolumeDetail = require('./jsonData/getVolumeDetail.js')

module.exports = {
  getProductList:Mock.mock(commentInfor),
  changeTop:Mock.mock(successInfor),
  getPriceDetail:Mock.mock(getPriceDetail),
  getVolumeDetail:Mock.mock(getVolumeDetail)
}
