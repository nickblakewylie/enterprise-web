import React from 'react'
import { StyleSheet, TouchableOpacity} from 'react-native';
import useTheme from '../myThemes/useTheme';
import useThemedStyles from '../myThemes/useThemedStyles';
import { FontAwesome5 } from '@expo/vector-icons';
function UserMarker({currentCar, setCurrentCar, carId, reservationInProgress, updatingCarInProgress}) {
    const theme = useTheme();
    const style = useThemedStyles(styles);
    return (
        <TouchableOpacity style={[style.marker, {backgroundColor:currentCar != null && currentCar == carId && updatingCarInProgress == false ? theme.colors.ACCENT : theme.colors.SECONDARY}]}>
            <FontAwesome5 name="location-arrow" size={15} color={theme.colors.ACCENT} />
        </TouchableOpacity>
      );
    }
export default UserMarker;

const styles = theme => StyleSheet.create({
    marker: {
        padding: 2,
        borderColor: "white",
        borderWidth:3,
        elevation: 30,
        width:"100%",
        alignContent:"center",
        borderRadius:50,
        justifyContent:"center",
        padding:10
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