import 'babel-polyfill';
import 'raf/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import reducers from '../redux/reducer';
import { BrowserRouter,Route,Switch} from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import '@/tools/font-awesome/css/font-awesome.min.css'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';


import { Provider } from 'react-redux';
import './index.css';
import App from '../app/App';
import registerServiceWorker from '../registerServiceWorker';
import NotFound from '@/pages/NotFound';
AOS.init();
window.removeEventListener("beforeunload",()=>console.log("==load preview=="));
const store = createStore(reducers, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))

sessionStorage.setItem('preview',true);
// console.log("==load preview==");
ReactDOM.render(<Provider store={store}>
  <BrowserRouter>
    <Switch>        
      <Route exact path="/404" component={NotFound} isPreview={false} />
      <App />
    </Switch>
  </BrowserRouter></Provider>, document.getElementById('preview'));
registerServiceWorker();
