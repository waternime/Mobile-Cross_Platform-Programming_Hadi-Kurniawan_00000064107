import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { getPosts } from "../services/api";

export default function Index() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = () => {
    getPosts()
      .then((res) => {
        if (res.status === 200) {
          setPosts(res.data);
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ScrollView>
        {posts.map((post) => (
          <Pressable
            key={post.id}
            style={{ padding: 10, borderWidth: 1, marginVertical: 5 }}
            onPress={() =>
              router.push({
                pathname: "/postDetail",
                params: { id: post.id, userId: post.userId },
              })
            }
          >
            <Text style={{ fontWeight: "bold" }}>
              Post Number: {post.id}
            </Text>
            <Text>Title: {post.title}</Text>
            <Text>Body: {post.body}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}