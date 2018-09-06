const commentInfor = require('./jsonData/commentInfo.js');
const successInfor = require('./jsonData/success.js');
var Mock = require('mockjs');
module.exports = {
  getComment: Mock.mock(commentInfor),
  addComment: Mock.mock(successInfor)
};