import Mock from 'mockjs';
import reportDataList from './jsonData/reportList';
import basicInfo from './jsonData/basicInfo';
import talentInfo from './jsonData/talentInfo';
import seniorTalent from './jsonData/seniorList';
import occupantList from './jsonData/occupList';
import repairList from './jsonData/repairList';
import repairInfo from './jsonData/repairInfo';
import billList from './jsonData/billList';
import billInfo from './jsonData/billInfo';
import loginInfo from './jsonData/loginInfo';
import success from './jsonData/success';
import reportStep from './jsonData/reportStep';
import phoneInfo from './jsonData/phoneInfo';
/**数据直报 */
Mock.mock('/api/company/data/list',reportDataList);
Mock.mock('/api/company/data/saveOrUpdate',success);
Mock.mock('/api/company/data/delete',success);

/**企业信息 */
//基本信息
Mock.mock('/api/company/info/get',basicInfo);
Mock.mock('/api/company/info/update',success);
//人才信息
Mock.mock('/api/company/talent/count/get',talentInfo);
Mock.mock('/api/company/talent/senior/list',seniorTalent);
Mock.mock('/api/company/talent/count/update',success);
Mock.mock('/api/company/talent/senior/saveOrUpdate',success);
Mock.mock('/api/company/talent/senior/delete',success);
//住宿信息
Mock.mock('/api/company/occupant/list',occupantList);
Mock.mock('/api/company/occupant/delete',success);
Mock.mock('/api/company/occupant/saveOrUpdate',success);

/** 报修模块*/
Mock.mock('/api/company/repair/list',repairList);
Mock.mock('/api/company/repair/get',repairInfo);
Mock.mock('/api/company/repair/saveOrUpdate',success);
Mock.mock('/api/company/repair/revoke',success);
Mock.mock('/api/company/repair/status/list',reportStep);
Mock.mock('/api/company/repair/comment',success);
Mock.mock('/api/company/repair/get/phone',phoneInfo);

/**账单模块 */
Mock.mock('/api/company/bill/list',billList);
Mock.mock('/api/company/bill/get',billInfo);

/**登录信息 */
Mock.mock('/api/user/get',loginInfo);
// Mock.mock('/wisdom-zone/company/logout',success);
Mock.mock('/logout',success);







