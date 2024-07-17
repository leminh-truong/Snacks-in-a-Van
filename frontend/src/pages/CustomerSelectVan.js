import {React, useState, useEffect,useRef} from 'react'
import { Link } from 'react-router-dom'
import '../styles/SelectVan.scss';
import { customerAxios } from '../Config';

import 'bootstrap/dist/css/bootstrap.min.css'
import Loading from '../Components/Loading';
import ReactDOM from 'react-dom';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

// get the access token from the env
mapboxgl.accessToken = process.env.REACT_APP_MAPGL_ACCESS_TOKEN;

function CustomerSelectVan({xpos,ypos}) {        
    const [xloc,setxLoc]=useState(144.963496);
    const [yloc,setyLoc]=useState(-37.809065);
    var [geojson,setgeojson]=useState({'features': [
    ]});
    let map = useRef(null);
    const [sort,setSort]=useState(0);
    let currentMarkers=[];
    let [vans,setVans]=useState([]);
    let [vansSorted,setVansSorted]=useState([]);

    // Get vans from the backend
    const fetchVans=async () =>{
        try {
            customerAxios.get('/van/all-open')
                .then(res => {
                    const itemsdata = res.data;
                    setVans( itemsdata);
                    setSort(!sort);

            })
        }
        catch (err) {
            console.error(err.response.status);
        }
    }


    const sortByDist = (xloca,yloca) => {
        //console.log("x"+xloca+"y"+yloca)
        const sorted = vans.sort((a, b) => {
            let bdist = (Math.sqrt(Math.pow(xloca-b.location.coordinates[0],2)+Math.pow(yloca-b.location.coordinates[1],2)));
            let adist = (Math.sqrt(Math.pow(xloca-a.location.coordinates[0],2)+Math.pow(yloca-a.location.coordinates[1],2)));
            return adist - bdist;
        });
        setVans(sorted);
        setVansSorted(sorted);
        };

    const sortLocation=(vansUse)=>{
        setgeojson({'features': [
        ]});
        const length = vansUse.length;
        for (let i=0;i<length;i++){
            let shortestDistance=(Math.sqrt(Math.pow(xloc-vansUse[i].location.coordinates[0],2)+Math.pow(yloc-vans[i].location.coordinates[1],2)));
            geojson.features.push({
                'type': 'Feature',
                'geometry': {
                    'type':'Point',
                    'coordinates':vansUse[i].location.coordinates
                    },
                    'properties':{
                        'title':vansUse[i].name,
                        'description': vansUse[i].locationString,
                        'distance':shortestDistance*111,
                        'vanid':vansUse[i]._id
                    }
            })
            let distance=((shortestDistance*111).toFixed(2));
            if (distance>10){
            vansUse[i].distance=">10km";

            } else{
                vansUse[i].distance=((shortestDistance*111).toFixed(2))+"km";
                
            }
        }

    }
    
    useEffect(()=>{
        fetchVans();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


    useEffect(() => {
        sortByDist(xloc,yloc);
        sortLocation(vans);
        var geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
            enableHighAccuracy: true
            },
            trackUserLocation: true
        });

        
        geolocate.on('geolocate', function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            if(latitude){
                setyLoc(latitude);
                setxLoc(longitude);
                sortByDist(longitude,latitude);
                sortLocation(vansSorted);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map = new mapboxgl.Map({
            container: 'map',
            style: "mapbox://styles/jackj3/ckohxi52z363z17nzghj4gzwi",
            center: [xloc, yloc],
            zoom:15
        });

    // and trigger the geolocate function upon loading the map
    map.on('load', () => {
        geolocate.trigger();
    });
    map.addControl(geolocate);

    geojson.features.forEach(function (marker) {
        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';
        ReactDOM.render(<div className='marker' />, el);
        // make a marker for each feature and add it to the map
        new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML('<img src="/VanPlain.png" alt="minivan"/><h3>' + 
        marker.properties.title + '</h3> <h4>' 
        + marker.properties.description + '</h4><a href="/menu/' +marker.properties.vanid+ '"><button class="orderButton"> Order Here </button></a>')).addTo(map);
        currentMarkers.push(marker);
    });


}, [sort]);
    let count=1;
    let emojilist=["☕","🥧","🥐","🍵","🍰","🍩","🍪"];

    function getRandom(list,count){
        let length=list.length;
        if (count<length){
            return list[count];
        } else {
            return list[Math.random(length)%length]
        }
    }
    return (
        <>
        <p className="welcome">Welcome!</p>
        <h1 className="welcomeTitle">Here are our closest vans!</h1>
        <div className="selectVanPageGrid">
        <div>
            <div id="map" className="map-customer"/>
        </div>
        <div>
            <h1 className="selectTitle"> &nbsp;<img src="/VanMenuIcons/Open.svg" width="30px" alt="Open Icon" style={{paddingRight:"10px"}}/>Or manually select below</h1>
            <p>In order by distance:</p>
            {vansSorted.length > 0 ? 
                <div className="selectVanGridContainer">
                    {vansSorted.map(post =>(<div key={post._id}>
                        <Link style={{textDecoration:"none"}}to={`/menu/${post._id}`}>
                            <div className="selectVanButton">
                                <div className="selectVanButtonText">{count++} {getRandom(emojilist,(count-1))} {post.name} <span className="selectVanButtonText">{post.distance}</span></div>
                            </div>
                        </Link>
                        </div>))}
                </div> : <Loading /> 
            }
        </div>
        </div>
        </>
    )
}
  

export default CustomerSelectVan;