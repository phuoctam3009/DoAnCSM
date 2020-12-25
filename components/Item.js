import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Item(item) {
  const { info } = item;
  return (
    <View style={styles.panelItemContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View>
          <Text style={{ fontSize: 14, color: "black" }}>{info.reason}</Text>
          <Text style={{ fontSize: 10, color: "black", opacity: 0.6 }}>
            {info.date}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "black", marginHorizontal: 2 }}>
          ${info.money}
        </Text>
        {info.typeMoney === "take" ? (
          <MaterialIcons name="arrow-drop-up" size={22} color="green" />
        ) : (
          <MaterialIcons name="arrow-drop-down" size={22} color="red" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0c0c",
    borderRadius: 24,
    padding: 14,
  },
  panelItemContainer: {
    borderWidth: 0.6,
    borderColor: "#666",
    padding: 14,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
});
