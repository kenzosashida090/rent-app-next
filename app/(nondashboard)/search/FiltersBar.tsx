"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useAppSelector } from '../../../state/redux'
import { useDispatch } from 'react-redux'
import { FiltersState,  setFilters, setViewMode, toggleFiltersFullOpen } from '../../../state'

import { cn, formatPriceValue, updateUrl as updateUrlUtils } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'
import { Filter, Grid, List,  Search } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { PropertyTypeIcons } from '../../../lib/constants'
const FiltersBar = () => {
    const dispatch = useDispatch()
    const pathName = usePathname()
    const router = useRouter()
    const filters = useAppSelector((state)=> state.global.filters)
    const viewMode = useAppSelector((state)=> state.global.viewMode)
    const isFiltersFullOpen = useAppSelector((state)=> state.global.isFiltersFullOpen)
    const [searchInput, setSearchInput] = useState(filters.location)
    
       const updateUrl = (newFilters: FiltersState)=>{
           const updatedSearchParams= updateUrlUtils(newFilters)
           router.push(`${pathName}?${updatedSearchParams?.toString()}`)
       }
 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFilterChange = (key:string,  value:any, isMin: boolean | null)=>{
        let newValue = value

        if(key === "priceRange" || key === "squareFeet") {
            const currentArrayRange = [...filters[key]]
            if(isMin !== null){
                const index = isMin ? 0 : 1
                currentArrayRange[index] = value === "any" ? null : Number(value)
            }
            newValue = currentArrayRange
        } else if (key === "coordinates") {
            newValue = value === "any" ? [0,0] : value.map(Number)
        } else {
            newValue = value === "any" ? "any" : value
        }
        const newFilters = {...filters, [key]: newValue}
        dispatch(setFilters(newFilters))
        updateUrl(newFilters)
    }
        const handleLocationSearch = async()=>{
        try{
            const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(searchInput)}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`)
            console.log('thiis', )
            const data = await response.json()
            console.log(data)
            const [lng, lat] = data.features[0].geometry.coordinates
            if(data.features && data.features.length > 0 ) {
                dispatch(setFilters({
                    location:searchInput,
                    coordinates:[lng,lat]
                }))
                
            }
        
        }catch(error){
            console.log(error)
        }
    }
    return (
    <div className='flex justify-between items-center w-full py-5'>
        <div className='flex justify-between items-center gap-4 p-2'>
            <Button 
                variant="outline"
                className={
                    cn("gap-2 rounded-xl  border-primary-400 hover:bg-primary-500 hover:text-primary-200", isFiltersFullOpen && 'bg-primary-700 text-primary-100')
                }
                onClick={()=> dispatch(toggleFiltersFullOpen())}
            >
                <Filter className='w-4 h-4'/>
                <span>All Filters Sexoo</span>
            </Button>
            <div className='flex items-center'>
                <Input
                    placeholder='Search for location'
                    value={searchInput}
                    onChange={(e)=> setSearchInput(e.target.value)}
                    />
                <Button 
                    className='rounded-r-xl rounded-l-none border-l-none border-primary-400 shadow-none border hover:text-primary-200 bg-primary-200'
                    onClick={handleLocationSearch}
                >
                    <Search className='w-4 h-4' />
                </Button>
            </div>
            <div className='flex gap-1'>
                <Select
                    value={filters.priceRange[0]?.toString() || "any"}
                    onValueChange={(value)=> handleFilterChange("priceRange", value, true)}
                >
                    <SelectTrigger className='w-32 rounded-xl border-primary-400'>
                        <SelectValue>
                            {formatPriceValue(filters.priceRange[0], true)}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                        <SelectItem value='any'>Any Min Price</SelectItem>
                        {
                            [500,1000, 1500, 2000, 3000, 5000, 10000].map((price)=>(
                                <SelectItem key={price} value={price.toString()}>
                                    ${price/1000}k+
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                <Select
                    value={filters.priceRange[1]?.toString() || "any"}
                    onValueChange={(value)=> handleFilterChange("priceRange", value, false)}
                >
                    <SelectTrigger className='w-32 rounded-xl border-primary-400'>
                        <SelectValue>
                            {formatPriceValue(filters.priceRange[1], false)}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                        <SelectItem value='any'>Any Max Price</SelectItem>
                        {
                            [9000,100000,200000, 3000000, 40000, 50000, 1000000].map((price)=>(
                                <SelectItem key={price} value={price.toString()}>
                                    ${price/1000}k+
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className='flex gap-1'>
                <Select
                    value={filters.beds || "any"}
                    onValueChange={(value)=> handleFilterChange("beds", value,null)}
                >
                    <SelectTrigger className='w-32 rounded-xl border-primary-400'>
                        <SelectValue placeholder='Beds'/>
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                        <SelectItem value='any'>Any beds</SelectItem>
                        <SelectItem value='1'>1+ bed</SelectItem>
                        <SelectItem value='2'>2+ beds</SelectItem>
                        <SelectItem value='3'>3+ beds</SelectItem>
                        <SelectItem value='4'>4+ beds</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={filters.baths|| "any"}
                    onValueChange={(value)=> handleFilterChange("baths", value,null)}
                >
                    <SelectTrigger className='w-32 rounded-xl border-primary-400'>
                        <SelectValue placeholder='Baths'/>
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                        <SelectItem value='any'>Any baths</SelectItem>
                        <SelectItem value='1'>1+ bath</SelectItem>
                        <SelectItem value='2'>2+ baths</SelectItem>
                        <SelectItem value='3'>3+ baths</SelectItem>
                        <SelectItem value='4'>4+ baths</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <Select
                    value={filters.propertyType || "any"}
                    onValueChange={(value)=> handleFilterChange("propertyType", value,null)}
                >
                    <SelectTrigger className='w-40 rounded-xl border-primary-400'>
                        <SelectValue placeholder='Home Type'/>
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                        <SelectItem value='any'>Any property type</SelectItem>
                        
                            {
                                Object.entries(PropertyTypeIcons).map(([type,Icon])=>(
                                    <SelectItem key={type} value={type}>
                                        <div className='flex items-center'>

                                       { <Icon className='w-4 h-4 m-2' />}
                                       <span>{type}</span>
                                        </div>
                                    </SelectItem>
                                ))
                            }

                    </SelectContent>
                </Select>
        </div>
        <div className='flex justify-between items-center gap-4 p-2'>
            <div className='flex border rounded-xl'>
                  <Button 
                variant="ghost"
                className={
                    cn("gap-2 rounded-none rounded-l-xl border-primary-400 hover:bg-primary-500 hover:text-primary-200", viewMode === 'list' ? 'bg-primary-700 text-primary-100' :'text-primary-700')
                }
                onClick={()=> dispatch(setViewMode('list'))}
            >
                <List />

                </Button>
                  <Button 
                variant="ghost"
                className={
                    cn("gap-2 rounded-none rounded-r-xl border-primary-400 hover:bg-primary-500 hover:text-primary-200", viewMode === 'grid' ? 'bg-primary-700 text-primary-100' :'text-primary-700')
                }
                onClick={()=> dispatch(setViewMode('grid'))}
            >
                <Grid />
                </Button>
            </div>

        </div>
    </div>
  )
}

export default FiltersBar
