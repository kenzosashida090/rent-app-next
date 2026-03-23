
"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import {motion} from "framer-motion"
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setFilters } from '../../../state'
const HeroSection = () => {
    const [inputSearch, setInputSearch] = useState('')
    const dispatch = useDispatch()
    const router = useRouter()
    const onSubmitSearch = async()=>{
        const searchTrim = inputSearch.trim()
        if(!searchTrim ) return
        try{
            const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(searchTrim)}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`)
            const data = await response.json()
            const [lng, lat] = data.features[0].geometry.coordinates
            if(data.features && data.features.length > 0 ) {
                dispatch(setFilters({
                    location:searchTrim,
                    coordinates:[lng,lat]
                }))
                const params = new URLSearchParams({
                    location: searchTrim,
                    lat: lat.toString(),
                    lng:lng.toString()
                })
                router.push(`search/${params.toString()}`)
            }
        }catch(error){
            console.log(error,'ddd')
        }
    }
  return (
    <div className='relative h-screen w-full'>
        <Image 
            src="/landing-splash.jpg"
            alt='Nextiful Rental Plataform Hero Section'
            fill
            className='object-cover object-center'
            priority
        />
        <div className='absolute inset-0 bg-black bg-opacity-50'>
            <motion.div
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                transition={{duration:0.8}}
                className='absolute top-16 md:top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full '
            >
                    <div className='max-w-4xl mx-auto px-16 sm:px-12'>
                        <h1 className='text-4xl md:text-5xl font-bold text-white mb-4 '>
                            Start your journey to finding the perfect place to call a vacation
                        </h1>
                        <p className='text-xl text-white mb-8'>Explore our wide range of rental properties to fit your lifestyle and needs.</p>
                        <div className='flex justify-center '>

                            <Input onChange={(e)=>setInputSearch(e.target.value)} type='text' placeholder='Search by city, neighborhood or address' className='w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12 '/>  
                            <Button onClick={onSubmitSearch} className='bg-secondary-500 text-white rounded-none rounded-r-xl border-none hover:bg-secondary-600 h-12'>Search</Button>
                        </div>
                    </div>
            </motion.div>
        </div>
    </div>
  )
}

export default HeroSection
