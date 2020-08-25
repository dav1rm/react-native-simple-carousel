import React, { useRef, useState } from 'react';
import { 
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Text,
  TouchableHighlight,
  Dimensions,
} from 'react-native';

const cardWidth = Dimensions.get('window').width - 10;
const items = ['#ACC1FF', '#C7EEFF', '#FFAEAE' ,'#FFEC94' ,'#B0E57C'];
const scrollX = new Animated.Value(0);

const position = new Animated.divide(scrollX, cardWidth);

const Main = () => {
  const [currentItem, setCurrentItem] = useState(0);
  const scrollRef = useRef();

  const buttonLabel = currentItem >= cardWidth*(items.length-1)-10 ? 'Finalizar' : 'Próximo';

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollview}
        snapToInterval={cardWidth}
        horizontal
        disableIntervalMomentum
        decelerationRate="fast"
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={new Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } }}],
            { useNativeDriver: false }
          )
        }
        onMomentumScrollEnd={e => {
          setCurrentItem(e.nativeEvent.contentOffset.x)
        }}
      >
        {
          items.map(item => (
            <View key={item} style={[styles.section, { backgroundColor: item }]}>
              <Text style={styles.sectionText}>{item}</Text>
            </View>
          ))
        }
      </ScrollView>

      <View style={styles.dotList}>
        {items.map((item, i) => {
          const opacity = position.interpolate({
            inputRange: [i-1, i, i+1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          });
          const height = position.interpolate({
            inputRange: [i-1, i, i+1],
            outputRange: [5, 5, 5],
            extrapolate: 'clamp'
          });
          const width = position.interpolate({
            inputRange: [i-1, i, i+1],
            outputRange: [5, 20, 5],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View
              key={item}
              style={[styles.dot, { opacity, height, width }]}
            />
          );
        }
        )}
      </View>
      <TouchableHighlight
        onPress={() => {
          const to = currentItem + cardWidth;
          
          if(to < cardWidth*items.length) {
            setCurrentItem(to);
            scrollRef.current?.scrollTo({x: to, y: 2, animated: true})
          }
        }}
        style={styles.button}
        underlayColor='rgba(97, 218, 251, 0.8)'
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flexGrow: 1,
  },
  section: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    width: cardWidth,
    backgroundColor: 'white'
  },
  sectionText: {
    fontSize: 26,
  },
  dotList: {
    height: 20,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    margin: 1,
    borderRadius: 5,
    backgroundColor: '#61dafb',
  },
  button: {
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 30,
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#61dafb',
  },
  buttonText: {
    fontSize: 14,
    color: '#111',
  }
});

export default Main;