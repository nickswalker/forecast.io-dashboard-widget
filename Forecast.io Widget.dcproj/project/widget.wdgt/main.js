// Called by HTML body element's onload event when the widget is ready to start
function load(){
	addListenersToAnchors();
	if (window.widget){
		widget.onshow = onShow;
		widget.onhide = onHide;
	}
	dashcode.setupParts();
	if( !(widget.preferenceForKey('latitude') == undefined || widget.preferenceForKey('longitude') == undefined || widget.preferenceForKey('name') == undefined || widget.preferenceForKey('units') == undefined) ) updateForecastEmbed();
	
}

// Called when the widget has been removed from the Dashboard
function remove(){
	// Stop any timers to prevent CPU usage
	// Remove any preferences as needed
}

// Called when the widget has been hidden
function onHide(){
	removeForecastEmbed();
	// Stop any timers to prevent CPU usage
}


// Called when the widget has been shown
function onShow(){
	updateForecastEmbed();
}

// Called when the info button is clicked to show the back of the widget
function showBack(event){
	document.getElementById('latitude').value = widget.preferenceForKey('latitude');
	document.getElementById('longitude').value = widget.preferenceForKey('longitude');
	setCheckedRadio(document.getElementsByName('units'), widget.preferenceForKey('units'));
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

// Called when the done button is clicked from the back of the widget
function showFront(event){
	if( document.getElementById("latitude").value == '' || document.getElementById("longitude").value == '' || document.getElementById("name").value == ''){
		return false;
	}
	var unitsButton = getCheckedRadio(document.getElementsByClassName("units"));
	widget.setPreferenceForKey( document.getElementById("latitude").value, 'latitude');
	widget.setPreferenceForKey( document.getElementById("longitude").value, 'longitude');
	widget.setPreferenceForKey( document.getElementById("name").value, 'name');
	widget.setPreferenceForKey( unitsButton.value, 'units');
	widget.setPreferenceForKey( '007bff', 'color');
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
function removeForecastEmbed(){
	if(!(document.getElementById('forecast') == null)){
		document.getElementById('forecast').remove();
	}
}
function updateForecastEmbed(){
	if(!(document.getElementById('update-settings-notice') == null)){
		document.getElementById('update-settings-notice').remove();
	}
	removeForecastEmbed();

	var name = String(widget.preferenceForKey('name'));
	var units = String(widget.preferenceForKey('units'));
	var latitude = String(widget.preferenceForKey('latitude'));
	var longitude = String(widget.preferenceForKey('longitude'));
	
	document.getElementById('forecast-container').innerHTML='<iframe id="forecast" type="text/html" frameborder="0" height="245" width="100%" src="http://forecast.io/embed/#lat='+latitude+'&lon='+longitude+'&name='+name+'&color=#007bff&units='+units+'"> </iframe>';
}
