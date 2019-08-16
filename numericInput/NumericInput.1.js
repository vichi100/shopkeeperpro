import React, { Component } from 'react'
import { View, TextInput, StyleSheet, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { EvilIcons } from "@expo/vector-icons";
import Button from './Button'
import PropTypes from 'prop-types'
import {create,PREDEF_RES} from 'react-native-pixel-perfect';
import { connect } from "react-redux";

let calcSize = create(PREDEF_RES.iphone7.px)

class NumericInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.initValue,
            lastValid:props.initValue,
            stringValue: props.initValue.toString(),
        }
        this.ref = null
    }
	
	componentWillReceiveProps(props) {
    if (props.initValue !== this.state.value) {
      this.setState({
        value: props.initValue,
        lastValid: props.initValue,
        stringValue: props.initValue.toString()
      });
    }
  }
    updateBaseResolution = (width,height) => {
        calcSize = create({width,height})
    }

    

    inc = () => {
        
        console.log('onChange called')
        //console.log(this.props.value)
        let value = this.props.value && (typeof this.props.value === 'number') ? this.props.value : this.state.value
        console.log('this.state.value: '+this.state.value)
        //console.log('this.props.value: '+JSON.stringify(this.props.value.item))
        if (this.props.maxValue === null || (value < this.props.maxValue)) {
            value = (value + this.props.step).toFixed(12)
            value = this.props.valueType === 'real' ? parseFloat(value) : parseInt(value)
            this.setState({ value,stringValue:value.toString() })
            this.props.value.item['qty'] = value
            console.log('this.props.value: '+JSON.stringify(this.props.value.item))
        }
        if (value !== this.props.value)
            this.props.onChange && this.props.onChange(Number(value)) 

        //this.props.dispatch({ type: 'CHANGE_QTY' });
    }
    dec = () => {
        console.log('onChange called')
        //this.props.dispatch({ type: 'CHANGE_QTY' });
        let value = this.props.value && (typeof this.props.value === 'number') ? this.props.value : this.state.value
        if (this.props.minValue === null || (value > this.props.minValue)) {
            value = (value - this.props.step).toFixed(12)
            value = this.props.valueType === 'real' ? parseFloat(value) : parseInt(value)
            this.setState({ value,stringValue:value.toString() })
            this.props.value.item['qty'] = value
            console.log('this.props.value: '+JSON.stringify(this.props.value.item))
        }
        if (value !== this.props.value)
            this.props.onChange && this.props.onChange(Number(value))
    }
    isLegalValue = (value,mReal,mInt) => value === '' || (((this.props.valueType === 'real' && mReal(value)) || (this.props.valueType !== 'real' && mInt(value))) && (this.props.maxValue === null || (parseFloat(value) <= this.props.maxValue)) && (this.props.minValue === null || (parseFloat(value) >= this.props.minValue)))

    realMatch = (value) => value && value.match(/-?\d+(\.(\d+)?)?/) && value.match(/-?\d+(\.(\d+)?)?/)[0] === value.match(/-?\d+(\.(\d+)?)?/).input

    intMatch = (value) => value && value.match(/-?\d+/) && value.match(/-?\d+/)[0] === value.match(/-?\d+/).input

    onChange = (value) => {
        console.log('onChange called')
        let currValue = typeof this.props.value === 'number' ? this.props.value : this.state.value
        if((value.length === 1 && value==='-') || (value.length === 2 && value==='0-')){
            console.log('onChange called')
            this.setState({stringValue:'-'})
            return
        }
        let legal = this.isLegalValue(value,this.intMatch,this.realMatch)
        if (!legal && !this.props.validateOnBlur) {
            if (this.ref) {
                this.ref.blur()
                setTimeout(() => {
                    this.ref.clear()
                    setTimeout(() => {
                        this.props.onChange && this.props.onChange(currValue - 1)
                    this.setState({ value: currValue - 1 }, () => {
                        this.setState({ value: currValue,legal })
                        this.props.onChange && this.props.onChange(currValue)
                    })},10)
                }, 15)
                setTimeout(() => this.ref.focus(), 20)

            }
        
        }else if(!legal && this.props.validateOnBlur){
            this.setState({stringValue:value})
            let parsedValue = this.props.valueType === 'real' ? parseFloat(value) : parseInt(value)
            parsedValue = isNaN(parsedValue) ? 0 : parsedValue
                if (parsedValue !== this.props.value)
                    this.props.onChange && this.props.onChange(parsedValue)
                this.setState({ value: parsedValue,legal,stringValue:parsedValue.toString() })
        } else {
            this.setState({stringValue:value})
            let parsedValue = this.props.valueType === 'real' ? parseFloat(value) : parseInt(value)
            parsedValue = isNaN(parsedValue) ? 0 : parsedValue
                if (parsedValue !== this.props.value)
                    this.props.onChange && this.props.onChange(parsedValue)
                this.setState({ value: parsedValue,legal,stringValue:parsedValue.toString() })
         
        }
    }
    onBlur = () => {
        let match = this.state.stringValue.match(/-?[0-9]\d*(\.\d+)?/)
        let legal = match && match[0] === match.input && ((this.props.maxValue === null || (parseFloat(this.state.stringValue) <= this.props.maxValue)) && (this.props.minValue === null || (parseFloat(this.state.stringValue) >= this.props.minValue)))
        let currValue = typeof this.props.value === 'number' ? this.props.value : this.state.value
        if(!legal){
            if (this.ref) {
                this.ref.blur()
                setTimeout(() => {
                    this.ref.clear()
                    setTimeout(() => {
                        this.props.onChange && this.props.onChange(this.state.lastValid)
                    this.setState({ value: this.state.lastValid }, () => {
                        this.setState({ value: this.state.lastValid,stringValue:this.state.lastValid.toString() })
                        this.props.onChange && this.props.onChange(this.state.lastValid)
                    })},10)
                }, 15)
                setTimeout(() => this.ref.focus(), 50)

            }
        }
        this.props.onBlur && this.props.onBlur()
    }

    onFocus = () => {
        this.setState({lastValid: this.state.value})
        this.props.onFocus && this.props.onFocus()
    }

    render() {
        const editable = this.props.editable
        const sepratorWidth =  (typeof this.props.separatorWidth === 'undefined') ? this.props.sepratorWidth : this.props.separatorWidth;//supporting old property name sepratorWidth
        const iconSize = this.props.iconSize
        const borderColor = this.props.borderColor
        const iconStyle = [style.icon, this.props.iconStyle]
        const totalWidth = this.props.totalWidth
        const totalHeight = this.props.totalHeight ? this.props.totalHeight : (totalWidth * 0.4)
        const inputWidth = this.props.type === 'up-down' ? (totalWidth * 0.6) : (totalWidth * 0.4)
        const paddingRight = 0;//totalWidth * 0.18
        const borderRadiusTotal = totalHeight * 0.18
        const fontSize = totalHeight * 0.38
        const textColor = 'black' //this.props.textColor 
        const maxReached = this.state.value === this.props.maxValue
        const minReached = this.state.value === this.props.minValue
        const inputContainerStyle = this.props.type === 'up-down' ?
            [style.inputContainerUpDown, { width: totalWidth, height: totalHeight, borderColor: borderColor }, this.props.rounded ? { borderRadius: borderRadiusTotal } : {}, this.props.containerStyle] :
            [style.inputContainerPlusMinus, {color: 'black',}, this.props.inputStyle]
        const inputStyle = this.props.type === 'up-down' ?
            [style.inputUpDown, { width: inputWidth, height: totalHeight, fontSize: fontSize, color: textColor, borderRightWidth: 2, borderRightColor: borderColor }, this.props.inputStyle] :
            [style.inputPlusMinus, {color: '#424242',}, ]
        const upDownStyle = [{ alignItems: 'center', width: totalWidth - inputWidth, backgroundColor: this.props.upDownButtonsBackgroundColor, borderRightWidth: 1, borderRightColor: borderColor }, this.props.rounded ? { borderTopRightRadius: borderRadiusTotal, borderBottomRightRadius: borderRadiusTotal } : {}]
        const rightButtonStyle = [
            {
                position: 'absolute',
                zIndex: -1,
                right: 0,
                //height: totalHeight - 2,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 0,
                //backgroundColor: this.props.rightButtonBackgroundColor,
               // width: (totalWidth - inputWidth) / 2
            },
            this.props.rounded ?
                {
                    borderTopRightRadius: borderRadiusTotal,
                    borderBottomRightRadius: borderRadiusTotal
                }
                : {}]
        const leftButtonStyle = [
            {
                position: 'absolute',
                zIndex: -1,
                left: 0,
                //height: totalHeight - 2,
                justifyContent: 'center',
                alignItems: 'center',
                //backgroundColor: this.props.leftButtonBackgroundColor,
                //width: (totalWidth - inputWidth) / 2,
                //borderWidth: 0
            },
            this.props.rounded ?
                { borderTopLeftRadius: borderRadiusTotal, borderBottomLeftRadius: borderRadiusTotal }
                : {}]
        const value = typeof this.props.value === 'number' ? this.props.value : this.state.value
        const inputWraperStyle = {
            alignSelf: 'center',
            // borderLeftColor: borderColor,
            // borderLeftWidth: sepratorWidth,
            // borderRightWidth: sepratorWidth,
            // borderRightColor: borderColor
        }
        if (this.props.type === 'up-down')
            return (
                <View style={inputContainerStyle}>
                    <TextInput editable={editable} returnKeyType='done'  keyboardType='numeric' value={this.state.stringValue} onChangeText={this.onChange} style={inputStyle} ref={ref => this.ref = ref} onBlur={this.onBlur} onFocus={this.onFocus}/>
                    <View style={upDownStyle}>
                        <Button onPress={this.inc} style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                            <Icon name='ios-arrow-up' size={fontSize} style={[...iconStyle,maxReached ? this.props.reachMaxIncIconStyle : {},minReached ? this.props.reachMinIncIconStyle : {}]} />
                        </Button>
                        <Button onPress={this.dec} style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                            <Icon name='ios-arrow-down' size={fontSize} style={[...iconStyle,maxReached ? this.props.reachMaxDecIconStyle : {},minReached ? this.props.reachMinDecIconStyle : {}]} />
                        </Button>
                    </View>
                </View>)
        else return (
            <View style={inputContainerStyle}>
                <Button onPress={this.dec} >
                    {/* <Icon name='md-remove' size={fontSize} style={[...iconStyle,maxReached ? this.props.reachMaxDecIconStyle : {},minReached ? this.props.reachMinDecIconStyle : {}]} /> */}
                    <EvilIcons name='minus' size={30}  />
                
                </Button>
                <View >
                    <TextInput editable={editable} returnKeyType='done'  keyboardType='numeric' value={this.state.stringValue} onChangeText={this.onChange} style={[inputStyle]}  />
                </View>
                <Button onPress={this.inc} >
                    {/* <Icon name='md-add' size={fontSize} style={[...iconStyle,maxReached ? this.props.reachMaxIncIconStyle : {},minReached ? this.props.reachMinIncIconStyle : {}]} /> */}
                    <EvilIcons name='plus' size={30}  />
                
                </Button>
            </View>)


    }
}

