// 10000 OK
// 20000 参数错误
// 50000 内容未找到
// 60000 服务器内部错误
const imgList = ["http://placehold.it/180x180","http://placehold.it/200x200"];
module.exports = {
    code: 10000,
    message: "success",
    data:{
        'url|1':imgList
    }
};