const cartItems = (state = [], action) => {
  console.log('action: '+JSON.stringify(action.type))
  if(action.payload !== undefined){
    action.payload['available'] = 'yes';
  }
  
  // this.props.value.item['available'] = 'yes'
  console.log('action.payload: '+JSON.stringify(action.payload)) 
  switch (action.type) {
    case "ADD_TO_CART":
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
      
    case "REMOVE_FROM_CART":
      console.log('REMOVE_FROM_CART: '+ JSON.stringify(state.filter(cartItem => cartItem.productid !== action.payload.productid)))
      return state.filter(cartItem => cartItem.productid !== action.payload.productid);
    case "CHANGE_QTY":
      console.log('CHANGE_QTY')
      var data = [...state, {'productid': '1'}];
      console.log('CHANGE_QTY: '+JSON.stringify(data))
      return data.filter(cartItem => cartItem.productid !== '1');
    
    case "EMPTY_CART":
      // console.log('CLEAR_COMPLETED')
      state = []
      return state
 
  }
  return state;
};

export default cartItems;
