import React from 'react';
import {StyleSheet,Pressable, View } from 'react-native'
import TextRegular from './TextRegular'
import { MaterialCommunityIcons } from '@expo/vector-icons'

function EditBottom(props) {
  return (
    <Pressable onPress={props.onPress} style={[styles.bottom,styles.bottomEdit, props.style]} >
      <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
        <MaterialCommunityIcons name='pencil' color={'white'} size={20}/>
        <TextRegular style={styles.textBottom}>Edit</TextRegular>
      </View>
    </Pressable>
  );
}

function DeleteBottom(props) {
  return (
    <Pressable onPress={props.onPress} style={[styles.bottom,styles.bottomDelete, props.style]} >
      <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
        <MaterialCommunityIcons name='delete' color={'white'} size={20}/>
        <TextRegular style={styles.textBottom}>Delete</TextRegular>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bottom:{
    width:90, color:'white', borderRadius:5, padding:5, margin:5
  },
  textBottom:{
    color:'white', 
    textAlign:'center'},
  bottomEdit:{
    backgroundColor:'#4452FB'
  },
  bottomDelete:{
    backgroundColor:'red'
  }
})

export { EditBottom, DeleteBottom };
