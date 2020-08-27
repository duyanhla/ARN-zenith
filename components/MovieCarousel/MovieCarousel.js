/* eslint-disable react/prop-types */
/**
* ORIGINAL 
* https://github.com/catalinmiron/react-native-movie-2.0-carousel
* animated carousel
* snapToInterval prop, display a portion from the prev and next item, align the active slide in the middle, use MaskedView
**/

import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  Animated,
  Image,
  FlatList,
} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import Svg, { Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { getMovies } from './api';
import Genres from './Genres';
import Rating from './Rating';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const { width, height } = Dimensions.get('window');
const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.6;

const Loading = () => (
  <View style={s.loadingContainer}>
    <Text style={s.paragraph}>Loading...</Text>
  </View>
);

const Backdrop = ({ movies, scrollX }) => {
  return <View style={{ position: 'absolute', width, height: BACKDROP_HEIGHT }}>
    <FlatList
      data={movies}
      keyExtractor={item=>item.key}
      renderItem={({item, index})=>
      {
        if (!item.backdrop) {
          return null;
        }

        const inputRange = [ (index - 1) * ITEM_SIZE, index * ITEM_SIZE];

        const translateX = scrollX.interpolate({
          inputRange,
          outputRange: [-width, 0],
        });

        return (
          <MaskedView 
            style={{position: 'absolute'}}
            maskElement={
              <AnimatedSvg 
                width={width} 
                height={height} 
                viewBox={`0 0 ${width} ${height}`}
                style={{ transform: [{ translateX }] }}
              >
                <Rect x='0' y='0' width={width} height={height} fill='red'/>
              </AnimatedSvg>
            }
          >
            <Image 
              source={{ uri: item.backdrop}}
              style={{ 
                width,
                height: BACKDROP_HEIGHT,
                resizeMode: 'cover',
              }} 
            />
          </MaskedView>
        );
      }}
    />
    <LinearGradient
      colors={['transparent', 'white']}
      style={{
        width,
        height: BACKDROP_HEIGHT,
        position: 'absolute',
        bottom: 0,
      }}
    />
  </View>;
};

export default function MovieCarousel() {
  const [movies, setMovies] = React.useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovies();
      //[spacer, ...movies, spacer] make item at middle top
      //setMovies([{key: 'left-spacer'}, ...movies, {key: 'right-spacer'}]);
      //or just set padding in contentContainerStyle 
      setMovies(movies);
    };
    if (movies.length === 0) {
      fetchData(movies);
    }
  }, [movies]);
  if (movies.length === 0) {
    return <Loading />;
  }
  return (
    <View style={s.container}>
      <StatusBar hidden />
      <Backdrop movies={movies} scrollX={scrollX} />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(item) => item.key}
        horizontal
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: SPACER_ITEM_SIZE,
        }}
        snapToInterval={ITEM_SIZE}
        decelerationRate={'0'}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: {contentOffset : {x: scrollX}}}],
          {useNativeDriver: true}
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
          });
          // if (!item.poster) {
          //   return <View style={{width: SPACER_ITEM_SIZE}} />;
          // }
          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View style={{
                marginHorizontal: SPACING,
                padding: SPACING * 2,
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 34,
                transform: [{ translateY }],
              }}
              >
                <Image
                  source={{ uri: item.poster }}
                  style={s.posterImage}
                />
                <Text style={{ fontSize: 24 }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Rating rating={item.rating} />
                <Genres genres={item.genres} />
                <Text style={{ fontSize: 12 }} numberOfLines={1}>
                  {item.description}
                </Text>
              </Animated.View>
            </View>
          );
        }
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});
