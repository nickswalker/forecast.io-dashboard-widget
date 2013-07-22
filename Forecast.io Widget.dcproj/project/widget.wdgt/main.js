//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
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
	var currentLocationButton = document.getElementById('current-location');
	currentLocationButton.addEventListener("click", function(event){
		event.preventDefault();
		geoLocate();
		 });
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
}
