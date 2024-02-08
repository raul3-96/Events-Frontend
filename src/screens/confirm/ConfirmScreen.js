import React, {useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text,  Pressable, FlatList, Dimensions} from 'react-native'
import * as GlobalStyles from '../../styles/GlobalStyles'
import TextSemiBold from '../../components/TextSemibold'
import Header from '../../components/Header'
import InputItem from '../../components/InputItem'
import { getByUser, getGuest, deleteGuest, postGuest, updateGuest, confirmInvitation, deniedInvitation } from '../../api/InvitationEndpoints'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import TextRegular from '../../components/TextRegular'
import {showMessage } from 'react-native-flash-message'
import ConfirmModal from '../../components/ConfirmModal'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Dropdown } from 'react-native-element-dropdown';

const windowWidth = Dimensions.get('window').width;

export default function ConfirmScreen ({ navigation, route }) {
  const { loggedInUser, signOut } = useContext(AuthorizationContext)
  const [invitation, setInvitation] = useState([])
  const [guest, setGuest] = useState([])
  const [expandedGuests, setExpandedGuests] = useState({})
  const [showAddGuestForm, setShowAddGuestForm] = useState(false)
  const [refresh, setRefresh] = useState(false)

  //Guests
  const [idGuest, setIdGuest] = useState(0)
  const [nombre, setNombre] = useState('')
  const [child, setChild] = useState(null)
  const [alergenos, setAlergenos] = useState('')

  const [flagDelete,setflagDelete] = useState(null)
  const [flagAddGuest,setflagAddGuest] = useState(null)
  const [flagUpdateGuest,setflagUpdateGuest] = useState(null)
  const [flagconfirmInvitation,setflagconfirmInvitation] = useState(null)
  const [flagdeniedInvitation,setflagdeniedInvitation] = useState(null)

  const [isFocus, setIsFocus] = useState(false);
  const selectedChild = {}


  useEffect(() => {
    async function fetchInvitation () {
      try {
        const fetchedInvitation = await getByUser(loggedInUser.id)
        console.log(fetchedInvitation)
        setInvitation(fetchedInvitation)
        
        fetchInvitationGuest(fetchedInvitation)
      } catch (error) {
        showMessage({
          message: `Ha ocurrido un error al rescatar los datos de la invitacion.`,
          type: 'danger',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    async function fetchInvitationGuest (fetchedInvitation) {
      try {
        console.log(invitation)
        const fetchedGuest = await getGuest(fetchedInvitation ? fetchedInvitation.id : invitation.id)
        console.log(fetchedGuest)
        setGuest(fetchedGuest)
        Object.keys(fetchedGuest).forEach((key) => {
          selectedChild[fetchedGuest[key].id] = false;
        })
        console.log(selectedChild)
      } catch (error) {
        showMessage({
          message: `Ha ocurrido un error al rescatar los datos de los invitados.`,
          type: 'danger',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }

    fetchInvitation()
  }, [loggedInUser, refresh])
 
  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const signOutAndNavigate = () => {
    signOut(() => showMessage({
      message: 'Bye Bye',
      type: 'info',
      style: GlobalStyles.flashStyle,
      titleStyle: GlobalStyles.flashTextStyle,
      duration:4000
    }))
  }

  const addGuest = (item) => {
    setShowAddGuestForm(item);
    if(item)
      toggleExpandedBasic(idGuest)
  }
  const delGuest = async () =>{
    try{
      await deleteGuest(flagDelete);
      setGuest((prevGuests) => prevGuests.filter((guest) => guest.id !== flagDelete));
      showMessage({
        message: `Invitado eliminado  correctamente.`,
        type: 'sucess',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
    catch (error) {
      console.log(error)
      showMessage({
        message: `Ha ocurrido un error al eliminar al invitado.`,
        type: 'danger',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const handleUpdateGuest = async () => {
    try {
      const updatedData = {
        name: nombre,
        child: child,
        alergenos: alergenos,
      };
      await updateGuest(idGuest, updatedData);
      showMessage({
        message: 'Datos actualizados con éxito',
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      })
      setExpandedGuests(idGuest)
      setAlergenos('')
      setChild(false)
      setNombre('')
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

  const handleSaveGuest= async () => {
    
    try {
      const setData = {
        name: nombre,
        child: child,
        alergenos: alergenos,
      };
      await postGuest(invitation.id, setData)
      showMessage({
        message: 'Nuevo invitado dado de alta',
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      })
      handleRefresh()
    } catch (error) {
      showMessage({
        message: `Error al dar de alta al nuevo invitado.`,
        type: 'danger',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      })
    }
    
    setflagAddGuest(null)
  }

  const confirmInvitationfunction = async () => {
    try {
      await confirmInvitation(invitation.id)
      showMessage({
        message: '¡Invitacion confirmada con éxito!',
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      })
      handleRefresh()
    } catch (error) {
      showMessage({
        message: `Error al confirmar la invitación.`,
        type: 'danger',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      })
    }
    setflagconfirmInvitation(null)
  }

  const deniedInvitationfunction = async () => {
    try {
      await deniedInvitation(invitation.id)
      showMessage({
        message: '¡Invitacion denegada!',
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      })
      handleRefresh()
    } catch (error) {
      showMessage({
        message: `Error al denegar la invitación.`,
        type: 'danger',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      })
    }
    setflagdeniedInvitation(null)
  }

  const toggleExpanded = (id) => {
    setExpandedGuests((prevExpandedGuests) => ({
      ...prevExpandedGuests,
      [id]: !prevExpandedGuests[id],
    }));
    
    Object.keys(expandedGuests).forEach((guestId) => {
      if(id !== guestId && expandedGuests[guestId])
        toggleExpanded(guestId)
    })
    setIdGuest(expandedGuests[id] ? 0 : id);
    
    if(showAddGuestForm)
      addGuest(false)
  };
  const toggleExpandedBasic = (id) => {
    setExpandedGuests((prevExpandedGuests) => ({
      ...prevExpandedGuests,
      [id]: !prevExpandedGuests[id],
    }));
    setIdGuest(expandedGuests[id] ? 0 : id);
  }

  const renderMenu = (val) =>
    val ? 'Infantil' : 'Adulto'

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Dropdown label
        </Text>
      )
    }
    return null
  }
  const data = [
    { label: renderMenu(false), value: 'false' },
    { label: renderMenu(true), value: 'true' }
  ]
  
  const renderGuests = ({ item }) => {
    return (
      <View style={{ backgroundColor: GlobalStyles.brandBackground }}>
        {/* Primera fila */}
        {!expandedGuests[item.id] && <View style={[GlobalStyles.flex,{ flexDirection : 'row', textAlign:'center'}]}>
          <View style={styles.contentRow}>
            <TextRegular size={14} numberOfLines={1} ellipsizeMode="tail">
              {item.user.firstName}
            </TextRegular>
          </View>
          <View style={styles.contentRow}>
            <TextRegular size={14}>
              {renderMenu(item.child)}
            </TextRegular>
          </View>
          <View style={styles.contentRow}>
            <TextRegular size={14}>
              {item.alergenos ? item.alergenos : 'Ninguno'}
            </TextRegular>
          </View>
          {invitation.status == 'pending' ?
          <View style={[styles.contentRow, { width: '10%', flexDirection: 'row', justifyContent: 'space-between' }]}>
            <Pressable onPress={() =>{toggleExpanded(item.id)
                setNombre(null)
                setAlergenos(null)
                setChild(null)}}>
              <MaterialCommunityIcons name='pencil' color={'blue'} size={20} />
            </Pressable>
            <Pressable onPress={() => setflagDelete(item.id)}>
              <MaterialCommunityIcons name='close-thick' color={'red'} size={20} />
              { flagDelete !== null && popupModalDelete()}
            </Pressable>
          </View>
          :null}
        </View>
        }
        {/* Segunda fila */}
        {expandedGuests[item.id] &&  renderFillGuest(item)}
      </View>

    )
  }

  const renderFillGuest = (item) => {
    return (<View style={[styles.flexInput, GlobalStyles.flex]}>
    <View style={[styles.contentRow, { width:windowWidth >= 500 ? '30%' : '50%'}]}>
      <InputItem
        style={{backgroundColor:'white'}}
        name='nombre'
        textContentType='nombre'
        placeholder={item ? item.user.firstName : 'Nombre'}
        value={item ? item.user.firstName : ''}
        onChangeText={setNombre}
      ></InputItem>
    </View>
    <View style={[styles.contentRow, { width:windowWidth >= 500 ? '30%' : '50%'}]}>
      {/*<CheckBox value={child} onValueChange={setChild} style={styles.checkbox} />*/}
      <Dropdown
      style={{backgroundColor:'white', borderRadius:8,borderWidth:1,borderColor:GlobalStyles.brandPrimary, marginTop:14, height:40}}
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
          console.log(item.value)
          setChild(item.value)
          setIsFocus(false);
        }}></Dropdown>
    </View>
    <View style={[styles.contentRow, { width:windowWidth >= 500 ? '30%' : '50%'}]}>
      <InputItem
        style={{backgroundColor:'white'}}
        name='alergenos'
        textContentType='alergenos'
        placeholder={item ? item.alergenos ? item.alergenos : 'Ninguno' : 'Alérgenos'}
        value={item ? item.alergenos ? item.alergenos : 'Ninguno': ''}
        onChangeText={setAlergenos}
      ></InputItem>
    </View>
    <View style={[styles.contentRow, { width: windowWidth >= 990 ? '10%':'40%', flexDirection: 'row', justifyContent: 'space-between', marginTop:14 }]}>
      { item ? 
        <Pressable onPress={() => setflagUpdateGuest(true)} >
          <MaterialCommunityIcons name='content-save' color={'green'} size={25} />
          {flagUpdateGuest !== null && popupModalUpdateGuest()}
        </Pressable>
        :
        <Pressable onPress={() => setflagAddGuest(true)} >
          <MaterialCommunityIcons name='account-plus-outline' color={'green'} size={25} />
          {flagAddGuest !== null && popupModalAddGuest()}
       </Pressable>
      }
      <Pressable onPress={() => {
          if(item)
          toggleExpandedBasic(item.id) 
          else{ 
            addGuest(!showAddGuestForm)
            setNombre(null)
            setAlergenos(null)
            setChild(null)
          }
        }}>
          <MaterialCommunityIcons name='arrow-left' color={'red'} size={25} />
        </Pressable>
    </View>
  </View>
  )
  }
  
  const handleSubmitDelete = () => {
    delGuest(flagDelete)
    setflagDelete(null)
  }
  
  const popupModalDelete = () =>{
    return(
      <ConfirmModal
          title="Eliminar invitado"
          isVisible={flagDelete !== null}
          onCancel={() => {setflagDelete(null)}}
          onConfirm={handleSubmitDelete}>
            <TextRegular size={16}>¿Está seguro que desea cancelar?</TextRegular>
        </ConfirmModal>
    )
  }
  
  const popupModalAddGuest = () =>{
    if((nombre == null || nombre == '') && (alergenos == null || alergenos == '') && child === null){
      showMessage({
        message: `Invitado vacio. Rellene al menos el nombre.`,
        type: 'danger',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      })
      setflagAddGuest(null)
    }else
      return(
        <ConfirmModal
            title="Añadir invitado"
            isVisible={true}
            onCancel={() => {setflagAddGuest(null)}}
            onConfirm={handleSaveGuest}>
              <TextRegular size={16}>¿Está seguro que desea añadir al invitado con nombre: {nombre}, menu: {child} y alegernos: {alergenos}?</TextRegular>
          </ConfirmModal>
      )
  }
  
  const popupModalUpdateGuest = () =>{
    if((nombre == null || nombre == '') && (alergenos == null || alergenos == '') && child === null){
      showMessage({
        message: `Invitado vacio. Modifique algún dato`,
        type: 'danger',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      })
      setflagUpdateGuest(null)
    }else
      return(
        <ConfirmModal
            title="Actualizar invitado"
            isVisible={true}
            onCancel={() => {setflagUpdateGuest(null)}}
            onConfirm={handleUpdateGuest}>
              <TextRegular size={16}>¿Está seguro que desea actualizar al invitado con nombre: {nombre}, menu: {child} y alegernos: {alergenos}?</TextRegular>
          </ConfirmModal>
      )
  }

  const popupModalConfirmInvitation = () =>{
    return(
      <ConfirmModal
            title="Confirmar Invitación"
            isVisible={true}
            onCancel={() => {setflagconfirmInvitation(null)}}
            onConfirm={confirmInvitationfunction}>
              <TextRegular>Una vez aceptada la invitación no podrá añadir o eliminar invitados.</TextRegular>
          </ConfirmModal>
    )
  }

  const popupModalDeniedInvitation = () =>{
    return(
      <ConfirmModal
            title="Rechazar Invitación"
            isVisible={true}
            onCancel={() => {setflagdeniedInvitation(null)}}
            onConfirm={deniedInvitationfunction}>
              <TextRegular>¿Está seguro que desea rechazar la invitación?</TextRegular>
          </ConfirmModal>
    )
  }

  const renderHeader = (text) =>{
    return(
      <View style={styles.contentRow}>
        <TextSemiBold size={18} textStyle={[{color:"white"}]}>{text}</TextSemiBold>
      </View>
    )
  }

  const renderEmptyGuestList = () => {
    return (
      <TextRegular size={16}>
        No hay invitados asociados a esta invitación.
      </TextRegular>
    )
  }
  return (
    <View style={{ flex: 1, position: "relative" }}>
      <View style={{ zIndex: 9999 }}>
        <Header navigation={navigation} activeTitle="Confirmar asistencia"></Header>
      </View>
      <View style={[GlobalStyles.itemCenter, { marginTop: 55, flex: 1 }]}>
        <View style={[GlobalStyles.containerCenter, { textAlign: "center", justifyContent:'flex-start' }]}>
          {invitation.status == "pending" ? (
            <>
              <TextSemiBold size={24}>¡Confirma tu asistencia!</TextSemiBold>
              <TextSemiBold size={18}>
                Podéis utilizar este formulario para confirmar vuestra asistencia a
                la boda. Si vais a confirmar para varios invitados por favor indicad
                los nombres de todos los que asistirán
              </TextSemiBold>
            </>
          ) : (
            <TextSemiBold size={16}>¡Invitación confirmada!</TextSemiBold>
          )}
          <View style={{ marginTop: 20, padding: 10, textAlign: "center" }}>
            <View
              style={[GlobalStyles.flex,
                {
                  flexDirection: "row",
                  backgroundColor: GlobalStyles.brandPrimaryTap,
                }]}
            >
              {renderHeader("Nombre")}
              
              {renderHeader("Menú")}
              
              {renderHeader("Alérgenos")}
            </View>
            <FlatList
              data={guest}
              ListEmptyComponent={renderEmptyGuestList}
              renderItem={renderGuests}
              keyExtractor={(item) => item.id}
            />
            {invitation.status == "pending" ? (
              <View
                style={[
                  GlobalStyles.justifyCenter,
                  GlobalStyles.flex,
                  styles.buttonFlex
                ]}
              >
                <Pressable
                  onPress={() => setflagconfirmInvitation(true)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? GlobalStyles.brandGreenTap2
                        : GlobalStyles.brandGreen2,
                      textAlign: "center",
                    },
                    styles.button,
                    styles.container,
                    { color: "white",minWidth:240 },
                  ]}
                >
                  <TextRegular size={16} textStyle={[{ color: "white" }]}>
                    ¡Confirmar mi asistencia!
                  </TextRegular>
                  {flagconfirmInvitation !== null && popupModalConfirmInvitation()}
                </Pressable>
                <Pressable
                  onPress={() => setflagdeniedInvitation(true)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? GlobalStyles.brandErrorTap
                        : GlobalStyles.brandError,
                      textAlign: "center",
                    },
                    styles.button,
                    styles.container,
                    { color: "white", marginLeft: windowWidth >=990 ? 50 : 0,
                      minWidth:240 },
                  ]}
                >
                  <TextRegular size={16} textStyle={[{ color: "white" }]}>
                    No iré
                  </TextRegular>
                  {flagdeniedInvitation !== null && popupModalDeniedInvitation()}
                </Pressable>
              </View>
            ) : null}

            {/*<Pressable onPress={() => signOutAndNavigate()}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandPrimaryTap
                      : GlobalStyles.brandPrimary
                  },
                  styles.button, styles.container, {color:'white'}]} >
                <TextRegular textStyle={styles.text}>Sign out</TextRegular>
                </Pressable>*/}
          </View>
          {invitation.status == "pending" ? (
            <Pressable
              onPress={() => {
                addGuest(!showAddGuestForm);
                setNombre(null);
                setAlergenos(null);
                setChild(null);
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandGreenTap
                    : GlobalStyles.brandGreen,
                  position: "absolute",
                  height: 40,
                  width: "100%",
                  bottom: 0,
                  left: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                },
              ]}
            >
              <MaterialCommunityIcons name="plus" color={"white"} size={20} />
              <TextRegular
                size={16}
                textStyle={[
                  styles.text,
                  GlobalStyles.flex,
                  GlobalStyles.justifyCenter,
                  { color: "white" },
                ]}
              >
                Añadir invitado
              </TextRegular>
            </Pressable>
          ) : null}
          {showAddGuestForm && renderFillGuest()}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contentRow: {
    width:windowWidth >= 500 ? '30%' : '28%', 
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight:2,
    paddingLeft:2
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    justifyContent:'center',
    alignContent:'center',
    flexDirection: 'row',
    width:'40%',
    maxWidth: 300,
    minWidth: 50,
  },
  checkbox: {
    alignSelf: 'center',
    marginTop: 20
  },
  flexInput : {
    flexDirection: windowWidth >= 990 ? 'row' : 'column',
    alignItems:'center'
  },
  buttonFlex:{
    flexDirection: windowWidth >= 990 ? 'row' : 'column',
  }
})