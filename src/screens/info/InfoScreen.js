import React, {useEffect, useState } from 'react'
import { StyleSheet, View, Image, Dimensions} from 'react-native'
import * as GlobalStyles from '../../styles/GlobalStyles'
import Header from '../../components/Header'
import { getCouple } from '../../api/MainEndpoints'
import { showMessage } from 'react-native-flash-message'
import map from '../../../assets/Map.png'
import hacienda from '../../../assets/hacienda.png'
import hacienda2 from '../../../assets/hacienda2.jpg'
import TextSemiBold from '../../components/TextSemibold'

const windowWidth = Dimensions.get('window').width;

export default function InfoScreen ({ navigation }) {
 
    const [couple, setCouple] = useState([])

    useEffect(() => {
        async function fetchCouple () {
            try {
              const fetchedCouple = await getCouple(1)
              console.log(fetchedCouple)
              setCouple(fetchedCouple)
            } catch (error) {
              showMessage({
                message: `Hay un error mientra intentamos mostrar información sobre el evento. ${error}`,
                type: 'danger',
                style: GlobalStyles.flashStyle,
                titleStyle: GlobalStyles.flashTextStyle
              })
            }
          }
          fetchCouple()
    }, [])

    const renderDate = () => {
        let date = couple.weddingDate
        const dateObj = new Date(couple.weddingDate)
        const day = dateObj.getDate()
        const month = dateObj.getMonth() + 1
        const hour = dateObj.getHours()
        const minutes = dateObj.getMinutes() == 0 ? '00' : dateObj.getMinutes()
    
        const formattedDay = day < 10 ? `0${day}` : day
        const formattedMonth = month < 10 ? `0${month}` : month
    
        const formattedDate = `${hour}:${minutes} ${formattedDay}-${formattedMonth}-${dateObj.getFullYear()}`
    
        return formattedDate
      }

    return(
        <View style={{ backgroundColor: GlobalStyles.brandBackground }}> 
            <View style={{zIndex:9999}}>
                <Header navigation={navigation} activeTitle="Información"></Header>
            </View>
            <View style={[ GlobalStyles.itemCenter,{marginTop:55}]}>
                <View style={[GlobalStyles.containerCenter, {textAlign:'center'}]}>
                    <TextSemiBold size={24}>Ceremonia & Celebración</TextSemiBold>
                    <View style={{textAlign:'start'}}>
                        <TextSemiBold size={20} textStyle={[{color:'#3E3E3E', paddingTop:20}]}>Hacienda: 
                            <TextSemiBold size={20} style={[{color:GlobalStyles.brandPrimaryTap}]}> {couple.weddingVenue}</TextSemiBold></TextSemiBold>
                        <TextSemiBold size={20} textStyle={[{color:'#3E3E3E', paddingTop:20}]}>Fecha:
                            <TextSemiBold size={20} style={[{color:GlobalStyles.brandPrimaryTap}]}> {renderDate()}</TextSemiBold></TextSemiBold>
                        
                        <TextSemiBold size={20} textStyle={[{color:'#3E3E3E', paddingTop:20}]}>Celebración: 
                            <TextSemiBold size={20} style={[{color:GlobalStyles.brandPrimaryTap}]}> {couple.invitationPlace}</TextSemiBold></TextSemiBold>
                        <TextSemiBold size={20} textStyle={[{color:'#3E3E3E', paddingTop:20}]}>Hora: 
                            <TextSemiBold size={20} style={[{color:GlobalStyles.brandPrimaryTap}]}> {couple.timingInvitation}</TextSemiBold></TextSemiBold>
    
                        <TextSemiBold size={20} textStyle={[{color:'#3E3E3E', paddingTop:20}]}>Ubicación: 
                            <TextSemiBold size={20}> <a href="https://goo.gl/maps/P8wCTbyWoYMRPP1J7">Hacienda {couple.weddingVenue}</a></TextSemiBold></TextSemiBold>
                    </View>  
                    <View style={styles.displayImages}>
                        <Image style={styles.imageSize} source={hacienda} />
                        <Image style={styles.imageSize} source={hacienda2} />
                    </View>
                    <Image style={[{height : 500, maginTop:15, marginBottom:15}]} source={map} />
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    displayImages:{
        display:'flex', 
        flexDirection: windowWidth > 768 ? 'row': 'column', 
        justifyContent: 'space-between', 
        alignItems:'center',
        paddingTop:20
    },
    imageSize:{
        height:250, 
        width:250,
        maginTop:15, 
        marginBottom:15
    }
})
  
  