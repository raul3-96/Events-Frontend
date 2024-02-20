import React from 'react'
import {StyleSheet, View, Image, Dimensions} from 'react-native'
import * as GlobalStyles from '../../styles/GlobalStyles'
import Header from '../../components/Header'
import viaje1 from '../../../assets/Viaje1.jpg'
import viaje2 from '../../../assets/Viaje2.jpg'
import viaje3 from '../../../assets/Viaje3.jpg'
import TextSemiBold from '../../components/TextSemibold'

const windowWidth = Dimensions.get('window').width;

export default function ListScreen ({ navigation}) {

    return(
        <View style={{ backgroundColor: GlobalStyles.brandBackground }}>
            <View style={{zIndex:9999}}>
                <Header navigation={navigation} activeTitle="Lista"></Header>
            </View>
            <View style={[ GlobalStyles.justifyCenter, GlobalStyles.alignCenter,{marginTop:55}]}>
                <View style={[GlobalStyles.containerCenter, {textAlign:'center'}]}>
                    <TextSemiBold size={24} textStyle={{fontStyle:'italic'}} >Nuestra Luna de Miel</TextSemiBold>
                    <TextSemiBold size={20} textStyle={[{color:'#3E3E3E', paddingTop:20}]}>Nos hemos decidido por un viaje a Tailandia-Bali</TextSemiBold>

                   <View style={styles.displayImages}>
                        <Image style={[styles.image, {borderRadius:'50%', maginTop:15, marginBottom:15}]} source={viaje2} />
                        <Image style={[styles.image, {borderRadius:'50%', maginTop:15, marginBottom:15}]} source={viaje3} />
                        <Image style={[styles.image, {borderRadius:'50%', maginTop:15, marginBottom:15}]} source={viaje1} />
                    </View>

                    <TextSemiBold size={20} textStyle={[{color:'#3E3E3E', paddingTop:20}]}>Sin lugar a dudas, vuestra compañía en nuestro día más especial es el mejor regalo, pero si además queréis contribuir de alguna otra forma, podéis hacerlo aquí:</TextSemiBold>
                    <TextSemiBold size={20} textStyle={[{color:'#3E3E3E', paddingTop:20}]}>Banco:</TextSemiBold>
                    <TextSemiBold size={20} textStyle={[{color:'#3E3E3E', paddingTop:20}]}>Beneficiario:</TextSemiBold>
                    <TextSemiBold size={20} textStyle={[{color:'#3E3E3E', paddingTop:20}]}>IBAN:</TextSemiBold>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    image: {
      height: 250,
      width: 250
    },
    displayImages:{
        display:'flex', 
        flexDirection: windowWidth > 768 ? 'row': 'column', 
        justifyContent: 'space-between', 
        alignItems:'center',
        paddingTop:20
    }
})
  