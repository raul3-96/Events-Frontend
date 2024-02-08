import React, {useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text, ImageBackground, Image, Pressable, FlatList, Dimensions, ScrollView, TextInput, FieldArray } from 'react-native'
import * as GlobalStyles from '../../styles/GlobalStyles'
import Header from '../../components/Header'
import TextRegular from '../../components/TextRegular'
import {showMessage } from 'react-native-flash-message'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { getInvitationAll, postInvitation, putUser, deleteGuest, deleteInvitation } from '../../api/InvitationEndpoints'
import TextSemiBold from '../../components/TextSemibold'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import InputItem from '../../components/InputItem'
import { Dropdown } from 'react-native-element-dropdown';
import ConfirmModal from '../../components/ConfirmModal'

const windowWidth = Dimensions.get('window').width;

export default function PanelAdminScreen ({ navigation, route }) {
    const { loggedInUser, signOut } = useContext(AuthorizationContext)
    const [invitations, setInvitations] = useState({})
    
    const [mapStatus, setMapStatus] = useState({})
    const [mapCountGuest, setmapCountGuest] = useState({})
    
    const [mapGroupsFront, setmapGroupsFront] = useState([])
    const [expandedEditGuest, setexpandedEditGuest] = useState([])
    const [expandedInvitation, setexpandedInvitation] = useState([])

    
    const [nombre, setNombre] = useState('')
    const [child, setChild] = useState(null)
    const [isFocus, setIsFocus] = useState(false);
    const [alergenos, setAlergenos] = useState('')
    const [Telefono, setTelefono] = useState(null)
    const [Password, setPassword] = useState(null)
    const [flagUpdateGuest,setflagUpdateGuest] = useState(null)
    const [flagNewUser, setflagNewUser] = useState(null)
    const [idUser, setIdUser] = useState(0)
    const [idInvitation, setidInvitation] = useState(0)
    const [refresh,setRefresh] = useState(false)
    const [usertoDelete,setUsertoDelete] = useState(0)
    const [invitationtoDelete,setInvitationtoDelete] = useState(0)

    const [newInvitation, setnewInvitation] = useState(false)

    useEffect(() => {
        async function fetchInvitations () {
            try{
                const fetchedInvitation = await getInvitationAll()
                console.log(fetchedInvitation)
                setInvitations(fetchedInvitation)
                calInvit(fetchedInvitation)
            }catch(error) {
                showMessage({
                  message: `Ha ocurrido un error al rescatar los datos de los invitados. ${error}`,
                  type: 'danger',
                  style: GlobalStyles.flashStyle,
                  titleStyle: GlobalStyles.flashTextStyle
                })
            }
        }

        fetchInvitations()
    }, [refresh])
 
    const handleRefresh = () => {
      setRefresh(!refresh);
    };

    const calInvit = (invitation) => {
        const mapStatusaux = {"pending": 0, "denied":0, "confirmed" : 0, "total": 0}
        let totalize = 0
        let totalPend =0, adultPend=0, childPend=0
        let totalConf=0, adultConf=0, childConf=0
        let totalDen=0, adultDen=0, childDen=0
        let mapFrontAux = []
        let mapExpandedInvAux = []
        let mapguestExpandesAux=[]
        Object.entries(invitation).map(([key, value]) =>{
            mapFrontAux[value[0].invitationId]= true
            mapExpandedInvAux[value[0].invitationId]= false
            Object.values(value).forEach(guest =>mapguestExpandesAux[guest.id]=false) 
            const status = value[0].invitation.status
            const count = mapStatusaux[status] + 1
            mapStatusaux[status] = count
            if(status == 'pending'){
              const tl = value.length
              const tlC = value.filter(el=>!el.child).length
              adultPend = adultPend + tlC
              childPend = childPend + (tl - tlC)
              totalPend = totalPend + tl
            }else if(status == 'denied'){
              const tl = value.length
              const tlC = value.filter(el=>!el.child).length
              adultDen = adultDen + tlC
              childDen = childDen + (tl - tlC)
              totalDen = totalDen + value.length
            }else if(status == 'confirmed'){
              const tl = value.length
              const tlC = value.filter(el=>!el.child).length
              adultConf = adultConf + tlC
              childConf = childConf + (tl - tlC)
              totalConf = totalConf + value.length
            }
            totalize++
        })
        mapStatusaux['total'] = totalize
        setMapStatus(mapStatusaux)
        setmapGroupsFront(mapFrontAux)
        setexpandedInvitation(mapExpandedInvAux)
        setexpandedEditGuest(mapguestExpandesAux)

        const total = Object.values(invitation).flat().length
        const adults = Object.values(invitation).flat().filter(el=>!el.child).length
        const mapCount = {
            "pending":{
              "adults": adultPend,
              "childs": childPend,
              "total": totalPend
            },"confirmed":{
              "adults": adultConf,
              "childs": childConf,
              "total": totalConf
            },"denied": {
              "adults": adultDen,
              "childs": childDen,
              "total": totalDen
            },"totales":{
              "total": total,
              "adults": adults,
              "childs": total - adults
            }
        }
        setmapCountGuest(mapCount)
    }

    const signOutAndNavigate = () => {
        signOut(() => showMessage({
          message: 'Bye Bye',
          type: 'info',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle,
          duration:4000
        }))
      }
    
    const renderRows = () => {
      const mobile = windowWidth < 990
      return (
        <View style={{ width:'100px', textAlign: "center" }}>
          <View style={[GlobalStyles.flex, GlobalStyles.alignCenter, GlobalStyles.justifyCenter, { height: 40, flexDirection: "row", backgroundColor: GlobalStyles.brandPrimaryTap }]}>                        
          </View>
          <View style={[GlobalStyles.flex, GlobalStyles.alignCenter, GlobalStyles.justifyCenter, { height: 30, flexDirection: "row", backgroundColor: GlobalStyles.brandPrimaryTap }]}>
            <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: "white"}]}>{mobile ? 'Rechazados':'Invitaciones'}</TextSemiBold>
          </View>
          <View style={[GlobalStyles.flex, GlobalStyles.alignCenter, GlobalStyles.justifyCenter, { height: 30, flexDirection: "row", backgroundColor: GlobalStyles.brandPrimaryTap }]}>
            <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: "white"}]}>{mobile ? 'Pendientes':'Invitados'}</TextSemiBold>
          </View>
          {mobile ? <>
            <View style={[GlobalStyles.flex, GlobalStyles.alignCenter, GlobalStyles.justifyCenter, { height: 30, flexDirection: "row", backgroundColor: GlobalStyles.brandPrimaryTap }]}>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: "white"}]}>Confirmados</TextSemiBold>
            </View>
            <View style={[GlobalStyles.flex, GlobalStyles.alignCenter, GlobalStyles.justifyCenter, { height: 30, flexDirection: "row", backgroundColor: GlobalStyles.brandPrimaryTap }]}>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: "white"}]}>Total</TextSemiBold>
            </View></>
           : ''}
        </View>
      )
    }
    const renderHeader = () =>{
      const mobile = windowWidth < 990
      return (
        <View style={[GlobalStyles.flex, GlobalStyles.alignCenter, { height: 40, flexDirection: "row", backgroundColor: GlobalStyles.brandPrimaryTap }]}>
          {mobile ? <>
            <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: "white", width:'30%' }]}>Invitaciones</TextSemiBold>
            <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: "white", width:'70%' }]}>Invitados</TextSemiBold></>
            :
            <>
            <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: "white", width:'28.33%' }]}>Rechazados</TextSemiBold>
            <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: "white", width:'28.33%' }]}>Pendientes</TextSemiBold>
            <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: "white", width:'28.33%' }]}>Confirmados</TextSemiBold>
            <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: "white", width:'15%' }]}>Total</TextSemiBold></>
          }
        </View>
      )
    }
    const renderTable = () => {
      const mobile = windowWidth < 990
      return (
        
        <>{renderRows()}
        <View style={{  width:'calc(100% - 100px)', textAlign: "center" }}>
          {/*TODO tabla con row: Invitados  y Invitaciones y total*/}
          
          {renderHeader()}
          <View style={[GlobalStyles.flex, GlobalStyles.alignCenter, { height: 30, flexDirection: "row" }]} >
            {mobile ? <>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandError,  width:'30%' }]}>{mapStatus['denied']}</TextSemiBold>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandError, width:'70%' }]}>
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['denied']['total'] : ''} (
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['denied']['adults'] : ''} adultos y {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['denied']['childs'] : ''} niños)
              </TextSemiBold></>
            :
            <>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandError,  width:'28.33%' }]}>{mapStatus['denied']}</TextSemiBold>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandBlue, width:'28.33%' }]}>{mapStatus['pending']}</TextSemiBold>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandGreen2, width:'28.33%' }]}>{mapStatus['confirmed']}</TextSemiBold>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandGreenTap2, width:'15%' }]}>{mapStatus['total']}</TextSemiBold>
            </>
            }
          </View>
          <View style={[GlobalStyles.flex, GlobalStyles.alignCenter, { height: 30, flexDirection: "row" }]} >
            {mobile ? <>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandBlue, width:'30%' }]}>{mapStatus['pending']}</TextSemiBold>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandBlue, width:'70%' }]}>
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['pending']['total'] : ''} (
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['pending']['adults'] : ''} adultos y {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['denied']['childs'] : ''} niños)
              </TextSemiBold>
            </>
            :<>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandError, width:'28.33%' }]}>
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['denied']['total'] : ''} (
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['denied']['adults'] : ''} adultos y {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['denied']['childs'] : ''} niños)
              </TextSemiBold>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandBlue, width:'28.33%' }]}>
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['pending']['total'] : ''} (
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['pending']['adults'] : ''} adultos y {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['pending']['childs'] : ''} niños)
              </TextSemiBold>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandGreen2, width:'28.33%' }]}>
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['confirmed']['total'] : ''} (
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['confirmed']['adults'] : ''} adultos y {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['confirmed']['childs'] : ''} niños)
              </TextSemiBold>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandGreenTap2, width:'15%' }]}>
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['totales']['total'] : ''}</TextSemiBold>
            </>}
          </View>
          <View style={[GlobalStyles.flex, GlobalStyles.alignCenter, { height: 30, flexDirection: "row" }]} >
            {mobile ? <>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandGreen2, width:'30%' }]}>{mapStatus['confirmed']}</TextSemiBold>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandGreen2, width:'70%' }]}>
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['confirmed']['total'] : ''} (
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['confirmed']['adults'] : ''} adultos y {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['confirmed']['childs'] : ''} niños)
              </TextSemiBold>
            </> : ''
            }
          </View>
          <View style={[GlobalStyles.flex, GlobalStyles.alignCenter, { height: 30, flexDirection: "row" }]} >
            {mobile ? <>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandGreenTap2, width:'30%' }]}>{mapStatus['total']}</TextSemiBold>
              <TextSemiBold size={14} numberOfLines={1} ellipsizeMode="tail" textStyle={[{ color: GlobalStyles.brandGreenTap2, width:'70%' }]}>
                {Object.keys(mapCountGuest).length != 0 ? mapCountGuest['totales']['total'] : ''}</TextSemiBold>
            </> : ''
            }
          </View>

        </View>
        </>
      )
    }
    
    const renderBodyInvitations = ({ item }) => {
      return (
          <View style={[{marginBottom:5}]}>
            <View style={[{flexDirection:'row'}]}>
            <View style={[{width:'calc(100% - 140px)',backgroundColor: GlobalStyles.brandPrimary, padding:5, borderRadius:5,flexDirection:'row'}]}>
              <Pressable style={[{flexDirection:'row', width:'100%'}]} onPress={() =>handlePressUpDown(item)}>
                {mapGroupsFront[item[0].invitationId] ?
                  (<MaterialCommunityIcons name='arrow-down-thick' color={'white'} size={22} />)
                  :(<MaterialCommunityIcons name='arrow-up-thick' color={'white'} size={22} />)
                }
                <TextSemiBold textStyle={[{ textAlign:'center',width:'-webkit-fill-available',color:'white'}]} size={14}>Invitación {item[0].invitationId}</TextSemiBold>
              </Pressable>
            </View>
            <View style={[GlobalStyles.itemCenter,{width:140, flexDirection:'row'}]}>
              <TextSemiBold textStyle={[{ textAlign:'center',width:70,color:item[0].invitation.status == 'pending' ? GlobalStyles.brandBlueTap : item[0].invitation.status == 'confirmed' ? GlobalStyles.brandGreenTap : GlobalStyles.brandError}]} size={14}> {item[0].invitation.status}</TextSemiBold>
              <Pressable style={[GlobalStyles.alignCenter,{width:35}]} onPress={() =>{ handlePressNew(item[0].invitationId)
                setidInvitation(item[0].invitationId)
                setexpandedEditGuest((prevMap) => ({
                  ...prevMap,
                  [item[0].id]: false,
                }))
                setNombre(null)
                setChild(null)
                setAlergenos(null)
                setTelefono(null)
                setPassword(null)
                setnewInvitation(false)
              }}>
                <MaterialCommunityIcons name='plus-box-outline' color={'green'} size={24} />
              </Pressable>
              <Pressable style={[GlobalStyles.alignCenter,{width:35}]} onPress={() =>{setInvitationtoDelete(item[0].invitationId)
              console.log(invitationtoDelete)}}>
                <MaterialCommunityIcons name='delete' color={'red'} size={24} />
              </Pressable>  
              </View>
            </View>
            { invitationtoDelete != 0 && popupModalDeleteInvitation()}
            {expandedInvitation[item[0].invitationId] && !newInvitation && renderFieldsInvitation()}

            {mapGroupsFront[item[0].invitationId] && <FlatList
              data={item}
              ListEmptyComponent={renderEmptyInvitationsList}
              renderItem={renderInvitations}
              keyExtractor={(item) => item}
            />}
          </View>
      )
    }
    const handlePressUpDown = (item)=>{
      if(item)
        setmapGroupsFront((prevMap) => ({
          ...prevMap,
          [item[0].invitationId]: !prevMap[item[0].invitationId],
        }));
    }

    const handlePressEdit = (itemId)=>{
      if(itemId){
        setexpandedEditGuest((prevMap) => ({
          ...prevMap,
          [itemId]: !prevMap[itemId],
        }));
        
        Object.keys(expandedEditGuest).forEach((guestId) => {
          if(itemId !== guestId && expandedEditGuest[guestId])
            handlePressEdit(guestId)
          if(itemId === guestId && expandedEditGuest[guestId])
            setexpandedEditGuest((prevMap) => ({
              ...prevMap,
              [itemId]: false,
            }));
        })
      }
    }
    
    const handlePressNew = (itemId)=>{
      if(itemId){
        console.log(itemId)
        setexpandedInvitation((prevMap) => ({
          ...prevMap,
          [itemId]: !prevMap[itemId],
        }));

        console.log(expandedInvitation)
        Object.keys(expandedInvitation).forEach((invitationId) => {
          if(itemId !== invitationId && expandedInvitation[invitationId])
            handlePressNew(invitationId)
          if(itemId === invitationId && expandedInvitation[invitationId])
            setexpandedInvitation((prevMap) => ({
              ...prevMap,
              [itemId]: false,
            }));
        })
      }
    }

    const renderDate = (date) =>{
      const fecha = new Date(date);

      const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
      return fecha.toLocaleString("es-ES", options);
    }

    const renderMenu = (val) =>
      val ? 'Infantil' : 'Adulto'
    const renderInvitations = ({ item }) => {
      return(
        <>
        <View style={{flexDirection:'row', borderBottomWidth:1, borderBottomColor:GlobalStyles.brandPrimary}}>
          <View style={{width:'18%'}}>
            <TextRegular size={14}>{item.user.firstName} </TextRegular>
          </View>
          <View style={{width:'18%'}}>
            <TextRegular size={14}>{item.child ? 'Niño' : 'Adulto'} </TextRegular>
          </View>
          <View style={{width:'18%'}}>
            <TextRegular size={14}>{item.alergenos} </TextRegular>
          </View>
          <View style={{width:'18%'}}>
            <TextRegular size={14}>{item.user.phone} </TextRegular>
          </View>
          <View style={{width:'18%'}}>
            <TextRegular size={14}>{renderDate(item.invitation.updatedAt)} </TextRegular>
          </View>
          <View style={{width:'10%', flexDirection:'row'}}>
            <Pressable style={[{ width:'30px'}]} 
              onPress={() =>{ handlePressEdit(item.id)
                setIdUser(item.id)
                setexpandedInvitation((prevMap) => ({
                  ...prevMap,
                  [item.invitationId]: false,
                }))
                setNombre(null)
                setChild(null)
                setAlergenos(null)
                setTelefono(null)
                setPassword(null)
                setidInvitation(0)
                setnewInvitation(false)}}>
              <MaterialCommunityIcons name="pencil" color={"blue"} size={20} />
            </Pressable>
            <Pressable style={[{ width:'30px'}]} onPress={() => setUsertoDelete(item.id)}>
              <MaterialCommunityIcons name="close-thick" color={"red"} size={20} />
              { usertoDelete !== 0 && showPopupDeleteUser()}
            </Pressable>
          </View>
        </View>
        {expandedEditGuest[item.id] && !newInvitation && renderFieldsInvitation(item) }
        </>
      )
    }
    const renderFieldsInvitation = (item) =>{
      return (
        <>
        <View style={[GlobalStyles.alignCenter, {flexDirection:windowWidth < 990 ? 'column': 'row' , borderBottomWidth:1, borderBottomColor:GlobalStyles.brandPrimary}]}>
            <View style={{width:windowWidth < 990 ? 180 : '19%'}}>
              <InputItem
                style={{backgroundColor:'white',height:30 }}
                name='nombre'
                textContentType='nombre'
                placeholder={item ? item.user.firstName : 'Nombre'}
                value={item ? item.user.firstName : ''}
                onChangeText={setNombre}
              ></InputItem>
            </View>
            <View style={{width:windowWidth < 990 ? 180 : '19%'}}>
            <Dropdown
              style={{backgroundColor:'white',height:30, borderRadius:8,borderWidth:1,borderColor:GlobalStyles.brandPrimary, marginTop:14,}}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus && item != null ? renderMenu(item.child) : '...'}
                searchPlaceholder="Search..."
                value={child}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setChild(item.value)
                  setIsFocus(false);
                }}></Dropdown>
            </View>
            <View style={{width:windowWidth < 990 ? 180 : '19%'}}>
              <InputItem
                style={{backgroundColor:'white',height:30}}
                name='alergenos'
                textContentType='alergenos'
                placeholder={item ? item.alergenos ? item.alergenos : 'Ninguno' : 'Alérgenos'}
                value={item ? item.alergenos ? item.alergenos : 'Ninguno': ''}
                onChangeText={setAlergenos}
              ></InputItem>
            </View>
            <View style={{width:windowWidth < 990 ? 180 : '19%'}}>
              <InputItem
                style={{backgroundColor:'white',height:30}}
                name='telefono'
                textContentType='telefono'
                placeholder={item ? item.user.phone : 'Teléfono'}
                value={item ? item.user.phone : ''}
                onChangeText={setTelefono}
              ></InputItem>
            </View>
            <View style={{width:windowWidth < 990 ? 180 : '19%'}}>
              <InputItem
                style={{backgroundColor:'white',height:'30px'}}
                name='contraseña'
                textContentType='contraseña'
                placeholder={'******'}
                value={''}
                onChangeText={setPassword}
              ></InputItem>
            </View>
            <View style={[GlobalStyles.itemCenter, {width:windowWidth < 990 ? 180 : '5%'}]}>
              {newInvitation || idInvitation != 0 ? 
                <Pressable onPress={() => { console.log("le damos valor")
                  setflagNewUser(true)
                  setflagUpdateGuest(false)}} >
                  <MaterialCommunityIcons name='content-save' color={'green'} size={25} />
                  {flagNewUser !== null && popupModalGuest()}
                </Pressable>
                :<Pressable onPress={() => { setflagUpdateGuest(true) /*setIdUser(item.user.id)*/
                  setflagNewUser(false)}} >
                  <MaterialCommunityIcons name='content-save' color={'green'} size={25} />
                  {flagUpdateGuest !== null && popupModalGuest()}
                </Pressable>
              }
            </View>
          </View>
        </>
      )
    }

    const popupModalGuest = () =>{
      if((nombre == null || nombre == '') && (alergenos == null || alergenos == '') && child === null && Password ===null && Telefono === null){
        showMessage({
          message: `Invitado vacio. Modifique algún dato`,
          type: 'danger',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle,
        })
        flagNewUser ? setflagNewUser(null) : setflagUpdateGuest(null)
      }else
        return(<>
          {flagNewUser && idInvitation != 0 &&
            <ConfirmModal
            title="Nuevo invitado para la invitacion "
            isVisible={true}
            onCancel={() => {setflagNewUser(null)}}
            onConfirm={handleNewGuest}>
              <TextRegular size={16}>¿Está seguro que desea dar de alta invitacion de invitado con nombre: {nombre}, menu: {child} y alegernos: {alergenos}?</TextRegular>
            </ConfirmModal>}
          {flagNewUser && idInvitation == 0 &&  <ConfirmModal
              title="Nuevo invitado"
              isVisible={true}
              onCancel={() => {setflagNewUser(null)}}
              onConfirm={handleNewGuest}>
                <TextRegular size={16}>¿Está seguro que desea dar de altala invitacion de invitado con nombre: {nombre}, menu: {child} y alegernos: {alergenos}?</TextRegular>
            </ConfirmModal>}
            {!flagNewUser && <ConfirmModal
              title="Actualizar invitado"
              isVisible={true}
              onCancel={() => {setflagUpdateGuest(null)}}
              onConfirm={handleUpdateGuest}>
                <TextRegular size={16}>¿Está seguro que desea actualizar al invitado con nombre: {nombre}, menu: {child} y alegernos: {alergenos}?</TextRegular>
            </ConfirmModal>
          }</>
        )
    }

    const handleUpdateGuest = async () => {
      try {
        console.log(nombre)
        const updatedData = {
          id:idUser,
          name: nombre,
          child: child,
          alergenos: alergenos,
          phone:Telefono,
          password:Password
        };
        await putUser(updatedData);
        showMessage({
          message: 'Datos actualizados con éxito',
          type: 'success',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle,
        })
        //setExpandedGuests(idGuest)
        setAlergenos('')
        setChild(false)
        setNombre('')
        setPassword(null)
        setTelefono(null)
        handleRefresh()
      } catch (error) {
        showMessage({
          message: `Error al actualizar los datos: ${error}`,
          type: 'danger',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle,
        })
      }
      setflagUpdateGuest(null)
    }

    const handleNewGuest = async () => {
      try {
        console.log(nombre)
        const newUser = {
          invitation:idInvitation,
          user:{
            firstName: nombre,
            phone:Telefono,
            password:Password
          },
          guest:{
            child: child,
            alergenos: alergenos,
          }
        };
        await postInvitation(newUser);
        showMessage({
          message: 'Invitado dado de alta correctamente',
          type: 'success',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle,
        })
        //setExpandedGuests(idGuest)
        setAlergenos('')
        setChild(false)
        setNombre('')
        setPassword(null)
        setTelefono(null)
        handleRefresh()
      } catch (error) {
        console.log(error)
        showMessage({
          message: `Error al dar de alta al usuario nuevo: ${error}`,
          type: 'danger',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle,
        })
      }
      setflagNewUser(null)
    }

    const data = [
      { label: renderMenu(false), value: 'false' },
      { label: renderMenu(true), value: 'true' }
    ]
    const popupModalDeleteInvitation = () =>{
      return(
        <ConfirmModal
            title={"Eliminar invitación " + invitationtoDelete}
            isVisible={true}
            onCancel={() => {setInvitationtoDelete(0)}}
            onConfirm={handleDeleteInvitation}>
              <TextRegular size={16}>¿Está seguro que desea eliminar la invitación al completo?</TextRegular>
          </ConfirmModal>
      )
    }
    const showPopupDeleteUser = () =>{
      return(
        <ConfirmModal
            title="Eliminar invitado"
            isVisible={true}
            onCancel={() => {setUsertoDelete(0)}}
            onConfirm={handleDeleteGuest}>
              <TextRegular size={16}>¿Está seguro que desea eliminar al usuario?</TextRegular>
          </ConfirmModal>
      )
    }
    const handleDeleteGuest = async () =>{
      try{
        await deleteGuest(usertoDelete)
        handleRefresh()
        showMessage({
          message: 'Invitado eliminado con éxito',
          type: 'success',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle,
        })
      }catch(error) {
        console.log(error)
        showMessage({
          message: `Ha ocurrido un error al eliminar al invitado` + error,
          type: 'danger',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
      setUsertoDelete(0)
    }
    const handleDeleteInvitation = async () =>{
      try{
        await deleteInvitation(invitationtoDelete)
        handleRefresh()
        showMessage({
          message: 'Invitacion eliminada con éxito',
          type: 'success',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle,
        })
      }catch(error) {
        console.log(error)
        showMessage({
          message: `Ha ocurrido un error al eliminar la invitación` + error,
          type: 'danger',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
      setInvitationtoDelete(0)
    }

    const renderEmptyInvitationsList = () => {
      return (
        <TextRegular size={16}>
          No hay invitados aún.
        </TextRegular>
      )
    }
    
    return (
        <View style={{flex:1,position: 'relative'}}>
            <View style={{zIndex:9999}}>
                <Header navigation={navigation} activeTitle="Administracion"></Header>
            </View>
            <View style={styles.container}>
              <View style={styles.containerCentered}>
                <View style={{flexDirection:'row' , marginTop: 20, padding: 10, textAlign: "center"}}>
                  {renderTable()}
                </View>
                <View>
                  <Pressable style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? GlobalStyles.brandGreenTap
                        : GlobalStyles.brandGreen,
                      height: 40,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                    },
                  ]} onPress={() =>{setnewInvitation(!newInvitation)
                    setidInvitation(0)
                    setNombre(null)
                    setChild(null)
                    setAlergenos(null)
                    setTelefono(null)
                    setPassword(null)}}>
                    <TextRegular style={[{color:'white'}]}> Añadir invitación</TextRegular>
                  </Pressable>
                  { newInvitation && renderFieldsInvitation()}
                </View>
                <View>
                  <FlatList
                    data={Object.values(invitations)}
                    ListEmptyComponent={renderEmptyInvitationsList}
                    renderItem={renderBodyInvitations}
                    keyExtractor={(item) => item}
                  />
                </View>
        
                    <Pressable onPress={() => signOutAndNavigate()}
                        style={({ pressed }) => [
                        {
                            backgroundColor: pressed
                            ? GlobalStyles.brandPrimaryTap
                            : GlobalStyles.brandPrimary
                        },
                        styles.button, styles.container, {color:'white'}]} >
                        <TextRegular textStyle={styles.text}>Sign out</TextRegular>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center", 
      justifyContent: "center",
      marginTop:55
    },
    containerCentered: {
      flex: 1,
      width:'100%',
      maxWidth:1250,
      display:'flex',
      padding:15
    }
})