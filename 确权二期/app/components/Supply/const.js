import { Link } from 'react-dom';
import React from 'react';
import { Switch, Input, Select } from 'antd';
const Option = Select.Option;


export const resData = {
  code: 10000,
  message: 'success',
  data: {
    'Result':'supplierList',
    'DataSets|2-10':[
      {
        'DataSetName':'@cname',
        'DataType':'金融数据',
        'DataSize|+1':88,
        'DataSetID|1':11
      },
    ]
  }
};

export const columns = t => {
  return [{
    title: '属性名称',
    width: 150,
    dataIndex: 'SchemaName',
    key: 'SchemaName',
    editable: true,
    render: (text, record) => {
      return (
        <div>
          <Input placeholder="请输入属性名称" />
        </div>
      );
    }
  }, {
    width: 100,
    title: '类型',
    dataIndex: 'SchemaType',
    key: 'SchemaType',
    editable: true,
    render: (text, record) => {
      return (
        <div>
          <Select defaultValue="string" style={{ width: 120 }}>
            <Option value="int">int</Option>
            <Option value="long">long</Option>
            <Option value="char">char</Option>
          </Select>
        </div>
      );
    }
  },  {
    title: '描述',
    dataIndex: 'SchemaDescription',
    key: 'SchemaDescription',
    width: 150,
    editable: true,
    render: (text, record) => {
      return (
        <div>
          <Input placeholder="请输入描述信息" />
        </div>
      );
    }
  },{
    width: 120,
    title: '数据是否加密',
    dataIndex: 'Sensitive',
    key: 'Sensitive',
    editable: true,
    render: (text, record) => {
      return <span>
        {/* <Link to={'/supply/details/'+record.UserName}>详情</Link> */}
        <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
      </span>;
    }
  },{
    title: '操作',
    key: 'action2',
    render: (text, record) => {
      const editable = t.isEditing(record);
      return (
        <div>
          {
            editable ? 
              <span>
                <a>保存</a>
                <span style={{margin: '0 0px'}}>|</span>
                <a>取消</a>
              </span>
              : 
              <span>
                <a onClick={() => this.edit(record.key)}>编辑</a>
                <a onClick={() => this.edit(record.key)}>取消</a>
              </span>
          }
        </div>
      );
    }
  }];
};


export const dataList = [
  {
    SchemaName: '篮球',
    SchemaType: '体育',
    SchemaDescription: '100/个',
    Sensitive: true,
    id: 1
  },
  {
    SchemaName: '足球',
    SchemaType: '体育',
    SchemaDescription: '60/个',
    Sensitive: false,
    id: 2
  }
];



export const residences = [
  {
    value: 'GovernmentDataSets',
    label: '政务数据',
    children: [
      {
        value: '工商信息',
        label: '工商信息'
      },
      {
        value: '住房公积金',
        label: '住房公积金'
      },
      {
        value: '经济指数',
        label: '经济指数'
      },
      {
        value: '城市数据',
        label: '城市数据'
      }
    ]
  
  }, 
  {
    value: 'FinanceDataSets',
    label: '金融数据',
    children: [
      {
        value: '个人征信',
        label: '个人征信'
      },
      {
        value: '企业征信',
        label: '企业征信'
      },
      {
        value: '身份核验',
        label: '身份核验'
      },
      {
        value: '黑名单',
        label: '黑名单'
      },
      {
        value: '银行数据',
        label: '银行数据'
      }
    ]
  },
  {
    value: 'MedicalDataSets',
    label: '医疗卫生',
    children: [
      {
        value: '药品数据',
        label: '药品数据'
      },
      {
        value: '医院医生',
        label: '医院医生'
      },
      {
        value: '病例数据',
        label: '病例数据'
      },
      {
        value: '体检数据',
        label: '体检数据'
      }
    ]
  },
  {
    value: 'AIDataSets',
    label: '人工智能',
    children: [
      {
        value: '语音语料',
        label: '语音语料'
      },
      {
        value: '人脸采集',
        label: '人脸采集'
      },
      {
        value: 'OCR',
        label: 'OCR'
      },
      {
        value: '文本资料',
        label: '文本资料'
      }
    ]
  },
  {
    value: 'ElectronicBusinessDataSets',
    label: '电商营销',
    children: [
      {
        value: '用户画像',
        label: '用户画像'
      },
      {
        value: '精准营销',
        label: '精准营销'
      },
      {
        value: '行业数据',
        label: '行业数据'
      },
      {
        value: '消费数据',
        label: '消费数据'
      },
      {
        value: '商品数据',
        label: '商品数据'
      }
    ],
  },
  {
    value: 'TrafficDataSets',
    label: '交通数据',
    children: [
      {
        value: '道路',
        label: '道路'
      },
      {
        value: '交通设施',
        label: '交通设施'
      },
      {
        value: '路况',
        label: '路况'
      },
      {
        value: '车辆数据',
        label: '车辆数据'
      },
      {
        value: '违章信息',
        label: '违章信息'
      },
      {
        value: '车辆GPS',
        label: '车辆GPS'
      }
    ],
  },
  {
    value: 'ServiceDataSets',
    label: '应用开发',
    children: [
      {
        value: '社交数据',
        label: '社交数据'
      },
      {
        value: '气象环境',
        label: '气象环境'
      },
      {
        value: '位置信息',
        label: '位置信息'
      },
      {
        value: '黑名单',
        label: '黑名单'
      },
      {
        value: '通讯数据',
        label: '通讯数据'
      }
    ],
  }
];


