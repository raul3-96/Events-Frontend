const brandPrimary = '#6AAFB1'
const brandPrimaryDisabled = `${brandPrimary}a8`
const brandPrimaryTap = '#5F9EA0' 
const brandSecondary = '#feca1b' // Amarillo US. rgba(254,202,27,255)
const brandSecondaryTap = '#EAB607' // amarillo US más oscuro
const brandSuccess = '#95be05' // verde US
const brandSuccessDisabled = `${brandSuccess}a8`
const brandSuccessTap = '#95be05'
const brandError = '#F20000' 
const brandErrorTap = '#C40000' 
const brandBackground = 'rgb(242, 242, 242)' // gris claro
const brandBlue = '#648a9f'
const brandBlueTap = '#648a9f'
const brandGreen = '#059f94'
const brandGreenTap = '#059f94'
const brandGreen2 = '#06C41E'
const brandGreenTap2 = '#018F04'
const flashStyle = { paddingTop: 50, fontSize: 20 }
const flashTextStyle = { fontSize: 18 }

const navigationTheme = {
  dark: false,
  colors: {
    primary: brandSecondary,
    background: brandBackground,
    card: brandPrimary,
    text: '#ffffff',
    border: `${brandPrimary}99`,
    notification: `${brandSecondaryTap}ff` // badge
  }
}

const flex={
  display:'flex'
}
const justifyCenter ={
  justifyContent: 'center',
}

const alignCenter = {
  alignItems: 'center'
}

const itemCenter={
  justifyContent: 'center',
  alignItems: 'center'
}

const containerCenter = {
  flex: 1,
  justifyContent: 'center',
  width:'100%',
  maxWidth:1250,
  display:'flex',
  padding:15
}

export { navigationTheme, brandPrimary, brandPrimaryTap, brandSecondary, brandSecondaryTap, brandSuccess, brandError, brandErrorTap,
  brandSuccessDisabled, brandSuccessTap, brandBackground, brandBlue, brandBlueTap, brandGreen, brandGreenTap, 
  flashStyle, flashTextStyle, brandPrimaryDisabled, brandGreen2, brandGreenTap2,justifyCenter,alignCenter,
  containerCenter, itemCenter, flex }
