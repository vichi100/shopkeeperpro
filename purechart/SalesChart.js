import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
// import PureChart from './pure-chart'
import PureChart from "./PureChart";
import { Feather } from "@expo/vector-icons";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import { SERVER_URL } from "../Constants";
import axios from "axios";
import AnimatedBar from "./AnimatedBar";
import SwitchButton from "./SwitchButton";
import { AsyncStorage } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const window = Dimensions.get("window");

//https://stackoverflow.com/questions/44834443/set-random-backgroundcolor-from-array
//https://medium.com/@wwayne_me/let-s-drawing-charts-in-react-native-without-any-library-4c20ba38d8ab
//https://github.com/wwayne/react-native-nba-app
//https://medium.com/react-native-motion/animated-graph-in-react-native-51354af2bdb0
//https://github.com/oksktank/react-native-pure-chart
const monthStr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export default class SalesChart extends React.Component {

  static navigationOptions = ({ navigation }) => {
    //https://stackoverflow.com/questions/45596645/react-native-react-navigation-header-button-event
    const { params = {} } = navigation.state;
    return {
      title: "Sales Chart",
      headerTitleStyle: {
        justifyContent: "center",
        color: "#757575",
        textAlign: "left",
        flex: 1
      },
        // headerStyle: {backgroundColor:'#3c3c3c'},
        headerRight: <Feather
        style={{ marginRight: 10, color: "#424242" }}
        name={"arrow-down-left"}
        size={25}
        onPress={() => params.openCreditOrderList()} 
      />
      
      
      };
};
  // static navigationOptions = {
  //   //To set the header image and title for the current Screen
  //   title: "Sales Chart",
  //   headerBackTitle: null,
  //   headerStyle: {
  //     //backgroundColor: '#263238',
  //     //Background Color of Navigation Bar
  //   },
  //   headerTitleStyle: {
  //     justifyContent: "center",
  //     color: "#757575",
  //     textAlign: "left",
  //     flex: 1
  //   },
  //   headerTintColor: "#757575"
  // };

  constructor(props) {
    super(props);
    // this.generateData = this.generateData.bind(this);
    this.state = {
      isLoading: true,
      switchDaynMonth: "day",
      activeSwitch: 1,
      data: [],
      hBarData: [],
      dailySalesChart: null,
      monthlySalesChart: null,
      dailyTopCustomer: null,
      monthlyTopCustomer: null,
      moneyPieCharData: [],
      receivedamount: 0,
      creditamount: 0,
      neworderamount: 0,
      pieData: [
        { label: "Received", value: 11111111110, color: "#bbdefb" }, //rgba(29, 231, 245, 0.1)
        { label: "Credit", value: 1141110898, color: "#f8bbd0" }, //rgba(245, 54, 29, 0.198)
        { label: "New", value: 5001117978, color: "#c8e6c9" } //rgba(142, 213, 87, 0.3)
      ]
    };
  }

  async componentDidMount() {
    this.props.navigation.setParams({ openCreditOrderList: this.openCreditOrderList });
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
        console.log("Resp Data: " + JSON.stringify(result.data));

        var moneyMattersPieData = result.data.moneyMattersPieData;
        console.log(
          "moneyMattersPieData: " + JSON.stringify(moneyMattersPieData)
        );
        var moneyPieCharDataX = [];
        var creditamount;
        var receivedamount;
        var neworderamount;
        
        moneyMattersPieData.map(function(item) {
          var amountName = item._id;
          var totalAmount = item.totalAmount;
          var totalOrdersCount = item.count;
          var color;
          console.log('item.totalpartialpaymentamount'+ JSON.stringify(item))

          if (amountName === "credit") { 
            amountName = "Credit"; 
            color = "#f8bbd0"; 
            creditamount = Number(totalAmount) - Number(item.totalpartialpaymentamount);
            // this.setState({creditamount: 0});
          } else if (amountName === "received") {
            amountName = "Received";
            color = "#bbdefb";
            receivedamount = totalAmount;
            // this.setState({receivedamount: 0})
          } else if (amountName === "pending") {
            amountName = "New";
            color = "#c8e6c9";
            neworderamount = totalAmount;
            // this.setState({neworderamount: 0})
          }
          var moneyPieData = {
            label: amountName,
            value: totalAmount,
            color: color
          };
          moneyPieCharDataX.push(moneyPieData);
        });

        // moneyPieCharData = [
        //   { label: "Received", value: 11111111110, color: "#bbdefb" },
        //   { label: "Credit", value: 1141110898, color: "#f8bbd0" },
        //   { label: "New", value: 5001117978, color: "#c8e6c9" }
        // ]

        this.setState({
          neworderamount: neworderamount,
          creditamount: creditamount,
          receivedamount: receivedamount
        });
        this.setState({ moneyPieCharData: moneyPieCharDataX });

        // console.log("Resp Data: " + JSON.stringify(result.data.dailySalesData));
        var dailySalesData = result.data.dailySalesData;
        var dailySalesChartData = [];
        dailySalesData.map(function(item) {
          var oneDaySale = item._id;
          var oneDaySaleDate = oneDaySale.day;
          var onDaySaleMonth = oneDaySale.month;
          var totalAmountOfDate = item.totalAmount;
          var oneDaySaleDatenMonth =
            oneDaySaleDate + "/" + monthStr[onDaySaleMonth - 1];
          var oneDayNumberOfOrder = item.count;
          const dailySaleCharDataObj = {
            x: oneDaySaleDatenMonth,
            y: totalAmountOfDate,
            z: oneDayNumberOfOrder
          };
          dailySalesChartData.push(dailySaleCharDataObj);
        });

        var monthlySalesData = result.data.monthlySalesData;
        var monthlySalesChartData = [];
        //,"monthlySalesData":[{"_id":{"month":8,"year":2019},"totalAmount":368376,"count":7},
        //{"_id":{"month":9,"year":2019},"totalAmount":4903814,"count":57}]}
        monthlySalesData.map(function(item) {
          var monthSale = item._id;
          var oneMonthSaleMonth = monthSale.month;
          var monthSaleYear = monthSale.year;
          var totalAmountOfMonth = item.totalAmount;
          var oneMonthSaleMonthnYear =
            monthStr[oneMonthSaleMonth - 1] + "/" + monthSaleYear;
          var totalNumberOfOrderInMonth = item.count;
          const monthlySaleCharDataObj = {
            x: oneMonthSaleMonthnYear,
            y: totalAmountOfMonth,
            z: totalNumberOfOrderInMonth
          };
          monthlySalesChartData.push(monthlySaleCharDataObj);
        });

        var dailyTopCustomer = result.data.dailyTopCustomer;
        var monthlyTopCustomer = result.data.monthlyTopCustomer;

        console.log(
          "dailySalesChartData+ " + JSON.stringify(dailySalesChartData)
        );
        this.setState({
          dailySalesChart: dailySalesChartData,
          hBarData: dailyTopCustomer,
          monthlySalesChart: monthlySalesChartData,
          dailyTopCustomer: dailyTopCustomer,
          monthlyTopCustomer: monthlyTopCustomer,
          // moneyPieCharData: moneyPieCharData,
          isLoading: false
        });
        // this.generateHBarData()
      })
      .catch(error => {
        console.error(error);
      });
  }

  switchTopCustomer = val => {
    console.log("switchTopCustomer: " + val);
    if (val === 2) {
      this.setState({
        activeSwitch: val,
        hBarData: this.state.monthlyTopCustomer,
        switchDaynMonth: "month"
      });
    } else if (val === 1) {
      this.setState({
        activeSwitch: val,
        hBarData: this.state.dailyTopCustomer,
        switchDaynMonth: "day"
      });
    }
  };

  openCreditOrderList = () => {
    this.props.navigation.navigate("CreditOrderList");
  }

  generateHBarData = () => {
    console.log("generateHBarData");
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push((i + 1) * 100);
    }

    this.setState({
      hBarData: data
    });
  };

  searchOrder = () => {
    this.props.navigation.navigate("LoadOrderListScreen");
  };

  generateData() {
    var data = [];
    var data2 = [];
    var data3 = [];
    var pieData = [];
    var startDate = moment();
    for (var i = 0; i < 30; i++) {
      startDate.add(1, "days");
      data.push({
        x: startDate.format("DD/MMM"),
        y: Math.round(Math.random() * 1000)
      });
      data2.push({
        x: startDate.format("YYYY-MM-DD"),
        y: Math.round(Math.random() * 50) + 0.5
      });
      data3.push({
        x: startDate.format("YYYY-MM-DD"),
        y: Math.round(Math.random() * 1000)
      });
    }

    this.setState({
      data: [
        {
          seriesName: "test2",
          data: data.slice(),
          color: "#0e95de"
        }
      ],
      pieData: pieData
    });
  }

  render() {
    console.log("this.state.hBarData:+ " + this.state.hBarData);

    if (this.state.isLoading) {
      console.log("isLoading: " + this.state.isLoading);
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20, justifyContent:'center', alignItems:'center' }}>
          <ActivityIndicator 
            color = '#ea80fc'
            size = "large"
 
          />
        </View>
      );
    }

    // type = bar , pie, line
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          padding: 5,
          marginTop: 15
        }}
      >
        <ScrollView>
          <View style={{ marginRight: 60 }}>
            {this.state.hBarData.map((value, index) => (
              <AnimatedBar value={value} key={index} />
            ))}
          </View>
          <View
            style={{
              marginBottom: 30,
              marginTop: 15,
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text
              style={{
                fontFamily: "sans-serif",
                fontWeight: "500"
              }}
            >
              Top 15 buyer of the {this.state.switchDaynMonth}
            </Text>

            <SwitchButton
              onValueChange={val => this.switchTopCustomer(val)} // this is necessary for this component
              text1="Day" // optional: first text in switch button --- default ON
              text2="Month" // optional: second text in switch button --- default OFF
              switchWidth={120} // optional: switch width --- default 44
              switchHeight={27} // optional: switch height --- default 100
              switchdirection="ltr" // optional: switch button direction ( ltr and rtl ) --- default ltr
              switchBorderRadius={120} // optional: switch border radius --- default oval
              switchSpeedChange={500} // optional: button change speed --- default 100
              switchBorderColor="#eeeeee" // optional: switch border color --- default #d4d4d4
              switchBackgroundColor="#fff" // optional: switch background color --- default #fff
              btnBorderColor="#00a4b9" // optional: button border color --- default #00a4b9
              btnBackgroundColor="#00bcd4" // optional: button background color --- default #00bcd4
              fontColor="#b1b1b1" // optional: text font color --- default #b1b1b1
              activeFontColor="#fff" // optional: active font color --- default #fff
            />

            {this.state.activeSwitch === 1
              ? console.log("view1")
              : console.log("view2")}
          </View>
          {this.state.moneyPieCharData !== null &&
          this.state.moneyPieCharData.length > 0 ? (
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row"
                }}
              >
                <PureChart
                  type={"pie"}
                  data={this.state.moneyPieCharData}
                  width={"100%"}
                  height={200}
                />
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    marginLeft: 30
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <MaterialCommunityIcons
                      style={{
                        color: "#c8e6c9",
                        transform: [{ rotate: "360deg" }]
                      }}
                      name="twitter-box"
                      size={30}
                    />
                    <View>
                      <Text style={{ marginLeft: 5 }}>New</Text>
                      <Text style={{ marginLeft: 5, fontSize: 10 }}>
                        Rs {this.state.neworderamount}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: 10,
                      marginTop: 10
                    }}
                  >
                    <MaterialCommunityIcons
                      style={{
                        color: "#bbdefb",
                        transform: [{ rotate: "360deg" }]
                      }}
                      name="briefcase-check"
                      size={30}
                    />
                    <View>
                      <Text style={{ marginLeft: 5 }}>Received</Text>
                      <Text style={{ marginLeft: 5, fontSize: 10 }}>
                        Rs {this.state.receivedamount}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => this.openCreditOrderList()}>
                  <View
                    style={{
                      flexDirection: "row",
                     
                    }}
                  >
                    <MaterialCommunityIcons
                      style={{
                        color: "#f8bbd0",
                        transform: [{ rotate: "90deg" }]
                      }}
                      name="arrow-right-box"
                      size={30}
                    />
                    <View >
                      <Text style={{ marginLeft: 5 }}>Credit</Text>
                      <Text style={{ marginLeft: 5, fontSize: 10 }}>
                        Rs {this.state.creditamount}
                      </Text>
                    </View>
                    </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  marginBottom: 35,
                  marginTop: 15,
                  alignContent: "center",
                  textAlign: "center",
                  fontWeight: "500",
                  fontFamily: "sans-serif"
                }}
              >
                Money Matters
              </Text>
            </View>
          ) : null}

          <PureChart
            type={"line"}
            data={this.state.dailySalesChart}
            width={"100%"}
            height={200}
            onPress={a => {
              console.log("onPress", a);
            }}
            // xAxisColor={'black'}
            yAxisColor={"#fff"}
            xAxisGridLineColor={"#fff"}
            //yAxisGridLineColor={'red'}
            minValue={10}
            labelColor={"#757575"}
            showEvenNumberXaxisLabel={false}
            numberOfYAxisGuideLine={20}
            customValueRenderer={(index, point) => {
              if (index < 1) return null;
              return <Text style={{ textAlign: "center" }}>{point.y}</Text>;
            }}
          />

          <Text
            style={{
              marginBottom: 30,
              marginTop: 15,
              alignContent: "center",
              textAlign: "center",
              fontWeight: "500"
            }}
          >
            Daily Sales Chart
          </Text>

          <PureChart
            type={"bar"}
            data={this.state.monthlySalesChart}
            height={150}
            xAxisColor={"#757575"}
            yAxisColor={"#fff"}
            xAxisGridLineColor={"#0091ea"}
            yAxisGridLineColor={"#e0e0e0"}
            showEvenNumberXaxisLabel={false}
            labelColor={"#757575"}
            numberOfYAxisGuideLine={10}
            customValueRenderer={(index, point) => {
              if (index < 5) return null;
              return <Text style={{ textAlign: "center" }}>{point.y}</Text>;
            }}
          />
          <Text
            style={{
              marginBottom: 30,
              marginTop: 15,
              alignContent: "center",
              textAlign: "center",
              fontWeight: "500"
            }}
          >
            Monthly Sales Chart
          </Text>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity onPress={() => this.searchOrder()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>SEARCH ORDERS</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center"
  },
  button: {
    width: 325,
    borderColor: "#129793",
    borderWidth: 1,
    height: 50,
    padding: 10,
    borderRadius: 24,
    marginTop: 20,
    backgroundColor: "#129793",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#129793",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 5,
    shadowOpacity: 0.8
  },
  buttonText: {
    color: "white",
    fontSize: 12
  }
});
