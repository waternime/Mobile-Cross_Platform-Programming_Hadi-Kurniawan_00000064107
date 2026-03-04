import { Link } from "expo-router";
import { Button, View, Text } from "react-native";

export default function Home() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ marginBottom: 20 }}>Navigation List</Text>
            
            {/* Bungkus Button dengan View untuk memberikan margin */}
            <View style={{ marginBottom: 10 }}>
                <Link href="/email" push asChild>
                    <Button title="Go to Email Screen" />
                </Link>
            </View>

            <Link href="/userList" push asChild>
                <Button title="Go to User List Screen" />
            </Link>
        </View>
    );
}