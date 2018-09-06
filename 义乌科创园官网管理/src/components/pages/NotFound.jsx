/**
 * authored on 2017/5/7.
 */
import React from 'react';
import img from '../../style/imgs/404.png';

import { Button } from 'antd';

class NotFound extends React.Component {
    state = {
        animated: ''
    };
    enter = () => {
        this.setState({animated: 'hinge'})
    };
    render() {
        return (
            <div className="center" style={{height:'1200px',maxHeight: '100%', background: '#ececec', overflow: 'hidden',textAlign:'center',padding:'80px'}}>
                <div><img src={img} alt="404" className={`animated swing ${this.state.animated}`} onMouseEnter={this.enter.bind(this)} /></div>
                <div style={{fontSize:'4.5rem',marginBottom:'4.5rem'}}>Page Not Found</div>
                <Button type='primary' style={{border:'none',}}><a href={window.location.origin}>返回首页</a></Button>
            </div>
        )
    }
}

export default NotFound;