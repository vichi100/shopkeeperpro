import React from 'react';
import debounce from 'lodash.debounce';

//https://snack.expo.io/@vichi/3c31ae
//https://code-examples.net/en/q/2282bc9

const withPreventDoubleClick = (WrappedComponent) => {
  
  class PreventDoubleClick extends React.PureComponent {
    
    debouncedOnPress = () => {
      this.props.onPress && this.props.onPress();
    }
    
    onPress = debounce(this.debouncedOnPress, 700, { leading: true, trailing: false });
    
    render() {
      return <WrappedComponent {...this.props} onPress={this.onPress} />;
    }
  }
  
  PreventDoubleClick.displayName = `withPreventDoubleClick(${WrappedComponent.displayName ||WrappedComponent.name})`
  return PreventDoubleClick;
}

export default withPreventDoubleClick;