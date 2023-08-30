import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { View, StyleSheet} from 'react-native'
import React, { useContext, useEffect } from 'react'
import * as GlobalStyles from '../styles/GlobalStyles'
import MainScreen from './Main/MainScreen'
import LoginScreen from './confirm/LoginScreen'
import 'bootstrap/dist/css/bootstrap.min.css';

// eslint-disable-next-line camelcase
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import { AuthorizationContext } from '../context/AuthorizationContext'
import { AppContext } from '../context/AppContext'
import { ApiError } from '../api/helpers/Errors'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ConfirmScreen from './confirm/ConfirmScreen'
import ListScreen from './List/ListScreen'
import InfoScreen from './info/InfoScreen'

const Stack = createNativeStackNavigator()

const Tab = createBottomTabNavigator()

export default function Layout () {
  const { loggedInUser, getToken, signOut } = useContext(AuthorizationContext)
  const { error, setError } = useContext(AppContext)
  
  const init = async () => {
    await getToken(
      (recoveredUser) => console.log("session recevored"),
      (error) =>  console.log( `Session could not be recovered. Please log in. ${error} `)
    )
  }

  useEffect(() => {
    if (error) {
      showMessage({
        message: error.message,
        type: 'danger',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      if (error instanceof ApiError && (error.code === 403 || error.code === 401)) {
        signOut()
      }
      setError(null)
    }
  }, [loggedInUser,error])

  useEffect(() => {
    init()
  }, [])

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold
  })
  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown : false}}>
        <Stack.Screen name="Home" component={MainScreen} />
        {!loggedInUser ? <Stack.Screen name="Login" component={LoginScreen} /> :
        <Stack.Screen name="Confirmar" component={ConfirmScreen} />}
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
      </Stack.Navigator>
      <FlashMessage position="bottom" />
  </NavigationContainer>
  </View>
          
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})