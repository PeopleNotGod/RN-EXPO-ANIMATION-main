import { useState } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')
const SWIPE_THRESHOLD = width * 0.25

/* ================= TYPE ================= */
interface CardItem {
  id: number
  title: string
  image: any
}

/* ================= DATA ================= */
const INITIAL_CARDS: CardItem[] = [
  {
    id: 1,
    title: 'Card 1',
    image: require('../assets/images/96efcc6d4b3abad31deea1eb42d60a19.png'),
  },
  {
    id: 2,
    title: 'Card 2',
    image: require('../assets/images/380c8f43dbfd107553faebd8bf29d8fd.png'),
  },
  {
    id: 3,
    title: 'Card 3',
    image: require('../assets/images/b7d1bdf20a35f0d2605de32b35f6b47e.png'),
  },
]

/* ================= COMPONENT ================= */
const SwipeableCard = (): JSX.Element => {
  const [cards, setCards] = useState<CardItem[]>(INITIAL_CARDS)

  const translateX = useSharedValue(0)
  const rotate = useSharedValue(0)

  const removeTopCard = () => {
    setCards(prev => {
      const next = prev.slice(1)
      return next.length === 0 ? INITIAL_CARDS : next
    })
    translateX.value = 0
    rotate.value = 0
  }

  const onSwipeRight = () => {
    console.log('LIKE ❤️')
    removeTopCard()
  }

  const onSwipeLeft = () => {
    console.log('NOPE ❌')
    removeTopCard()
  }

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      translateX.value = e.translationX
      rotate.value = e.translationX / 20
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width, {}, () =>
          runOnJS(onSwipeRight)()
        )
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width, {}, () =>
          runOnJS(onSwipeLeft)()
        )
      } else {
        translateX.value = withSpring(0)
        rotate.value = withSpring(0)
      }
    })

  /* ================= ANIMATION ================= */
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }))

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }))

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }))

  /* ================= RENDER ================= */
  return (
    <View style={styles.container}>
      {[...cards].reverse().map((item, index) => {
        const isTop = index === cards.length - 1

        if (isTop) {
          return (
            <GestureDetector key={item.id} gesture={panGesture}>
              <Animated.View style={[styles.card, cardStyle]}>
                <Image
                  source={item.image}
                  style={styles.image}
                  resizeMode="cover"
                />

                <Animated.View style={[styles.like, likeStyle]}>
                  <Text style={styles.likeText}>LIKE</Text>
                </Animated.View>

                <Animated.View style={[styles.nope, nopeStyle]}>
                  <Text style={styles.nopeText}>NOPE</Text>
                </Animated.View>

                <Text style={styles.text}>{item.title}</Text>
              </Animated.View>
            </GestureDetector>
          )
        }

        return (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                top: (cards.length - 1 - index) * 10,
                transform: [
                  { scale: 1 - (cards.length - 1 - index) * 0.05 },
                ],
              },
            ]}
          >
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.text}>{item.title}</Text>
          </View>
        )
      })}
    </View>
  )
}

export default SwipeableCard

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    height: 380,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: width * 0.85,
    height: 330,
    borderRadius: 20,
    elevation: 6,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 20,
  },
  text: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  like: {
    position: 'absolute',
    top: 20,
    left: 20,
    borderWidth: 3,
    borderColor: '#4CAF50',
    padding: 6,
    borderRadius: 6,
  },
  likeText: {
    color: '#4CAF50',
    fontSize: 22,
    fontWeight: 'bold',
  },

  nope: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderWidth: 3,
    borderColor: '#F44336',
    padding: 6,
    borderRadius: 6,
  },
  nopeText: {
    color: '#F44336',
    fontSize: 22,
    fontWeight: 'bold',
  },
})
