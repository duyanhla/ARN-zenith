
/* eslint-disable react/prop-types */
/**
* ORIGINAL 
* https://github.com/catalinmiron/react-native-accordion-menu
* using reanimated
* to create accordion menu at home
**/

import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';
import data from './data';

const transition = (
  <Transition.Together>
    <Transition.In type = 'fade' durationMs={150} />
    <Transition.Change />
    <Transition.Out type = 'fade' durationMs={150} />
  </Transition.Together>
);

export default function AccordionMenu() {
  const [currentIndex, setCurrentIndex] = React.useState(null);
  const ref = React.useRef();
  return (
    <Transitioning.View
      transition={transition}
      ref={ref}
      style={s.container}>
      <StatusBar hidden />
      {data.map(({bg, color, category, subCategories}, index) => {
        return <TouchableOpacity
          activeOpacity={0.9}
          key={category} 
          onPress={()=> {
            ref.current.animateNextTransition();
            setCurrentIndex(index === currentIndex ? null : index);
          }}
          style={s.cardContainer}>
          <View style={[s.card, {backgroundColor: bg}]}>
            <Text style={[s.heading, { color }]}>{category}</Text>
            {index === currentIndex && <View style={s.subCategoriesList} >
              {subCategories.map((subCategory) => (
                <Text key={subCategory} style={[s.body, { color }]}>{subCategory}</Text>
              ))}
            </View>}
          </View>
        </TouchableOpacity>;
        
      }
      )}
    </Transitioning.View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  cardContainer: {
    flexGrow: 1,
  },
  card: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 38,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -2,
  },
  subCategoriesList: {
    marginTop: 20,
  },
  body: {
    fontSize: 20,
    lineHeight: 20 * 1.5,
    textAlign: 'center',
  },
});
