import {useState, useRef, useEffect} from "react";
import { useHistory } from "react-router-dom";

// For the actual mapping environment
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import "../styles/Map.scss";
import Popup from "../Components/Popup";

// and get the mapbox token from the .env file
mapboxgl.accessToken = process.env.REACT_APP_MAPGL_ACCESS_TOKEN;

// Adapted from Mapbox React example, found at 
// https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
function Map(props) {
    // Set out the map's initial details
    const mapContainer = useRef(null);
    const map = useRef(null);

    // Default coords for Hoddle Grid
    const [lng, setLng] = useState(144.9611);
    const [lat, setLat] = useState(-37.8121);
    const [zoom, setZoom] = useState(12);

    // Set up the storage of the location string
    const [locationString, setLocationString] = useState("");

    // and the popup
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // and the history so the page can be redirected
    const history = useHistory();

    // and initalise the map
    useEffect(() => {
        if (map.current) return; // only do it once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            // and the "Snacks in a van" style
            style: "mapbox://styles/jackj3/ckohxi52z363z17nzghj4gzwi",
            center: [lng, lat],
            zoom: zoom
        });

        var geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
            enableHighAccuracy: true
            },
            trackUserLocation: true
        });

        // do the geolocate function on the load of the map
        map.current.on("load", () => {
            geolocate.trigger();
        })

        // and add it to the map
        map.current.addControl(geolocate);
    },);

    // Change the centre value on change
    useEffect(() => {
        if (!map.current) return // gotta get it to initalise

        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(5));
            setLat(map.current.getCenter().lat.toFixed(5));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    const handleOpenSubmit = async (event) => {
        event.preventDefault();

        // Check if the location string is blank
        if (locationString.length === 0){
            setIsPopupOpen(true);
            return;
        }

        // put location in a struct so it can be sent off
        props.submission.axios.post(props.submission.link, {
            xpos: lng,
            ypos: lat,
            locationString: locationString
        });

        // And send to the next page
        history.push(props.submission.redirect)
    }

    const handleChange = (event) => {
        setLocationString(event.target.value);
    }

    return (
        <div>
            {props.submission &&
                <div id="wideInputContainerTop">
                    <label>{props.submission.prompt}</label>
                    <input 
                        type="text" 
                        id="locationString" name="locationString"
                        onChange={handleChange}
                        placeholder={props.submission.placeholder}
                    />
                </div>
            }
            <div ref={mapContainer} className="map-container">
                {props.submission && <img src="/locationWaypoint.svg" id="centeredWaypoint" alt="Waypoint"/>}
            </div>
            {props.submission &&
                <div id="wideInputContainerBottom">
                    <button 
                        onClick={handleOpenSubmit} 
                        className="centeredButton"
                    >
                    Let's open!
                    </button>
                </div>
            }
            {isPopupOpen && 
                <Popup content={
                    <div>
                        <p className="popupHeader">Oops...</p>
                        <p className="popupText">Details of your location are needed.</p>
                        <p className="popupText">Customers need to know where to find you!</p>
                        <button className="centeredButton" onClick={() => setIsPopupOpen(false)}>Close</button>
                    </div>
                } handleClose={() => setIsPopupOpen(false)} />
            }
        </div>
    );
}

function SubmissionMap(props){
    return (
        <div>
            <Map 
                submission={props.submission} 
            />
        </div>
    )
}

export {
    Map,
    SubmissionMap
};