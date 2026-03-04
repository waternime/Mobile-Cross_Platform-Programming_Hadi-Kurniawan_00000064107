import { Link } from "expo-router";
import { Button, View, Text } from "react-native";
import styles from "../AppStyles";

export default function Email() {
    return (
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
            <Text>Email List Page</Text>
            <Link href="/home" push asChild>
                <Button title="Go to Home Screen" />
            </Link>
        </View>
    );
}