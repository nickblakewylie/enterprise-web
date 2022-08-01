import React,{useEffect, useState} from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import { Callout, CalloutSubview } from 'react-native-maps'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; 
import useTheme from '../myThemes/useTheme';
import useThemedStyles from '../myThemes/useThemedStyles';
function MyCallout({carData}) {
    const theme = useTheme();
    const style = useThemedStyles(styles);
    const [amountChargers, setAmountChargers] = useState(null);
    const amountOfChargers = () => {
        var numOfChargers = 0;
        if(carData["ev_dc_fast_num"] != null){
            numOfChargers += carData["ev_dc_fast_num"]
        }
        if(carData["ev_level1_evse_num"] != null){
            numOfChargers += carData["ev_level1_evse_num"]
        }
        if(carData["ev_level2_evse_num"] != null){
            numOfChargers += carData["ev_level2_evse_num"]
        }
        return numOfChargers
    }
    useEffect(() => {
        setAmountChargers(amountOfChargers());
    }, [])
  return (
    <Callout style={{position:"absolute", bottom:0}}>
        <CalloutSubview>
        <View style={{width: 200, backgroundColor :theme.colors.BACKGROUND, padding: 5, borderBottomLeftRadius: 10,borderBottomRightRadius:10 }}>
        <View style={{width:"100%"}}>
            {carData['station_name'] != null?
            <View>
                <Text style={{textAlign:"center", fontSize: 25}}>{carData['station_name']}</Text>
            </View>: <></>
            }
            <View>
            <View style={{width:"100%"}}>
                {carData["ev_pricing"]?
                    <Text>Cost to charge {carData["ev_pricing"]}</Text>
                :<></>
                }
                {carData["ev_network"] && carData["ev_network"]!= "Non-Networked"?
                    <Text>EV network {carData["ev_network"]}</Text>
                :<></>
                }
                <Text>Amount of Chargers {amountChargers}</Text>
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