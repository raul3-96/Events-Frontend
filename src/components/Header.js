import "bootstrap/dist/css/bootstrap.min.css";
import { Image, StyleSheet, Pressable, View } from "react-native"
import React, { useContext, useState } from "react"
import logo from "../../assets/logo.png"
import * as GlobalStyles from '../styles/GlobalStyles'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { AuthorizationContext } from "../context/AuthorizationContext"


export default function Header({ navigation, activeTitle }) {
  const [collapseVisible, setCollapseVisible] = useState(false)
  const { loggedInUser, signIn } = useContext(AuthorizationContext)

  const handleClick = () => {
    setCollapseVisible(!collapseVisible)
  }
  const renderNavItems = () => {
    const navItems = [
      { title: "Inicio", route: "Home" },
      {
        title: "Confirmar asistencia",
        route: loggedInUser ? "Confirmar" : "Login",
      },
      { title: "Lista", route: "List" },
      { title: "Información", route: "Info" },
    ]

    return navItems.map((item) => {
      const isActive = item.title === activeTitle
      const textStyle = isActive
        ? { color: GlobalStyles.brandPrimary, borderBottom: "1px solid #7ED7DB" }
        : { color: "white" }

      return (
        <li className="nav-item" key={item.route}>
          <Pressable
            title={item.title}
            onPress={() => navigation.navigate(item.route)}
          >
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
      <nav
        className="navbar navbar-expand-lg navbar-light fixed-top"
        style={{ backgroundColor: "black", opacity: 0.8 }}
      >
        <div className="container-fluid">
          <Pressable  onPress={() => navigation.navigate("Home")}>
            <Image style={styles.image} source={logo} />
          </Pressable>

          <button
            className="navbar-toggler my-button"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarExample01"
            aria-controls="navbarExample01"
            aria-expanded={collapseVisible ? "true" : "false"}
            aria-label="Toggle navigation"
            onClick={handleClick}
            style={{ WebkitTapHighlightColor: "transparent", outline: "none" }}
          >
            <MaterialCommunityIcons name="menu" color={"white"} size={24} />
          </button>
          <div
            className={`collapse navbar-collapse ${
              collapseVisible ? "show" : ""
            }`}
            id="navbarExample01"
          >
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
  image: {
    height: 25,
    width: 25,
  },
})