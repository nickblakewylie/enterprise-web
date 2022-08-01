import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import useTheme from '../myThemes/useTheme';
import useThemedStyles from '../myThemes/useThemedStyles';
import { RideHistory } from '../RideHistory';
function RideHistoryPage() {
    const theme = useTheme();
    const style = useThemedStyles(styles);
    const {rideHistory, setRideHistory} = useContext(RideHistory);
    const [numberOfRides, setNumberOfRides] = useState(0);
    const [distanceTraveled, setDistanceTraveled] = useState(0);
    const [timeTraveled, setTimeTraveled] = useState(0);
    function calculateInfo(){
        if(rideHistory){
            var totalDistance = 0;
            var numRides = 0;
            var timeSpent = 0;
            if(rideHistory.length > 0){
                numRides = rideHistory.length
            }else{
                numRides = 0;
            }
            for(var i = 0; i < rideHistory.length; i ++){
                if(rideHistory[i] != null && rideHistory[i].distance != null && rideHistory[i].time != null){
                    totalDistance += rideHistory[i].distance ;
                    timeSpent += rideHistory[i].time
            }
            setDistanceTraveled(totalDistance);
            setTimeTraveled(Math.round(timeSpent)/ 60);
            console.log(numRides)
            console.log("number of rides")
            setNumberOfRides(numRides)
            }
        }
    }
    useEffect(() => {
        calculateInfo()
    }, [])
    useEffect(() => {
        calculateInfo()
    },[JSON.stringify(rideHistory)])
  return (
    <View>
        <View style={style.graphContainer}>
            <View style={{width:"33%", alignItems:"center", justifyContent:"center"}}>
                <Text style={style.mainStats}>{numberOfRides}</Text>
                <View style={{borderTopColor:theme.colors.BACKGROUND, borderWidth: 2, width:"80%", alignSelf:"center", alignItems:"center", paddingTop:10}}>
                    <Text style={style.subHeader}>Rides</Text>
                </View>
            </View>
            <View style={{width:"33%", alignItems:"center",justifyContent:"center"}}>
                <Text style={style.mainStats}>{Math.round(distanceTraveled)} mi</Text>
                <View style={{borderTopColor:theme.colors.BACKGROUND, borderWidth: 2, width:"80%", alignSelf:"center", alignItems:"center",paddingTop:10}}>
                    <Text style={style.subHeader}>Distance</Text>
                </View>
            </View>
            <View style={{width:"33%", alignItems:"center", justifyContent:"center"}}>
                <Text style={style.mainStats}>{Math.round(timeTraveled)} mins</Text>
                <View style={{borderTopColor:theme.colors.BACKGROUND, borderWidth: 2, width:"80%", alignSelf:"center", alignItems:"center", paddingTop:10}}>
                    <Text style={style.subHeader}>Time</Text>
                </View>
            </View>
        </View>
        <ScrollView style={style.rideHistoryScrollView} contentInset={{bottom: 300}}>
            {rideHistory != null?
                rideHistory.map(data => 
                    <View key={(Math.random() * 10000)} style={[style.rideListItem, style.boxWithShadow]}>
                        <View style={{width:"25%"}}>
                            <Text>{data.carName}</Text>
                            <Image source={data.carName == "Tesla" ?require("../assets/tesla.png"):data.carName== "Nissan Leaf" ?require("../assets/nissanleaf.png") :require("../assets/chevroletbolt.png")} style={{width:100,height: 66,resizeMode:'contain'}} />
                        </View>
                        <View style={{width:"50%"}}>
                            <Text>${Math.round((data.cost + Number.EPSILON) * 100) / 100}</Text>
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
        height: 180,
        flexDirection:"row"
    },
    rideHistoryScrollView:{
        width:"100%",
        paddingBottom:400    
    },
    rideListItem: {
        width:"100%",
        flexDirection:"row",
        backgroundColor:'#FFFFFF',
        marginBottom:3,
        padding:10
    },
    mainStats :{
        color: theme.colors.BACKGROUND,
        fontSize: theme.typography.size.L
    },
    subHeader:{
        color:theme.colors.BACKGROUND,
        fontSize:theme.typography.size.SM
    },
    boxWithShadow: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
    }

})