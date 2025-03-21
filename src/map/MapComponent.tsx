//import * as React from 'react';
import '../App.css';
import maplibregl, { MapMouseEvent } from "maplibre-gl";
import React, { useState, useEffect, useRef } from "react";
import Map, { MapEvent, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import "maplibre-gl/dist/maplibre-gl.css";


function MapComponent({ setClickInfo }: any) {

    const [mapStyle, setMapStyle] = useState(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

    type MapInfo = { map_arg: MapMouseEvent; };
    type Year_index = { index_year: number | null; };

   const markerRef = useRef<maplibregl.Popup | null>(null);

    const [mapinfo, setMapInfo] = useState<MapInfo | null>(null);
    const [index_info, setIndexInfo] = useState<Year_index>();

    const YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

    const handleMapLoad = (event: MapEvent) => {
        const map = event.target;
        mapRef.current = event.target;
        setIndexInfo({ index_year: (YEARS.length - 1) });
        const layer = map.getLayer('district-layer');
        if (layer) {
            setClickInfo({ lng: 0, lat: 0, firstLayer: layer });
        }
        
        setMapInfo({ map_arg: event as MapLayerMouseEvent });
        map.addSource('source-overlay', {
            type: "geojson",
            data: geojsonData[YEARS[(YEARS.length - 1)]],
        });
        map.addLayer({
            id: 'layer-overlay',
            type: "fill",
            source: 'source-overlay',
            paint: {
                "fill-color": [
                    "match",
                    [
                        "get",
                        "rank"
                    ],
                    1,
                    "#c33", // red 
                    2,
                    "#f93", // orange
                    3,
                    "#fc6", // yellow
                    4,
                    "#cc3", //light green
                    5,
                    "#3c3", //green
                    "rgba(255, 255, 255, 0)",
                ],
                "fill-opacity": 0.8
                //"fill-outline-color": "#FFF",
            },
        });

    }

    const [geojsonData, setGeojsonData] = useState<Record<number, string>>({});
    const geoLoaded = useRef(false)



    const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = parseInt(event.target.value, 10);
        setIndexInfo({ index_year: index });

        if (mapinfo && geojsonData[YEARS[index]]) {
            const mapFrame = mapinfo.map_arg.target;
            const source = mapFrame.getSource('source-overlay') as maplibregl.GeoJSONSource;
            if (source) {
                source.setData(geojsonData[YEARS[index]]);
            } else {
                mapFrame.addSource('source-overlay', {
                    type: "geojson",
                    data: geojsonData[YEARS[index]],
                });
                mapFrame.addLayer({
                    id: 'layer-overlay',
                    type: "fill",
                    source: 'source-overlay',
                    paint: {
                        "fill-color": [
                            "match",
                            [
                                "get",
                                "rank"
                            ],
                            1,
                            "#c33", // red 
                            2,
                            "#f93", // orange
                            3,
                            "#fc6", // yellow
                            4,
                            "#cc3", //light green
                            5,
                            "#3c3", //green
                            "rgba(255, 255, 255, 0)",
                        ],
                        "fill-opacity": 0.8
                        //"fill-outline-color": "#FFF",
                    },
                });
            }
        }
    };



    // Handle map click event
    const handleMapClick = (event: MapLayerMouseEvent) => {
        if (!mapRef.current) return;
        const firstLayer = event.target.getLayer('district-layer');
        const { lng, lat } = event.lngLat;
        setMapInfo({ map_arg: event });
        setClickInfo({ lng, lat, firstLayer });
        console.log("Clicked at:", lng, lat);
        console.log("First Layer:", firstLayer);
        const feature = event.target.queryRenderedFeatures(event.point)[0];
        console.log("features: ", feature);
        
        if (markerRef.current) {
            markerRef.current.remove();
        }
        const risk = event.target.queryRenderedFeatures(event.point)[0].properties.rank;
      
      //if (marker) marker.remove();
        markerRef.current =  new maplibregl.Popup({ closeButton: true, closeOnClick: false , maxWidth: "100px", // Limit the width of the popup
            offset: [0, -10],}) // Red marker
            .setLngLat([lng, lat]) // Marker position
            .setHTML(`<h4 style="color: black; align: 'center' ">Risk Level ${6-risk}</h4>`)
            .addTo(mapRef.current); // Add marker to the map
        
        setClickInfo({ lng, lat });

    };



    useEffect(() => {
        fetch("/style.json")
            .then((response) => response.json())
            .then((data) => setMapStyle(data))
            .catch((error) => console.error("Error loading style:", error));

        if (!geoLoaded.current) {
            geoLoaded.current = true;
            YEARS.forEach(year => {
                fetch(`https://start-hack-public-dev.sthomas.ch/gpp-ranking-${year}.geojson`) // gpp-ranking-YEAR.geojson
                    .then(res => res.json())
                    .then(data => setGeojsonData(prev => ({ ...prev, [year]: data })))
                    .then(_data => console.log(`loaded ${year}`))
                    .catch(err => console.error(`Failed to load ${year}`, err));
            });


        }

    }, []);


    if (!mapStyle) return <div>Loading map...</div>;


    return (
        <>
            <div className='belowMap' >
                <h4 className="text">Region Assaba</h4>

                <Map
                    initialViewState={{ // 16.60504099204053, -11.79772412619621
                        longitude: -11.79772412619621,
                        latitude: 16.60504099204053,
                        zoom: 6.2,
                    }}
                    style={{ width: '90%', height: '70vh', overflow: 'hidden' }}

                    mapStyle={mapStyle}
                    attributionControl={false}
                    onClick={handleMapClick}
                    onLoad={handleMapLoad}
                />

                <label className="text" > {YEARS[index_info && index_info.index_year !== null ? index_info.index_year : 0]}</label>
                <input
                    type="range"
                    min="0"
                    className='slider'
                    max={YEARS.length - 1}
                    defaultValue={index_info && index_info.index_year !== null ? index_info.index_year : (YEARS.length - 1)}
                    onChange={handleRangeChange}
                />
            </div>

        </>
    )

}

export default MapComponent