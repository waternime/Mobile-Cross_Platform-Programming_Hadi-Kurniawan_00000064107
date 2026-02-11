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
      <Text>Kucing</Text>
      <Text style={{marginBottom: 20 }}>839944</Text>

      <Image source={require('../assets/ironman.jpg')}
        style={{ width: 100, height: 150, marginBottom: 20 }}
      />
      <Text>Iron man</Text>
      <Text style={{marginBottom: 20 }}>9203944</Text>

      <Image source={require('../assets/superman.jpeg')}
        style={{ width: 160, height: 130, marginBottom: 20 }}
      />
      <Text>Superman</Text>
      <Text style={{marginBottom: 20 }}>4252565</Text>

      <Image source={require('../assets/Tamiya.jpg')}
        style={{ width: 160, height: 130, marginBottom: 20 }}
      />
      <Text>Let's and go</Text>
      <Text style={{marginBottom: 20 }}>Letsandgo@gmail.com</Text>

      <Image source={require('../assets/naruto.jpeg')}
        style={{ width: 160, height: 130, marginBottom: 20 }}
      />
      <Text>Naruto</Text>
      <Text style={{marginBottom: 20 }}>naruto@gmail.com</Text>
    </ScrollView>
  );
}