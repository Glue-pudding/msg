import React from 'react';
import { Link } from 'react-dom';
import { Switch, Input, Select,Popconfirm, Divider  } from 'antd';
const Option = Select.Option;


export const columns = t => {
  const { isEditing, editKey, editData } = t.state;
  return [{
    title: '属性名称',
    dataIndex: 'SchemaName',
    key: 'SchemaName',
    width:'20%',
    editable: true,
    selectedRowKeys: true,
    render: (text, record) => {
      return (
        <div>
          {
            isEditing && record.key === editKey? 
              <Input
                value={text}
                placeholder="请输入属性名称"
                onChange={t.oneEditChange.bind(t,record,'SchemaName')}
                onBlur={t.editblur.bind(t,record,'SchemaName')}
              />
              :
              text
          }
        </div>
      );
    }
  }, {
    title: '类型',
    dataIndex: 'SchemaType',
    key: 'SchemaType',
    width:'20%',
    editable: true,
    render: (text, record) => {
      return (
        <div>
          {
            isEditing && record.key === editKey ? 
              <Select
                labelInValue
                defaultValue={record.SchemaType?{key:record.SchemaType}:{ key: 'string'} } 
                style={{ width: 120 }}
                onChange={t.oneEditChange.bind(t,record,'SchemaType')}
              >
                <Option value="string">string</Option>
                <Option value="int">int</Option>
                <Option value="long">long</Option>
                <Option value="double">double</Option>
              </Select>
              :
              text
          }
          
        </div>
      );
    }
  },  {
    title: '描述',
    dataIndex: 'SchemaDescription',
    key: 'SchemaDescription',
    editable: true,
    width:'20%',
    render: (text, record) => {
      return (
        <div>
          {
            isEditing && record.key === editKey ? 
              <Input
                value={text}
                placeholder="请输入描述信息"
                onChange={t.oneEditChange.bind(t,record,'SchemaDescription')}
              />
              :
              text
          }
        </div>
      );
    }
  },{
    title: '数据是否加密',
    dataIndex: 'Sensitive',
    key: 'Sensitive',
    width:'20%',
    editable: true,
    render: (text, record) => {
      // console.log('istrue', text);
      return <span style={{display:'inline-block'}}>
        {/* <Link to={'/supply/details/'+record.UserName}>详情</Link> */}
        {
          isEditing && record.key === editKey ? 
            <Switch
              checkedChildren="开" 
              unCheckedChildren="关" 
              defaultChecked={record.Sensitive}
              onChange={t.oneEditChange.bind(t,record,'Sensitive')}
            />
            :
            t.renderStateIcon(record)
        }
      </span>;
    }
  },{
    title: '操作',
    key: 'action2',
    width:'20%',
    render: (text, record) => {
      // const editable = t.isEditing(record);
      return (
        <div>
          {
            isEditing && record.key === editKey ? 
              <span>
                <a onClick={() => t.saveRowData(record)}>保存</a>
                <Divider type="vertical" style={{margin:'0 5px'}}/>
                <a onClick={() => t.cancelRowData(record)}>取消</a>
              </span>
              : 
              <span>
                <a onClick={() => t.editRowData(record)}>编辑</a>
                <Divider type="vertical" style={{margin:'0 5px'}}/>
                <Popconfirm title="是否删除" onConfirm={() => t.delRowData(record)}>
                  <a href="javascript:;">删除</a>
                </Popconfirm>
              </span>
          }
        </div>
      );
    }
  }];
};

// mock数据
export const dataList = [
  {
    SchemaName: '篮球',
    SchemaType: '体育',
    SchemaDescription: '100/个',
    Sensitive: true,
    key: `${Math.random()}`
  },
  {
    SchemaName: '足球',
    SchemaType: '体育',
    SchemaDescription: '60/个',
    Sensitive: false,
    key: `${Math.random()}`
  }
];



export const residences = [
  {
    value: '政务数据',
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
    value: '金融数据',
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
    value: '医疗卫生',
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
    value: '人工智能',
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
    value: '电商营销',
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
    value: '交通数据',
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
    value: '应用开发',
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


const residences2 = [
  {
    value: '政务数据',
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
    value: '金融数据',
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
    value: '医疗卫生',
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
    value: '人工智能',
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
    value: '电商营销',
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
    value: '交通数据',
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
    value: '应用开发',
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
