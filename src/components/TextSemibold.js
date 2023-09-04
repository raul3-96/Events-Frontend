import React from 'react'
import { StyleSheet, Text } from 'react-native'
export default function TextSemiBold (props) {
  const { textStyle, ...inputProps } = props

  return (
          <Text style={[styles.text, textStyle, {fontSize : props.size}]} {...inputProps}>
            {props.children}
          </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat_600SemiBold'
  }
})
