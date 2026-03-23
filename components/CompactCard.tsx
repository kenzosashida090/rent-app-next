import { Bath, Bed, Heart, House, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const CardCompact= ({
    property,
    isFavorite,
    onFavoriteToggle,
    showFavoriteButton = true,
    propertyLink

}: CardCompactProps) => {
    const [imgSrc, setImgSrc] = useState(
        property.photoUrls?.[0] || "/placeholder.jpg"
    )
    console.log("p[roper", property)
  return (
    <div className='bg-white rounded-xl overflow-hidden shadow-lg w-full flex h-40 mb-5'>
      <div className='relative w-1/3'>
        
            <Image
                src={imgSrc}
                alt={property.name}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                onError={()=> setImgSrc("/placeholder.jpg")}
            />

        <div className='absolute bottom-1 left-1 flex gap-1 flex-col'>
            {
                property.isPetsAllowed && (
                    <span className='bg-white/80 text-black text-xs font-semibold px-1 py-1 rounded-xl w-fit'>
                        Pets 
                    </span>
                )
            }
            {
                property.isParkingIncluded && (
                    <span className='bg-white/80 text-black text-xs font-semibold px-1 py-1 rounded-xl'>
                        Parking
                    </span>
                )
            }
        </div>
            </div>
            <div className='w-2/3 p-2 flex flex-col justify-between'>
            <div>
                <div className='flex justify-between items-start'>
                <h2 className='text-xl font-bold mb-1'>
                    {propertyLink ? (
                        <Link
                            href={propertyLink}
                            className='hover:underline hover:text-blue-600'
                            scroll={false}
                        >
                            {property.name}
                        </Link>
                    ) :
                    (
                        property.name
                    )       
                    }
                </h2>
            {
                showFavoriteButton && (
                    <button onClick={onFavoriteToggle} className=' bg-white p-1 cursor-pointer rounded-full'>
                        <Heart 
                            className={`w-4 h-4 ${
                                isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                        />
                    </button>
                )
            }
                </div>
                <p className='text-gray-600 mb-1 text-sm'>
                    {property?.location?.address} , {property?.location?.city}
                </p>
                <div className='flex text-sm items-center '>
                        <Star className='w-3 h-3 text-yellow-400 mr-1'/>
                        <span className='font-semibold'>{property?.averageRating.toFixed(1)}</span>
                        <span className='font-semibold'>({property?.numberOfReview})</span>
                    
                </div>  
            </div>
                <div className='flex justify-between items-center gap-2 text-gray-600 text-sm'>
                    <div className='flex gap-1 text-gray-600'>

                    <span className='flex items-center'> 
                        <Bed className='w-4 h-4 mr-1' />
                        {property.beds} Bed
                    </span>
                    <span className='flex items-center'> 
                        <Bath className='w-4 h-4 mr-1' />
                        {property.baths} Baths
                    </span>
                    <span className='flex items-center'> 
                        <House className='w-4 h-4 mr-1' />
                        {property.squareFeet} sq ft
                    </span>
                    
                    </div>
                    <p className=' text-base font-bold mb-3'>
                        ${property?.pricePerMonth.toFixed(0)} {" "}
                        <span className='text-gray-600 text-base font-normal'>
                            {" "}
                            /month
                        </span>
                    </p>
                </div>
            </div>
      </div>
  )
}

export default CardCompact
