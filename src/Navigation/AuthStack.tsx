import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import notes from '../screen/notes';
import newNotes from '../screen/newNotes';

const Stack = createStackNavigator();
const AuthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='notes' component={notes} options={{ headerShown: false }} />
            <Stack.Screen name='newNotes' component={newNotes} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AuthStack; 