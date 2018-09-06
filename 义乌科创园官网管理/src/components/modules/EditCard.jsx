import { React } from 'React'
import { Input, Card,Icon } from 'antd'
const EditableCard = ({ editable,title,clsName,value,onCancel,onSave,onEdit, onChange }) => {
    let actArr = editable?[<span >取消</span>,<span>保存</span>]:[<div >编辑</div>];
    return <Card actions={actArr}>
        <p className={clsName}><Icon type="environment" style={{ color: '#BFC4CE', width: 16, height: 25 }} /></p>
        <p >{title}</p>
        {editable?<Input value={value} />:<p >Card content</p>}
    </Card>
}
    
export default EditableCard