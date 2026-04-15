import { getPostDetail, getUserDetail } from "../services/api";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function PostDetail() {
  const { id, userId } = useLocalSearchParams<{
    id: string;
    userId: string;
  }>();

  const [user, setUser] = useState<any>(null);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getPostDetailData();
      getUserData();
    }
  }, [id]);

  const getUserData = () => {
    getUserDetail(Number(userId)).then((res) => {
      if (res.status === 200) {
        setUser(res.data);
        console.log(res.data);
      }
    });
  };

  const getPostDetailData = () => {
    getPostDetail(Number(id)).then((res) => {
      if (res.status === 200) {
        setPost(res.data);
        console.log(res.data);
      }
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ textAlign: "center", fontWeight: "bold" }}>
        {post?.title}
      </Text>

      <Text style={{ textAlign: "center" }}>{post?.body}</Text>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "bold" }}>Post Created By</Text>
        <Text>Name: {user?.name}</Text>
        <Text>Email: {user?.email}</Text>
      </View>
    </View>
  );
}