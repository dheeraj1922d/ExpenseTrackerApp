import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'


const rootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: true }} />
      <Stack.Screen name="SignupScreen" options={{ headerShown: true }} />
    </Stack>
  )
}

export default rootLayout