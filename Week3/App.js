import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Counter from './Counter';
import Profile from './Profile';

export default function App() {
    const [count, setCount] = useState(0);
    const [nameInput, setNameInput] = useState('');
    const [displayedName, setDisplayedName] = useState('Anonymous');
    const [displayedAge, setDisplayedAge] = useState(0);

    const handleIncrement = () => setCount(count + 1);
    const handleDecrement = () => setCount(count - 1);

    const handpassvalue = (value) => {
        setDisplayedAge(value);
        setDisplayedName(nameInput && nameInput.trim() !== '' ? nameInput : 'Anonymous');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={nameInput}
                onChangeText={setNameInput}
            />

            <Counter
                value={count}
                handleDecrement={handleDecrement}
                handleIncrement={handleIncrement}
                handpassvalue={handpassvalue}
            />

            <Profile name={displayedName} age={displayedAge} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 12,
        borderRadius: 4,
    },
});