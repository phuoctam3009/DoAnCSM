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
import MoneyImage from "../assets/salary.png";
import firebase from "../components/FirebaseConfig.js";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
  Dangnhap() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        Alert.alert(
          "Alert Title",
          "Dang nhap thanh cong: " + this.state.email,
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                // console.log(this.state.email);
                this.props.navigation.navigate("Welcome", {
                  emailName: this.state.email,
                });
              },
            },
          ],
          { cancelable: false }
        );
        // this.setState({
        //   email: "",
        //   password: "",
        // });
      })
      .catch(function (error) {
        Alert.alert(
          "Alert Title",
          "Dang nhap that bai",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ],
          { cancelable: false }
        );
      });
  }
  render() {
    return (
      //Don't dismis Keyboard when click outside of TextInput
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.up}>
            <Image source={MoneyImage}></Image>
            <Text style={styles.title}>Save your Money</Text>
          </View>
          <View style={styles.down}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                textContentType="emailAddress"
                keyboardType="email-address"
                placeholder="Enter your email"
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
              ></TextInput>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                secureTextEntry={true}
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
              ></TextInput>
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                this.Dangnhap();
              }}
            >
              <Text style={styles.loginButtonTitle}>LOGIN</Text>
            </TouchableOpacity>
            <View style={styles.divider}>
              <View style={styles.line}></View>
              <Text style={styles.textOR}>OR</Text>
              <View style={styles.line}></View>
            </View>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => this.props.navigation.navigate("Register")}
            >
              <Text style={styles.loginButtonTitle}>REGISTER</Text>
            </TouchableOpacity>
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
    justifyContent: "center",
    flexDirection: "column",
  },
  up: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  down: {
    flex: 7,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    color: "rgb(255, 119, 34)",
    textAlign: "center",
    width: 400,
    fontSize: 23,
  },
  textInputContainer: {
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  textInput: {
    width: 280,
    height: 45,
  },
  loginButton: {
    width: 300,
    height: 45,
    borderRadius: 6,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(221, 97, 97)",
  },
  loginButtonTitle: {
    fontSize: 18,
    color: "white",
  },
  registerButton: {
    width: 300,
    height: 45,
    borderRadius: 6,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(46, 46, 179)",
  },
  line: {
    height: 1,
    flex: 2,
    backgroundColor: "black",
  },
  textOR: {
    flex: 1,
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
    width: 298,
  },
});
