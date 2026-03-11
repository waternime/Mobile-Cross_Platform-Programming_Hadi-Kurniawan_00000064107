import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
// Import komponen dari file input.tsx
import { CustomTextInput, NIMInput } from "./input"; 

export default function Index() {
  const [name, setName] = useState("");
  const [nim, setNim] = useState(""); // Variable baru untuk NIM

  return (
    <View style={styles.container}>
      {/* NIM tidak lagi hardcode, tapi mengikuti variable nim */}
      <Text style={styles.header}>
        {name || "Nama"} - {nim || "NIM"}
      </Text>

      <CustomTextInput 
        input={name} 
        onChange={(val) => setName(val)} 
      />

      <NIMInput 
        input={nim} 
        onChange={(val) => setNim(val)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});