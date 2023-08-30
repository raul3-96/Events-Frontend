import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text, ImageBackground, Image, Pressable, ScrollView, TextInput, FieldArray } from 'react-native'
import * as GlobalStyles from '../../styles/GlobalStyles'
import InputItemFormik from '../../components/InputItemFormik'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import Header from '../../components/Header'
import * as yup from 'yup'
import { Formik } from 'formik'
import FlashMessage ,{ showMessage } from 'react-native-flash-message'
import TextError from '../../components/TextError'

export default function LoginScreen ({ navigation, route }) {
    const [backendErrors, setBackendErrors] = useState()
    const { loggedInUser, signIn } = useContext(AuthorizationContext)

    const validationSchema = yup.object().shape({
        phone: yup
          .string()
          .max(255, 'Phone too long')
          .required('Número de telefono obligatorio'),
        password: yup
          .string()
          .min(3, ({ min }) => `Password must be at least ${min} characters`)
          .matches(/^\S*$/, 'No spaces are allowed')
          .required('Código obligatorio')
      })

    const login = (values) => {
        setBackendErrors([])
        signIn(values,
            (loggedInUser) => {
            loggedInUser.userType === 'customer'
                ? showMessage({
                message: `Welcome back ${loggedInUser.firstName}.`,
                type: 'success',
                style: GlobalStyles.flashStyle,
                titleStyle: GlobalStyles.flashTextStyle,
                duration:4000
                })
                : showMessage({
                message: `Bienvenido ${loggedInUser.firstName}. Confirma tu asistencia si aún no lo has hecho.`,
                type: 'warning',
                style: GlobalStyles.flashStyle,
                titleStyle: GlobalStyles.flashTextStyle,
                duration:4000
                })
                navigation.navigate('Confirmar')
            },
            (error) => {
                setBackendErrors(error.errors)
            })
        }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ phone: '', password: '' }}
      onSubmit={login}>
      {({ handleSubmit }) => (
    <View style={{ backgroundColor: GlobalStyles.brandBackground }}>
      <View style={{zIndex:9999}}>
        <Header navigation={navigation} activeTitle="Confirmar asistencia"></Header>
      </View>
      <View style={[styles.container, styles.center,{marginTop:55}]}>
        <View style={styles.containerCentered}>
          <Text style={{fontWeight:'bold', fontSize:24, textAlign:'center'}}>¡Identificate!</Text>
          <Text style={{fontWeight:'bold', fontSize:18, textAlign:'center'}}>Para confirmar tu asistencia es necesario identificar tu invitación.</Text>
          <View style={[styles.container, styles.center,{marginTop:20}]}>
            <View style={{minWidth: 255, width:'50%'}}>
                <InputItemFormik
                name='phone'
                label='Teléfono:'
                placeholder='666999666'
                textContentType='teléfono'
                />
                <InputItemFormik
                name='password'
                label='Código:'
                placeholder='secret'
                textContentType='password'
                secureTextEntry={true}
                />

                {backendErrors &&
                backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)
                }

                <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                    {
                    backgroundColor: pressed
                        ? GlobalStyles.brandSuccessTap
                        : GlobalStyles.brandSuccess
                    },
                    styles.center,
                    styles.button
                ]}>
                <TextRegular textStyle={styles.text}>
                    Identifícate
                </TextRegular>
                </Pressable>
                </View>
            </View>
        </View>
      </View>
    </View>)}
    </Formik>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center:{
    alignItems: "center", 
    justifyContent: "center",
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    width:'100%',
    maxWidth:1250,
    display:'flex',
    padding:15
  },  
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 15,
    marginBottom: 15,
    width: '100%'
  }
})
