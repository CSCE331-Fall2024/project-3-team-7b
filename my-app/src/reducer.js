const initialState = {
    subtotal: 0.00,
    order: ""
};

function rootReducer(state = initialState, action) {
    if (action.type == "write") {
        return {subtotal: action.data.subtotal, order: action.data.order};
    }
    else {
        return state;
    }
}

export default rootReducer;