const residences2 =[
  {
    value: 'GovernmentDataSets',
    label: '政务数据',
    children: [
      {
        value: '工商信息',
        label: '工商信息'
      },
      {
        value: '住房公积金',
        label: '住房公积金'
      },
      {
        value: '经济指数',
        label: '经济指数'
      },
      {
        value: '城市数据',
        label: '城市数据'
      }
    ]
  
  }, 
  {
    value: 'FinanceDataSets',
    label: '金融数据',
    children: [
      {
        value: '个人征信',
        label: '个人征信'
      },
      {
        value: '企业征信',
        label: '企业征信'
      },
      {
        value: '身份核验',
        label: '身份核验'
      },
      {
        value: '黑名单',
        label: '黑名单'
      },
      {
        value: '银行数据',
        label: '银行数据'
      }
    ]
  },
  {
    value: 'MedicalDataSets',
    label: '医疗卫生',
    children: [
      {
        value: '药品数据',
        label: '药品数据'
      },
      {
        value: '医院医生',
        label: '医院医生'
      },
      {
        value: '病例数据',
        label: '病例数据'
      },
      {
        value: '体检数据',
        label: '体检数据'
      }
    ]
  },
  {
    value: 'AIDataSets',
    label: '人工智能',
    children: [
      {
        value: '语音语料',
        label: '语音语料'
      },
      {
        value: '人脸采集',
        label: '人脸采集'
      },
      {
        value: 'OCR',
        label: 'OCR'
      },
      {
        value: '文本资料',
        label: '文本资料'
      }
    ]
  },
  {
    value: 'ElectronicBusinessDataSets',
    label: '电商营销',
    children: [
      {
        value: '用户画像',
        label: '用户画像'
      },
      {
        value: '精准营销',
        label: '精准营销'
      },
      {
        value: '行业数据',
        label: '行业数据'
      },
      {
        value: '消费数据',
        label: '消费数据'
      },
      {
        value: '商品数据',
        label: '商品数据'
      }
    ],
  },
  {
    value: 'TrafficDataSets',
    label: '交通数据',
    children: [
      {
        value: '道路',
        label: '道路'
      },
      {
        value: '交通设施',
        label: '交通设施'
      },
      {
        value: '路况',
        label: '路况'
      },
      {
        value: '车辆数据',
        label: '车辆数据'
      },
      {
        value: '违章信息',
        label: '违章信息'
      },
      {
        value: '车辆GPS',
        label: '车辆GPS'
      }
    ],
  },
  {
    value: 'ServiceDataSets',
    label: '应用开发',
    children: [
      {
        value: '社交数据',
        label: '社交数据'
      },
      {
        value: '气象环境',
        label: '气象环境'
      },
      {
        value: '位置信息',
        label: '位置信息'
      },
      {
        value: '黑名单',
        label: '黑名单'
      },
      {
        value: '通讯数据',
        label: '通讯数据'
      }
    ],
  }
];
