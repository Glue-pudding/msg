import 'babel-polyfill';
import 'raf/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import reducers from '../redux/reducer';
import { BrowserRouter,Route,Switch,HashRouter} from 'react-router-dom';
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
const store = createStore(reducers, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
let hasPreview = JSON.parse(sessionStorage.getItem('preview'));
if(hasPreview){
  window.removeEventListener("beforeunload",()=>console.log('index'));
}else{
  window.addEventListener("beforeunload", function(event) {
    event.returnValue = "是否保存编辑内容";
  });
}
// window.onpageshow = function(event) {
//   if (event) {
//       window.location.reload() 
//   }
//   return false
// };
sessionStorage.setItem('preview',false);
ReactDOM.render(<Provider store={store}>
    <BrowserRouter>
      <Switch>        
        <Route exact path="/404" component={NotFound} />
        <App />
      </Switch>
    </BrowserRouter>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
