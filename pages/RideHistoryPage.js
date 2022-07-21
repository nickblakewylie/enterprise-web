import { getDoc } from 'firebase/firestore';
import React, {useContext, useEffect} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import useTheme from '../myThemes/useTheme';
import useThemedStyles from '../myThemes/useThemedStyles';
import { RideHistory } from '../RideHistory';
function RideHistoryPage() {
    const theme = useTheme();
    const style = useThemedStyles(styles);
    const {rideHistory, setRideHistory} = useContext(RideHistory);
    useEffect(() => {
    }, [])
  return (
    <View>
        <View style={style.graphContainer}>
        </View>
        <ScrollView style={style.rideHistoryScrollView}>
            {rideHistory != null?
                rideHistory.map(data => 
                    <View key={Math.round(Math.random() * 10000)} style={style.rideListItem}>
                        <View style={{width:"25%"}}>
                            <Text>{data.carName}</Text>
                            <Image source={require("../assets/telsa.png")} style={{width:100,height: 66,resizeMode:'contain'}} />
                        </View>
                        <View style={{width:"50%"}}>
                            <Text>$ {Math.round((data.cost + Number.EPSILON) * 100) / 100}</Text>
                        </View>
                        <View style={{width:"12%"}}>
                            <Text>{Math.round((data.distance + Number.EPSILON) * 100) / 100} miles</Text>
                        </View>
                    </View>
                ): <View></View>}
        </ScrollView>
    </View>
  )
}

export default RideHistoryPage

const styles = theme => StyleSheet.create({
    graphContainer: {
        backgroundColor: theme.colors.SECONDARY,
        width:"100%",
        height: 200
    },
    rideHistoryScrollView:{
        width:"100%"    
    },
    rideListItem: {
        width:"100%",
        flexDirection:"row"
    }

})