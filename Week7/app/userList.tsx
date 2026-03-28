import React, { useState } from "react";
import { Stack, Link } from "expo-router";
import { ScrollView, View, TouchableOpacity, Image, Text } from "react-native";
import { Searchbar, Portal, Modal, IconButton } from "react-native-paper";
import styles from "../AppStyles";
import userData from "../data.json";

export default function UserList() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const filtered = userData.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) || 
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Stack.Screen options={{ title: "Contact" }} />
      <Searchbar 
        placeholder="Search users" 
        onChangeText={setQuery} 
        value={query} 
        style={styles.searchbar} 
      />

      <ScrollView contentContainerStyle={styles.container}>
        {filtered.map((user, index) => (
          <View style={styles.card} key={index}>
            
            {/* Foto: Klik untuk buka Modal */}
            <TouchableOpacity 
              onPress={() => { setModalImage(user.photo_url); setVisible(true); }}
            >
              <Image source={{ uri: user.photo_url }} style={styles.avatar} />
            </TouchableOpacity>

            {/* Area Teks: Klik untuk navigasi ke Profile */}
            <Link 
              href={{ 
                pathname: "/profile", 
                params: { 
                    userName: user.name,
                    email: user.email,
                    photo_url: user.photo_url
                 } 
              }} 
              asChild
            >
              <TouchableOpacity style={{ flex: 1, marginLeft: 10 }}>
                <View>
                  <Text style={styles.boldText}>{user.name}</Text>
                  <Text>{user.email}</Text>
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        ))}
      </ScrollView>

      <Portal>
        <Modal 
          visible={visible} 
          onDismiss={() => setVisible(false)} 
          contentContainerStyle={styles.modalContainer}
        >
          {/* Pengecekan agar tidak crash jika modalImage null */}
          {modalImage && (
            <Image source={{ uri: modalImage }} style={styles.modalImage} />
          )}
        </Modal>
      </Portal>
    </>
  );
}