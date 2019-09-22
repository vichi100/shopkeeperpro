import { ADD_TO_CART, EMPTY_CART, REMOVE_FROM_CART } from '../actions/types';

const initialState = {
    cart: [],
    total: 0,
}

export default function(state=initialState, action) {
    switch(action.type){
        case ADD_TO_CART:
            let toAdd = 'true'
            console.log("state: " + JSON.stringify(state));
            console.log("action: " + JSON.stringify(action));
            // check if product is already in card
            let newProductId = action.payload.productid;
            console.log("newProductId: " + newProductId);
            Object.keys(state).map((keyName, keyIndex) => { 
            // use keyName to get current key's name
            let pid = state[keyName].productid;
            console.log("product id: " + pid);
            if (pid === newProductId) {
                toAdd = 'false'
                return;
            }
            // console.log("data : " + response[keyName].type);
            // and a[keyName] to get its value
            });
            if( toAdd === 'true'){
            //return [...state, action.payload];
            var data = [...state, action.payload];
            return data.filter(cartItem => cartItem.productid !== undefined || cartItem.productid !== null);
            }else{
            // return [...state];
            var data = [...state];
            return data.filter(cartItem => cartItem.productid !== undefined || cartItem.productid !== null);
            }
        case EMPTY_CART:
            return {
                ...state,
                cart: [],
                total: 0
            }
        case REMOVE_FROM_CART:
            return state.filter(cartItem => cartItem.productid !== action.payload.productid);
        default:
            return state
    }
}
