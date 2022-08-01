
import React, {useMemo, useEffect,useState} from 'react';

import { StyleSheet, Text, View } from 'react-native';
import MapPage from './pages/MapPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons'; 
import AccountPage from './pages/AccountPage';
import Header from './components/Header';
import ThemeProvider from './myThemes/ThemeProvider';
import useTheme from './myThemes/useTheme';
import useThemedStyles from './myThemes/useThemedStyles';
import RideHistoryPage from './pages/RideHistoryPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { doc, getDoc } from 'firebase/firestore';
import { RideHistory } from './RideHistory';
import { db } from './firebase';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
const Tab = createBottomTabNavigator();
function HomeTabs({route}){
  const theme = useTheme();
  const style = useThemedStyles(styles);
  return(
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        // size = 40
        if (route.name === 'Ride') {
          iconName = focused ? 'car': 'car-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ?'person-sharp': 'person-outline';
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#009570",
      tabBarInactiveTintColor: theme.colors.BACKGROUND,
      tabBarStyle: { position: 'absolute'},
      tabBarBackground: () => (
        <View style={style.container} />
      ),
      headerStyle:{backgroundColor: "black", height: 120}
    })}
  >
    <Tab.Screen name="Ride" component={MapPage} options={{headerShown:false}}/>
    <Tab.Screen name="Profile" component={AccountPage} options={{headerShown:false}}/>
  </Tab.Navigator>
  )
}
const RootStack = createStackNavigator();
export default function App() {
  const [rideHistory, setRideHistory] = useState(null);
  const rideHistoryValue = useMemo(() => ({rideHistory, setRideHistory}), [rideHistory,setRideHistory]);
  useEffect(() => {
    const getData = async () => {
      const getDocumentRef = doc(db,"user", "eU4lnc1lvwuSZv3PgX93");
      const yourRideHistory = await getDoc(getDocumentRef);
      if(yourRideHistory != null && yourRideHistory.data() != null && yourRideHistory.data().carReservations){
        setRideHistory(yourRideHistory.data().carReservations);
      }
      await SplashScreen.hideAsync();
    }
    getData();
  }, []);
  return (
    <NavigationContainer>
      <RideHistory.Provider value={rideHistoryValue}>
      <ThemeProvider>
        <RootStack.Navigator>
          <RootStack.Screen name="HomePage" component={HomeTabs} options={{headerShown: false}}/>
          <RootStack.Screen name="RideHistory" component={RideHistoryPage} options={{headerTitle:() => <Header title="Ride History"/> , headerStyle:{backgroundColor:"black",height: 120}}}
                />
        </RootStack.Navigator>
      </ThemeProvider>
      </RideHistory.Provider>
  </NavigationContainer>
  );
}

const styles = theme => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: "90%",
    height: "90%"
  }
});
