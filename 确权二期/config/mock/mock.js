import Mock from 'mockjs';

import userInfor from './jsonData/userInfor';
import userList from './jsonData/userList';
import supplierList from './jsonData/supplierList';
import dataOpenBusinessManager from './jsonData/dataOpenBusinessManager';
import dataOpenBusinessDetail from './jsonData/dataOpenBusinessDetail';
import getDataSourceDetail from './jsonData/supplyDetail';
import editDataSourceInfo from './jsonData/editDataSourceInfo';
import fileUpLoad from './jsonData/fileUpLoad';
import editSourceSchema from './jsonData/editSourceSchema';
import schemaFileUpLoad from './jsonData/schemaFileUpLoad';
import openGetSchema from './jsonData/openGetSchema';
import openAothSchema from './jsonData/openAothSchema';
import addDataSource from './jsonData/addDataSource';



import success from './jsonData/success';
import userDetail from './jsonData/userDetail';
import userBussList from './jsonData/userBussList';
import UsersConditions from './jsonData/UsersConditions';
import dataSetList from './jsonData/dataSetList';
import businessDetail from './jsonData/businessDetail';
import customerBList from './jsonData/customerBList';
import customeDetail from './jsonData/customeDetail';
import selectSchema from './jsonData/selectSchema';
import confuse from './jsonData/confuse';
import manageConfig from './jsonData/manageConfig';

Mock.mock(/api\/login\/login/,userInfor);
Mock.mock(/api\/login\/logout/,success);
Mock.mock(/api\/manager\/userListQuery/,userList);

Mock.mock(/api\/supplier\/getDataSourceDetail/,getDataSourceDetail);
Mock.mock(/api\/supplier\/getDataSource/,supplierList);
Mock.mock(/api\/supplier\/dataOpenBusinessManager/,dataOpenBusinessManager);
Mock.mock(/api\/supplier\/dataOpenBusinessDetail/,dataOpenBusinessDetail);
Mock.mock(/api\/supplier\/editDataSourceInfo/,editDataSourceInfo);
Mock.mock(/api\/supplier\/fileUpLoad/,fileUpLoad);
Mock.mock(/api\/supplier\/editDataSourceSchema/,editSourceSchema);
Mock.mock(/api\/supplier\/schemaFileUpLoad/,schemaFileUpLoad);
Mock.mock(/api\/supplier\/dataOpenBusinessGetSchema/,openGetSchema);
Mock.mock(/api\/supplier\/dataOpenBusinessAuthSchema/,openAothSchema);
Mock.mock(/api\/supplier\/addDataSource/,addDataSource),

Mock.mock(/api\/manager\/addUser/,success);
Mock.mock(/api\/manager\/editUser/,success);
Mock.mock(/api\/manager\/blockUser/,success);
Mock.mock(/api\/manager\/recoverUser/,success);
Mock.mock(/api\/manager\/getUserDetail/,userDetail);
Mock.mock(/api\/manager\/businessQuery/,userBussList);
Mock.mock(/api\/manager\/blockBusiness/,success);
Mock.mock(/api\/manager\/getUsersConditions/,UsersConditions);
Mock.mock(/api\/manager\/getDataSetsConditions/,dataSetList);
Mock.mock(/api\/manager\/addBusiness/,success);
Mock.mock(/api\/manager\/editBusiness/,success);
Mock.mock(/api\/manager\/getBusinessDetail/,businessDetail);
Mock.mock(/api\/manager\/recoverBusiness/,success);
Mock.mock(/api\/customer\/businessQuery/,customerBList);
Mock.mock(/api\/customer\/businessDetailQuery/,customeDetail);
Mock.mock(/api\/customer\/selectSchema/,selectSchema);
Mock.mock(/api\/customer\/confirmSchema/,success);
Mock.mock(/api\/customer\/dataRecover/,confuse);
Mock.mock(/api\/file\/download/,confuse);
Mock.mock(/api\/customer\/managerConfig/,manageConfig);
Mock.mock(/api\/customer\/confirmConfig/,success);
Mock.mock(/api\/customer\/fileUpLoad/,success);





