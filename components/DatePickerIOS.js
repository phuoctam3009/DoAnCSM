import React, { useState } from "react";
import { Button, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';


const Example = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    var dateString = JSON.stringify(date)
    console.log(dateString)
    var time_parse = moment(date).format('DD-MM-YYYY')
    console.log(typeof(time_parse))
    hideDatePicker();
  };

  return (
    <View>
      <Button title="Show Date Picker" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default Example;