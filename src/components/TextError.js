import React from 'react'
import { StyleSheet, Text } from 'react-native'
import * as GlobalStyles from '../styles/GlobalStyles'

export default function TextError (props) {
  const { textStyle, ...inputProps } = props

  return (
          <Text style={[styles.text, textStyle]} {...inputProps}>
            {props.children}
          </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Oregano_400Regular',
    fontSize: 16,
    color: GlobalStyles.brandError,
    textAlign: 'center'
  }
})
