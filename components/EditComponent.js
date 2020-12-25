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
import { State } from "react-native-gesture-handler";

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
        date: "",
        typeMoney: "",
        key: ""
      },
      isDatePickerVisible: false,
      listType: [],
    };
  }
  async componentDidMount() {
    this.readInfo()
    var temp = [];
    await this.itemRef.ref("Service").once("value", async (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        childData = { ...childData, label: childData.NameService };
        temp.push(childData);
      });
    });
    this.setState({
      listType: temp,
    });
    console.log(this.state.listType)
    console.log(this.state.info)
  }

  async readInfo(){
    const { Item } = this.props.route.params;
    console.log(Item);
    this.setState({info: Item})
  }

  editData(){
       this.itemRef.ref("History").child(this.state.info.key).update(this.state.info)
  }
  deleteData(){
        this.itemRef.ref("History").child(this.state.info.key).remove()
  }

  editAlert() {
    if (
      this.state.info.email == "" ||
      this.state.info.money == "" ||
      this.state.info.type == "" ||
      this.state.info.typeMoney == ""
    ) {
      Alert.alert("Alert Title", "Vui lòng nhập đầy đủ thông tin ", [
        {
          text: "OK",
          style: "OK",
        },
      ]);
      return;
    }else{
        Alert.alert("THÔNG BÁO", "Bạn có chắc chắn muốn lưu thay đổi này ", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "OK",
                onPress: () => {
                    this.editData()
                    this.props.navigation.goBack();
                },
            }
        ])
    }
  }
  deleteAlert(){
    
        Alert.alert("THÔNG BÁO", "Bạn có chắc chắn muốn xóa lịch mục này ", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "OK",
                onPress: () => {
                    this.deleteData()
                    this.props.navigation.goBack();
                },
            }
        ])
    
  }
  hideDatePicker() {
    this.setState({ isDatePickerVisible: false });
  }
  showDatePicker() {
    this.setState({ isDatePickerVisible: true });
  }
  handleConfirm(date) {
    var dateString = JSON.stringify(date);
    var time_parse = moment(date).format("DD-MM-YYYY");
    this.setState({ info: { ...this.state.info, date: time_parse } });
    this.hideDatePicker();
  }


  render() {
    return (
      //Don't dismis Keyboard when click outside of TextInput
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.down}>
            <View style={styles.rowInfo}>
              <View style={styles.imageContainer}>
                <Image source={dollar} style={styles.image}></Image>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  defaultValue= {this.state.info.money}
                  keyboardType="number-pad"
                  placeholder="Enter your money"
                  onChangeText={(money) => {
                    this.setState({
                      info: { ...this.state.info, money: money },
                    });
                  }}
                ></TextInput>
              </View>
            </View>
            <View style={styles.rowInfo}>
              <View style={styles.imageContainer}>
                <Image source={category} style={styles.image}></Image>
              </View>
              <View style={styles.textInputContainer}>
                <ModalSelector
                  style={styles.textInput}
                  data={this.state.listType}
                  initValue="Select something yummy!"
                  accessible={true}
                  scrollViewAccessibilityLabel={"Scrollable options"}
                  cancelButtonAccessibilityLabel={"Cancel Button"}
                  onChange={(option) => {
                    this.setState({
                      info: {
                        ...this.state.info,
                        type: option.NameService,
                        typeMoney: option.Type,
                      },
                    });
                  }}
                >
                  <TextInput
                    editable={false}
                    placeholder="Enter your type"
                    value={this.state.info.type}
                  />
                </ModalSelector>
              </View>
            </View>
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
                      this.handleConfirm(date);
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
            <View style={styles.rowInfo}>
              <View style={styles.imageContainer}>
                <Image source={data_img} style={styles.image}></Image>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  defaultValue={this.state.info.reason}
                  placeholder="Enter your reason"
                  onChangeText={(reason) => {
                    this.setState({
                      info: { ...this.state.info, reason: reason },
                    });
                  }}
                ></TextInput>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "stretch" }}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                  this.editAlert();
                }}
              >
                <Text style={styles.buttonTitle}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  this.deleteAlert();
                }}
              >
                <Text style={styles.buttonTitle}>Delete</Text>
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
