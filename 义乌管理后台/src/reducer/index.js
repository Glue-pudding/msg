/**
 * Created by author on 2017/7/30.
 */
import { combineReducers } from 'redux';
import * as type from '../action/type';

let defaultState = {
    isFetching: true, data: {}
}
const handleData = (state = defaultState, action) => {
    switch (action.type) {
        case type.REQUEST_DATA:
            return {...state, isFetching: true};
        case type.RECEIVE_DATA:
            return {...state, isFetching: false, data: action.data};
        default:
            return {...state};
    }
};
const httpData = (state = {}, action) => {
    switch (action.type) {
        case type.RECEIVE_DATA:
        case type.REQUEST_DATA:
            return {
                ...state,
                [action.category]: handleData(state[action.category], action)
            };
        default:
            return {...state};
    }
};

export default combineReducers({
    httpData
});
