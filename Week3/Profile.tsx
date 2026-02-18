import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface ProfileProps {
  name?: string;
  age?: number;
}

const Profile = ({ name, age }: ProfileProps) => {
  const displayName = name && name.trim() !== '' ? name : 'Anonymous';
  const displayAge = typeof age === 'number' ? age : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`${displayName} is ${displayAge} years old`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});

export default Profile;
