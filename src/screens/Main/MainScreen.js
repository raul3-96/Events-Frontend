import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ImageBackground,Dimensions, Text} from 'react-native'
import * as GlobalStyles from '../../styles/GlobalStyles'
import Header from '../../components/Header'
import { getCouple } from '../../api/MainEndpoints'
import { showMessage } from 'react-native-flash-message'

const windowWidth = Dimensions.get('window').width

export default function MainScreen ({ navigation, route }) {

  const initialValuesTime = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }

  const [couple, setCouple] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(initialValuesTime)

  useEffect(() => {
    async function fetchCouple () {
      try {
        const fetchedCouple = await getCouple(1)
        setCouple(fetchedCouple)
        
        const calculateTimeRemaining = () => {
          if (fetchedCouple && fetchedCouple.weddingDate) {
            const currentTime = new Date()
            const difference = new Date(fetchedCouple.weddingDate).getTime() - currentTime.getTime()
            if (difference > 0) {
              const days = Math.floor(difference / (1000 * 60 * 60 * 24))
              const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
              const minutes = Math.floor((difference / 1000 / 60) % 60)
              const seconds = Math.floor((difference / 1000) % 60)
    
              setTimeRemaining({
                days,
                hours,
                minutes,
                seconds
              })
            } else {
              setTimeRemaining(initialValuesTime)
            }
          } else {
            showMessage({
              message: `Ha ocurrido un error al obtener la fecha del evento`,
              type: 'danger',
              style: GlobalStyles.flashStyle,
              titleStyle: GlobalStyles.flashTextStyle
            })
          }
        }
        const timer = setInterval(calculateTimeRemaining, 1000)
    
        return () => {
          clearInterval(timer)
        }
      } catch (error) {
        showMessage({
          message: `Ha ocurrido un error al obtener la fecha del evento.`,
          type: 'danger',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
        console.error(error)
      }
    }
    fetchCouple()
  }, [])

  const renderDate = () => {
    let date = couple.weddingDate
    const dateObj = new Date(couple.weddingDate)
    const day = dateObj.getDate()
    const month = dateObj.getMonth() + 1

    const formattedDay = day < 10 ? `0${day}` : day
    const formattedMonth = month < 10 ? `0${month}` : month

    return `${formattedDay}-${formattedMonth}-${dateObj.getFullYear()}`
  }

  const renderDateUnit = (unit) =>{
    return unit < 10 ? `0${unit}` : unit
  }

  return (<View style={{ backgroundColor: GlobalStyles.brandBackground }}>
    <View style={{zIndex:9999}}>
      <Header navigation={navigation} activeTitle="Inicio"></Header>
    </View>
    <View style={[GlobalStyles.itemCenter, {flex: 1}]}>
    <ImageBackground
        source={require('../../../assets/mainBackground.jpeg')}
        style={styles.imageBackground}>
        <View style={styles.overlay}>
          <View style={[styles.dflex, styles.directionRow, GlobalStyles.justifyCenter, {justifyContent: 'space-between', width:260}]}>
            <Text style={styles.text}>{couple.wifeName}</Text>
            <Text style={styles.text}>&</Text>
            <Text style={styles.text}>{couple.husbandName}</Text>
          </View>
          <View style={[styles.dflex, styles.directionRow, GlobalStyles.justifyCenter, {width:260}]}>
            <Text style={styles.text}>{renderDate()}</Text>
          </View>
          <View style={[styles.dflex, styles.directionRow, GlobalStyles.justifyCenter, {width:300}]}>
            <Text style={styles.text}>{couple.weddingVenue}</Text>
          </View>
          
          <View style={[styles.dflex, styles.directionRow, GlobalStyles.justifyCenter]}>
            <View style={styles.indexCounterWrapper}>
              <Text style={[styles.h_2, styles.justifyCenter, GlobalStyles.alignCenter,{fontWeight:'bold'}]}>{renderDateUnit(timeRemaining.days)}</Text>
              <View style={[styles.h_2, styles.directionRow]}>
                <Text style={[styles.w_4, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(0px) translateY(14px) rotate(40deg)' :'translateX(4px) translateY(12px) rotate(34deg)'}]}>D</Text>
                <Text style={[styles.w_4, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(0px) translateY(28px) rotate(8deg)':'translateX(0px) translateY(19px) rotate(23deg)'}]}>i</Text>
                <Text style={[styles.w_4, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(0px) translateY(28px) rotate(-8deg)':'translateX(0px) translateY(19px) rotate(-23deg)'}]}>a</Text>
                <Text style={[styles.w_4, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(0px) translateY(14px) rotate(-40deg)':'translateX(-4px) translateY(12px) rotate(-34deg)'}]}>s</Text>
              </View>
            </View>
            <View style={[styles.indexCounterWrapper,{marginLeft: windowWidth < 768 ? 5 : windowWidth < 1200 ? 15 :30 }]}>
              <Text style={[styles.h_2,GlobalStyles.itemCenter,{fontWeight:'bold'}]}>{renderDateUnit(timeRemaining.hours)}</Text>
              <View style={[styles.h_2, styles.directionRow]}>
                <Text style={[styles.w_5, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(1px) translateY(12px) rotate(40deg)':'translateX(1px) translateY(8px) rotate(40deg)'}]}>H</Text>
                <Text style={[styles.w_5, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(-1px) translateY(25px) rotate(23deg)':'translateX(-1px) translateY(18px) rotate(23deg)'}]}>o</Text>
                <Text style={[styles.w_5, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(0px) translateY(30px) rotate(0deg)':'translateX(0px) translateY(22px) rotate(0deg)'}]}>r</Text>
                <Text style={[styles.w_5, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(-1px) translateY(25px) rotate(-23deg)':'translateX(-1px) translateY(18px) rotate(-23deg)'}]}>a</Text>
                <Text style={[styles.w_5, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(-3px) translateY(13px) rotate(-40deg)':'translateX(-3px) translateY(8px) rotate(-40deg)'}]}>s</Text>
              </View>
            </View>
            <View style={[styles.indexCounterWrapper,{marginLeft: windowWidth < 768 ? 5 : windowWidth < 1200 ? 15 :30 }]}>
              <Text style={[styles.h_2, GlobalStyles.itemCenter,{fontWeight:'bold'}]}>{renderDateUnit(timeRemaining.minutes)}</Text>
              <View style={[styles.h_2, styles.directionRow]}>
                <Text style={[styles.w_3, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(4px) translateY(18px) rotate(35deg)':'translateX(4px) translateY(13px) rotate(24deg)'}]}>M</Text>
                <Text style={[styles.w_3, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(0px) translateY(30px) rotate(0deg)':'translateX(0px) translateY(20px) rotate(0deg)'}]}>i</Text>
                <Text style={[styles.w_3, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(-6px) translateY(19px) rotate(-35deg)':'translateX(-5px) translateY(13px) rotate(-24deg)'}]}>n</Text>
              </View>
            </View>
            <View style={[styles.indexCounterWrapper,{marginLeft: windowWidth < 768 ? 5 : windowWidth < 1200 ? 15 :30 }]}>
              <Text style={[styles.h_2, GlobalStyles.itemCenter,{fontWeight:'bold'}]}>{renderDateUnit(timeRemaining.seconds)}</Text>
              <View style={[styles.h_2, styles.directionRow]}>
              <Text style={[styles.w_3, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(4px) translateY(18px) rotate(35deg)':'translateX(4px) translateY(13px) rotate(24deg)'}]}>S</Text>
                <Text style={[styles.w_3, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(0px) translateY(30px) rotate(0deg)':'translateX(0px) translateY(20px) rotate(0deg)'}]}>e</Text>
                <Text style={[styles.w_3, {fontWeight:'bold',transform:windowWidth >= 768 ? 'translateX(-6px) translateY(19px) rotate(-35deg)':'translateX(-5px) translateY(13px) rotate(-24deg)'}]}>g</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
  </View></View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageBackground: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      width:'100%',
      maxWidth:1250
    },
    dflex:{
      display:'flex'
    },
    directionRow:{
      flexDirection:'row'
    },
    overlay: {
      height: 960,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
    indexCounterWrapper:{
      position: 'relative',
      float: 'left',
      width: windowWidth >= 768 ? 100 : 85,
      height: windowWidth >= 768 ? 100 : 85,
      marginTop: 15,
      backgroundColor:'#CC88A1',
      color: '#FFFFFF',
      textAlign: 'center',
      backgroundRepeat: 'no-repeat',
      borderRadius: '50%',
    },
    h_2:{
      height:'50%'
    },
    w_2:{
      width:'50%'
    },
    w_3:{
      width:'33.3%'
    },
    w_4:{
      width:'25%'
    },
    w_5:{
      width:'20%'
    }
  })