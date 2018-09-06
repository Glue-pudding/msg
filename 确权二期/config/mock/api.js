export default {
  //后台管理
  USER_LOGIN:'/api/login/login', //用户登录
  USER_LOGOUT:'/api/login/logout', //用户登出
  USER_LIST:'/api/manager/userListQuery',  //用户列表
  ADD_USER:'/api/manager/addUser',     //添加用户
  EDIT_USER:'/api/manager/editUser',//编辑用户
  USER_LIST_QUERY:'/api/manager/userListQuery',//用户列表查询
  BLOCK_USER:'/api/manager/blockUser',//冻结用户
  RECOVER_USER:'/api/manager/recoverUser',//恢复用户
  GET_USER_DETAIL:'/api/manager/getUserDetail',//用户详情
  BUSINESS_QUERY:'/api/manager/businessQuery',//数据开放业务列表
  BLOCK_BUSINESS:'/api/manager/blockBusiness',//冻结数据开放业务
  RECOVER_BUSINESS:'/api/manager/recoverBusiness',//恢复业务
  GET_USERS_CONDITIONS:'/api/manager/getUsersConditions',//获取所有供方，需方列表
  GET_DATA_SETS_CONDITIONS:'/api/manager/getDataSetsConditions',//获取数据源
  ADD_BUSINESS:'/api/manager/addBusiness',//新增业务
  EDIT_BUSINESS:'/api/manager/editBusiness',//编辑业务
  GET_BUSINESS_DETAIL:'/api/manager/getBusinessDetail',//业务详情

  //供方
  DATASOURCE_LIST:'/api/supplier/getDataSource',   //数据资源列表查询
  ADD_DATA_SOURCE:'/api/supplier/addDataSource',  //新增数据
  GET_DATA_SOURCE_DETAIL:'/api/supplier/getDataSourceDetail',   //数据资源详情
  DATA_OPEN_BUSINESS_MANAGER:'/api/supplier/dataOpenBusinessManager',   //数据开放业务
  DATA_OPEN_BUSINESS_DETAIL:'/api/supplier/dataOpenBusinessDetail',  //数据开放业务详情
  EDIT_DATA_SOURCE_INFO:'/api/supplier/editDataSourceInfo',   //编辑数据资源基本信息
  FILE_UPLOAD:'/api/supplier/fileUpLoad',   //文件上传接口
  EDIT_SOURCE_SCHEMA:'/api/supplier/editDataSourceSchema',    //编辑schema数据信息
  SCHEMA_FILE_UPLOAD:'/api/supplier/schemaFileUpLoad',   //schema数据批量上传
  OPEN_GET_SCHEMA:'/api/supplier/dataOpenBusinessGetSchema',    //schema授权操作列表
  OPEN_AUTH_SCHEMA:'/api/supplier/dataOpenBusinessAuthSchema',   //授权schema提交


  //需方
  BUSINESS_LIST:'/api/customer/businessQuery',     //查询业务列表
  BUSINESS_DETAIL_QUERY:'/api/customer/businessDetailQuery',//业务详情
  SELECT_SCHEMA:'/api/customer/selectSchema',//获取可选用Schema
  CONFIRM_SCHEMA:'/api/customer/confirmSchema',//提交选中的schema
  DATA_RECOVER:'/api/customer/dataRecover',//解混淆操作
  DOWNLOAD_CERT:'/api/file/download',//证书下载
  MANAGER_CONFIG:'/api/customer/managerConfig',//配置文件管理
  CONFIRM_CONFIG:'/api/customer/confirmConfig',//配置文件提交
  FILE_UP_LOAD:'/api/customer/fileUpLoad',//上传文件
};