function mapStateToProps(state) {
    return {
        payload: state
    };
  }

// const mapDispatchToProps = dispatch => {
//     return {
//       increaseQty: product =>
//         dispatch({
//           type: "CHANGE_QTY",
//           payload: product
//         })
//       // increaseCounter: ()=> dispatch({type:"ICREASE_COUNTER"}),
//       // decreaseCounter: ()=> dispatch({type:"DECREASE_COUNTER"})
//     };
//   };
  
  export default connect(
    mapStateToProps 
  )(NumericInput);

const style = StyleSheet.create({
    seprator: {
        // backgroundColor: 'grey',
        // height: calcSize(80),
    },
    inputContainerUpDown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        borderColor: 'grey',
        borderWidth: 1
    },
    inputContainerPlusMinus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // /borderWidth: 1
    },
    inputUpDown: {
        textAlign: 'center',
        padding: 0

    },
    inputPlusMinus: {
        textAlign: 'center',
        padding: 0
    },
    icon: {
        // fontWeight: '900',
        // backgroundColor: 'rgba(0,0,0,0)'
    },
    upDown: {
        alignItems: 'center',
        //paddingRight: calcSize(15)
    }
})
NumericInput.propTypes = {
    iconSize: PropTypes.number,
    borderColor: PropTypes.string,
    iconStyle: PropTypes.any,
    totalWidth: PropTypes.number,
    totalHeight: PropTypes.number,
    sepratorWidth: PropTypes.number,
    type: PropTypes.oneOf(['up-down', 'plus-minus']),
    valueType: PropTypes.oneOf(['real', 'integer']),
    rounded: PropTypes.any,
    textColor: PropTypes.string,
    containerStyle: PropTypes.any,
    inputStyle: PropTypes.any,
    initValue: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    step: PropTypes.number,
    upDownButtonsBackgroundColor: PropTypes.string,
    rightButtonBackgroundColor: PropTypes.string,
    leftButtonBackgroundColor: PropTypes.string,
    editable: PropTypes.bool,
    reachMaxIncIconStyle:PropTypes.any,
    reachMaxDecIconStyle:PropTypes.any,
    reachMinIncIconStyle:PropTypes.any,
    reachMinDecIconStyle:PropTypes.any,
}
NumericInput.defaultProps = {
    iconSize: calcSize(30),
    //borderColor: '#d4d4d4',
    iconStyle: {},
    //totalWidth: calcSize(220),
    //sepratorWidth: 1,
    type: 'plus-minus',
    rounded: true,
    //textColor: 'white',
    containerStyle: {},
    //inputStyle: {color : 'blue'},
    initValue: 0,
    valueType: 'integer',
    value: null,
    minValue: null,
    maxValue: null,
    step: 1,
    // upDownButtonsBackgroundColor: 'white',
    // rightButtonBackgroundColor: 'white',
    // leftButtonBackgroundColor: 'white',
    editable: false,
    validateOnBlur: true,
    reachMaxIncIconStyle:{},
    reachMaxDecIconStyle:{},
    reachMinIncIconStyle:{},
    reachMinDecIconStyle:{}

}