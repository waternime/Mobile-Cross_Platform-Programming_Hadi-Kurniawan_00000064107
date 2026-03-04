import { Link, useLocalSearchParams } from "expo-router";
import { Button, Text, View, Image } from "react-native";

export default function Profile() {
    const { userName, email, photo_url } = useLocalSearchParams<{ 
        userName: string, 
        email: string, 
        photo_url: string 
    }>();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {/* Tampilkan Foto */}
            {photo_url && (
                <Image 
                    source={{ uri: photo_url }} 
                    style={{ width: 150, height: 150, borderRadius: 75, marginBottom: 20 }} 
                />
            )}
            
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{userName}</Text>
            <Text style={{ fontSize: 16, color: 'gray' }}>{email}</Text>
            
            <View style={{ marginTop: 20 }}>
                <Link href="/home" push asChild>
                    <Button title="Go to Home Screen" />
                </Link>
            </View>
        </View>
    );
}