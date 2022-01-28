"use strict";

require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/LayerList",
    "esri/widgets/Legend"
], (Map, Sceneview, FeatureLayer, Graphic, GraphicsLayer, BasemapGallery, Expand,LayerList, Legend) => {

    const layer = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    })

    const layer2 = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    })
    const graphLayer = new GraphicsLayer();

    const map1 = new Map({
        basemap: "streets-night-vector",
        layers: [layer2, graphLayer]
    });

    const view = new Sceneview({
        map: map1,
        container: "mapDiv",
        zoom: 4,
        center: [-96, 40],
    });

  

    //definicja odpytania
    let query = layer.createQuery();
    query.where = "MAGNITUDE >= 4";
    query.outFields = ['*'];
    query.returnGeometry = true;


    //wykonanie odpytania
    layer.queryFeatures(query)
        //co ma sie stac po odpytaniu serwisu
        .then(response => {
            console.log(response);
            getResults(response.features)
        });
    //wizualizacja danych
    function getResults(features) {
        const symbol = {
            type: "simple-marker",
            color: "pink",
            style:"triangle",
            size: 15
        };
        features.map(element => {
            element.symbol = symbol
        });
        graphLayer.addMany(features);
    };
    //renderowanie część druga polecenia
    let simpleRenderer = {
        type: "simple",
        symbol: {
            type: "point-3d",
            symbolLayers:[
                {
                    type:"object",
                    resource:{
                        primitive:"cylinder"
                    },
                    width:5000
                }
            ]
        },
        visualVariables: [
            {
                type: "color",
                field: "MAGNITUDE",
                stops: [
                    {
                        value: 0.5,
                        color: "green"
                    },
                   
                    {
                        value: 4.48,
                        color: "red"
                    }
                ]
            },
            {
            type:"size",
            field: "DEPTH",
            stops:[
                {
                    value:-3.39,
                    size: 40000
                },
                {
                    value:30.97,
                    size:90000
                }
            ]
            }
        ]
    };
    layer2.renderer = simpleRenderer;

    const LayerListWg = new LayerList({
        view: view
    });
      //tworzenie widgetow
      const basemapGalleryWg = new BasemapGallery({
        view: view
    });

    const legendWg = new Legend({
        view: view
    });
    //dodanie do mapy, do interfejsu uzytkownika, zminimalizowanego
    const expWg = new Expand({ //jakie widgety mają być schowane
        view: view,
        content: basemapGalleryWg
    });
    view.ui.add(expWg, { position: "top-right" });
    //dodanie do mapy, do interfejsu uzytkownika, zminimalizowanego
    const expWg2 = new Expand({ //jakie widgety mają być schowane
        view: view,
        content: LayerListWg
    });
    view.ui.add(expWg2, { position: "top-right" });

    const expWg3 = new Expand({ //jakie widgety mają być schowane
        view: view,
        content: legendWg
    });
    view.ui.add(expWg3, { position: "top-right" });
});