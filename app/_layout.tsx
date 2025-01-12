import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'


const rootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="Home" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="SignupScreen" options={{ headerShown: false }} />
    </Stack>
  )
}

export default rootLayout