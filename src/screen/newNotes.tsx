import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';

const newNotes = ({ navigation, route }: { navigation: any, route: any }) => {
    const noteData = route.params?.noteData;
    const isEdit = route.params?.isEdit;

    const [title, setTitle] = useState(noteData?.title || '');
    const [description, setDescription] = useState(noteData?.description || '');

    const [images, setImages] = useState<string[]>(noteData?.images || []);

    const getCurrentUser = async () => {
        const data = await AsyncStorage.getItem('currentUser');
        return data ? JSON.parse(data) : null;
    };

    const getNotesKey = (userId: string | number) => {
        return `notes_${userId}`;
    };

    const handleSave = async () => {
        try {
            if (!title || !description) {
                console.log('Title or description missing');
                return;
            }

            const user = await getCurrentUser();
            if (!user) return;

            const key = getNotesKey(user.id);

            const existingNotes = await AsyncStorage.getItem(key);
            let notesArray = existingNotes ? JSON.parse(existingNotes) : [];

            if (isEdit) {
                const updatedNotes = notesArray.map((item: any) => {
                    if (item.id === noteData.id) {
                        return {
                            ...item,
                            title,
                            description,
                            images,
                        };
                    }
                    return item;
                });

                await AsyncStorage.setItem(key, JSON.stringify(updatedNotes));

            } else {
                const newNote = {
                    id: Date.now(),
                    userId: user.id,
                    title,
                    description,
                    images,
                    time: new Date().toLocaleTimeString(),
                };

                notesArray.push(newNote);

                await AsyncStorage.setItem(key, JSON.stringify(notesArray));
            }

            navigation.navigate('notes', { refresh: Date.now() });

        } catch (error) {
            console.log('Save Error:', error);
        }
    };

    const requestCameraPermission = async () => {

        if (Platform.OS === 'android') {

            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );

            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        return true;
    };

    const openCamera = async () => {

        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;

        const result = await launchCamera({
            mediaType: 'photo',
            saveToPhotos: true,
        });

        if (result.didCancel) return;

        if (result.assets && result.assets.length > 0) {

            const newImage = result.assets[0].uri;

            if (newImage) setImages(prev => [...prev, newImage]);
        }
    };

    const openGallery = async () => {

        const result = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 0,
        });

        if (result.didCancel) return;

        if (result.assets && result.assets.length > 0) {

            const newImages = result.assets?.map(item => item.uri);

            if (newImages) {
                setImages(prev => [
                    ...prev,
                    ...newImages.filter((uri): uri is string => typeof uri === 'string')
                ]);
            }
        }
    };

    return (
        <LinearGradient
            colors={['#fff', '#00aaff1e']}
            start={{ x: 2, y: 2 }}
            end={{ x: 0.8, y: 1 }}
            style={{
                flex: 1,
            }}
        >
            <View style={style.container}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        style={style.image}
                        source={require('../images/arrow.png')}
                    />
                </TouchableOpacity>
                <Text style={style.text}>
                    {isEdit ? 'Edit Note' : 'New Note'}
                </Text>


                <TouchableOpacity
                    onPress={handleSave}
                >
                    <LinearGradient
                        colors={['#2FA4FF', '#001B79']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={style.gradientTab}
                    >
                        <Text style={style.activeTabText}>Save</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>


            <TextInput
                placeholder="Note Title"
                placeholderTextColor="#9CA3AF"
                style={style.input}
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                placeholder="Start writing..."
                placeholderTextColor="#9CA3AF"
                style={style.input2}
                multiline
                value={description}
                onChangeText={setDescription}
            />

            <FlatList
                data={images}
                keyExtractor={(item, index) => item + index}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <View style={style.imageWrapper}>

                        <Image
                            source={{ uri: item }}
                            style={style.previewImage}
                        />

                        <TouchableOpacity
                            style={style.closeBtn}
                            onPress={() => {
                                const updated = images.filter((_, i) => i !== index);
                                setImages(updated);
                            }}
                        >
                            <Text style={style.closeText}>✕</Text>
                        </TouchableOpacity>

                    </View>
                )}
                style={{ flexGrow: 0 }}
            />


            <View style={style.container2}>
                <TouchableOpacity style={style.touchable}
                    onPress={openCamera}
                >
                    <Image
                        style={style.image2}
                        source={require('../images/Icon-2.png')}
                    />
                    <Text style={style.text2}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={style.touchable2}
                    onPress={openGallery}
                >
                    <Image
                        style={style.image2}
                        source={require('../images/Icon-3.png')}
                    />
                    <Text style={style.text2}>Gallery</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const style = StyleSheet.create({
    image: {
        height: 46,
        width: 46,
        resizeMode: 'contain',
        marginTop: 66,
        marginLeft: 20
    },
    text: {
        fontSize: 24,
        marginTop: 73,
    },
    gradientTab: {
        borderRadius: 23,
        marginTop: 70,
        shadowOpacity: 0.1,
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 18,
        paddingRight: 18,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 20
    },
    input: {
        color: '#001B62',
        fontSize: 20,
        backgroundColor: '#ffffff8d',
        padding: 16,
        borderRadius: 18,
        marginHorizontal: 22,
        marginTop: 30,
    },
    input2: {
        fontSize: 16,
        color: '#001B62',
        textAlignVertical: 'top',
        backgroundColor: '#ffffff8d',
        height: '33%',
        marginTop: 20,
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 16
    },
    image3: {
        height: 21,
        width: 21,
        resizeMode: 'contain',
    },
    container2: {
        position: 'absolute',
        bottom: 46,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    touchable: {
        width: '48%',
        backgroundColor: '#001B621A',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 14,
    },
    touchable2: {
        width: '48%',
        backgroundColor: '#00AAFF38',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 14,
    },
    text2: {
        fontSize: 16,
        fontWeight: '600',
        color: '#001B62',
        marginLeft: 8,
    },
    image2: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },
    imageWrapper: {
        position: 'relative',
        marginHorizontal: 6,
        marginVertical: 140,
    },
    previewImage: {
        height: 100,
        width: 143,
        borderRadius: 20,
        resizeMode: 'cover',
    },
    closeBtn: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.39)',
        height: 28,
        width: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default newNotes;