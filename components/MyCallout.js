import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import { Callout, CalloutSubview } from 'react-native-maps'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; 
import useTheme from '../myThemes/useTheme';
import useThemedStyles from '../myThemes/useThemedStyles';
function MyCallout({currentCar, setCurrentCar, carId}) {
    const theme = useTheme();
    const style = useThemedStyles(styles);
  return (
    <Callout style={{position:"absolute", bottom:0}}>
        <CalloutSubview>
        <View style={{width: 200, backgroundColor :theme.colors.BACKGROUND, padding: 5, borderBottomLeftRadius: 10,borderBottomRightRadius:10 }}>
        <View style={{width:"100%"}}>
            <View>
            <Text style={{textAlign:"center", fontSize: 25}}>Nissan Leaf</Text>
            </View>
            <View>
            <View style={{width:"100%"}}>
                <Text>{<FontAwesome5 name="gas-pump" size={20} />} 30%</Text>
                <Text>Cost $13 per hour</Text>
            </View>
            </View>
        </View>
        <View style={{marginBottom: -28, width:"100%"}}>
            <FontAwesome name="caret-down" size={40} style={{textAlign:"center"}} color="white"/>
        </View>
        </View>
    </CalloutSubview>
  </Callout>
  )
}

export default MyCallout;

const styles = theme => StyleSheet.create({
});