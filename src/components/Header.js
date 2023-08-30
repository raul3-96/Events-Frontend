import 'bootstrap/dist/css/bootstrap.min.css';
import { NavigationContainer } from '@react-navigation/native'
import { ImageBackground, Button,Image,StyleSheet, Text,Pressable, View } from 'react-native'
import React, { useContext,useState} from 'react'
import logo from '../../assets/logo.png'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../styles/GlobalStyles'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthorizationContext } from '../context/AuthorizationContext'
import TextRegular from './TextRegular';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
export default function Header ({ navigation,activeTitle}){
    const [collapseVisible, setCollapseVisible] = useState(false);
    const { loggedInUser, signIn } = useContext(AuthorizationContext)

const handleClick = () => {
    setCollapseVisible(!collapseVisible);
}
const renderNavItems = () => {
  const navItems = [
    { title: 'Inicio', route: 'Home' },
    { title: 'Confirmar asistencia', route: loggedInUser ? 'Confirmar' : 'Login' },
    { title: 'Lista', route: 'List' },
    { title: 'Información', route: 'Info' },
  ];

  return navItems.map((item) => {
    const isActive = item.title === activeTitle;
    const textStyle = isActive ? { color: '#7ED7DB', borderBottom: '1px solid #7ED7DB' } : { color: 'white' };

    return (
      <li className="nav-item" key={item.route}>
        <Pressable title={item.title} onPress={() => navigation.navigate(item.route)}>
          <div className="nav-link" style={textStyle}>
            {item.title}
          </div>
        </Pressable>
      </li>
    )
  })
}
    return (
            <View>
              <nav className="navbar navbar-expand-lg navbar-light fixed-top" style={{backgroundColor: 'black', opacity: 0.8}}>
                <div className="container-fluid">
                  <Image style={styles.image} source={logo} />
                  
            <button
                className="navbar-toggler my-button"
                type="button"
                data-mdb-toggle="collapse"
                data-mdb-target="#navbarExample01"
                aria-controls="navbarExample01"
                aria-expanded={collapseVisible ? 'true' : 'false'}
                aria-label="Toggle navigation"
                onClick={handleClick}
                style={{ WebkitTapHighlightColor: 'transparent', outline:'none' }}
            >
                <MaterialCommunityIcons name='menu' color={'white'} size={24}/>
            </button>
                  <div className={`collapse navbar-collapse ${collapseVisible ? 'show' : ''}`} id="navbarExample01">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100 justify-content-center text-center ">
                      {renderNavItems()}
                    </ul>
                  </div>
                </div>
              </nav>
    </View>
            
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
    },
    menuButton: {
      borderRadius: 4,
      padding: 8,
    },
    pressedMenuButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
    image: {
      height: 25,
      width: 25
    },
    navItemTitleActive: {
      color: '#7ED7DB'
    }
  });
  const styles2 = StyleSheet.create({
    navigationContainer: {
        borderWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
      },
    tabBar: {
        flexDirection:'column', 
        display: 'flex',
        border: 0
    },
  });