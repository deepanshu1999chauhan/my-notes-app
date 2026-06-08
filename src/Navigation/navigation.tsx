import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import splash from '../screen/splash';
import register from '../screen/register';
import fingerprints from '../screen/fingerprints';
import Login from '../screen/login';
import notes from '../screen/notes';
import newNotes from '../screen/newNotes';


const Stack = createStackNavigator();
const navigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="splash" component={splash} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="register" component={register} />
            <Stack.Screen name="fingerprints" component={fingerprints} />
            <Stack.Screen name="notes" component={notes} />
            <Stack.Screen name="newNotes" component={newNotes} />
        </Stack.Navigator>
    );
};

export default navigation;