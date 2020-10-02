/* eslint-disable react/prop-types */
/**
* ORIGINAL 
* https://github.com/catalinmiron/react-native-movie-2.0-carousel
* animated carousel
* snapToInterval prop, display a portion from the prev and next item, align the active slide in the middle, use MaskedView
**/

import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';

import data, { detailsList, iconsByType } from './data';
import react from 'react';
import { 
  Directions, 
  FlingGestureHandler, 
  State,
} from 'react-native-gesture-handler';
import { Transition, Transitioning } from 'react-native-reanimated';
import posed, { Transition as PoseTransition } from 'react-native-pose';

const { width, height } = Dimensions.get('window');

const DURATION = 700;
const TITLE_SIZE = 36;
const SPACING = 80;
const IMAGE_SIZE = width * 0.8;

const colors = {
  lightBg: '#F2F2F2',
  darkBg: '#2C2D51',
  lightText: '#E5E5DD',
  darkText: '#A5A6AA',
};

const Item = ({ children, style }) => {
  return (
    <View
      style={[
        style,
        {
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'transparent',
        },
      ]}>
      {children}
    </View>
  );
};

const Icon = ({ type }) => {
  return (
    <SimpleLineIcons
      name={type}
      size={26}
      color='#A5A6AA'
      style={{ marginRight: 15, height: 26}}
    />
  );
};

const Description = ({ index, text, color }) => { 
  return (
    <Item>
      <Text key={`description-${index}`} style={{ fontsize: 16, color }}>
        {text}
      </Text>
    </Item>
  );
};

const Title = ({ index, text, color }) => {
  return (
    <Item style={{ height: TITLE_SIZE * 3, justifyContent: 'flex-end'}}>
      <Text
        key={`title-${index}`} 
        style={{
          fontSize: TITLE_SIZE,
          fontWeight: '900',
          color,
        }}
      >
        {text}
      </Text>
    </Item>
  );
};

const Detail = ({ color, index }) => {
  return (
    <View style={{ marginVertical: SPACING }}>
      {detailsList.map((key) => {
        return (
          <View 
            key={key}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 25,
            }}
          >
            <Icon type={iconsByType[key]} />
            <Item style={{ flex: 1, height: 26, justifyContent: 'center'}}>
              <Text 
                key={`${key}-${index}`}
                style={{ fontSize: 16, color, fontWeight: '700'}}
              >
                {data[index][key]}
              </Text>
            </Item>
          </View>
        );
      })}
    </View>
  );
};

const transition = (
  <Transition.Together>
    <Transition.Out type="slide-bottom" durationMs={DURATION} interpolation="easeIn"/>
    <Transition.Change />
    <Transition.In type="slide-bottom" durationMs={DURATION} interpolation="easeOut"/>
  </Transition.Together>
);

const config = {
  transition: {
    type: 'tween',
    duration: DURATION,
    easing: Easing.elastic(0.9),
  },
};

const PosedView = posed.View({
  enter: {opacity: 1, rotate: '0deg', ...config},
  exit: {opacity: 0, rotate: '180deg', ...config},
});

export default function AdvancedCarousel() {
  const [index, setIndex] = React.useState(0);
  const color = index % 2 === 1 ? colors.lightText : colors.darkText;
  const headingColor = index % 2 === 1 ? colors.lightBg : colors.darkBg;
  const activeIndex = React.useRef(new Animated.Value(0)).current;
  const animation = React.useRef(new Animated.Value(0)).current;

  react.useEffect(() => {
    Animated.timing(animation, {
      toValue: activeIndex,
      duration: DURATION * 0.7,
      useNativeDriver: true,
    }).start();
  });

  const setActiveIndex = React.useCallback((newIndex) => {
    activeIndex.setValue(newIndex);
    ref.current.animateNextTransition();
    setIndex(newIndex);
  });

  const translateY = animation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [height, 0, -height],
  });
  
  const ref = React.useRef();

  return (
    <FlingGestureHandler 
      key="up" 
      direction={Directions.UP} 
      onHandlerStateChange={(ev) => {
        if (ev.nativeEvent.state === State.END) {
          if (index === data.length-1) {
            return;
          }
          setActiveIndex(index + 1);
        }
      }}>
      <FlingGestureHandler 
        key="down" 
        direction={Directions.DOWN} 
        onHandlerStateChange={(ev) => {
          if (ev.nativeEvent.state === State.END) {
            if (index === 0) {
              return;
            }
            setActiveIndex(index - 1);
          }
        }}>
        <SafeAreaView style={s.container}>
          <Animated.View style={[
            StyleSheet.absoluteFillObject,
            { heigh: height * data.length, transform: [{ translateY }] },
          ]}>
            {data.map((_, i) => {
              return (
                <View 
                  key={i} 
                  style={{ 
                    height, 
                    backgroundColor: i % 2 === 0 ? colors.lightBg : colors.darkBg,
                  }}>
                </View>
              );
            })}
          </Animated.View>
          <PoseTransition>
            {index % 2 === 0 ? (
              <PosedView
                key='image0'
                style={[
                  s.imageContainer,
                  { borderColor: index % 2 === 0 ? colors.darkBg : colors.lightBg },
                ]}>
                <Image source = {{ uri: data[index].image }} style={s.image} />
              </PosedView>
            ) : (
              <PosedView
                key='image1'
                style={[
                  s.imageContainer,
                  { borderColor: index % 2 === 0 ? colors.darkBg : colors.lightBg },
                ]}>
                <Image source = {{ uri: data[index].image }} style={s.image} />
              </PosedView>
            )}
          </PoseTransition>
          <Transitioning.View
            ref={ref}
            transition={transition}
            style={{
              padding: 20,
              flex: 1,
              justifyContent: 'space-evenly',
            }}>
            <Title color={headingColor} index={index} text={data[index].title} />
            <Detail color={color} index={index} />
            <Description 
              index={index}
              text={data[index].description}
              color={headingColor} 
            />
          </Transitioning.View>
        </SafeAreaView>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: -IMAGE_SIZE/2,
    borderWidth: 2,
    top: height/2 - IMAGE_SIZE/2,
    width: IMAGE_SIZE + 30,
    height: IMAGE_SIZE + 30,
    borderRadius: IMAGE_SIZE/2 + 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, heigh: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE/2,
  },
});
