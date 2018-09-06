import React from 'react';
import ReactDOM from 'react-dom';
import reducers from './redux/reducer';
import { BrowserRouter,Route} from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import '@/tools/font-awesome/css/font-awesome.min.css'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';


import { Provider } from 'react-redux';
import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
AOS.init();
const store = createStore(reducers, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
function enter(prevState){
  console.log(prevState);
}
ReactDOM.render(<Provider store={store}><BrowserRouter onEnter={enter}>
    <App />
  </BrowserRouter></Provider>, document.getElementById('root'));
registerServiceWorker();
