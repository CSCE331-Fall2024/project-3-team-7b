// Creates the initial state (no order)
const initialState = {
    orders: [[], []]
};

// Defines the reducer function to interact with redux storage
function rootReducer(state = initialState, action) {
    if (action.type == "write") {
        return {orders: action.data.orders};
    }
    else {
        return state;
    }
}

export default rootReducer;
