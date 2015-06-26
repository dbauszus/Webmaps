gmap = new google.maps.Map(document.getElementById('gmap'), {
	disableDefaultUI: true,
	keyboardShortcuts: false,
	draggable: false,
	disableDoubleClickZoom: true,
	scrollwheel: false,
	streetViewControl: false});

view = new ol.View({
	maxZoom: 21});

view.on('change:center', function() {
	var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
	gmap.setCenter(new google.maps.LatLng(center[1], center[0]));});

view.on('change:resolution', function() {
	gmap.setZoom(view.getZoom());});

layerVector = new ol.layer.Vector({
	source: new ol.source.Vector({
		url: 'data/countries.geojson',
		format: new ol.format.GeoJSON(),
		}),
	});

olMapDiv = document.getElementById('olmap');

map = new ol.Map({
	layers: [layerVector],
	interactions: ol.interaction.defaults({
		altShiftDragRotate: false,
		dragPan: false,
		rotate: false}).extend([new ol.interaction.DragPan({kinetic: null})]),
		target: olMapDiv,
		view: view});

view.setCenter([0, 0]);
view.setZoom(1);

olMapDiv.parentNode.removeChild(olMapDiv);
gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);