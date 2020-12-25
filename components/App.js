import React, { Component } from "react";
import { View, Text, Navigator, Button, Image } from "react-native";
import Login from "../components/Login";
import Register from "../components/Register";
import Welcome from "../components/Welcome";
import AddHistory from "../components/AddHistory";
import EditComponent from "./EditComponent";
import SendEmail from "./SendEmail";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import addButton from "../assets/plus.png";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createStackNavigator();

function LogoTitle() {
  return <Image style={{ width: 50, height: 50 }} source={addButton} />;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const Tab = createBottomTabNavigator();
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen             options={{
              headerStyle:{
                backgroundColor: "rgb(234, 195, 176)",
                borderWidth: 0
              }
            }} name="Login" component={Login} />

          <Stack.Screen             options={{
              headerStyle:{
                backgroundColor: "rgb(234, 195, 176)"
              }
            }} name="Register" component={Register} />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: "rgb(146, 139, 221)",
              },
            }}
            name="Welcome"
            component={Welcome}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: "rgb(146, 139, 221)",
              },
            }}
            name="AddHistory"
            component={AddHistory}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: "rgb(146, 139, 221)",
              },
            }}
            name="SendEmail"
            component={SendEmail}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: "rgb(146, 139, 221)",
              },
            }}
            name="EditComponent"
            component={EditComponent}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
