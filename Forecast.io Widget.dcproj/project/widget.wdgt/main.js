//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
watchId = null;
function load()
{
    dashcode.setupParts();
    if( !(widget.preferenceForKey('latitude') == undefined || widget.preferenceForKey('longitude') == undefined || widget.preferenceForKey('name') == undefined) ) updateForecastEmbed();
    
    var Anchors = document.getElementsByTagName("a");

for (var i = 0; i < Anchors.length ; i++) {
    Anchors[i].addEventListener("click", 
        function (event) {
            event.preventDefault();
            widget.openURL(this.href);
        }, 
        false);
}
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove()
{
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide()
{
    // Stop any timers to prevent CPU usage
}

//
// Function: show()
// Called when the widget has been shown
//
function show()
{
    // Restart any timers that were stopped on hide
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");


}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    document.getElementById('latitude').value = widget.preferenceForKey('latitude');
    document.getElementById('longitude').value = widget.preferenceForKey('longitude');
	if ( !(widget.preferenceForKey('name') == undefined) ) document.getElementById('name').value = widget.preferenceForKey('name');
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    front.style.display = "none";
    back.style.display = "block";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }

}

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
    if( document.getElementById("latitude").value == '' || document.getElementById("longitude").value == '' || document.getElementById("name").value == ''){
        return false;
    }
    widget.setPreferenceForKey( document.getElementById("latitude").value, 'latitude');
    widget.setPreferenceForKey( document.getElementById("longitude").value, 'longitude');
    widget.setPreferenceForKey( document.getElementById("name").value, 'name');
    widget.setPreferenceForKey( '007bff', 'color');
	updateForecastEmbed();
     //document.getElementById('forecast').src += '';
    var front = document.getElementById("front");
    var back = document.getElementById("back");
   
    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }

    front.style.display="block";
    back.style.display="none";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
     
	
}
//Update the map if the current location is different from the previous location
function updateForecastEmbed()
{
	var forecast= document.getElementById('forecast');
   forecast.parentNode.removeChild(forecast);
    document.getElementById('forecast-container').innerHTML='<iframe id="forecast" type="text/html" frameborder="0" height="245" width="100%" src="http://forecast.io/embed/#lat='+widget.preferenceForKey('latitude')+'&lon='+String(widget.preferenceForKey('longitude'))+'&name='+widget.preferenceForKey('name')+'&color=#007bff"> </iframe>';
 //98.667348   
}

function acquireLocation(event)
{
	if (navigator.geolocation)
	{
        
        // Register for location changes and pass the returned position to the forecast method
		watchId = navigator.geolocation.watchPosition(updateLocation, handleError);
	}
	else
	{  
       // Display a message if Geolocation is unavailable
	   document.getElementById("location").innerHTML="<p>Your browser does not support Geolocation services.</p>";
	}
}
function handleError(error) 
{
    var errorMessage;
    switch (error.code)
    {
        case error.code.PERMISSION_DENIED:
            errorMessage = "Permission Denied";
            break;
        case error.code.POSITION_UNAVAILABLE:
            errorMessage = "Position Unavailable";
            break;	
        case error.code.TIMEOUT:
            errorMessage = "Time Out";
            break;
        case error.code.UNKNOWN_ERROR:
            errorMessage = "Unknown Error";
            break;	
    }
    // Display and log the error message
    document.getElementById("location").innerHTML = "<p>"+errorMessage+"</p>";
}
// Unregister for location changes when the user quits the application
function clearWatchId()
{
	if(watchId) 
    {
        navigator.geolocation.clearWatch(watchId);
		watchId = null;
    }
}
//Update the map if the current location is different from the previous location
function updateLocation(position)
{
    // Update the map if the current position is different from the previous position
	if ((latitude != position.coords.latitude)||(longitude != position.coords.longitude))
	{
    	latitude = position.coords.latitude;
		longitude = position.coords.longitude;
    }
 
}