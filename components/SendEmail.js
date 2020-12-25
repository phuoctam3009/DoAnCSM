import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import firebase from "../components/FirebaseConfig.js";
import dollar from "../assets/dollar.png";
import category from "../assets/category.png";
import calendar from "../assets/calendar.png";
import data_img from "../assets/data.png";
import schedule from "../assets/schedule.png";
import confirm from "../assets/confirm.png";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import ModalSelector from "react-native-modal-selector";
import axios from "axios";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.itemRef = firebase.database();
    this.state = {
      info: {
        email: "",
        money: "",
        type: "",
        reason: "",
        date: moment().format("DD-MM-YYYY"),
        typeMoney: "",
      },
      isDatePickerVisible: false,
      resultSearch: {
        take: [],
        pay: []
      }
    };
  }
  async getDataByDate(){
      var takeList =[];
      var payList =[];
      const { emailName } = this.props.route.params;
      await this.itemRef.ref("History").once("value", async(snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          if(childData.email === emailName){
            if(childData.date === this.state.info.date){
              if(childData.typeMoney === 'take'){
                takeList.push(childData)
              }else{
                payList.push(childData)
              }
            }
          }

        })
      })
      this.setState({resultSearch: {...this.state.resultSearch, take: takeList}})
      this.setState({resultSearch: {...this.state.resultSearch, pay: payList}})
  }

  async sendEmail() {
    try {
        await this.getDataByDate();
      const params = new URLSearchParams();
      const { emailName } = this.props.route.params;
      let sum = 0
      this.state.resultSearch.take.length > 0 && this.state.resultSearch.take.map(item => sum += parseInt(item.money))
      this.state.resultSearch.pay.length > 0 && this.state.resultSearch.pay.map(item => sum -= parseInt(item.money))
      console.log(sum)
      const bodyContent = {
        content: `
        <p>Kết quả thống kê chi tiêu ngày ${this.state.info.date} </p>
        <br/>
        <h3>Thu nhập:</h3><br/>
        ${this.state.resultSearch.take.length === 0 ? '<p>Không có khoản thu vào ngày này</p> ' : ""}
        ${this.state.resultSearch.take.map(item => `<p>${item.type}: ${item.money}</p>`)}
        <h3>Chi tiêu:</h3><br/>
        ${this.state.resultSearch.pay.length === 0 ? '<p>Không có khoản thu vào ngày này</p> ' : ""}
        ${this.state.resultSearch.pay.map(item => `<p>${item.type}: ${item.money}</p>`)}
        <h2 style="font-size: 30; font-style: italic">Tổng: ${sum} </h2>
      `
      }

      
      console.log(this.state.resultSearch)
      console.log(this.state.resultSearch.pay.length)
      console.log(this.state.resultSearch.take.length)
      params.append('to', emailName)
      params.append('subject', 'Báo cáo chi tiêu ngày ' + this.state.info.date)
      params.append('body', bodyContent.content)
      const response = await axios({
        method: "post",
        url: "http:/192.168.1.5:8017/send-email",
        data: params
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  hideDatePicker() {
    this.setState({ isDatePickerVisible: false });
  }
  showDatePicker() {
    this.setState({ isDatePickerVisible: true });
  }
  handleConfirmDate(date) {
    var dateString = JSON.stringify(date);
    var time_parse = moment(date).format("DD-MM-YYYY");
    this.setState({ info: { ...this.state.info, date: time_parse } });
    this.hideDatePicker();
  }

  render() {
    const { emailName } = this.props.route.params;
    this.state.info.email = emailName;
    return (
      //Don't dismis Keyboard when click outside of TextInput
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.down}>
            <View style={styles.rowInfo}>
              <View style={styles.imageContainer}>
                <Image source={calendar} style={styles.image}></Image>
              </View>
              <View style={styles.textInputContainer}>
                <Text style={{ justifyContent: "center", fontSize: 20 }}>
                  {this.state.info.date}
                </Text>
                <TouchableOpacity
                  style={{
                    flex: 4,
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    this.showDatePicker();
                  }}
                >
                  <DateTimePickerModal
                    isVisible={this.state.isDatePickerVisible}
                    maximumDate={moment().toDate()}
                    mode="date"
                    onConfirm={(date) => {
                      this.handleConfirmDate(date);
                    }}
                    onCancel={() => {
                      this.hideDatePicker();
                    }}
                  />
                  <Image
                    style={{ width: 40, height: 40 }}
                    source={confirm}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={styles.rowInfo}>
              <View style={styles.imageContainer}>
                <Image source={data_img} style={styles.image}></Image>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your reason"
                  onChangeText={(reason) => {
                    this.setState({
                      info: { ...this.state.info, reason: reason },
                    });
                  }}
                ></TextInput>
              </View>
            </View> */}
            <View style={{ flexDirection: "row", alignItems: "stretch" }}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                  this.sendEmail();
                }}
              >
                <Text style={styles.buttonTitle}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Text style={styles.buttonTitle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(234, 195, 176)",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  down: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 10,
  },
  textInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    width: 250,
  },
  // picker: {
  //   justifyContent: "center",
  //   height: 40,
  //   width: 220,
  //   flex: 1,
  // },
  textInput: {
    fontSize: 20,
    width: 150,
    height: 60,
    flex: 4,
    justifyContent: "center",
  },
  loginButton: {
    width: 100,
    height: 45,
    borderRadius: 6,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(221, 97, 97)",
  },
  cancelButton: {
    width: 100,
    height: 45,
    borderRadius: 6,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(0, 0, 196)",
  },
  buttonTitle: {
    fontSize: 18,
    color: "white",
  },
  rowInfo: {
    flexDirection: "row",
    margin: 10,
  },
  image: {},
  imageContainer: {
    marginLeft: 20,
  },
});
