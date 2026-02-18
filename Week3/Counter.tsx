import { Button, Text, View, StyleSheet } from "react-native";

interface iCounter {
  handleIncrement: () => void;
  handleDecrement: () => void;
  handpassvalue: (value: number) => void;
  value: number;
}

const Counter = ({
  handleIncrement,
  handleDecrement,
  handpassvalue,
  value
}: iCounter) => {
  return <View style={styles.container}>
    <Text style={styles.value}>{value}</Text>
    <View style={styles.buttonWrapper}>
      <Button title="Increment" onPress={handleIncrement} />
    </View>
    <View style={styles.buttonWrapper}>
      <Button title="Decrement" onPress={handleDecrement} />
    </View>
    <View style={styles.buttonWrapper}>
      <Button title="Pass Value" onPress={() => handpassvalue(value)} />
    </View>
    
  </View>
};

export default Counter;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonWrapper: {
    marginBottom: 8,
  },
});