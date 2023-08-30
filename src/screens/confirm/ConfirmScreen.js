import React, {useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text, ImageBackground, Image, Pressable, FlatList, Dimensions, ScrollView, TextInput, FieldArray } from 'react-native'
import * as GlobalStyles from '../../styles/GlobalStyles'
import TextSemiBold from '../../components/TextSemibold'
import Header from '../../components/Header'
import InputItem from '../../components/InputItem'
import { getByUser, getGuest, deleteGuest, postGuest, updateGuest, confirmInvitation, deniedInvitation } from '../../api/InvitationEndpoints'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import TextRegular from '../../components/TextRegular'
import FlashMessage ,{showMessage } from 'react-native-flash-message'
import ConfirmModal from '../../components/ConfirmModal'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { CheckBox } from 'react-native-web'

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
  


  useEffect(() => {
    async function fetchInvitation () {
      try {
        const fetchedInvitation = await getByUser(loggedInUser.id)
        console.log(fetchedInvitation)
        setInvitation(fetchedInvitation)
        
        fetchInvitationGuest(fetchedInvitation)
      } catch (error) {
        showMessage({
          message: `Tha ocurrido un error al rescatar los datos de la invitacion. ${error} `,
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
      } catch (error) {
        showMessage({
          message: `Tha ocurrido un error al rescatar los datos de los invitados. ${error} `,
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
        message: `Ha ocurrido un error al eliminar al invitado. ${error} `,
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
  };


  const renderGuests = ({ item }) => {
    return (
      <View style={{ backgroundColor: GlobalStyles.brandBackground }}>
        {/* Primera fila */}
        {!expandedGuests[item.id] && <View style={{ display: 'flex', flexDirection : 'row'}}>
          <View style={styles.contentRow}>
            <Text style={{ fontSize: 14, textAlign: 'center' }} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
          </View>
          <View style={styles.contentRow}>
            <Text style={{ fontSize: 14, textAlign: 'center' }}>
              {!item.child ? 'Adulto' : 'Infantil'}
            </Text>
          </View>
          <View style={styles.contentRow}>
            <Text style={{ fontSize: 14, textAlign: 'center' }}>
              {item.alergenos ? item.alergenos : 'Ninguno'}
            </Text>
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
    return (<View style={[styles.flexInput,{ display: 'flex'}]}>
    <View style={[styles.contentRow, { width:windowWidth >= 500 ? '30%' : '50%'}]}>
      <InputItem
        name='nombre'
        textContentType='nombre'
        placeholder={item ? item.name : 'Nombre'}
        value={item ? item.name : ''}
        onChangeText={setNombre}
      ></InputItem>
    </View>
    <View style={[styles.contentRow, { width:windowWidth >= 500 ? '30%' : '50%'}]}>
      <CheckBox value={child} onValueChange={setChild} style={styles.checkbox} />
    </View>
    <View style={[styles.contentRow, { width:windowWidth >= 500 ? '30%' : '50%'}]}>
      <InputItem
        name='alergenos'
        textContentType='alergenos'
        placeholder={item ? item.alergenos ? item.alergenos : 'Ninguno' : 'Alérgenos'}
        value={item ? item.alergenos ? item.alergenos : 'Ninguno': ''}
        onChangeText={setAlergenos}
      ></InputItem>
    </View>
    <View style={[styles.contentRow, { width: windowWidth >= 990 ? '10%':'40%', flexDirection: 'row', justifyContent: 'space-between' }]}>
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
            <TextRegular>¿Está seguro que desea cancelar?</TextRegular>
            
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
              <TextRegular>¿Está seguro que desea añadir al invitado con nombre: {nombre}, menu: {child} y alegernos: {alergenos}?</TextRegular>
              
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
              <TextRegular>¿Está seguro que desea actualizar al invitado con nombre: {nombre}, menu: {child} y alegernos: {alergenos}?</TextRegular>
              
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

  const renderEmptyRestaurantsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No restaurants were retreived. Are you logged in?
      </TextRegular>
    )
  }
  return (
    <View style={{flex:1,position: 'relative'}}>
      <View style={{zIndex:9999}}>
        <Header navigation={navigation} activeTitle="Confirmar asistencia"></Header>
      </View>
      <View style={styles.container}>
        <View style={styles.containerCentered}>
        {invitation.status == 'pending' ? 
          <><Text style={{fontWeight:'bold', fontSize:24, textAlign:'center'}}>¡Confirma tu asistencia!</Text>
          <Text style={{fontWeight:'bold', fontSize:18, textAlign:'center'}}>Podéis utilizar este formulario para confirmar vuestra asistencia a la boda. Si vais a confirmar para varios invitados por favor indicad los nombres de todos los que asistirán</Text></>
          : <Text style={{fontWeight:'bold', fontSize:16, textAlign:'center'}}>¡Invitación confirmada!</Text>}
          {/*<Formik
          validationSchema={validationSchema}
          initialValues={{ phone: '', password: '' }}
          onSubmit={login}>
          {({ handleSubmit }) => (
          )}
          </Formik>*/}
          <View style={{marginTop:20, padding: 10}}>
              <View style={{display:'flex', flexDirection:'row', backgroundColor:'#81B7BA'}}>
                <View style={styles.contentRow}>
                  <Text style={{fontSize:16, textAlign:'center'}}>Nombre</Text>
                </View>
                <View style={styles.contentRow}>
                  <Text style={{fontSize:16, textAlign:'center'}}>Menú</Text>
                </View>
                <View style={styles.contentRow}>
                  <Text style={{fontSize:16, textAlign:'center'}}>Alérgenos</Text>
                </View>
              </View>
              <FlatList
                data={guest}
                ListEmptyComponent={renderEmptyRestaurantsList}
                renderItem={renderGuests}
                keyExtractor={(item) => item.id}
              />
          {invitation.status == 'pending' ? 
            
          <View style={{display:'flex', flexDirection:'row', justifyContent:' center'}}>
            <Pressable onPress={() => setflagconfirmInvitation(true)}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandGreenTap2
                    : GlobalStyles.brandGreen2
                    ,textAlign:'center'
                },
                styles.button, styles.container, {color:'white'}]} >
              <TextRegular textStyle={[styles.text,{color:'white'}]}>¡Confirmar mi asistencia!</TextRegular>
              {flagconfirmInvitation !== null && popupModalConfirmInvitation()}
            </Pressable>   
            <Pressable onPress={() => setflagdeniedInvitation(true)}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandPrimaryTap
                    : GlobalStyles.brandPrimary
                    ,textAlign:'center'
                },
                styles.button, styles.container, {color:'white', marginLeft:50}]} >
              <TextRegular textStyle={[styles.text,{color:'white'}]}>No iré</TextRegular>
              {flagdeniedInvitation !== null && popupModalDeniedInvitation()}
            </Pressable>  
          </View> 
            
            : null  }
            
            
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
            {invitation.status == 'pending' ? <Pressable onPress={() => {
                addGuest(!showAddGuestForm)
                setNombre(null)
                setAlergenos(null)
                setChild(null)}}
                
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandGreenTap
                    : GlobalStyles.brandGreen,
                  position: 'absolute',
                  height:40,
                  width: '100%',
                  bottom: 0,
                  left:0,
                  justifyContent:'center',
                  alignItems:'center',
                  flexDirection: 'row'
                }]} >
              <MaterialCommunityIcons name='plus' color={'white'} size={20}/>
              <TextRegular textStyle={[styles.text, styles.flexCenter, {color:'white'}]}>Añadir invitado</TextRegular>
            </Pressable> : null
          }
          {showAddGuestForm && renderFillGuest()}
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
  },
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
  flexCenter:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  }, 
  containerCheck: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    alignSelf: 'center',
    marginTop: 20
  },
  flexInput : {
    flexDirection: windowWidth >= 990 ? 'row' : 'column',
    alignItems:'center'
  }  
})