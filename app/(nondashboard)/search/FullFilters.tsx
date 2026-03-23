import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../../state/redux'
import { FiltersState, initialState, setFilters } from '../../../state'
import { cn, updateUrl as updateUrlUtil } from '../../../lib/utils'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Search } from 'lucide-react'
import { AmenityIcons, PropertyTypeIcons } from '../../../lib/constants'
import { Slider } from '../../../components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'

const FullFilters = () => {
    const dispatch = useDispatch()
    const pathName = usePathname()
    const router = useRouter()
    const isFiltersFullOpen = useAppSelector((state)=> state.global.isFiltersFullOpen)
    const [localFilters, setLocalFilters] = useState(initialState.filters)
    const updateUrl = (newFilters: FiltersState)=>{
        const updatedSearchParams= updateUrlUtil(newFilters)
        router.push(`${pathName}?${updatedSearchParams?.toString()}`)
    }
    const handleSubmit = ()=>{
        dispatch(setFilters(localFilters))
        updateUrl(localFilters)
    }
    const handleAmenity = (amenity:string) =>{
        setLocalFilters((prev)=>(
            {
                ...prev, amenities: prev.amenities.includes(amenity) ? prev.amenities.filter((amen)=> amen !== amenity) : [...prev.amenities, amenity]
            }
        ))
    }
    const handleLocationSearch = async()=>{
        try{
            const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(localFilters?.location)}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`)
            const data = await response.json()
            const [lng, lat] = data.features[0].geometry.coordinates
            console.log(data.features[0].geometry.coordinates)
            
            if(data.features && data.features.length > 0 ) {
                setLocalFilters((prev)=>({
                    ...prev, 
                    coordinates:[lng,lat]
                }))
            }
        }catch(error){
            console.log(error)
        }
    }
    const handleReset = ()=>{
        setLocalFilters(initialState.filters)

        updateUrl(initialState.filters)
    }
    if(!isFiltersFullOpen) return null 
  return (
    <div className=' bg-white rounded-lg px-4 h-full overflow-auto pb-10 '>
      <div className='flex flex-col space-y-6'>
        <div>
            <h4 className='font-bold mb-2'>Location</h4>
            <div className='flex items-center'>
                <Input
                    placeholder='Search for location'
                    value={localFilters.location}
                    onChange={(e)=> setLocalFilters((prev)=>({
                        ...prev,
                        location: e.target.value
                    }))}
                    />
                <Button
                    onClick={handleLocationSearch}
                    className='rounded-r-xl rounded-l-none border-l-none border-black  shadow-none text-white'
                >
                    <Search className='w-4 h-4'/>
                </Button>
            </div>
        </div>
        <div>
            <h4 className='font-bold mb-2'>Property Type</h4>
            <div className='grid grid-cols-2 gap-4'>
                    {
                        Object.entries(PropertyTypeIcons).map(([type,Icon])=>(
                            <div key={type} 
                                className={cn("flex flex-col items-center justify-center border p-4 rounded-xl cursor-pointer",
                                    localFilters.propertyType === type ? 
                                        'border-black' : 'border-gray-200'

                                )}  
                                onClick={()=>{
                                    console.log('hoosos', localFilters.propertyType, type)
                                    setLocalFilters((prev)=>({
                                        ...prev,
                                        propertyType: type as PropertyTypeEnum
                                    }))
                                }}
                            >
                                <Icon/>
                                <span>{type}</span>
                            </div>
                        ))
                    }
            </div>
        </div>
        <div>
            <h4 className='font-bold mb-2'>Price Range (Monthly)</h4>
            <Slider  
                min={0}
                max={10000}
                step={100}
                value={[
                    localFilters.priceRange[0] ?? 0 ,
                    localFilters.priceRange[1] ?? 10000 ,

                ]}
                onValueChange={(value:[number,number])=>{
                    setLocalFilters((prev)=>({
                        ...prev,
                        priceRange:value
                    }))
                }}
            />
            <div className='flex justify-between mt-2'>
                <span>${localFilters.priceRange[0] ?? 0}</span>
                <span>${localFilters.priceRange[1] ?? 10000}</span>

            </div>
        </div>
        <div className='flex gap-4'>
            <div className='flex-1 '>
                <h4 className='font-bold mb-2'>Beds</h4>
                <Select
                    value={localFilters.beds || 'any'}
                    onValueChange={(value)=> setLocalFilters((prev)=>({...prev, beds: value}))}
                >
                    <SelectTrigger className='w-full rounded-xl'>
                        <SelectValue placeholder="beds" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='any'>Any beds</SelectItem>
                        <SelectItem value='1'>1+ bed</SelectItem>
                        <SelectItem value='2'>2+ beds</SelectItem>
                        <SelectItem value='3'>3+ beds</SelectItem>
                        <SelectItem value='4'>4+ beds</SelectItem>
                    </SelectContent>

                </Select>
            </div>
            <div className='flex-1 '>
                <h4 className='font-bold mb-2'>Baths</h4>
                <Select
                    value={localFilters.baths || 'any'}
                    onValueChange={(value)=> setLocalFilters((prev)=>({...prev, baths: value}))}
                >
                    <SelectTrigger className='w-full rounded-xl'>
                        <SelectValue placeholder="beds" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='any'>Any baths</SelectItem>
                        <SelectItem value='1'>1+ bath</SelectItem>
                        <SelectItem value='2'>2+ baths</SelectItem>
                        <SelectItem value='3'>3+ baths</SelectItem>
                        <SelectItem value='4'>4+ baths</SelectItem>
                    </SelectContent>

                </Select>
            </div>

        </div>
        <div>
            <h4 className='font-bold mb-2'>Square Feet</h4>
                        <Slider  
                min={0}
                max={5000}
                step={100}
                value={[
                    localFilters.squareFeet[0] ?? 0 ,
                    localFilters.squareFeet[1] ?? 5000 ,

                ]}
                onValueChange={(value:[number,number])=>{
                    setLocalFilters((prev)=>({
                        ...prev,
                        squareFeet:value
                    }))
                }}
            />
            <div className='flex justify-between mt-2'>
                <span>{localFilters.squareFeet[0] ?? 0} sq ft</span>
                <span>{localFilters.squareFeet[1] ?? 5000} sq ft</span>

            </div>
        </div>
        <div>
                <h4 className='font-bold mb-2'>Amenities</h4>
                <div className='flex flex-wrap gap-2'>
                {
                    Object.entries(AmenityIcons).map(([amenity,Icon])=>(
                        <div
                        key={amenity}
                        className={cn('flex items-center space-x-2 p-2 border rounded-xl cursor-pointer', localFilters.amenities.includes(amenity) ? 'border-black' : 'border-primary-200' )}
                        onClick={()=> handleAmenity(amenity)}
                        >
                            <Icon className='w-4 h-4'/>
                            <span>{amenity}</span>
                        </div>
                    ))
                }
                </div>
        </div>
        <div>
            <h4 className='font-bold mb-2'> Available from </h4>
            <Input
                type='date'
                value={
                    localFilters.availableFrom !== "any" ? localFilters.availableFrom : "" 
                }
                onChange={(e)=>
                    setLocalFilters((prev)=>({
                        ...prev,
                        availableFrom: e.target.value
                    }))
                }
                className='rounded-xl'
            />
        </div>
        <div className='flex gap-4 mt-6'>
            <Button
                onClick={handleSubmit} className='flex-1 bg-primary-700 text-white rounded-xl'>Submit</Button>
            <Button
                onClick={handleReset} variant={'outline'} className='flex-1   rounded-xl'>Reset</Button>
        </div>
      </div>
    </div>
  )
}

export default FullFilters
