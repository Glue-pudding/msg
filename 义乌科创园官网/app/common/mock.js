import Mock from 'mockjs';

import jsonData from '../../jsonData/jsonDemo';
import newsList from '../../jsonData/newsList';
import newsDetail from '../../jsonData/newsDetail';
import companyTypeList from '../../jsonData/compTypeList';
import companyList  from '../../jsonData/companyList';
import companyInfor from '../../jsonData/companyInfor';
import talentList from '../../jsonData/talentList';
import packIntro from '../../jsonData/ParkIntro';
import industrial from '../../jsonData/Industrial';
import PolicyService from '../../jsonData/PolicyService';
import Policy from '../../jsonData/policy';
import bannerList from '../../jsonData/bannerList';
import contactInfor from '../../jsonData/contactInfor';
import persontypeList from '../../jsonData/persontypeList';
import personInfor from '../../jsonData/personInfor';

// import jsonData from '../../jsonData/jsonDemo';
// Mock响应模板
Mock.mock(/api\/getList\/(\w+)/, jsonData);
// Mock.mock(/api\/getUser/, useData);
Mock.mock('/api/index/news/list',newsList);
Mock.mock('/api/index/news/get',newsDetail);

Mock.mock(/api\/index\/company\/type\/list/,companyTypeList);
Mock.mock(/api\/index\/company\/list/,companyList);
Mock.mock('/api/index/company/get',companyInfor);

Mock.mock('/api/index/banner/list',bannerList);
Mock.mock('/api/index/talents/list',talentList);

Mock.mock('/api/index/exhibition/equement/data/get',packIntro);
Mock.mock('/api/index/industry/list',industrial);
Mock.mock('/api/index/policy/list',PolicyService);
Mock.mock('/api/index/policy/get',Policy);

Mock.mock('/api/index/contact/get',contactInfor);
Mock.mock('/api/index/talents/type/list',persontypeList);
Mock.mock('/api/index/talents/get',personInfor);


