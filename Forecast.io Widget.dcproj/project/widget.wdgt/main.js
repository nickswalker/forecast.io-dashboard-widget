// Called by HTML body element's onload event when the widget is ready to start
function load(){
	addListenersToAnchors();
    document.getElementById('latitude').onchange = populateLocationName;
    document.getElementById('longitude').onchange = populateLocationName;
    document.getElementById('name').onchange = populateLatLong;
	
    if (window.widget){
		widget.onshow = onShow;
		widget.onhide = onHide;
	}
	dashcode.setupParts();
    //See if we can update the display, if not...
	if(!updateForecastEmbed()){  
        //configureByGeolocation();
    }
	
}

// Called when the widget has been removed from the Dashboard
function remove(){
	// Stop any timers to prevent CPU usage
	// Remove any preferences as needed
}

// Called when the widget has been hidden
function onHide(){
	removeForecastEmbed();
	// The skyicons suck up CPU even when they're off screen.
}

// Called when the widget has been shown
function onShow(){
    if(!updateForecastEmbed()) {
        //configureByGeolocation();
    }
}

// Called when the info button is clicked to show the back of the widget
function showBack(event){
    configureBack(widget.preferenceForKey(makeKey('latitude')), widget.preferenceForKey(makeKey('longitude')), widget.preferenceForKey(makeKey('name')), widget.preferenceForKey(makeKey('units')) )

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

// Called when the done button is clicked from the back of the widget
function showFront(event){
       //We've got to have coordinates
	if( document.getElementById("latitude").value == '' || document.getElementById("longitude").value == '')        {
		return false;
	}
    //If they didn't provide a location, try to pull one out of the coordinates
    if( document.getElementById("name").value == ''){
        var geocodeResults = reverseGeocode(document.getElementById("latitude").value, document.getElementById("longitude").value, null);
      document.getElementById("name").value = geocodeResults;  
    }

	var unitsButton = getCheckedRadio(document.getElementsByClassName("units"));
    
    //If they didn't select a unit display preference, default to U.S.
    if (unitsButton == null){
        setCheckedRadio(document.getElementsByClassName("units"), 'us');
        unitsButton = getCheckedRadio(document.getElementsByClassName("units"));
    }
	widget.setPreferenceForKey( document.getElementById("latitude").value, makeKey('latitude'));
	widget.setPreferenceForKey( document.getElementById("longitude").value, makeKey('longitude'));
	widget.setPreferenceForKey( document.getElementById("name").value, makeKey('name'));
	widget.setPreferenceForKey( unitsButton.value, makeKey('units'));
	widget.setPreferenceForKey( '007bff', makeKey('color'));
	updateForecastEmbed();
    
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
function getCheckedRadio(radio_group) {
	for (var i = 0; i < radio_group.length; i++) {
		var button = radio_group[i];
		if (button.checked) {
			return button;
		}
	}
	return undefined;
}
function setCheckedRadio(radio_group, desiredValue) {
	for (var i = 0; i < radio_group.length; i++) {
		var button = radio_group[i];
		if (button.value == desiredValue) button.checked=true;
	}
}
//Disable the default behavior of the links on the back (which is to open within the widget) and instead send them to the browser. Note: does not affect links with the iFrame
function addListenersToAnchors(){
	var anchors = document.getElementsByTagName("a");

	for (var i = 0; i < anchors.length ; i++) {
		anchors[i].addEventListener("click", 
			function (event) {
				event.preventDefault();
				widget.openURL(this.href);
		}, 
		false);
	}
}

function configureByGeolocation(){
    //This fails instantly and consistently, but I'll leave it here in case it starts working by some miracle, or somebody figures out a better approach
    navigator.geolocation.getCurrentPosition(function(){
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var geocodeResults = reverseGeocode(lat, long);
        //Do something with the results
    });
}

function populateLatLong(){
    var name = document.getElementById('name').value;
    if(name != ''){
        geocode(name, function(lat, long){
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = long;
        });
        document.getElementById('done').className = 'enabled';
    }
    else{
        document.getElementById('done').className='';
    }
}

function populateLocationName(){
    var lat = document.getElementById('latitude').value;
	var long = document.getElementById('longitude').value;
    if(lat != '' && long != ''){
        reverseGeocode(lat, long, function(city){
            document.getElementById('name').value = city;
        });
        document.getElementById('done').className = 'enabled';
    }
    else{
        document.getElementById('done').className='';
    }
}
function configureBack(lat, long, city, units){
    document.getElementById('latitude').value = lat;
	document.getElementById('longitude').value = long;
	setCheckedRadio(document.getElementsByName('units'), units);
    if ( city != undefined ) document.getElementById('name').value = city;

}
function removeForecastEmbed(){
	if(!(document.getElementById('forecast') == null)){
		document.getElementById('forecast').remove();
	}
}
function updateForecastEmbed(){
    if( 
        widget.preferenceForKey(makeKey('latitude')) == undefined ||
        widget.preferenceForKey(makeKey('longitude')) == undefined ||
        widget.preferenceForKey(makeKey('name')) == undefined ||
        widget.preferenceForKey(makeKey('units')) == undefined)  {
            return false;
        }
        
    if(!(document.getElementById('update-settings-notice') == null)){
        document.getElementById('update-settings-notice').remove();
    }
    removeForecastEmbed();

    var name = String(widget.preferenceForKey(makeKey('name')));
    var units = String(widget.preferenceForKey(makeKey('units')));
    var latitude = String(widget.preferenceForKey(makeKey('latitude')));
    var longitude = String(widget.preferenceForKey(makeKey('longitude')));
    
    document.getElementById('forecast-container').innerHTML='<iframe id="forecast" type="text/html" frameborder="0" height="245" width="100%" src="http://forecast.io/embed/#lat='+latitude+'&lon='+longitude+'&name='+name+'&color=#007bff&units='+units+'"> </iframe>';
}
// Helpers

//Creates unique pref keys so that we can have multiple instances with unique prefs
function makeKey(key){
    return (widget.identifier + "-" + key);
}
//Reverse geocode from GeoNames
//Async with a callback and sync otherwise
function reverseGeocode(lat, long, callback){
    var requestString = "http://api.geonames.org/findNearbyPlaceNameJSON?lat="+ lat +"&lng="+ long +"&username=nickswalker&style=SHORT&lang=local&localCountry=true&maxRows=1";
    var xhr = new XMLHttpRequest();
    if ( callback != null){
        xhr.open("GET", requestString, true);
        
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    if(json.geonames[0] != undefined){
                        callback( json.geonames[0].name );
                    }
                }
            }
        };
        xhr.send();
    }
    else{
        xhr.open("GET", requestString, false);
        xhr.send();
        var json = JSON.parse(xhr.responseText);
        if(json.geonames[0] != undefined){
            return json.geonames[0].name;
        }
        
    }
}
function geocode(placeName, callback){
http://api.geonames.org/searchJSON?q=london&maxRows=10&username=demo
var requestString = "http://api.geonames.org/searchJSON?q="+ placeName +"&username=nickswalker&style=SHORT&lang=local&localCountry=true&maxRows=1";
    var xhr = new XMLHttpRequest();
    if ( callback != null){
        xhr.open("GET", requestString, true);
        
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    if(json.geonames[0] != undefined){
                        var lat = json.geonames[0].lat;
                        var long = json.geonames[0].lng;
                        callback( lat, long );
                    }
                }
            }
        };
        xhr.send();
    }
    else{
        xhr.open("GET", requestString, false);
        xhr.send();
        var json = JSON.parse(xhr.responseText);
        if(json.geonames[0] != undefined){
            var lat = json.geonames[0].lat;
            var long = json.geonames[0].lng;
            return {'lat': lat, 'long': long};
        }
        
    }
}
function log(string){
        document.getElementById('forecast-container').innerHTML = string;
}