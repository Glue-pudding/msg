import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter,Route } from 'react-router-dom';

import './index.css';
// import App from './modules/app/App';
import HorizonApp from "./modules/horizonGrid";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<BrowserRouter>
    <HorizonApp />
  </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
