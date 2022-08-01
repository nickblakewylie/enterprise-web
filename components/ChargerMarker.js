import React from 'react'
import {StyleSheet,TouchableOpacity} from 'react-native';
import useTheme from '../myThemes/useTheme';
import useThemedStyles from '../myThemes/useThemedStyles';
import { FontAwesome5} from '@expo/vector-icons'; 
function ChargerMarker() {
    const theme = useTheme();
    const style = useThemedStyles(styles);
    return (
        <TouchableOpacity style={[style.marker, {backgroundColor:theme.colors.ACCENT}]}>
            <FontAwesome5 name="gas-pump" size={15} color={theme.colors.SECONDARY} />
        </TouchableOpacity>
      );
    }
export default ChargerMarker;

const styles = theme => StyleSheet.create({
    marker: {
        padding: 6,
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