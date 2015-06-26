//my vector source for storing the postcode locations
var vectorSource = new ol.source.Vector({
	projection: 'EPSG:3857'
	});

//my vector source and layer for display of the data extent in the map window
var vectorSourceExtent = new ol.source.Vector({
	projection: 'EPSG:3857'
	});
var vectorLayerExtent = new ol.layer.Vector({
	source: vectorSourceExtent
	});

//init map object
var map = new ol.Map({
	target: 'map',
	layers: [new ol.layer.Tile({source: new ol.source.OSM()}),vectorLayerExtent],
	view: new ol.View({
		center : [-533748.669,7224111.857],
		zoom : 6})
	});

//define dropzone for drag and drop functionality
dropzone = document.getElementById('map');

//check browser dependencies 
if (window.FileReader && window.Blob) {
	state = document.getElementById('status');
	state.innerHTML = 'Drag and drop CSV file into Map';
	}

//export file function
function exportFile(fileName){
	
	//remove mask
	document.getElementById('mask').style.display = 'none';
	document.getElementById('status').style.display = 'block';
	
	//transform features from EPSG:3857 back to EPSG:4326
	geoJSON = new ol.format.GeoJSON();
	json = geoJSON.writeFeatures(vectorSource.getFeatures(),{
		dataProjection: 'EPSG:4326',
		featureProjection: 'EPSG:3857'
		});
	
	//check whether browser is IE
	var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
	    ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/);
	
	//create text file blob for download
	textFileAsBlob = new Blob([json], {
        type: 'application/json'
    });
	
	//download method is different for IE
	if (ie || ie11) {
        window.navigator.msSaveBlob(textFileAsBlob, fileName);}
	else {
		downloadLink = document.createElement('a');
		downloadLink.style.display = 'none';
		downloadLink.download = fileName;
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		}
	}	

//process the features; look for nearest postcode
function processFeaturesTimeout(features) {
	
	//display mask during processing
	document.getElementById('status').style.display = 'none';
	document.getElementById('mask').style.display = 'block';
	l = features.length;
	p = 0;
	progress = document.getElementById('progress');
	
	//use a timeout in order to prevent script from breaking on large files
	function timeout(i) {
		setTimeout(function() {
			
			//remove feature prior to checking distance, then add feature again to source
			f = features[i];
			vectorSource.removeFeature(f);
			fClosest = vectorSource.getClosestFeatureToCoordinate(f.getGeometry().j);
			f.setProperties({pcd_closest: fClosest.q.pcd});
			vectorSource.addFeature(f);
			
			//increase index, calculate the rounded percentage of progress
			i++;
			pp = p;
			p = Math.round((i / l)*100);
			
			//update progress DOM if percentage has increased
			if (p>pp){
				progressText = p + ' %';
				progress.innerHTML = progressText;
			}
			
			//call export and quit function when index has reached length
			if (i==l){
				progress.innerHTML = '';
				exportFile(fileName);
				return;
			}
			
			//recursive call to timeout
			timeout(i);
			
			//timeout value is 0
			}, 1);
		}
	
	//call timeout first time
	timeout(0);
}

//drag and drop events
dropzone.ondragover = function() {
	return false;
	};
dropzone.ondragend = function() {
	return false;
	};
dropzone.ondragleave = function() {
	return false;
	};
dropzone.ondrop = function(e) {
	
	//prevent default (opening file in browser)
	e.stopPropagation();
	e.preventDefault();
	
	//get file and check whether type is allowed for processing
	file = e.dataTransfer.files[0];
	//if (file.type != 'text/plain' && file.type != 'text/csv' && file.type != 'application/vnd.ms-excel') {
		//alert("Snap! Don't like that type of file.");
		//return false;
	//}
	
	//create filename suggestion for download
	fileName = file.name.substr(0,file.name.lastIndexOf('.')) + ".json";
	
	//init FileReader
	reader = new FileReader();
	
	//do stuff when file is read
	reader.onload = function(event) {
		
		//empty cached features from previous operation
		vectorSource.clear();
		vectorSourceExtent.clear();
		
		//create an array from lines in text file
		myarray = event.target.result.split('\r\n').map(function(e){
			return e.split('\t');
		});
		myarray.splice(0, 1);
		
		//create feature for each line and add to vector source
		myarray.forEach(function(entry) {
			if (entry!=""){
				feature = new ol.Feature();
				feature.setGeometry(new ol.geom.Point(ol.proj.transform([Number(entry[1]), Number(entry[2])], 'EPSG:4326', 'EPSG:3857')));
				feature.setProperties({pcd: entry[0]})
				vectorSource.addFeature(feature);
			}
		});
		
		//check whether there are enough features in source for processing
		features = vectorSource.getFeatures();
		if (features.length < 2){
			alert('Nope! Not enough features in this file');
			return false;
		};
		
		//create and show the extent of read features
		extent = vectorSource.getExtent();
		feature = new ol.Feature();
		feature.setGeometry(new ol.geom.Polygon.fromExtent(extent));
		vectorSourceExtent.addFeature(feature);
		map.getView().fitExtent(extent, map.getSize());
		};
		
	//read the text file
	reader.readAsText(file);
	return false;
	};