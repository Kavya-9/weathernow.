# weathernow.
Created with CodeSandbox
Live Weather Dashboard is a responsive React web application that provides real-time weather information for any city around the world.

Users can:
->Search for any city 
->Instantly view live weather conditions 
->See sunrise, sunset, and wind speed 
->Experience adaptive, cinematic background images 
->Enjoy a fully responsive UI (works on both desktop and mobile )

Technology	Purpose:
React.js -	Front-end framework
CSS3	Custom - responsive styling
Open-Meteo API	 -Fetch live weather and forecast data
React Icons -	Display clean weather icons

Design & User Experience:
Clean and minimal layout
Glass-style overlay for readability
Smooth fade-in transitions for new backgrounds
Large, readable fonts and intuitive layout
Fully responsive — adapts beautifully on mobile, tablet, and laptop screens

How It Works:
User types a city name in the search bar.
The app uses Open-Meteo’s Geocoding API to find the city’s coordinates (latitude & longitude).
Those coordinates are passed to Open-Meteo’s Forecast API to get live weather, wind, and time data.
A keyword is generated based on the weather code (like “sunny”, “rainy”, “fog”).
That keyword is sent to the Unsplash API, which returns a high-quality image matching the weather.
