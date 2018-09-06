import Mock from 'mockjs';
import newsList from './jsonData/newsList';

import talentList from './jsonData/talentList';
import uploadFile from './jsonData/upload';
import success from './jsonData/success';
import newsGetSuccess from './jsonData/newsGetSuccess';
import companyList from './jsonData/companyList';
import companyInfo from './jsonData/companyInfo';
import companyTypeList from './jsonData/companyTypeList';
import contact from './jsonData/contact';
import bannerList from './jsonData/bannerList';
import gardenIntroduction from './jsonData/gardenIntroduction';
import gardenDelete from './jsonData/gardenDelete';
import policyList from './jsonData/policyList';
import equementList from './jsonData/equementList';
import industryList from './jsonData/industryList';
import abstract from './jsonData/abstract';
import saveOrUpdae from './jsonData/saveOrUpdae';
import exhibition from './jsonData/exhibition';
import editPolicy from './jsonData/editPolicy';

import loginInfo from './jsonData/loginInfo';
/**首页模块 */
Mock.mock(/api\/contact\/get/,contact);
Mock.mock(/api\/banner\/list/,bannerList);
Mock.mock(/api\/company\/saveOrUpdate/,success);
Mock.mock(/api\/banner\/delete/,success);
Mock.mock(/api\/contact\/update/,success);


/**人才模块 */
Mock.mock(/api\/talents\/list/,talentList);
Mock.mock(/api\/talents\/saveOrUpdate/,success)
Mock.mock(/api\/talents\/update/,success)

/**企业模块 */
Mock.mock(/api\/company\/list/,companyList);
Mock.mock(/api\/company\/saveOrUpdate/,success);
Mock.mock(/api\/company\/get/,companyInfo);
Mock.mock(/api\/company\/update/,success);
Mock.mock(/api\/company\/type\/add/,success);
Mock.mock(/api\/company\/type\/update/,success);
Mock.mock(/api\/company\/type\/list/,companyTypeList);

Mock.mock(/api\/file\/upload/,uploadFile);

/**新闻模块 */
Mock.mock(/api\/news\/list/,newsList);
Mock.mock(/api\/news\/update/,success);
Mock.mock(/api\/news\/saveOrUpdate/,success);
Mock.mock(/api\/news\/get/,newsGetSuccess);


/**园区管理模块 */
Mock.mock(/api\/exhibition\/list/,gardenIntroduction);
Mock.mock(/api\/exhibition\/delete/,gardenDelete);
Mock.mock(/api\/policy\/list/,policyList);
Mock.mock(/api\/equement\/list/,equementList);
Mock.mock(/api\/industry\/list/,industryList);
Mock.mock('/api/industry/delete',success);
Mock.mock(/api\/equement\/abstract\/update/,abstract);
Mock.mock(/api\/industry\/saveOrUpdae/,saveOrUpdae);
Mock.mock(/api\/exhibition\/equement\/data\/get/,exhibition);
Mock.mock(/api\/exhibition\/saveOrUpdate/,success);
Mock.mock(/api\/exhibition\/abstract\/update/,success);
Mock.mock(/api\/equement\/saveOrUpdate/,success);
Mock.mock(/api\/equement\/delete/,success);
Mock.mock(/api\/policy\/update/,success);
Mock.mock(/api\/policy\/saveOrUpdate/,success);
Mock.mock(/api\/policy\/get/,editPolicy);


/**登录信息 */
Mock.mock('/api/user/get',loginInfo);
Mock.mock('/wisdom-zone/protal/logout',success);
Mock.mock('/logout',success);
