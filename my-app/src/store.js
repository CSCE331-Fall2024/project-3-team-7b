import { createStore } from 'redux';
import rootReducer from './reducer';

// Purpose: Creates the redux storage
const store = createStore(rootReducer);

export default store;