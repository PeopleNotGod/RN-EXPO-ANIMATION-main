import AnimatedButton from '@/components/ButtonAnimated'
import React from 'react'
import { View } from 'react-native'

const Home = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* <Text>Home</Text>
      <Link href="/profile">Open Profile</Link> */}
      <AnimatedButton />
    </View>
  )
}

export default Home