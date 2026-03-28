import React, { useEffect, useRef, useState } from "react";
import { Stack, Link } from "expo-router";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Text,
  Animated,
} from "react-native";
import { Searchbar, Portal, Modal } from "react-native-paper";
import styles from "../AppStyles";
import userData from "../data.json";

export default function UserList() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const filtered = userData.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const animations = useRef(
    userData.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    animations.forEach((anim) => anim.setValue(0));

    const animatedList = filtered.map((_, index) =>
      Animated.timing(animations[index], {
        toValue: 1,
        duration: 500,
        delay: index * 200, // tiap user beda waktu animasinya
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animatedList).start();
  }, [query]);

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
        {filtered.map((user, index) => {
          const translateY = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0],
          });

          return (
            <Animated.View
              key={index}
              style={{
                opacity: animations[index],
                transform: [{ translateY }],
              }}
            >
              <View style={styles.card}>
                <TouchableOpacity
                  onPress={() => {
                    setModalImage(user.photo_url);
                    setVisible(true);
                  }}
                >
                  <Image source={{ uri: user.photo_url }} style={styles.avatar} />
                </TouchableOpacity>

                <Link
                  href={{
                    pathname: "/profile",
                    params: {
                      userName: user.name,
                      email: user.email,
                      photo_url: user.photo_url,
                    },
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
            </Animated.View>
          );
        })}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {modalImage && (
            <Image source={{ uri: modalImage }} style={styles.modalImage} />
          )}
        </Modal>
      </Portal>
    </>
  );
}