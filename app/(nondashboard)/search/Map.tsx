import React, { useEffect,  useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppSelector } from '../../../state/redux'
import { useGetPropertiesQuery } from '../../../state/api';
import { Property } from '../../types/prismaTypes';
import "../../globals.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string 
const Map = () => {
    const mapContainerRef = useRef(null)
    const filters = useAppSelector((state)=>state.global.filters)
    const isFiltersFullOpen = useAppSelector((state)=>state.global.isFiltersFullOpen)
    const {isLoading, data:properties, isError} =useGetPropertiesQuery(filters)
        const createPropertyMarker = (property: Property, map: mapboxgl.Map)=>{
      console.log(property,"---------")
      console.log(property.location.coordinates)
      const marker = new mapboxgl.Marker({color:'#cc57af'})
      .setLngLat([
        property.location.coordinates?.longitude,
        property.location.coordinates?.latitude,
      ])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `
            <div class="marker-popup">
              <div class="marker-popup-image"></div>
              <div>
                <a href="/search/${property.id}" target="_blank" class=""marker-popup-title>${property.name}</a>
                <p class="marker-popup-price">${property.pricePerMonth}<span class="marker-popup-price-unit"> /month</span></p>
              </div>
            </div>
          `
        )
      )
      .addTo(map)

      return marker
    }
    useEffect(()=>{
      if(isLoading || isError || !properties) return;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style:"mapbox://styles/kenzosashida090/cmm2p26ri008y01s1hv5i7saa",
        center: filters.coordinates || [-74.5, 40],
        zoom: 9
      })

       properties?.forEach((property)=>{
          const marker = createPropertyMarker(property, map)
          const markerElement = marker.getElement()
          const path = markerElement.querySelector("path[fill='#971e61'")
          if(path) path.setAttribute("fill","#00000")
        }
        )


      
      return ()=> map.remove()
    
    },[properties, filters.coordinates, isError, isLoading])

  return (
    <div className='basis-5/12 grow relative rounded-xl'>
      <div className='map-container rounded-xl' ref={mapContainerRef} style={{height:"100%", width:"100%"}}/>

    </div>
  )
}

export default Map
