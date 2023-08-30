import React, {useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image, Dimensions} from 'react-native'
import * as GlobalStyles from '../../styles/GlobalStyles'
import Header from '../../components/Header'
import TextRegular from '../../components/TextRegular'
import { getCouple } from '../../api/MainEndpoints'
import { showMessage } from 'react-native-flash-message'
import map from '../../../assets/Map.png'
import hacienda from '../../../assets/hacienda.png'
import hacienda2 from '../../../assets/hacienda2.jpg'

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
            <View style={[styles.container, styles.center,{marginTop:55}]}>
                <View style={styles.containerCentered}>
                    <TextRegular textStyle={[styles.text, {color:'black',textAlign:'center'}]}>Ceremonia & Celebración</TextRegular>
                    
                    <TextRegular textStyle={[styles.text, {color:'#3E3E3E',textAlign:'start', fontSize:20, paddingTop:20}]}>Hacienda: 
                        <Text style={{fontWeight:'initial', color:'#7ED7DB',fontWeight:'bold'}}> {couple.weddingVenue}</Text></TextRegular>
                    <TextRegular textStyle={[styles.text, {color:'#3E3E3E',textAlign:'start', fontSize:20, paddingTop:20}]}>Fecha:
                        <Text style={{fontWeight:'initial', color:'#7ED7DB',fontWeight:'bold'}}> {renderDate()}</Text></TextRegular>
                    
                    <TextRegular textStyle={[styles.text, {color:'#3E3E3E',textAlign:'start', fontSize:20, paddingTop:20}]}>Celebración: 
                        <Text style={{fontWeight:'initial', color:'#7ED7DB',fontWeight:'bold'}}> {couple.invitationPlace}</Text></TextRegular>
                    <TextRegular textStyle={[styles.text, {color:'#3E3E3E',textAlign:'start', fontSize:20, paddingTop:20}]}>Hora: 
                        <Text style={{fontWeight:'initial', color:'#7ED7DB',fontWeight:'bold'}}> {couple.timingInvitation}</Text></TextRegular>

                        
                    <TextRegular textStyle={[styles.text, {color:'#3E3E3E',textAlign:'start', fontSize:20, paddingTop:20}]}>Ubicación: 
                        <Text style={{fontWeight:'initial'}}> <a href="https://goo.gl/maps/P8wCTbyWoYMRPP1J7">Hacienda {couple.weddingVenue}</a></Text></TextRegular>
                    <View style={styles.displayImages}>
                        <Image style={[ {height:250, width:250,maginTop:15, marginBottom:15}]} source={hacienda} />
                        <Image style={[ {height:250, width:250,maginTop:15, marginBottom:15}]} source={hacienda2} />
                    </View>
                    <Image style={[styles.image, {maginTop:15, marginBottom:15}]} source={map} />
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
      height: 500
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
    },displayImages:{
        display:'flex', 
        flexDirection: windowWidth > 768 ? 'row': 'column', 
        justifyContent: 'space-between', 
        alignItems:'center',
        paddingTop:20
    }
})
  