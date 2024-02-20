import React, {useEffect, useState } from 'react'
import { StyleSheet, View, Image, Dimensions} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as GlobalStyles from '../../styles/GlobalStyles'
import Header from '../../components/Header'
import { getCouple } from '../../api/MainEndpoints'
import { showMessage } from 'react-native-flash-message'
import map from '../../../assets/Map.png'
import hacienda from '../../../assets/hacienda.png'
import hacienda1 from '../../../assets/hacienda-1.jpg'
import hacienda2 from '../../../assets/hacienda2.jpg'
import hacienda22 from '../../../assets/hacienda2-2.jpg'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'

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
        const dateObj = new Date(couple.weddingDate)
        const day = dateObj.getDate()
        const month = dateObj.getMonth() + 1
    
        const formattedDay = day < 10 ? `0${day}` : day
        const formattedMonth = month < 10 ? `0${month}` : month
    
        const formattedDate = `${formattedDay}-${formattedMonth}-${dateObj.getFullYear()}`
    
        return formattedDate
    }
    const renderTime = ()=>{
        const dateObj = new Date(couple.weddingDate)
        const hour = dateObj.getHours()
        const minutes = dateObj.getMinutes() == 0 ? '00' : dateObj.getMinutes()

        return `${hour}:${minutes}`
    }

    return(
        <View style={{ backgroundColor: GlobalStyles.brandBackground }}> 
            <View style={{zIndex:9999}}>
                <Header navigation={navigation} activeTitle="Información"></Header>
            </View>
            <View style={[ GlobalStyles.itemCenter,{marginTop:55}]}>
                <View style={[GlobalStyles.containerCenter, {textAlign:'center'}]}>
                    <TextSemiBold size={24} textStyle={{fontStyle:'italic'}}>Ceremonia & Celebración</TextSemiBold>
                    <View style={styles.displayImages}>
                        <Image style={styles.imageSize} source={hacienda1} />
                        <Image style={styles.imageSize} source={hacienda22} />
                    </View>
                    <View style={[GlobalStyles.itemCenter ,{textAlign:'start',marginBottom:6}]}>
                        <MaterialCommunityIcons name='church' color={GlobalStyles.brandPrimaryTap} size={25} style={{paddingTop:20}}/>
                        <TextSemiBold size={20} textStyle={[{color:'#3E3E3E'}]}>Hacienda:</TextSemiBold>
                        <TextRegular size={18} textStyle={[{color:GlobalStyles.brandPrimaryTap}]}> {couple.weddingVenue}</TextRegular>
                        <MaterialCommunityIcons name='calendar' color={GlobalStyles.brandPrimaryTap} size={25} style={{paddingTop:20}}/>
                        <TextSemiBold size={20} textStyle={[{color:'#3E3E3E'}]}>Fecha:</TextSemiBold>
                        <TextRegular size={18} textStyle={[{color:GlobalStyles.brandPrimaryTap}]}> {renderDate()}</TextRegular>
                        {/*<TextSemiBold size={20} textStyle={[{color:'#3E3E3E', paddingTop:20}]}>Celebración: 
                            <TextSemiBold size={20} style={[{color:GlobalStyles.brandPrimaryTap}]}> {couple.invitationPlace}</TextSemiBold></TextSemiBold>*/}
                            <MaterialCommunityIcons name='clock' color={GlobalStyles.brandPrimaryTap} size={25} style={{paddingTop:20}}/>
                        <TextSemiBold size={20} textStyle={[{color:'#3E3E3E'}]}>Hora:</TextSemiBold>
                        <TextRegular size={18} textStyle={[{color:GlobalStyles.brandPrimaryTap}]}> {renderTime()}h</TextRegular>
                        <MaterialCommunityIcons name='map-marker' color={GlobalStyles.brandPrimaryTap} size={25} style={{paddingTop:20}}/>
                        <TextSemiBold size={20} textStyle={[{color:'#3E3E3E'}]}>Ubicación:</TextSemiBold> 
                        <TextRegular size={18}> <a href="https://goo.gl/maps/P8wCTbyWoYMRPP1J7">
                            Ctra. Dos Hermanas Utrera km, Km 1</a>
                        </TextRegular>
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
        justifyContent: 'space-around', 
        alignItems:'center',
        paddingTop:20
    },
    imageSize:{
        height:250, 
        width:200,
        borderRadius:250,
        maginTop:15, 
        borderWidth:2,
        borderColor:'goldenrod',
        marginBottom:15
    }
})
  
  