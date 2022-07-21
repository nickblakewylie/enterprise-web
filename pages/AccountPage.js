import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import Header from '../components/Header'
import useTheme from '../myThemes/useTheme';
import useThemedStyles from '../myThemes/useThemedStyles';
import { Ionicons, SimpleLineIcons, Feather } from '@expo/vector-icons'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RideHistoryPage from './RideHistoryPage';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const AccountPage = ({navigation}) => {
  const theme = useTheme();
  const style = useThemedStyles(styles);
  return (
    <Stack.Navigator
        screenOptions={{
            headerBackVisible: false,
            headerLeftContainerStyle:{width: 100}
        }}
        >
        <Stack.Screen
        name="AccountPage"
        component={AccountPageComponent}
        options={{headerTitle: () => <Header title="Profile"/>, headerStyle:{backgroundColor:"black", height: 120}, headerBackVisible:false}}
        >
        </Stack.Screen>
        <Stack.Screen
        name="RideHistory"
        component={RideHistoryPage}
        options={{headerTitle: () => <Header title="Ride History"/>, headerStyle:{backgroundColor:"black", height: 120}, headerBackVisible:false, headerBackTitleVisible:false,headerLeft:() => <Ionicons name='chevron-back' style={{position:"absolute", marginRight:-45}} size={45} color={theme.colors.ACCENT} onPress={() => navigation.navigate('AccountPage')}/>,headerLeftContainerStyle:{alignSelf:"center", paddingRight:31}}}
        >
        </Stack.Screen>
    </Stack.Navigator>
  )
}

const AccountPageComponent = ({navigation}) => {
    const theme = useTheme();
    const style = useThemedStyles(styles);
    return (
        <View style={style.container}>
            <View style={{backgroundColor:theme.colors.ACCENT,width:"100%", height:"23%", marginBottom:40, justifyContent:"flex-end", alignItems:"center"}}>
                <View style={{backgroundColor:theme.colors.BACKGROUND, borderRadius:100, width:150, height: 150, marginBottom: -50,overflow:"hidden", justifyContent:"center",alignItems:"center",borderWidth:4,borderColor:"white"}}>
                    <Image source={require("../assets/profilePic.png")} style={{width: 190, height:190}}/>
                </View>
            </View>
            <View style={style.listContainer}>
                <TouchableOpacity style={style.itemContainer} onPress={() => {navigation.navigate(('RideHistory'), {data : "hello"})}}>
                    <View style={{width:"60%"}}>
                        <Text style={style.itemText}>Ride History</Text>
                    </View>
                    <View style={{width:"40%", alignItems:"flex-end"}}>
                        <Ionicons name="book-outline" size={30} color="white"/>
                    </View>
                </TouchableOpacity>
                <View style={style.itemContainer}>
                <View style={{width:"60%"}}>
                        <Text style={style.itemText}>Account</Text>
                    </View>
                    <View style={{width:"40%", alignItems:"flex-end"}}>
                        <Ionicons name="settings-outline" size={30} color="white" font/>
                    </View>
                </View>
                <View style={style.itemContainer}>
                <View style={{width:"60%"}}>
                        <Text style={style.itemText}>Rewards</Text>
                    </View>
                    <View style={{width:"40%", alignItems:"flex-end"}}>
                       <Ionicons name="ios-medal-outline" color="white" size={30} />
                    </View>
                </View>
                <View style={[style.itemContainer,{backgroundColor:"#E3242B"}]}>
                <View style={{width:"60%"}}>
                        <Text style={style.itemText}>Logout</Text>
                    </View>
                    <View style={{width:"40%", alignItems:"flex-end"}}>
                        <Feather name="x" size={24} color="white" />
                    </View>
                </View>
            </View>
        </View>
    )
}
const styles = theme => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.BACKGROUND,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    listContainer: {
        width:"100%",
        alignItems:"center"
    },
    itemContainer:{
        width:"90%",
        backgroundColor: theme.colors.SECONDARY,
        padding : theme.typography.size.M,
        borderRadius: 20,
        margin:15,
        shadowRadius: 5,
        flexDirection:"row",
        shadowOffset:{
            width: 1,
            height: 5
        },
        shadowOpacity: 0.5,
        shadowRadius:5
    },
    itemText:{
        fontSize: theme.typography.size.M,
        color: theme.colors.TEXT,
        fontWeight:"700"
    }

})
export default AccountPage