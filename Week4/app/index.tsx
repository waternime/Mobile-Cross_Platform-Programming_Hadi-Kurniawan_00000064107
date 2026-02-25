import React, { useState } from "react";
import { Stack } from "expo-router";
import { ScrollView, View, TouchableOpacity, Image, Text } from "react-native";
import { Searchbar, Portal, Modal, IconButton } from "react-native-paper";
import styles from "../AppStyles";
import userData from "../data.json";

export default function App() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const filtered = userData.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
  );

  const openImage = (uri: string) => {
    setModalImage(uri);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setModalImage(null);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Contact",
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
          headerTitleStyle: { fontWeight: '700' },
          headerRight: () => <IconButton icon="plus" onPress={() => {}} />,
        }}
      />

      <Searchbar placeholder="Search users" onChangeText={setQuery} value={query} style={styles.searchbar} />

      <ScrollView contentContainerStyle={styles.container}>
        {filtered.map((user, index) => (
          <View style={styles.container} key={index}>
            <View style={styles.card}>
              <TouchableOpacity onPress={() => openImage(user.photo_url)}>
                <Image source={{ uri: user.photo_url }} style={styles.avatar} />
              </TouchableOpacity>
              <View>
                <Text style={styles.boldText}>{user.name}</Text>
                <Text>{user.email}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Portal>
        <Modal visible={visible} onDismiss={closeModal} contentContainerStyle={styles.modalContainer}>
          <IconButton icon="close" size={24} onPress={closeModal} style={{ position: 'absolute', top: 10, right: 10, zIndex: 3, backgroundColor: 'rgba(255,255,255,0.9)' }} />
          {modalImage ? <Image source={{ uri: modalImage }} style={styles.modalImage} /> : null}
        </Modal>
      </Portal>

      {/* FAB removed as requested */}
    </>
  );
}