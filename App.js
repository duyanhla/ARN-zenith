/* eslint-disable react/prop-types */
/**
* ORIGINAL 
* https://github.com/catalinmiron/react-native-animated-flatlist-picker
* the masked view style with StyleSheet.absoluteFillObject
* Synchronise the two FlatLists with ref and onScroll based on scrollY value
**/

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
  Animated,
} from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';

import data from './data';

const ICON_SIZE = 42;
const ITEM_HEIGHT = ICON_SIZE * 2;
const colors = {
  yellow: '#FFE8A3',
  dark: '#2D2D2D',
};
const { width, height } = Dimensions.get('window');

const Icon = React.memo(({ icon, color }) => {
  return <SimpleLineIcons name={icon} color={color} size={ICON_SIZE} />;
});

const Item = React.memo(({ icon, color, name, showText }) => {
  return (
    <View style={s.itemWrapper}>
      {showText ? (
        <Text style={[s.itemText, { color }]}>{name}</Text>
      ) : (
        <View />
      )}
      <Icon icon={icon} color={color} />
    </View>
  );
});

const ConnectWithText = React.memo(() => {
  return (
    <View
      style={{
        position: 'absolute',
        top: height / 2 - ITEM_HEIGHT * 2,
        width: width * 0.7,
        paddingHorizontal: 14,
      }}
    >
      <Text 
        style={{
          color: colors.yellow,
          fontSize: 52,
          fontWeight: '700',
          lineHeight: 52,
        }}>
        Connect with...
      </Text>
    </View>
  );
});

const ConnectButton = React.memo(({ onPress }) => {
  return (
    <View 
      style={{
        position: 'absolute',
        top: height / 2 + ITEM_HEIGHT / 2,
        paddingHorizontal: 14,
      }}
    >
      <View
        style={{
          height: ITEM_HEIGHT * 2,
          width: 4,
          backgroundColor: colors.yellow,
        }} 
      />
      <TouchableOpacity
        onPress={onPress}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 12,
          backgroundColor: colors.yellow,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 32, fontWeight: '800', color: colors.dark }}>
          Done!
        </Text>
      </TouchableOpacity>
    </View>
  );
}
);

const List = React.forwardRef(({color, showText, style, onScroll, onItemIndexChange}, ref) => {
  return (
    <Animated.FlatList
      ref={ref}
      data={data}
      style={style}
      keyExtractor={item => `${item.name}-${item.icon}`}
      bounces={false}
      scrollEnabled={!showText}
      scrollEventThrottle={16}
      onScroll={onScroll}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate={'fast'}
      contentContainerStyle={{
        paddingTop: showText ? 0 : height / 2 - ITEM_HEIGHT / 2,
        paddingBottom: showText ? 0 : height / 2 - ITEM_HEIGHT / 2,
        paddingHorizontal: 20,
      }}
      renderItem={({item}) => {
        return <Item {...item} color={color} showText={showText} />;
      }} 
      onMomentumScrollEnd={ev => {
        const newIndex = Math.round(
          ev.nativeEvent.contentOffset.y / ITEM_HEIGHT
        );
        if (onItemIndexChange) {
          onItemIndexChange(newIndex);
        }
      }}
    />
  );
});

export default function App() { 
  const [index, setIndex] = React.useState(0);
  const onConnectPress = React.useCallback(() => {
    Alert.alert('Connect with: ', data[index].name.toUpperCase());
  }, [index]);
  const yellowRef = React.useRef();
  const darkRef = React.useRef();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event(
    [{ nativeEvent: {contentOffset: { y: scrollY} }}],
    { useNativeDriver: true }
  );
  const onItemIndexChange = React.useCallback(setIndex, []);
  React.useEffect(() => {
    scrollY.addListener((v) => {
      if (darkRef?.current) {
        darkRef.current.scrollToOffset({
          offset: v.value,
          animated: false,
        });
      }
    });
  });

  return (
    <View style={s.container}>
      <StatusBar hidden />
      <ConnectWithText />
      <List 
        ref={yellowRef} 
        color={colors.yellow} 
        style={StyleSheet.absoluteFillObject}
        onScroll={onScroll}
        onItemIndexChange={onItemIndexChange}
      />
      <List 
        ref={darkRef} 
        color={colors.dark} 
        showText 
        style={{
          position: 'absolute',
          backgroundColor: colors.yellow,
          width,
          height: ITEM_HEIGHT,
          top: height / 2 - ITEM_HEIGHT / 2,
        }}
      />
      <ConnectButton onPress={onConnectPress} />
      <Item />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.dark,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ITEM_HEIGHT,
  },
  itemText: {
    fontSize: 26,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
});
