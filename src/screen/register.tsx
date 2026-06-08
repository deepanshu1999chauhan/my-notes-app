import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const register = ({ navigation }: { navigation: any }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setconfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async () => {
        if (!username || !password || !confirm) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (password !== confirm) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const newUser = {
                id: Date.now().toString(),
                username,
                password,
            };

            const existingUsers = await AsyncStorage.getItem('users');
            let users = existingUsers ? JSON.parse(existingUsers) : [];

            const alreadyExists = users.find(
                (u: any) => u.username === username
            );

            if (alreadyExists) {
                Alert.alert('Error', 'User already exists');
                return;
            }

            users.push(newUser);

            // Save users list
            await AsyncStorage.setItem('users', JSON.stringify(users));

            // IMPORTANT FIX: set current user immediately
            await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));

            // login token
            await AsyncStorage.setItem('userToken', 'true');

            // clear fields
            setUsername('');
            setPassword('');
            setconfirm('');

            Alert.alert('Success', 'Account Created');

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <LinearGradient
                    colors={['#00aaff1e', '#FFFFFF']}
                    start={{ x: 1.3, y: 0.9 }}
                    end={{ x: 0.5, y: 1.5 }}
                    style={styles.mainContainer}
                >
                    <Image
                        style={styles.image}
                        source={require('../images/notes.png')}
                    />

                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={styles.inactiveTab}
                            onPress={() => navigation.replace('Login')}
                        >
                            <Text style={styles.inactiveTabText}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.activeTab}>
                            <LinearGradient
                                colors={['#2FA4FF', '#001B79']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientTab}
                            >
                                <Text style={styles.activeTabText}>Register</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>Secure Your Notes</Text>

                    <Text style={styles.subtitle}>
                        Set up a password to protect your notes
                    </Text>

                    <Text style={styles.label}>Name</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Enter your name"
                            placeholderTextColor="#9CA3AF"
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>

                    <Text style={styles.label2}>Create Password</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Enter password"
                            placeholderTextColor="#7d8aa0"
                            secureTextEntry={!showPassword}
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeBtn}
                        >
                            <Image
                                source={require('../images/eyes.png')}
                                style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label2}>Confirm Password</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Enter password"
                            placeholderTextColor="#7d8aa0"
                            secureTextEntry={!showPassword}
                            style={styles.input}
                            value={confirm}
                            onChangeText={setconfirm}
                        />

                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeBtn}
                        >
                            <Image
                                source={require('../images/eyes.png')}
                                style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={handleSignIn}
                    >
                        <LinearGradient
                            colors={['#2FA4FF', '#001B79']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.loginGradient}
                        >
                            <Text style={styles.loginText}>Next</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },

    image: {
        height: 120,
        width: 120,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 60,
    },

    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#EEF2F5',
        borderRadius: 22,
        padding: 3,
        marginTop: 30,
        marginHorizontal: 20,
    },

    activeTab: {
        flex: 1,
        borderRadius: 30,
    },

    gradientTab: {
        borderRadius: 14,
        alignItems: 'center',
    },

    activeTabText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 22,
        paddingBottom: 16,
        paddingTop: 16,
    },

    inactiveTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    inactiveTabText: {
        color: '#7B8BA1',
        fontSize: 22,
        fontWeight: '600',
    },

    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#001B62',
        marginTop: 35,
        marginLeft: 20,
    },

    subtitle: {
        color: '#001B62',
        marginTop: 8,
        fontSize: 16,
        marginLeft: 20,
        fontWeight: '200',
    },

    label: {
        marginTop: 35,
        marginBottom: 10,
        fontSize: 16,
        color: '#001B62',
        fontWeight: '600',
        marginLeft: 20,
    },

    label2: {
        marginTop: 23,
        marginBottom: 10,
        fontSize: 16,
        color: '#001B62',
        fontWeight: '600',
        marginLeft: 20,
    },

    inputContainer: {
        backgroundColor: '#F5F7FA',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 58,
        marginHorizontal: 22,
        shadowOpacity: 0.1,
    },

    input: {
        flex: 1,
        color: '#001B62',
    },

    loginBtn: {
        marginTop: 30,
        marginHorizontal: 22,
        marginBottom: 30,
    },

    loginGradient: {
        height: 58,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loginText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },

    eyeBtn: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    eyeIcon: {
        width: 19,
        height: 14,
        resizeMode: 'contain',
        tintColor: '#001B62',
    },
});

export default register;