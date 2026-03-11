import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface CustomProps {
  input: string;
  onChange: (val: string) => void;
}

export const CustomTextInput = ({ input, onChange }: CustomProps) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Input Name:</Text>
      <TextInput
        placeholder="Input your name"
        value={input}
        style={styles.input}
        onChangeText={onChange}
      />
    </View>
  );
};

export const NIMInput = ({ input, onChange }: CustomProps) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Input NIM:</Text>
      <TextInput
        placeholder="Input your NIM"
        value={input}
        style={styles.input}
        onChangeText={onChange}
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 250,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
});