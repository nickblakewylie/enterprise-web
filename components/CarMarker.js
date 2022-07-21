import { doc, getDoc } from 'firebase/firestore';
import React, {useState} from 'react'
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { db } from '../firebase';
import useTheme from '../myThemes/useTheme';
import useThemedStyles from '../myThemes/useThemedStyles';
function CarMarker({currentCar, setCurrentCar, carId, reservationInProgress}) {
    const theme = useTheme();
    const style = useThemedStyles(styles);
    // const [thisIsCurrentCard, setThisIsCurrentCard] = useState(false);
    async function getOneCarData(){
        const docRef = doc(db, "enterpriseWeb", carId);
        const docSnap = await getDoc(docRef);
        return docSnap;
    }
    function startCarReservation(){
        if(reservationInProgress == null){
            setCurrentCar(carId);
        }
    }

    return (
        <TouchableOpacity style={[style.marker, {backgroundColor:currentCar == carId ? theme.colors.ACCENT : theme.colors.SECONDARY}]}>
            <Image style={style.carImage} source={require("../assets/markerCar.png")} />
        </TouchableOpacity>
      );
    }
//styles for our custom marker.
export default CarMarker;

const styles = theme => StyleSheet.create({
    marker: {
    padding: 3,
    // backgroundColor: "black",
    borderColor: "#eee",
    elevation: 30,
    width:"100%",
    alignContent:"center",
    borderRadius:50
    },
    text: {
    color: "#fff",   
    },
    carImage : {
        width:30,
        height:30,
        borderRadius: 50
    }
});