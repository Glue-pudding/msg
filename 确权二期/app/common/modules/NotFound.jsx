import React from 'react';
import img from '@static/images/404.png';
import { Button } from 'antd';

class NotFound extends React.Component {
  render() {
    return (
      <div className="center" style={{height:'1200px',maxHeight: '100%', background: '#ececec', overflow: 'hidden',textAlign:'center',padding:'80px'}}>
        <div><img src={img} alt="404" /></div>
        <div style={{fontSize:'4.5rem',marginBottom:'4.5rem'}}>Page Not Found</div>
        <Button type='primary' style={{border:'none',}}><a href={window.location.origin}>返回首页</a></Button>
      </div>
    );
  }
}

export default NotFound;