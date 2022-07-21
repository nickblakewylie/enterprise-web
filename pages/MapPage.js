import React, {useState, useEffect, useContext} from 'react'
import MapView, { Overlay, Callout, Circle, Polyline, Marker, Polygon } from 'react-native-maps'
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, TextInput, Keyboard, Modal, Image} from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'; 
import CarMarker from '../components/CarMarker';
import MyCallout from '../components/MyCallout';
import DropDownPicker from 'react-native-dropdown-picker';

import useTheme from '../myThemes/useTheme';
import useThemedStyles from '../myThemes/useThemedStyles';
import { db } from '../firebase';
import {addDoc, arrayUnion, collection, doc, FieldValue, getDoc, getDocs, updateDoc} from "firebase/firestore";
import { RideHistory } from '../RideHistory';



function MapPage() {
  const {rideHistory, setRideHistory} = useContext(RideHistory);
  const collectionRef = collection(db, "carCollection")
  const userCollection = collection(db, "users");
  const [region, setRegion] = useState(null);
  const sanFrancisco = {
    latitude: 37.7749,
    longitude: -122.431297,
    longitudeDelta: 0.3,
    latitudeDelta: 0.3
  };
  const sanFranPolygon = [
    // {
    //   latitude : 37.628748, 
    //   longitude : -122.495262
    // },
    {
      latitude: 37.691921,
      longitude:  -122.390992
    },
    {
      latitude: 37.708759, 
      longitude:-122.391682
    },
    {
      latitude: 37.726141,
      longitude: -122.359410
    },
    {
      latitude: 37.810332, 
      longitude: -122.410271
    },
    {
      latitude: 37.805967,
      longitude: -122.450833
    },
    {
      latitude: 37.808123,
      longitude: -122.474900
    },
    {
      latitude: 37.791273,
      longitude: -122.486562
    },
    {
      latitude: 37.782556,
      longitude: -122.511980
    },
    {
      latitude: 37.717376,
      longitude: -122.507049
    },
    {
      latitude: 37.717920,
      longitude: -122.507050
    },
    {
      latitude: 37.690430,
      longitude: -122.497786
    }
  ]
  const theme = useTheme();
  const style = useThemedStyles(styles);
  const [showSearch, setShowSearch] = useState(false)
  const [openPicker, setOpenPicker] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const [searchItems, setSearchItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'}
  ]);
  const [cars, setCars] = useState(null);
  const [currentCar, setCurrentCar] = useState(null);
  const [chosenCar, setChosenCar] = useState({})
  const [myRide, setMyRide] = useState({})
  const [rideCost, setRideCost] = useState(0);
  const [distance, setDistance] = useState(0);
  const [rideRating, setRideRating] = useState(0);
  const [currentCarCoordinates, setCurrentCarCoordinates] = useState({});
  const [startReservationTime, setStartReservationTime] = useState(null);
  const [amountOfLatChanges, setAmountOfLatChanges] = useState(0);
  const [amountOfLongitudeChanges, setAmountOfLongitudeChanges] = useState(0);
  const [rideLineArray, setRideLineArray] = useState(null);
  const changeInDegrees = 0.003;
  const ride = {
    "carTitle" : "Nissan Leaf",
    "cost" : "$20",
    "time" : "2 hrs",
    "rating" : "",
    "car" : car
  };
  const car ={
    "title" : "Telsa",
    "license_plate": "UF2SDfA",
    "gas_mileage": 110,
    "charge": 79,
    "latitude": 37.7749,
    "longitude" : -122.431297,
    "cost_per_hour" : 21
  }

  async function updateCurrentCarCoordinates(){
    const docRef = doc(db,"carCollection",currentCar)
    const docSnap = await getDoc(docRef);
    await updateDoc(docRef, {"latitude": currentCarCoordinates.latitude })
    await updateDoc(docRef, {"longitude": currentCarCoordinates.longitude})
    await getAllCars()
    setCurrentCar(null);
  }

  async function getAllCars(){
    const allDocs = await getDocs(collectionRef);
    const allCars = [];
    allDocs.docs.map(data => {allCars.push(data)});
    setCars(allCars)
  }
  async function getMyCar(carID){
    const docRef = doc(db,"carCollection",carID)
    const docSnap = await getDoc(docRef);
    return docSnap;
  }
  async function changeMyCar(){
      const docSnap = await getMyCar(currentCar)
      console.log(docSnap.exists())
      setChosenCar(docSnap.data());
      setCurrentCarCoordinates({"latitude" :docSnap.data().latitude, "longitude" : docSnap.data().longitude});
  }
  async function addCarDocument(){
    const myDoc = await addDoc(collectionRef,car);
  }
  // this function can be used to add a reservation to the users ride history
  async function addReservation(){
    // one degree lattiude == 69 miles
    // one degree longitude == 54.6 miles
    if(startReservationTime != null){
      setChosenCar({});
      const yourCar = await getMyCar(currentCar);
      const getDocumentRef = doc(db,"user", "eU4lnc1lvwuSZv3PgX93");
      const latMiles = changeInDegrees * amountOfLatChanges * 69;
      const longMiles = changeInDegrees * amountOfLongitudeChanges * 54.6;
      console.log(calculateTimeChanged())
      const newReservation = {
        "carName": yourCar.data().title,
        "year" : yourCar.data().year,
        "cost" : yourCar.data().cost_per_hour * ((calculateTimeChanged()/ 60 )/ 60),
        "distance": latMiles + longMiles,
        "time": calculateTimeChanged()
      }
      setRideLineArray(null);
      updateCurrentCarCoordinates();
      setStartReservationTime(null);
      const newDocument = await updateDoc(getDocumentRef,{carReservations: arrayUnion(newReservation)});
      await updateRideHistory()
    }
  }
  async function updateRideHistory(){
    const getDocumentRef = doc(db,"user", "eU4lnc1lvwuSZv3PgX93");
    const yourRideHistory = await getDoc(getDocumentRef);
    if(yourRideHistory != null && yourRideHistory.data() != null && yourRideHistory.data().carReservations){
      setRideHistory(yourRideHistory.data().carReservations);
    }
  }

  function userStartReservation(){
    if(startReservationTime == null){
      setRideLineArray([{latitude: currentCarCoordinates.latitude, longitude:currentCarCoordinates.longitude}])
      const currentTime = new Date();
      setStartReservationTime(currentTime);
    }else{
      console.log("reservation in progress")
    }
  }

  function calculateTimeChanged(){
    if(startReservationTime != null){
      const miliTime = new Date().getTime() - startReservationTime.getTime();
      return miliTime / 1000;
    }
  }

  function changingCarCoordinates(direction){
    if(currentCarCoordinates != null && startReservationTime != null){
      const currentLat = currentCarCoordinates.latitude;
      const currentLong = currentCarCoordinates.longitude;
      if(direction == "up"){
        setCurrentCarCoordinates({"latitude": currentLat + changeInDegrees, "longitude": currentLong})
        setAmountOfLatChanges(amountOfLatChanges + 1);
      }else if(direction == "left"){
        setCurrentCarCoordinates({"latitude": currentLat, "longitude": currentLong - changeInDegrees})
        setAmountOfLongitudeChanges(amountOfLongitudeChanges + 1);
      }else if(direction == "right"){
        setCurrentCarCoordinates({"latitude": currentLat, "longitude": currentLong +changeInDegrees})
        setAmountOfLongitudeChanges(amountOfLongitudeChanges + 1);
      }else if(direction == "down"){
        setCurrentCarCoordinates({"latitude": currentLat - changeInDegrees, "longitude": currentLong})
        setAmountOfLatChanges(amountOfLatChanges + 1);
      }
    }
  }
  // function caculateDistanceTraveled(){
  //       // one degree lattiude == 69 miles
  //       // one degree longitude == 54.6 miles
  // }
  async function updateTheVehicleCharge(){

  }
  useEffect(() => {
    const getData = async () => {
      await getAllCars()
    }
    getData();
  }, []);
  useEffect(() => {
    if(currentCar != null){
      const changeCar = async () => {
        await changeMyCar();
      }
      changeCar()
    }
  }, [currentCar])
  useEffect(() => {
    if(startReservationTime != null && rideLineArray != null ){
      var tempA = rideLineArray.concat({latitude: currentCarCoordinates.latitude, longitude: currentCarCoordinates.longitude});
      setRideLineArray(tempA)
    }
  },[JSON.stringify(currentCarCoordinates)])
  return (
    <TouchableWithoutFeedback onPress={ () => {Keyboard.dismiss(); setShowSearch(false) } }   accessible={false}>
    <View style={{width:"100%", alignItems:"center", justifyContent:"center"}}>
        <MapView
        style={style.map}
        mapType="terrain"
        initialRegion={sanFrancisco}
        onRegionChangeComplete={(region) => setRegion(region)}
        userInterfaceStyle="light"
        showsUserLocation={true}
        zoomEnabled={true}
        >
        {
          cars != null && cars.length > 0 ?
            cars.map((data) =>
              <Marker
              coordinate={{
                latitude: data.id == currentCar && currentCarCoordinates.latitude? currentCarCoordinates.latitude: data.data().latitude,
                longitude: data.id == currentCar && currentCarCoordinates.longitude? currentCarCoordinates.longitude: data.data().longitude
              }}
              key={data.id}
              onPress={() => {startReservationTime == null ? setCurrentCar(data.id): ""}}
            >
              <CarMarker currentCar={currentCar} setCurrentCar={setCurrentCar} carId={data.id} reservationInProgress={startReservationTime}/>
          </Marker>)
        : <View></View>
        }
      {/* <Circle center={sanFrancisco} radius={15000} strokeWidth={3} key="kajsldflkas" /> */}
        <Polyline coordinates={rideLineArray} strokeColor={theme.colors.BACKGROUND} strokeWidth={6}/>
        <Polygon coordinates={sanFranPolygon} strokeWidth={3} strokeColor={theme.colors.ACCENT} fillColor="rgba(21,154,90,0.3)"  zIndex={-100} style={{opacity: 0.1}}/>
        </MapView>
        {         
          chosenCar != null && Object.keys(chosenCar).length > 0?
          <View style={{position:"absolute", bottom: 0,width:"100%", backgroundColor:theme.colors.SECONDARY, height: 240}}>
                <View style={{width:"100%", marginTop:10}}>
                    <Text style={{color:theme.colors.TEXT, textAlign:"center",fontSize:theme.typography.size.SM}}>{chosenCar.title}</Text>
                </View>
                <View style={{width:"100%", flexDirection:"row"}}>
                  <View style={{width:"50%", alignItems:"center",alignItems:"center"}}>
                    <Image source={require("../assets/telsa.png")} style={{width:100,height: 66,resizeMode:'contain'}} />
                    <Text style={{color:theme.colors.TEXT, fontSize:theme.typography.size.SM}}>{chosenCar.license_plate}</Text>
                  </View>
                  <View style={{width:"50%", justifyContent:"center"}}>
                    <View style={{width:"100%", alignItems: "flex-end" ,justifyContent:"center", flexDirection:"row" }} >
                      <View style={{width:"60%", alignItems:"center"}}>
                        <View style={{marginBottom:10}}>
                          <FontAwesome5 name="gas-pump" size={25} color="white" />
                        </View>
                        <View>
                          <Text style={{color:"white", fontSize:theme.typography.size.SM}}>Range</Text>
                          </View>
                      </View>
                      <View style={{width:"40%", alignItems:"center"}}>
                        <View style={{marginBottom:10}}>
                          <Text style={{color:"white", textAlignVertical:"center", fontSize:theme.typography.size.SM}}>{chosenCar.charge}%</Text>
                        </View>
                        <View>
                          <Text style={{color:"white", textAlignVertical:"center", fontSize:theme.typography.size.SM}}>{Math.round(chosenCar.range * (chosenCar.charge / 100))} miles</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{width:"100%", flexDirection:"row"}}>
                  <TouchableOpacity onPress={() => addReservation()} style={{backgroundColor:"#E3242B",width:"48%", padding:10, alignItems:"center", borderRadius:10, marginRight:"1%", marginLeft:"1%"}}>
                      <Text style={{color:"white", fontWeight:"800", fontSize:theme.typography.size.SM}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => userStartReservation()} style={{backgroundColor:theme.colors.ACCENT,width:"48%",padding:10,alignItems:"center",borderRadius:10, marginLeft: "1%",marginRight:"1%"}}>
                      <Text style={{color:"white", fontWeight:"800", fontSize:theme.typography.size.SM}}>Reserve Car</Text>
                    </TouchableOpacity>
                </View>
          </View>: <View></View>}
          { startReservationTime != null && Object.keys(chosenCar).length > 0?
          <View style={{position:"absolute", bottom: 245,width:"100%", alignItems:"center"}}>
            <View style={{backgroundColor: theme.colors.SECONDARY, width: 130,padding:0, borderRadius: 200, alignItems:"center",alignContent:"center"}}>
              <TouchableOpacity style={{width:"100%", alignItems: "center"}} onPress={() => changingCarCoordinates("up")}>
                <Ionicons name="caret-up" size={40} color="white" />
              </TouchableOpacity>
              <View style={{width:"100%", alignItems:"center",flexDirection:"row"}}>
                  <TouchableOpacity style={{width:"50%", alignItems:"center"}} onPress={() => changingCarCoordinates("left")}>
                    <Ionicons name="caret-back" size={40} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{width:"50%",alignItems:"center"}} onPress={() => changingCarCoordinates("right")}>
                    <Ionicons name="caret-forward" size={40} color="white" />
                  </TouchableOpacity>
              </View>
              <TouchableOpacity style={{width:"100%", alignItems:"center"}} onPress={() => changingCarCoordinates("down")}>
                <Ionicons name="caret-down" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>:<View></View>
          }
        <View
          style={{position:"absolute",top:40, left: 20, alignItems:"flex-start", width:"100%"}}
           >
          <TouchableWithoutFeedback onPress={() => {setShowSearch(true); console.log("tapped")}}>
            <View style={{ alignItems:"center", backgroundColor: theme.colors.SECONDARY, borderRadius:100, padding:theme.typography.size.S, opacity: showSearch? 0: 1 }}>
              <FontAwesome name="search" size={30} color="white" />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={showSearch}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}>
          <TouchableOpacity style={{flex: 1}} onPressOut={() => setShowSearch(false)}>
            <TouchableWithoutFeedback >
              <View style={{position:"absolute",top:40, alignItems:"center", width:"100%"}} >
                <View style={{width:"90%", borderRadius:30, backgroundColor: theme.colors.SECONDARY }}>
                <DropDownPicker 
                  open={setOpenPicker}
                  value={searchValue}
                  items={searchItems}
                  setValue={setSearchValue}
                  setItems={setSearchItems}
                  searchable={true}
                  // style={{ color:theme.colors.TEXT}}
                  listItemContainerStyle={{backgroundColor: theme.colors.SECONDARY, color: theme.colors.TEXT}}
                  listItemLabelStyle={{color:theme.colors.TEXT}}
                  searchPlaceholder="Search ..."
                  theme="DARK"
                  searchContainerStyle={{backgroundColor: theme.colors.SECONDARY}}
                  dropDownContainerStyle={{backgroundColor: theme.colors.SECONDARY, borderRadius:20}}
                  dropDownDirection="BOTTOM"
                  hideSelectedItemIcon={false}
                  style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor:"black"}}
                />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
          </Modal>
    </View>
    </TouchableWithoutFeedback>
  )
}
export default MapPage;

const styles = theme =>StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: "100%",
      height: "100%"
    },
    callOutHeader:{

    }

})