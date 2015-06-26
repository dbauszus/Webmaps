loadFeatures = function(response) {
	geoJSON = new ol.format.GeoJSON();
	vectorSource.addFeatures(geoJSON.readFeatures(response));
	};

vectorSource = new ol.source.Vector({
	loader: function(extent, resolution, projection) {
		$.ajax('http://geoserver-dbauszus.rhcloud.com/wfs',{
			type: 'GET',
			data: {
				service: 'WFS',
				version: '1.1.0',
				request: 'GetFeature',
				typename: 'playa_sample',
				srsname: 'EPSG:3857',
				outputFormat: 'application/json',
				bbox: extent.join(',') + ',EPSG:3857'
				},
			}).done(loadFeatures);
		},
		strategy: ol.loadingstrategy.tile(new ol.tilegrid.XYZ({
			maxZoom: 19
			})),
	});

layerVector = new ol.layer.Vector({
	source: vectorSource
	});

map = new ol.Map({
	target: 'map',
	layers: [new ol.layer.Tile({source: new ol.source.OSM()}),layerVector],
	view: new ol.View({
		center : ol.proj.transform([ -87.07, 20.63 ], 'EPSG:4326', 'EPSG:3857'),
		zoom : 17})
	});