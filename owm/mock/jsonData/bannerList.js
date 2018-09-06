
const imgList = ["http://placehold.it/180x180","https://image.flaticon.com/icons/svg/126/126508.svg","https://image.flaticon.com/icons/svg/126/126472.svg"];
const siteList = ["https://www.baidu.com","https://www.jd.com"];
module.exports ={
    code: 10000,
    message: "success",
    'data':{    
        'count|1':[1,5],
        'list|1-5':[
            {'id|+2':6,'url|1':imgList,'sort|+1':0,'href|1':siteList,'imageId|+2':8}
        ]
    }
  };
  