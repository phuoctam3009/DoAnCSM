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
  FlatList,
  Button,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import firebase from "../components/FirebaseConfig.js";
import Item from "../components/Item";
import addButton from "../assets/plus.png";
import gmail from "../assets/gmail.png";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import nodemailer from "nodemailer";
// import {RNSmtpMailer} from "react-native-smtp-mailer";

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      listHistory: [],
      sum: 0
    };
  }

  componentDidMount() {
    const { emailName } = this.props.route.params;
    console.log(emailName);
    firebase.auth().onAuthStateChanged(() => {
      this.setState({ user: emailName });
    });
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.readDB();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  async readDB() {
    let sumtemp = 0;
    var list = [];
    var db = firebase.database().ref("History");
    const { emailName } = this.props.route.params;
    await db.once("value", async (snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childData.email == emailName) {
          childData = { ...childData, key: childKey };
          // console.log(childData);
          list.push(childData);
          if(childData.typeMoney === "take"){
            sumtemp += parseInt(childData.money)
          }else{
            sumtemp -= parseInt(childData.money)
          }
        }
      });
    });
    //Sorted by Date
    list = list.sort(
      (a, b) =>
        new Date(...b.date.split("-").reverse()) -
        new Date(...a.date.split("-").reverse())
    );
    this.setState({sum : sumtemp})
    this.setState({ listHistory: list });
  }

  addHistory() {
    const { emailName } = this.props.route.params;
    console.log("Move screen");
    console.log("Data: " + emailName);
    this.props.navigation.navigate("AddHistory", {
      emailName: emailName,
    });
    // this.props.navigation.navigate("TestComponent")
  }

  sendEmail() {
    const { emailName } = this.props.route.params;
    console.log("Move screen");
    console.log("Data: " + emailName);
    this.props.navigation.navigate("SendEmail", {
      emailName: emailName,
    });
  }

  editInfo(item) {
    this.props.navigation.navigate("EditComponent", {
      Item: item,
    });
  }

  getFullData() {
    this.readDB();
    // const callable = firebase.functions().httpsCallable('')
    // return callable({text: 'Sending email', subject: 'Test sending email'}).then(console.log("sending thanh cong"))
  }

  async getTake() {
    let sum = 0;
    var list = [];
    var db = firebase.database().ref("History");
    const { emailName } = this.props.route.params;
    await db.once("value", async (snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childData.email == emailName && childData.typeMoney == "take") {
          childData = { ...childData, key: childKey };
          // console.log(childData);
          sum += parseInt(childData.money)
          list.push(childData);
        }
      });
    });
    //Sorted by Date
    list = list.sort(
      (a, b) =>
        new Date(...b.date.split("-").reverse()) -
        new Date(...a.date.split("-").reverse())
    );
    this.setState({sum: sum})
    this.setState({ listHistory: list });
  }

  async getPay() {
    let sum = 0;
    var list = [];
    var db = firebase.database().ref("History");
    const { emailName } = this.props.route.params;
    await db.once("value", async (snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childData.email == emailName && childData.typeMoney == "pay") {
          childData = { ...childData, key: childKey };
          // console.log(childData);
          sum -= parseInt(childData.money)
          list.push(childData);
        }
      });
    });
    //Sorted by Date
    list = list.sort(
      (a, b) =>
        new Date(...b.date.split("-").reverse()) -
        new Date(...a.date.split("-").reverse())
    );
    this.setState({sum: sum})
    this.setState({ listHistory: list });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonCategory}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              this.getFullData();
            }}
          >
            <Text style={styles.buttonTitle}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              this.getTake();
            }}
          >
            <Text style={styles.buttonTitle}>Nhận vào</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              this.getPay();
            }}
          >
            <Text style={styles.buttonTitle}>Chi ra</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.sumText}>Tổng cộng: {this.state.sum}</Text>
        </View>
        <View style={styles.up}>
          {this.state.listHistory.length > 0 ? (
            <FlatList
              data={this.state.listHistory}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => this.editInfo(item)}>
                  <Item info={item} />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.key}
              contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
            />
          ) : (
            <Text style={{ fontSize: 20 }}>Chưa có bản ghi nào ...</Text>
          )}
        </View>
        <View style={styles.down}>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => {
              this.sendEmail();
            }}
          >
            <Image style={{ width: 50, height: 50 }} source={gmail} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => {
              this.addHistory();
            }}
          >
            <Image style={{ width: 50, height: 50 }} source={addButton} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
  },
  sumText:{
    fontSize: 20,
    color: "black",
     marginHorizontal: 2,
     padding: 5
  },
  up: {
    flex: 9,
  },
  down: {
    flex: 1,
    borderColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  panelButton: {
    padding: 14,
    width: 100,
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonCategory: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginButton: {
    width: 100,
    height: 45,
    borderRadius: 6,
    borderColor: "black",
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(221, 97, 97)",
  },
  buttonTitle: {
    fontSize: 18,
    color: "white",
  },
});
