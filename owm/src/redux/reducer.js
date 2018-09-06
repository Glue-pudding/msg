import { combineReducers } from "redux";

import indexReducer from "../modules/horizonGrid/indexReducer";
import homeReducer from "../modules/home/homeReducer";
import connectReducer from "../modules/connect/connectReducer"; //  联系我们
import commonReducer from "../modules/common/commonReducer";
import newsReducer from "../modules/news/newsReducer";
import productReducer from "../modules/product/productReducer";
import aboutReducer from "../modules/about/aboutReducer";
const reducer = combineReducers({
    connectState:connectReducer,
    homeState:homeReducer,
    indexState:indexReducer,
    commonState:commonReducer,
    newsState:newsReducer,
    productState:productReducer,
    aboutState:aboutReducer
});
export default reducer;
