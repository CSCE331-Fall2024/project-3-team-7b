// Creates the initial state (no order)
const initialState = {
    subtotal: 0.00,
    order: ""
};

// Defines the reducer function to interact with redux storage
function rootReducer(state = initialState, action) {
    if (action.type == "write") {
        return {subtotal: action.data.subtotal, order: action.data.order};
    }
    else {
        return state;
    }
}

export default rootReducer;
