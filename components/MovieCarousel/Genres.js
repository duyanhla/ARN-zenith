import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Genres({ genres }) {
  return (
    <View style={s.genres}>
      {genres.map((genre, i) => {
        return (
          <View key={genre} style={s.genre}>
            <Text style={s.genreText}>{genre}</Text>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 4,
  },
  genre: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: '#ccc',
    marginRight: 4,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 9, 
    opacity: 0.4,
  },
});