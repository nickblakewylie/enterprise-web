import { Text, View, StyleSheet, Image } from 'react-native'
import React, { Component } from 'react'
import useTheme from '../myThemes/useTheme';
import useThemedStyles from '../myThemes/useThemedStyles';

function Header({title}) {
    const theme = useTheme();
    const style = useThemedStyles(styles);
    return (
      <View style={{width:"100%", height:"100%",flexWrap:"nowrap", flexDirection:"row", justifyContent:"center"}}>
        <View style={{width:"70%", alignItems:"flex-start", justifyContent:"center"}} >
          <Text style={style.titleText}>{title}</Text>
        </View>
        <View style={{width:"30%", alignItems:"flex-end", justifyContent:"center"}}>
          <View style={{backgroundColor:theme.colors.BACKGROUND, borderRadius:100, width:50, height: 50, overflow:"hidden", justifyContent:"center",alignItems:"center", paddingRight:14}}>
            <Image source={require("../assets/enterpriseLogo.png")} style={{width: 80, height:80}}/>
          </View>
        </View>
      </View>
    )
}
const styles = theme => StyleSheet.create({
    titleText: {
    color: "white",  
    fontSize: 35 ,
    fontWeight:"500",
    textAlign:"left"
    },
    smallerText:{
      color:"white",
      fontSize:theme.typography.size.XS
    }
});
export default Header