document.addEventListener("DOMContentLoaded", function () {
    src="https://cdn.jsdelivr.net/npm/ol@v7.3.0/dist/ol.js"
    let osm_source = new ol.source.OSM()
    let tdt_source = new ol.source.XYZ(
        {url: "https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=9aeba3de18960d7d3351c3b12697b060"                                       
        }
    )
    let tdt_img_source = new ol.source.XYZ(
        {url:"https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=9aeba3de18960d7d3351c3b12697b060"
        }
    )
    let tdt_ter_img_source = new ol.source.XYZ(
        {url:"https://t0.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=9aeba3de18960d7d3351c3b12697b060"
        }
    )
    let arcgis_source = new ol.source.XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
    });
    let arcgis_img_source = new ol.source.XYZ({
        url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png'
    });
    const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    let my_maplayer = new ol.layer.Tile(
        {title: "天地图矢量图层",                
        source: tdt_source}
    ) 
    window.my_map = new ol.Map({
        target: 'map',
        layers: [my_maplayer],
        view: new ol.View({
        projection: "EPSG:4326",
        center: [114.064839, 22.548857], 
        zoom: 12
        })
    })
    window.toggleLayer = function toggleLayer() {
        let layers =my_map.getLayers() 
        let layer = layers.item(0) 
        let visible = layer.getVisible() 
        layer.setVisible(!visible)
        }
    window.changeMap = function changeMap(value){
        switch(value){
            case 'OSM':
                my_maplayer.setSource(osm_source)
                break;
            case 'TDT':
                my_maplayer.setSource(tdt_source)
                break;
            case 'TDT_img':
                my_maplayer.setSource(tdt_img_source)
                break;
            case 'TDT_ter_img':
                my_maplayer.setSource(tdt_ter_img_source)
                break;
            case 'arcgis':
                my_maplayer.setSource(arcgis_source)
                break;
            case 'arcgis_img':
                my_maplayer.setSource(arcgis_img_source)
                break;
        }
    }
    const fileInput = document.getElementById('jsonFile');
    document.getElementById('sel1').addEventListener('change', function() {
    let selectedValue = this.value;
    changeMap(selectedValue);
        });
    document.getElementById('sel2').addEventListener('change', function () {
        let selectedValue = this.value;
        changeMap(selectedValue);
    });
    document.getElementById('sel3').addEventListener('change', function () {
        let selectedValue = this.value;
        changeMap(selectedValue);
    });
    sel1.dispatchEvent(new Event('change'));
    sel2.dispatchEvent(new Event('change'));
    sel3.dispatchEvent(new Event('change'));
    changeMap(sel1.value);
    changeMap(sel2.value);
    changeMap(sel3.value);
    // fileInput.addEventListener('change', handleFile);

    function handleFile(evt) {
    const file = evt.target.files[0];
    if (!file) return;

    const reader = new FileReader();
        reader.onload = e => {
            try {
            const geojson = JSON.parse(e.target.result);
            addGeoJsonToMap(geojson);
            } catch (err) {
            alert('JSON 解析失败：' + err.message);
            }
        };
        reader.readAsText(file);
    }

    function addGeoJsonToMap(geojson) {
    if (window.userLayer) map.removeLayer(window.userLayer);

    const source = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geojson, {
        featureProjection: 'EPSG:4326' 
        })
    });

    window.userLayer = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
        fill: new ol.style.Fill({ color: 'rgba(255, 166, 0, 0)' }),
        stroke: new ol.style.Stroke({ color: '#f37e08ff', width: 2 }),
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: '#f7f2ee' })
        })
        })
    });

    my_map.addLayer(window.userLayer);

    my_map.getView().fit(source.getExtent(), {
        padding: [30, 30, 30, 30],
        maxZoom: 16
    });
    }

});
 window.addEventListener('load', function() {
        var hash = window.location.hash;
        if (hash) {
            var element = document.querySelector(hash);
            if (element) {
                var yOffset = -60; 
                var y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        }
    });
