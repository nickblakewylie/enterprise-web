# enterprise-web
Created a mobile application to prototype the idea of an electric car sharing service.  This project was created with react native for the front end technology and firebase for the backend database holding information about the cars and the users.


## Features 

### Directions to vehicle, and allowing user to rent car
Uses Google Maps Directions API to give the user directions electric vehicles.  As well as showing important information about the vehicle such as the vehicle name, the license plate number, the charge perecentage of the car, and the distance to the vehicle.  To simulate the driving experience the user can use the joystick to drive the car around the map.
https://user-images.githubusercontent.com/77705797/185832390-4e5700dd-2206-4cbd-8eb7-a8c3bc5d3971.mp4

### Showing nearby charging stations
Using the information from the National Renewable Engergy Laboratory, the user is able to view charging stations in the radius of the screen and see details about the charging station if they are avaible, (the cost to charge, the ev network, and the amount of chargers)
https://user-images.githubusercontent.com/77705797/185833082-772175a5-58b2-46e7-ab0b-752ffeb81fee.mp4

### Animate to citites on the map
Using the Google Maps Geocoder API, the app takes in the city name sends it to google and get the latitude and longitude back. Then the map animates to that chosen city.  
https://user-images.githubusercontent.com/77705797/185834028-bb6a8472-7b60-41b6-b848-fcbe18568965.mp4

