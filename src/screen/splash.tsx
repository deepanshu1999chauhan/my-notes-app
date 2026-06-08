import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';

const splash = ({ navigation }: { navigation: any }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 3000);

    }, []);
    return (
        <LinearGradient
            colors={['#00aaff1e', '#fff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                style={style.image}
                source={require('../images/notes.png')}
            />
        </LinearGradient>
    );
};

const style = StyleSheet.create({
    image: {
        height: 218,
        width: 187,
        resizeMode: 'contain',
    },
});

export default splash;