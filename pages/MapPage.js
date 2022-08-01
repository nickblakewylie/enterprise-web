import React, {useState, useEffect, useContext, useRef} from 'react'
import MapView, { Overlay, Callout, Circle, Polyline, Marker, Polygon, Animated as AnimatedMap, PROVIDER_GOOGLE} from 'react-native-maps'
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, TextInput, Keyboard, Modal, Image, Animated, Dimensions} from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'; 
import CarMarker from '../components/CarMarker';
import MyCallout from '../components/MyCallout';

import useTheme from '../myThemes/useTheme';
import useThemedStyles from '../myThemes/useThemedStyles';
import { db } from '../firebase';
import {addDoc, arrayUnion, collection, doc, FieldValue, getDoc, getDocs, updateDoc} from "firebase/firestore";
import { RideHistory } from '../RideHistory';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import ChargerMarker from '../components/ChargerMarker';
import UserMarker from '../components/UserMarker';
import {GOOGLE_MAPS_API_KEY, CHARGER_API_KEY} from "@env";
Geocoder.init(GOOGLE_MAPS_API_KEY); 
const chargerApiKey = CHARGER_API_KEY;
const closestApi = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?limit=100&fuel_type=ELEC&api_key=" + chargerApiKey
function MapPage() {
  const {rideHistory, setRideHistory} = useContext(RideHistory);
  const collectionRef = collection(db, "carCollection")
  const [region, setRegion] = useState(null);
  const zoomValue = useRef(new Animated.Value(1)).current;
  const map = useRef(null);
  const seattlePolygon = [
    {
      latitude: 47.517424, 
      longitude:-122.395871
    },{
      latitude: 47.576058, 
      longitude: -122.419551
    },
    {
      latitude: 47.594956,
      longitude: -122.339504
    },
    {
      latitude: 47.660394, 
      longitude:-122.424583
    },
    {
      latitude: 47.733060,
      longitude: -122.372750 
    },
    {
      latitude: 47.732907,
      longitude: -122.285266 
    },
    {
      latitude: 47.683886,
      longitude: -122.250469
    },
    {
      latitude: 47.582120,
      longitude: -122.288507
    },
    {
      latitude: 47.511086, 
      longitude:-122.245302
    }
  ]
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
  const [distanceToCar, setDistanceToCar] = useState(null);
  const [updatingCarInProgress, setUpdatingCarInProgress] = useState(false);
  const [carChargers, setCarChargers] = useState(null);
  const [showChargers, setShowChargers] = useState(false);
  const ride = {
    "carTitle" : "Nissan Leaf",
    "cost" : "$20",
    "time" : "2 hrs",
    "rating" : "",
    "car" : car
  };
  const car ={
    "title" : "Chevrolet Bolt",
    "license_plate": "T752549C",
    "gas_mileage": 109,
    "charge": 81,
    "latitude": 37.7749,
    "longitude" : -122.430297,
    "cost_per_hour" : 21,
    "year" : 2022,
    "range":259
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
      setUpdatingCarInProgress(true);
      console.log(currentCar)
      const docSnap = await getMyCar(currentCar)
      console.log(docSnap.exists())
      setChosenCar(docSnap.data());
      setCurrentCarCoordinates({"latitude" :docSnap.data().latitude, "longitude" : docSnap.data().longitude});
      setUpdatingCarInProgress(false);
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
  function searchForLocation(){
    if(searchValue != ""){
      Geocoder.from(searchValue)
      .then(json => {
        var location = json.results[0].geometry.location;
        goToRegion(location.lat, location.lng);
      })
      .catch(error => console.warn(error));
    }
  }

  useEffect(() => {
    const getData = async () => {
      await getAllCars()
      map.current.animateToRegion(newRegion, 4000);
    }
    getData();
  }, []);
  function goToRegion(latitude, longitude){
      const updatedRegion = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta:0.3,
        longitudeDelta: 0.3
      }
      map.current.animateToRegion(updatedRegion, 1000);
      setSearchValue(null)
    }
  useEffect(() => {
    if(currentCar != null){
      const changeCar = async () => {
        await changeMyCar();
      }
      changeCar()
    }
  }, [currentCar])
  useEffect(() => {
    if(startReservationTime != null && rideLineArray != null && Object.keys(chosenCar).length > 0 ){
      var tempA = rideLineArray.concat({latitude: currentCarCoordinates.latitude, longitude: currentCarCoordinates.longitude});
      setRideLineArray(tempA)
      const reg = {
        latitude: currentCarCoordinates.latitude,
        longitude: currentCarCoordinates.longitude,
        latitudeDelta:0.06,
        longitudeDelta: 0.06
      }
      map.current.animateToRegion(reg, 500);
    }
  },[JSON.stringify(currentCarCoordinates)])

  useEffect(() => {
    if(startReservationTime != null && Object.keys(chosenCar).length > 0){
      const reg = {
        latitude: chosenCar.latitude,
        longitude: chosenCar.longitude,
        latitudeDelta:0.06,
        longitudeDelta: 0.06
      }
      map.current.animateToRegion(reg, 2000);
    } 
  }, [startReservationTime])

  const newRegion= {
    latitude: 37.7749,
    longitude: -122.431297,
    longitudeDelta: 0.3,
    latitudeDelta: 0.3
  }

  const amountOfChargers = (carData) => {
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

  async function getChargingStations(){
    const cam = await map.current.getCamera();
    console.log(cam);
    if(cam != null && cam.center != null && cam.center.latitude != null && cam.center.longitude != null){
      var lat = cam.center.latitude;
      var long = cam.center.longitude;
      var current_state = null;
      }
      var startT = new Date()
      fetch(closestApi + "&latitude=" + lat +"&longitude=" + long + "&radius=80").then((data) => {return data.json()}).then((res) => {
        console.log(res)
        if(res != null && res.fuel_stations != null){
          var newData = []
          for(var i =0; i < res.fuel_stations.length; i ++){
            if(amountOfChargers(res.fuel_stations[i]) > 0){
              newData.push(res.fuel_stations[i]);
            }
          }
          var endT = new Date()
          console.log((endT.getTime() - startT.getTime())/1000)
          setCarChargers(newData);
        }
      }
      ).catch((er) => console.log(er))
  }
  return (
    <TouchableWithoutFeedback onPress={ () => {Keyboard.dismiss(); setShowSearch(false) } }   accessible={false}>
    <View style={{width:"100%", alignItems:"center", justifyContent:"center"}}>
        <MapView
        style={style.map}
        mapType="standard"
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.431297,
          longitudeDelta: 10,
          latitudeDelta: 10
        }}
        showsCompass={false}
        ref={map}
        onRegionChangeComplete={(region) => {
          setRegion(region)
        }}
        userInterfaceStyle="light"
        zoomEnabled={true}
        apiKey={GOOGLE_MAPS_API_KEY}
        >
        <Marker
          coordinate={{
              latitude: 37.7749,
              longitude: -122.431297
          }}
        >
          <UserMarker />
        </Marker>
        {
          chosenCar != null && startReservationTime == null &&Object.keys(chosenCar).length > 0 ?
          <MapViewDirections
            origin={{
              latitude:chosenCar.latitude,
              longitude:chosenCar.longitude,
            }}
            destination={{
              latitude: 37.7749,
              longitude: -122.431297,
            }}
            mode="DRIVING"
            language="en"
            apikey={GOOGLE_MAPS_API_KEY}
            strokeColor="black"
            resetOnChange={false}
            strokeWidth={4}
            onReady={result => {
              map.current.fitToCoordinates(result.coordinates, {
                    edgePadding: { top: 100, right: 100, bottom: 250, left: 100 },
                    animated: true
                  });
                const milesDistance = result.distance * 0.621371;
                setDistanceToCar(Math.round((milesDistance + Number.EPSILON) * 100) / 100)
            }}
          />: <></>
        }
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
              <CarMarker currentCar={currentCar} setCurrentCar={setCurrentCar} carId={data.id} reservationInProgress={startReservationTime} updatingCarInProgress={updatingCarInProgress}/>
          </Marker>)
        : <View></View>
        }
        {
          carChargers != null && showChargers == true?
            carChargers.map((data, index) =>
              <Marker
                coordinate={{
                  latitude: data.latitude,
                  longitude: data.longitude
                }}
                key={index}
                tracksViewChanges={false}
              >
                <ChargerMarker  />
                <MyCallout carData={data}/>
              </Marker>
            ):<></>
        }
        <Polyline coordinates={rideLineArray} strokeColor={theme.colors.BACKGROUND} strokeWidth={6}/>
        <Polygon coordinates={sanFranPolygon} strokeWidth={3} strokeColor={theme.colors.ACCENT} fillColor="rgba(21,154,90,0.3)"  zIndex={-100} style={{opacity: 0.1}}/>
        <Polygon coordinates={seattlePolygon} strokeWidth={3} strokeColor={theme.colors.ACCENT} fillColor="rgba(21,154,90,0.3)"  zIndex={-100} style={{opacity: 0.1}} />
        </MapView>
        {         
          chosenCar != null && Object.keys(chosenCar).length > 0 && distanceToCar != null?
          <View style={{position:"absolute", bottom: 0,width:"100%", backgroundColor:theme.colors.SECONDARY, height: 240}}>
                <View style={{width:"100%", marginTop:10}}>
                    <Text style={{color:theme.colors.TEXT, textAlign:"center",fontSize:theme.typography.size.SM}}>{chosenCar.title}</Text>
                </View>
                <View style={{width:"100%", flexDirection:"row"}}>
                  <View style={{width:"50%", alignItems:"center",alignItems:"center"}}>
                    <Image source={chosenCar.title == "Tesla" ?require("../assets/tesla.png"):chosenCar.title == "Nissan Leaf" ?require("../assets/nissanleaf.png") :require("../assets/chevroletbolt.png")} style={{width:100,height: 66,resizeMode:'contain'}} />
                    <Text style={{color:theme.colors.TEXT, fontSize:theme.typography.size.SM}}>{chosenCar.license_plate}</Text>
                  </View>
                  <View style={{width:"50%", justifyContent:"center"}}>
                    <View style={{width:"100%", alignItems: "flex-end" ,justifyContent:"center", flexDirection:"row" }} >
                      <View style={{width:"60%", alignItems:"center", justifyContent:""}}>
                        <View style={{marginBottom:10}}>
                          <FontAwesome5 name="gas-pump" size={22} color="white" />
                        </View>
                        <View style={{paddingRight: 4}}>
                          <Ionicons name="location" size={22} color={theme.colors.BACKGROUND} />
                          </View>
                      </View>
                      <View style={{width:"40%", alignItems:"center"}}>
                        <View style={{marginBottom:10}}>
                          <Text style={{color:"white", textAlignVertical:"center", fontSize:theme.typography.size.SM}}>{chosenCar.charge}%</Text>
                        </View>
                        <View>
                          <Text style={{color:"white", textAlignVertical:"center", fontSize:theme.typography.size.SM}} >{distanceToCar} mi</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{width:"100%", flexDirection:"row"}}>
                  <TouchableOpacity onPress={async() => {
                        if(startReservationTime != null){
                          console.log("started");
                          await addReservation()
                          console.log("ended");
                        }else{
                          console.log("end")
                          setCurrentCar(null);
                          setChosenCar({});
                          setDistanceToCar(null);
                          setUpdatingCarInProgress(true);
                        }
                     }} style={{backgroundColor:"#E3242B",width:"48%", padding:10, alignItems:"center", borderRadius:10, marginRight:"1%", marginLeft:"1%"}}>
                      <Text style={{color:"white", fontWeight:"800", fontSize:theme.typography.size.SM}}>{startReservationTime == null ? "Cancel" : "End"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => userStartReservation()} style={{backgroundColor:theme.colors.ACCENT,width:"48%",padding:10,alignItems:"center",borderRadius:10, marginLeft: "1%",marginRight:"1%"}}>
                      <Text style={{color:"white", fontWeight:"800", fontSize:theme.typography.size.SM}}>Reserve</Text>
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
          style={{position:"absolute",top:40, width:"90%", flexDirection:"row", alignSelf:"center"}}
           >
          <TouchableWithoutFeedback onPress={() => {setShowSearch(true); console.log("tapped")}} style={{width:"100%", alignItems:"flex-start"}}>
            <View style={{ alignItems:"center", backgroundColor: theme.colors.SECONDARY, borderRadius:100, padding:theme.typography.size.S, opacity: showSearch? 0: 1 }}>
              <FontAwesome name="search" size={25} color="white" />
            </View> 
          </TouchableWithoutFeedback>
          <View style={{alignItems:"center", width:"85%",justifyContent:"center"}}>
              <View style={{width:"100%", alignItems:"flex-end"}}>
                <TouchableOpacity style={{ alignItems:"center", backgroundColor: theme.colors.SECONDARY, borderRadius:100, padding:theme.typography.size.S, opacity: showSearch? 0: 1 , justifyContent:"center"}} onPress={()=> {
                  if(showChargers == false){
                    setShowChargers(true);
                    getChargingStations()
                  }else{
                    setCarChargers(null);
                    setShowChargers(false);
                  }
                  }}>
                  <FontAwesome5 name="gas-pump" size={25} color={showChargers ? theme.colors.ACCENT: "white"} />
                </TouchableOpacity>
            </View>
          </View>
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
                <View style={{width:"100%"}}>
                  <TextInput 
                    value={searchValue}
                    onChangeText={setSearchValue}
                    style={{width:"90%", height:60, padding:20, color:theme.colors.BACKGROUND,fontSize:20}}
                    onSubmitEditing={() => {searchForLocation(); setShowSearch(false);}}
                    placeholder="Search"
                  />
                </View>
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