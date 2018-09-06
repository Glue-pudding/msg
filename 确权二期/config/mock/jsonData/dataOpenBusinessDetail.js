export default {
  code: 10000,
  message: 'success',
  data: {
    'Result':'BusinessList',
    'BusinessName': '@name',
    'BusinessType|1':['GovernmentDataSets','FinanceDataSets','MedicalDataSets','AIDataSets','ElectronicBusinessDataSets','TrafficDataSets','ServiceDataSets'],
    'Supplier': '@name',
    'Customer': '@name',
    'SupplierStatus': 0,
    'CustomerStatus': 0,
    'Status|1':[0,1,2,3], 
    'StartTime': '2018-06-06',
    'EndTime': '2018-09-09', 
    'DataSetID': 2,
    'Description': 'dfgdf',
    'StoreType': 'hdfs',
    'BusinessID':1,
    'EditFlag|1':[0,1],
   
     
    'SchemaList|2-4': [ 
      { 
        'SchemaName': '@name',
        'SchemaType': 'String',
        'SchemaDescription':'SchemaSchema', 
        'SchemaID|+2': 1,  
        'Sensitive|1':[0,1], 
      }
    ]
  },
};