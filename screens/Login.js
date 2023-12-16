import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signinUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace('Home');
            }
        });

        return unsubscribe;
    }, [navigation]);

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User has been successfully created:', user);
                // Navigate to Home screen here
                navigation.navigate('Home');
            })
            .catch((error) => alert(error.message));
    };

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Logged in with: ', user.email);
                // Navigate to Home screen here
                navigation.navigate('Home');
            })
            .catch((error) => alert(error.message));
    };
    return (

        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.title}>NotAvailable</Text>
            <Text style={styles.description}>The web app that rewards you for logging off</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <View style={styles.loginButton}>
                <Pressable onPress={handleSignUp} style={styles.button}>
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>
                <Pressable onPress={handleLogin} style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>Login</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView >
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        width: '38%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    loginButton: {
        width: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    button: {
        backgroundColor: 'pink',
        width: '100%',
        padding: 15,
        borderRadius: 10,
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: 'pink',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: 'pink',
        fontWeight: '700',
        fontSize: 16,
    },
    title: {
        fontSize: 66,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 22,
        textAlign: 'center',
        marginTop: 10,
    },
});

