import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text, ImageBackground, Image, Pressable,Dimensions,  ScrollView, TextInput, FieldArray } from 'react-native'
import * as GlobalStyles from '../../styles/GlobalStyles'
import Header from '../../components/Header'
import TextRegular from '../../components/TextRegular'
import viaje1 from '../../../assets/Viaje1.jpg'
import viaje2 from '../../../assets/Viaje2.jpg'
import viaje3 from '../../../assets/Viaje3.jpg'

const windowWidth = Dimensions.get('window').width;

export default function ListScreen ({ navigation, route }) {

    return(
        <View style={{ backgroundColor: GlobalStyles.brandBackground }}>
            <View style={{zIndex:9999}}>
                <Header navigation={navigation} activeTitle="Lista"></Header>
            </View>
            <View style={[styles.container, styles.center,{marginTop:55}]}>
                <View style={styles.containerCentered}>
                    <TextRegular textStyle={[styles.text, {color:'black',textAlign:'center'}]}>Nuestra Luna de Miel</TextRegular>
                    <TextRegular textStyle={[styles.text, {color:'#3E3E3E',textAlign:'center', fontSize:20, paddingTop:20}]}>Nos hemos decidido por un viaje a XXXXX</TextRegular>

                   <View style={styles.displayImages}>
                        <Image style={[styles.image, {borderRadius:'50%', maginTop:15, marginBottom:15}]} source={viaje2} />
                        <Image style={[styles.image, {borderRadius:'50%', maginTop:15, marginBottom:15}]} source={viaje3} />
                        <Image style={[styles.image, {borderRadius:'50%', maginTop:15, marginBottom:15}]} source={viaje1} />
                    </View>

                    <TextRegular textStyle={[styles.text, {color:'#3E3E3E',textAlign:'center', fontSize:20, paddingTop:20}]}>Sin lugar a dudas, vuestra compañía en nuestro día más especial es el mejor regalo, pero si además queréis contribuir de alguna otra forma, podéis hacerlo aquí:</TextRegular>
                    <TextRegular textStyle={[styles.text, {color:'#3E3E3E',textAlign:'center', fontSize:20, paddingTop:20}]}>Banco:</TextRegular>
                    <TextRegular textStyle={[styles.text, {color:'#3E3E3E',textAlign:'center', fontSize:20, paddingTop:20}]}>Beneficiario:</TextRegular>
                    <TextRegular textStyle={[styles.text, {color:'#3E3E3E',textAlign:'center', fontSize:20, paddingTop:20}]}>IBAN:</TextRegular>
                </View>
            </View>
        </View>
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
    image: {
      height: 250,
      width: 250
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },displayImages:{
        display:'flex', 
        flexDirection: windowWidth > 768 ? 'row': 'column', 
        justifyContent: 'space-between', 
        alignItems:'center',
        paddingTop:20
    }
})
  