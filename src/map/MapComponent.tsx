//import * as React from 'react';
import { Color, MapMouseEvent } from "maplibre-gl";
import React, { useState, useEffect, useRef } from "react";
import Map, { MapEvent, MapLayerMouseEvent } from 'react-map-gl/maplibre';



function MapComponent() {

    const [mapStyle, setMapStyle] = useState(null);

    type ClickInfo = { lng: number; lat: number; firstLayer: any; }
    type MapInfo = { map_arg: MapMouseEvent; };
    type Year_index = { index_year: number | null; };


    const [mapinfo, setMapInfo] = useState<MapInfo | null>(null);
    const [clickInfo, setClickInfo] = useState<ClickInfo | null>(null);
    const [index_info, setIndexInfo] = useState<Year_index>();

    const YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

    const handleMapLoad = (event: MapEvent) => {
        const map = event.target;

        const layer = map.getLayer('district-layer');
        if (layer) {
            setClickInfo({ lng: 0, lat: 0, firstLayer: layer });
        }
        setMapInfo({ map_arg: event as MapLayerMouseEvent });
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
                          "landUse"
                        ],
                        "Open Shrublands",
                        "#080",
                        "Grasslands",
                        "#0c5",
                        "Croplands",
                        "#944",
                        "Urban and Built-up Lands",
                        "#666",
                        "Barren",
                        "#000",
                        "#088",
                      ],
                      "fill-opacity": 0.5,
                      "fill-outline-color": "#000",
                    },
                });
            }
        }
    };



    // Handle map click event
    const handleMapClick = (event: MapLayerMouseEvent) => {
        const firstLayer = event.target.getLayer('district-layer');
        const { lng, lat } = event.lngLat;
        setMapInfo({ map_arg: event });
        setClickInfo({ lng, lat, firstLayer });
        console.log("Clicked at:", lng, lat);
        console.log("First Layer:", firstLayer);
        const feature = event.target.queryRenderedFeatures(event.point)[0];
        console.log("features: ", feature);
    };

    useEffect(() => {
        fetch("/basic.json") // Load JSON from public folder
            .then((response) => response.json())
            .then((data) => setMapStyle(data))
            .catch((error) => console.error("Error loading style:", error));

        if(!geoLoaded.current) {
            geoLoaded.current = true;
            YEARS.forEach(year => {
                fetch(`https://start-hack-public-dev.sthomas.ch/gp-${year}.geojson`)
                    .then(res => res.json())
                    .then(data => setGeojsonData(prev => ({ ...prev, [year]: data })))
                    .then(data => console.log(`loaded ${year}`))
                    .catch(err => console.error(`Failed to load ${year}`, err));
            });


        }
        
    }, []);


    if (!mapStyle) return <div>Loading map...</div>;


    return (
        <>
            <h2>Assaba</h2>
            <Map
                initialViewState={{ // 16.60504099204053, -11.79772412619621
                    longitude: -11.79772412619621,
                    latitude: 16.60504099204053,
                    zoom: 6.2
                }}
                style={{ width: 400, height: 400, overflow: 'hidden' }}
                mapStyle={mapStyle}
                attributionControl={false}
                onClick={handleMapClick}
                onLoad={handleMapLoad}

            />
            <h2>Clicked on
                {clickInfo && (
                    <div>
                        <p>Clicked at: Longitude {clickInfo.lng}, Latitude {clickInfo.lat}</p>
                        {clickInfo && <p>First Layer ID: {clickInfo.firstLayer.feature}</p>}
                    </div>
                )}
            </h2>
            <div className="special_div">
                <label>Time Line Year {YEARS[index_info && index_info.index_year !== null ? index_info.index_year : 0]}</label>
                <input
                    type="range"
                    min="0"
                    max={YEARS.length - 1}

                    onChange={handleRangeChange}
                />
            </div>
        </>
    )

}

export default MapComponent