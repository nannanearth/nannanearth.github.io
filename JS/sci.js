document.addEventListener("DOMContentLoaded", function () {
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
    // 处理导航栏链接点击事件
    const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // 移除所有链接的active类
                navLinks.forEach(l => l.classList.remove('active'));
                // 为当前点击的链接添加active类
                link.classList.add('active');
                
                // 对于数据处理按钮，确保初始化数据地图
                if (link.getAttribute('data-bs-toggle') === 'offcanvas') {
                    initDataMap();
                }
            });
        });
    // 单独为数据处理按钮添加active状态处理
    const dataProcessButton = document.querySelector('[data-bs-target="#offcanvasRight"]');
    if (dataProcessButton) {
        const offcanvasEl = document.getElementById('offcanvasRight');
        offcanvasEl.addEventListener('show.bs.offcanvas', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            dataProcessButton.classList.add('active');
        });
    }
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
        // 同步数据地图的图层可见性
        if (window.data_map) {
            let data_layers = data_map.getLayers();
            let data_layer = data_layers.item(0);
            data_layer.setVisible(!visible);
        }
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
        // 同步更新数据地图的底图
        if (window.data_map) {
            data_maplayer.setSource(my_maplayer.getSource());
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

    // 数据处理相关函数
    window.convertToGeoJSON = function() {
        alert('将数据转换为GeoJSON格式');
        // 实际项目中这里应该实现数据转换的逻辑
    };

    window.convertToShapefile = function() {
        alert('将数据转换为Shapefile格式');
        // 实际项目中这里应该实现数据转换的逻辑
    };

    window.convertToKML = function() {
        alert('将数据转换为KML格式');
        // 实际项目中这里应该实现数据转换的逻辑
    };

    window.spatialAnalysis = function() {
        alert('执行空间分析');
        // 实际项目中这里应该实现空间分析的逻辑
    };

    window.statisticalAnalysis = function() {
        alert('执行统计分析');
        // 实际项目中这里应该实现统计分析的逻辑
    };

    window.bufferAnalysis = function() {
        alert('执行缓冲区分析');
        // 实际项目中这里应该实现缓冲区分析的逻辑
    };

    window.exportCSV = function() {
        alert('导出为CSV文件');
        // 实际项目中这里应该实现导出CSV的逻辑
    };

    window.exportExcel = function() {
        alert('导出为Excel文件');
        // 实际项目中这里应该实现导出Excel的逻辑
    };

    window.exportImage = function() {
        alert('导出为图片文件');
        // 实际项目中这里应该实现导出图片的逻辑
    };
});
 window.addEventListener('load', function() {
        var hash = window.location.hash;
        if (hash) {
            var element = document.querySelector(hash);
            if (element) {
                var yOffset = -60; 
                var y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
                // 如果是数据处理页面，初始化数据地图
                if (hash === '#dataprocess') {
                    initDataMap();
                }
            }
        }
        
        // 确保数据地图初始化
        if (window.location.hash === '#dataprocess') {
            initDataMap();
        }
    });
