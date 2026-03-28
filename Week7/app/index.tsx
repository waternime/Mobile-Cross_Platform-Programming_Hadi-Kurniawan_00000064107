import { Link, Stack } from "expo-router";
import { View, Text } from "react-native"; // Tambahkan Text

export default function App() {
  return (
    <>
      <Stack.Screen options={{ title: "Welcome" }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Link href="/home">
           <Text>GO TO NAVIGATION LIST</Text>
        </Link>
      </View>
    </>
  );
}