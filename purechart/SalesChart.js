import React from 'react'
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native'
// import PureChart from './pure-chart'
import PureChart from './PureChart';

import moment from 'moment'
import { ScrollView } from 'react-native-gesture-handler';
import { SERVER_URL } from "../Constants";
import axios from "axios";
import AnimatedBar from './AnimatedBar'; 
import SwitchButton from './SwitchButton';
import { AsyncStorage } from "react-native";

const window = Dimensions.get('window');



//https://stackoverflow.com/questions/44834443/set-random-backgroundcolor-from-array
//https://medium.com/@wwayne_me/let-s-drawing-charts-in-react-native-without-any-library-4c20ba38d8ab
//https://github.com/wwayne/react-native-nba-app
//https://medium.com/react-native-motion/animated-graph-in-react-native-51354af2bdb0
//https://github.com/oksktank/react-native-pure-chart
const monthStr=["Jan", 'Feb', 'Mar', "Apr", 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default class SalesChart extends React.Component { 

  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Sales Chart",
    headerBackTitle: null,
    headerStyle: {
      //backgroundColor: '#263238',
      //Background Color of Navigation Bar
    },
    headerTitleStyle: {
      justifyContent: "center",
      color: "#757575",
      textAlign: "left",
      flex: 1
    },
    headerTintColor: "#757575"
  };

  constructor (props) {
    super(props)
    this.generateData = this.generateData.bind(this)
    this.state = {
      switchDaynMonth: 'day',
      activeSwitch:1,
      data: [],
      hBarData:[],
      dailySalesChart: null,
      monthlySalesChar:[],
      dailyTopCustomer: null,
      monthlyTopCustomer: null,
      pieData: [{label: '사람', value: 110, color: 'red'}, {label: '동물', value: 140, color: 'green'} , {label: '동물', value: 50, color: 'blue'} ],
      pieData2: [{value: 220700.26, color: 'red'}, { value: 140700.89, color: 'yellow'} ],
      pieData3: [{value: 220}, { value: 140} ]
    }
  }

  
  async componentDidMount () {
    var shopid = await AsyncStorage.getItem("shopid");
    const orderQueryData = {
      shopid: shopid
    };

    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/fetchOrderChartData",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: orderQueryData     
    })
    .then(result => {
      console.log("Resp Data: " + JSON.stringify(result.data.dailySalesData));
      var dailySalesData = result.data.dailySalesData;
      var dailySalesChartData = [] 
      dailySalesData.map(function(item) {
        var oneDaySale = item._id;
        var oneDaySaleDate = oneDaySale.day; 
        var onDaySaleMonth = oneDaySale.month;
        var totalAmountOfDate = item.totalAmount;
        var oneDaySaleDatenMonth = oneDaySaleDate+'/'+monthStr[onDaySaleMonth-1]
        var oneDayNumberOfOrder = item.count
        const dailySaleCharDataObj = {
          x: oneDaySaleDatenMonth,
          y: totalAmountOfDate,
          z: oneDayNumberOfOrder,
        }
        dailySalesChartData.push(dailySaleCharDataObj) 

      });
      
      var dailyTopCustomer = result.data.dailyTopCustomer
      var monthlyTopCustomer = result.data.monthlyTopCustomer
      // console.log('dailyTopCustomer: '+JSON.stringify(monthlyTopCustomer)) 
      // for (let i = 0; i < 15; i++) {
      //   dataxx.push(Math.floor(Math.random() * window.width));  
      // }
  
      
      // console.log('dailySalesChartData+ '+JSON.stringify(dailySalesChartData))
      this.setState({dailySalesChart: dailySalesChartData, hBarData: dailyTopCustomer, dailyTopCustomer: dailyTopCustomer, monthlyTopCustomer:  monthlyTopCustomer})
      // this.generateHBarData()
    })
    .catch(error => {  
      console.error(error);
    });
    
  }

  switchTopCustomer = (val) =>{
     console.log('switchTopCustomer: '+val)
     if(val === 2){
      this.setState({ activeSwitch: val, hBarData: this.state.monthlyTopCustomer, switchDaynMonth: 'month' })
     }else if(val === 1){
      this.setState({ activeSwitch: val, hBarData: this.state.dailyTopCustomer, switchDaynMonth: 'day' })
     }
    
  }

  generateHBarData = () => {
    console.log('generateHBarData') 
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push((((i+1)*100)));
    }

    this.setState({
      hBarData:data,
    });
  }
  

  generateData () {
    var data = []
    var data2 = []
    var data3 = []
    var pieData = []
    var startDate = moment()
    for (var i = 0; i < 30; i++) {
      startDate.add(1, 'days')
      data.push(
        {
          x: startDate.format('DD/MMM'),
          y: Math.round(Math.random() * 1000)
        }
      )
      data2.push(
        {
          x: startDate.format('YYYY-MM-DD'),
          y: Math.round(Math.random() * 50) + 0.5
        }
      )
      data3.push(
        {
          x: startDate.format('YYYY-MM-DD'),
          y: Math.round(Math.random() * 1000)
        }
      )
    }

    console.log('Data: '+ JSON.stringify(data))
    for (let i = 0; i < 5; i++) {
      pieData.push({
        value: Math.round(Math.random() * 500),
        label: 'Marketing'+i
      })

      
    }

    // console.log('pieData: '+JSON.stringify(pieData))

    // this.setState({data: [
    //   {seriesName: 'test', data: data, color: '#ff4b00'},
    //    {seriesName: 'test2', data: data2, color: '#0e95de'},
    //    {seriesName: 'test3', data: data3, color: '#00c19b'}
    // ]})

    this.setState({
      data: [
        {
          seriesName: 'test2', data: data.slice(), color: '#0e95de'
        }
      ],
      pieData: pieData
    })
  }
  render () {

    console.log('this.state.hBarData:+ '+this.state.hBarData)

    // type = bar , pie, line
    return (
<View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', padding: 5, marginTop:15 }}>
      <ScrollView>
        <View style={{marginRight:60}}>
          {this.state.hBarData.map((value, index) => <AnimatedBar value={value} key={index} />)}
        </View>
        <View style={{marginBottom: 30, marginTop:15, flex:1, flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={{ fontFamily: 'sans-serif', fontWeight:'500', numberOfLines:1}}>Top 15 buyer of the {this.state.switchDaynMonth}</Text>

        
            <SwitchButton
                onValueChange={(val) => this.switchTopCustomer(val)}      // this is necessary for this component
                text1 = 'Day'                        // optional: first text in switch button --- default ON
                text2 = 'Month'                       // optional: second text in switch button --- default OFF
                switchWidth = {120}                 // optional: switch width --- default 44
                switchHeight = {27}                 // optional: switch height --- default 100
                switchdirection = 'ltr'             // optional: switch button direction ( ltr and rtl ) --- default ltr
                switchBorderRadius = {120}          // optional: switch border radius --- default oval
                switchSpeedChange = {500}           // optional: button change speed --- default 100
                switchBorderColor = '#eeeeee'       // optional: switch border color --- default #d4d4d4
                switchBackgroundColor = '#fff'      // optional: switch background color --- default #fff
                btnBorderColor = '#00a4b9'          // optional: button border color --- default #00a4b9
                btnBackgroundColor = '#00bcd4'      // optional: button background color --- default #00bcd4
                fontColor = '#b1b1b1'               // optional: text font color --- default #b1b1b1
                activeFontColor = '#fff'            // optional: active font color --- default #fff
            />
            
            { this.state.activeSwitch === 1 ? console.log('view1') : console.log('view2') }
            
       
</View>
        <PureChart type={'line'} 
            data={this.state.dailySalesChart}
            width={'100%'}
            height={200} 
            onPress={(a) => {
              console.log('onPress', a)
            }}
            // xAxisColor={'black'}
            yAxisColor={'#fff'} 
            xAxisGridLineColor={'#fff'} 
            //yAxisGridLineColor={'red'}
            minValue={10}
            labelColor={'#757575'}   
            showEvenNumberXaxisLabel={false}
            numberOfYAxisGuideLine={20} 
            customValueRenderer={(index, point) => {
              if (index < 1) return null 
              return (
                <Text style={{textAlign: 'center'}}>{point.y}</Text>
              )
            }}
            />
 
<Text style={{marginBottom: 30, marginTop:15, alignContent: 'center', textAlign: 'center' , fontWeight:'500'}}>Daily Sales Chart</Text>


<PureChart type={'bar'}
            data={this.state.dailySalesChart}
            height={150}
            xAxisColor={'#757575'} 
            yAxisColor={'#fff'}
            xAxisGridLineColor={'#0091ea'}
            yAxisGridLineColor={'#e0e0e0'}
            showEvenNumberXaxisLabel={false}
            labelColor={'#757575'}
            numberOfYAxisGuideLine={10} 
            customValueRenderer={(index, point) => {
              if (index < 5) return null
              return (
                <Text style={{textAlign: 'center'}}>{point.y}</Text>
              )
            }}
            />
<Text style={{marginBottom: 30, marginTop:15, alignContent: 'center', textAlign: 'center', fontWeight:'500' }}>Monthly Sales Chart</Text>

        </ScrollView>
      </View> 

      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignContent: 'center'
  }
})
