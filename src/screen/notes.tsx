import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Alert, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const notes = ({ navigation, route }: { navigation: any; route: any }) => {
    const [notesData, setNotesData] = useState([]);
    const [searchText, setSearchText] = useState('');

    const getCurrentUser = async () => {
        const data = await AsyncStorage.getItem('currentUser');
        return data ? JSON.parse(data) : null;
    };

    const getNotesKey = (userId: string | number) => {
        return `notes_${userId}`;
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Do you want to logout ?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('userToken');
                            await AsyncStorage.removeItem('currentUser');

                            setNotesData([]);

                        } catch (error) {
                            console.log('Logout Error:', error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const getNotes = async () => {
        try {
            const user = await getCurrentUser();

            if (!user) return;

            const key = getNotesKey(user.id);

            const storedNotes = await AsyncStorage.getItem(key);

            if (!storedNotes) {
                setNotesData([]);
                return;
            }

            setNotesData(JSON.parse(storedNotes));

        } catch (error) {
            console.log('GET NOTES ERROR:', error);
        }
    };

    const deleteNote = async (id: number) => {
        try {
            const user = await getCurrentUser();
            if (!user) return;

            const key = getNotesKey(user.id);

            const storedNotes = await AsyncStorage.getItem(key);
            let notesArray = storedNotes ? JSON.parse(storedNotes) : [];

            const updatedNotes = notesArray.filter((item: any) => item.id !== id);

            await AsyncStorage.setItem(key, JSON.stringify(updatedNotes));

            setNotesData(updatedNotes);

        } catch (error) {
            console.log('Delete Note Error:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getNotes();
        }, [])
    );


    const filteredNotes = notesData
        .filter((item: any) =>
            item.title.toLowerCase().includes(searchText.toLowerCase())
        )
        .sort((a: any, b: any) => {
            if (a.title.toLowerCase().startsWith(searchText.toLowerCase())) return -1;
            if (b.title.toLowerCase().startsWith(searchText.toLowerCase())) return 1;
            return 0;
        });

    const formatTime = (time: string) => {
        if (!time) return '';

        return time.replace(/:\d{2}\s/, ' ');
    };

    return (
        <LinearGradient
            colors={['#fff', '#00aaff1e']}
            start={{ x: 0.4, y: -16 }}
            end={{ x: 0.6, y: -15 }}
            style={styles.mainContainer}
        >
            <ScrollView>
                <View style={styles.container}>
                    <View>
                        <Text style={styles.title}>My{'\n'}<Text style={{ color: '#001B62' }}>Notes</Text></Text>
                        <Text style={styles.subtitle}>You have 50 note</Text>
                    </View>
                    <TouchableOpacity style={styles.container2}
                        onPress={handleLogout}
                    >
                        <Image
                            style={styles.image2}
                            source={require('../images/Group.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor="#9CA3AF"
                        style={styles.input}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <Image
                        style={styles.image}
                        source={require('../images/Group-2.png')}
                    />

                </View>

                {
                    filteredNotes.map((item: any) => (
                        <View style={styles.card} key={item.id}>

                            <View style={styles.photoRow2}>
                                <Text style={styles.subtitle2}>{item.title}</Text>

                                <TouchableOpacity onPress={() =>
                                    Alert.alert(
                                        'Choose Option',
                                        'What do you want to do?',
                                        [
                                            {
                                                text: 'Edit',
                                                onPress: () =>
                                                    navigation.navigate('newNotes', {
                                                        noteData: item,
                                                        isEdit: true,
                                                    }),
                                            },
                                            {
                                                text: 'Delete',
                                                style: 'destructive',
                                                onPress: () => deleteNote(item.id),
                                            },
                                            {
                                                text: 'Cancel',
                                                style: 'cancel',
                                            },
                                        ]
                                    )
                                }>
                                    <Text style={styles.dotText}>⋮</Text>
                                </TouchableOpacity>

                            </View>

                            <Text style={styles.cardDesc}>{item.description}</Text>

                            <View style={styles.line} />

                            <View style={styles.footer}>
                                <Text style={styles.time}>
                                    {formatTime(item.time)}
                                </Text>

                                <View style={styles.photoRow}>
                                    <View style={styles.dot} />

                                    <Text
                                        style={[
                                            styles.time,
                                            {
                                                color: '#667085',
                                                marginLeft: 6,
                                                fontFamily: 'sans-serif',
                                            },
                                        ]}
                                    >
                                        {item.images && item.images.length > 0
                                            ? `${item.images.length} Photos`
                                            : '0 Photos'}
                                    </Text>
                                </View>
                            </View>

                        </View>
                    ))
                }

            </ScrollView>
            <TouchableOpacity style={styles.floatingBtn}
                onPress={() => navigation.navigate('newNotes')}
            >
                <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 16,
    },
    container2: {
        backgroundColor: '#001c6217',
        height: 46,
        width: 46,
        borderRadius: 23,
        marginTop: 70,
    },
    image: {
        height: 19,
        width: 19,
        resizeMode: 'contain',
    },
    image2: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 8,
    },
    title: {
        fontSize: 54,
        fontWeight: 'bold',
        color: '#00ADFF',
        marginTop: 60,
        marginLeft: 16,
    },
    subtitle: {
        color: '#001B62',
        fontSize: 16,
        fontWeight: '200',
        marginBottom: 13,
        marginLeft: 16,
    },
    subtitle2: {
        marginBottom: 6,
    },
    card: {
        backgroundColor: '#ffffff8d',
        borderRadius: 20,
        padding: 16,
        marginTop: 18,
        marginHorizontal: 13
    },
    time: {
        fontSize: 14,
        color: '#a19f9fde',
        includeFontPadding: false,
        padding: 0,
        margin: 0,

    },
    dotText: {
        fontSize: 23,
        color: '#001B62',
        // marginBottom: 3,
    },
    cardDesc: {
        color: '#667085',
        fontSize: 14,
        lineHeight: 22,
    },
    footer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    photoRow: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    photoRow2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dot: {
        height: 6,
        width: 6,
        borderRadius: 3,
        backgroundColor: '#B423FF',
        marginRight: 6,
    },
    line: {
        borderBottomWidth: 1,
        borderColor: '#0000001a',
        marginTop: 10,
    },
    inputContainer: {
        backgroundColor: '#ffffff8d',
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 58,
        marginHorizontal: 13,
    },
    input: {
        flex: 1,
        color: '#001B6280',
    },
    floatingBtn: {
        position: 'absolute',
        bottom: 50,
        right: 24,
        height: 68,
        width: 68,
        borderRadius: 34,
        backgroundColor: '#001B79',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plus: {
        color: '#fff',
        fontSize: 40,
        marginTop: -4,
        fontWeight: '300',
    },
    imageRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        gap: 8,
    },

    noteImage: {
        height: 80,
        width: 80,
        borderRadius: 12,
    },

});

export default notes;