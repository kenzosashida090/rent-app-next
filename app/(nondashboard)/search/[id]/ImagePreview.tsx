import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

const ImagePreview = ({images}:ImagePreviewsProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const handlePreviousImageIndex = ()=>{
        setCurrentImageIndex((prev)=> prev === 0 ? images.length - 1 : prev - 1)
    }
    const handleNextImageIndex = ()=>{
        setCurrentImageIndex((prev)=> prev === images.length - 1 ? 0 : prev + 1)
    }
  return (
    <div className='relative h-[450px] w-full lg:h-[600px]'>
        {
            images.map((image,index)=>(
                <div key={image} className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                }`}>
                    <Image
                        src={image}
                        alt={`Property Image ${index + 1}`}
                        fill
                        className='object-cover cursor-pointer transition-transform duration-500 ease-in-out'/>
                </div>
            ))
        }
        
            <button
                onClick={handlePreviousImageIndex}
                className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary-700 bg-opacity-70 rounded-full p-2'
                aria-label='Previous image'
            >
                <ChevronLeft className='text-white'/>
            </button>
        
            <button
                onClick={handleNextImageIndex}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary-700 bg-opacity-70 rounded-full p-2'
                aria-label='Previous image'
            >
                <ChevronRight className='text-white'/>
            </button>
        
        
      
    </div>
  )
}

export default ImagePreview
