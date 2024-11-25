// Creates the initial state (no order)
const initialState = {
    orders: [[], []],
    isComplete: false
};

// Defines the reducer function to interact with redux storage
function rootReducer(state = initialState, action) {
    if (action.type == "write") {
        return {orders: action.data.orders, isComplete: action.data.isComplete};
    }
    else {
        return state;
    }
}

export default rootReducer;
