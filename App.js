/* eslint-disable react/prop-types */
import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import FlatListPicker from './components/FlatListPicker';
import MovieCarousel from './components/MovieCarousel';
import AccordionMenu from './components/AccordionMenu';

function HomeScreen({ navigation }) {
  return (
    <View style={s.container}>
      <Button
        title="FlatList Picker"
        onPress={() => navigation.navigate('FlatListPicker')}
      />
      <Button
        title="Movie Carousel"
        onPress={() => navigation.navigate('MovieCarousel')}
      />
      <Button
        title="Accordion Menu"
        onPress={() => navigation.navigate('AccordionMenu')}
      />
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
        <Stack.Screen name="MovieCarousel" component={MovieCarousel} header={'MovieCarousel'}/>
        <Stack.Screen name="AccordionMenu" component={AccordionMenu} header={'AccordionMenu'}/>
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
