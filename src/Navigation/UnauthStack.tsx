import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screen/login';
import splash from '../screen/splash';
import register from '../screen/register';
import fingerprints from '../screen/fingerprints';

const Stack = createStackNavigator();

const UnauthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='splash' component={splash} options={{ headerShown: false }} />
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='register' component={register} options={{ headerShown: false }} />
            <Stack.Screen name='fingerprints' component={fingerprints} options={{ headerShown: false }} />
        </Stack.Navigator>

    );
};

export default UnauthStack;