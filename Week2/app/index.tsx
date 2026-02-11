import { Text, ScrollView, Image, } from "react-native";

export default function App() {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingVertical: 50,
        alignItems: "center",
      }}
    >
      <Image source={require('../assets/kucing.jpeg')}
        style={{ width: 100, height: 90, marginBottom: 20 }}
      />
      <Text style={{marginBottom: 20 }}>Kucing</Text>

      <Image source={require('../assets/ironman.jpg')}
        style={{ width: 100, height: 150, marginBottom: 20 }}
      />
      <Text style={{marginBottom: 20 }}>Iron Man</Text>

      <Image source={require('../assets/superman.jpeg')}
        style={{ width: 160, height: 130, marginBottom: 20 }}
      />
      <Text style={{marginBottom: 20 }}>Iron Man</Text>

      <Image source={require('../assets/Tamiya.jpg')}
        style={{ width: 160, height: 130, marginBottom: 20 }}
      />
      <Text style={{marginBottom: 20 }}>Iron Man</Text>

      <Image source={require('../assets/naruto.jpeg')}
        style={{ width: 160, height: 130, marginBottom: 20 }}
      />
      <Text style={{marginBottom: 20 }}>Iron Man</Text>
    </ScrollView>
  );
}