/* eslint-disable react/prop-types */
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import FlatListPicker from './components/FlatListPicker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation }) {
  return (
    <View style={s.container}>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('FlatListPicker')}
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor:  '#2D2D2D',
          },
          headerTintColor: '#FFE8A3',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown: false,
        }} 
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'My home' }}
        />
        <Stack.Screen name="FlatListPicker" component={FlatListPicker} header={'FlatListPicker'}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
