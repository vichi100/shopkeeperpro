import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
// import PureChart from './pure-chart'
import PureChart from './PureChart';

import moment from 'moment'
import { ScrollView } from 'react-native-gesture-handler';
export default class SalesChart extends React.Component {
  constructor (props) {
    super(props)
    this.generateData = this.generateData.bind(this)
    this.state = {
      data: [],
      pieData: [{label: '사람', value: 110, color: 'red'}, {label: '동물', value: 140, color: 'green'} , {label: '동물', value: 50, color: 'blue'} ],
      pieData2: [{value: 220700.26, color: 'red'}, { value: 140700.89, color: 'yellow'} ],
      pieData3: [{value: 220}, { value: 140} ]
    }
  }

  // 파이차트 테스트 하기
  /*
  componentDidMount () {
    this.test = 0
    setInterval(() => {
      if (this.test < 360) {
        this.test++
        this.setState({
          pieData: [this.test, 360 - this.test]
        })
      }
    }, 5)
  }
  */

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

    // type = bar , pie, line
    return (
      <View style={styles.container}>
      <ScrollView>
        <View style={{padding: 5, marginTop: 10}}>
          <PureChart type={'line'}
            data={this.state.data}
            width={'100%'}
            height={200} 
            onPress={(a) => {
              console.log('onPress', a)
            }}
            // xAxisColor={'black'}
            yAxisColor={'red'} 
            xAxisGridLineColor={'#fff'} 
            //yAxisGridLineColor={'red'}
            minValue={10}
            labelColor={'blue'}
            showEvenNumberXaxisLabel={false}
            numberOfYAxisGuideLine={20} 
            customValueRenderer={(index, point) => {
              if (index < 1) return null 
              return (
                <Text style={{textAlign: 'center'}}>{point.y}</Text>
              )
            }}
            />
          <PureChart type={'bar'}
            data={this.state.data}
            height={100}
            xAxisColor={'red'}
            yAxisColor={'red'}
            xAxisGridLineColor={'red'}
            yAxisGridLineColor={'red'}
            showEvenNumberXaxisLabel={false}
            labelColor={'red'}
            numberOfYAxisGuideLine={10} 
            // customValueRenderer={(index, point) => {
            //   if (index < 5) return null
            //   return (
            //     <Text style={{textAlign: 'center'}}>{point.y}</Text>
            //   )
            // }}
            />
          {/* <PureChart type={'line'} data={this.state.data} /> */}
          {/* <PureChart type={'bar'} data={this.state.data} /> */}
          <PureChart type={'pie'} data={this.state.pieData} />
          <Button style={{marginTop: 20}} title='Generate chart data' onPress={this.generateData}>
            <Text>Generate chart data</Text>
          </Button>

        </View>
        </ScrollView> 
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  }
})
