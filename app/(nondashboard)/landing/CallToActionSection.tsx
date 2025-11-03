"use client"
import Image from 'next/image'
import {motion} from "framer-motion"
import Link from 'next/link'
const CallToActionSection = () => {
  return (
    <div className='relative py-24  '>
      <Image 
          src="/landing-call-to-action.jpg"
          alt="toaction"
          fill
          
          className='object-cover object-center '  
      />
      <div className='absolute inset-0 bg-black bg-opacity-70'>

      <motion.div
        initial={{opacity:0, y:20}}
        transition={{duration:0.3}}
        whileInView={{opacity:1, y:0}}
        viewport={{once:true}}
        className='relative max-w-5xl xl:mx-w-6xl mx-auto w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-12 '
        >

        <div className='flex flex-col md:flex-row justify-between items-center space-x-4'>
            <div className='mb-6 md:mb-0 md:mr-0'>
                <h2 className='text-2xl font-bold text-white'>
                    Find Your dream Rental Property
                </h2>
            </div>
            <div className='mr-10'>
                
            <p className='text-white mb-3 '>
                Discover a wide range of rental properties in your desired location.
            </p>
            </div>
            <div className='flex justify-between md:justify-start gap-8 w-3/4'>
                <button
                    onClick={()=> window.scrollTo({top:0, behavior:"smooth"})}
                    className='inline-block text-primary-700 bg-white rounded-lg px-6 py-3 font-semibold hover:bg-primary-500 hover:text-primary-50 w-full'
                    >Search</button>
                <Link scroll={false} className='inline-block text-white bg-secondary-500 rounded-lg px-6 py-3 font-semibold hover:bg-secondary-600 w-full text-center' href={"/signup"}>Sign Up</Link>
            </div>
        </div>

      </motion.div>
                    </div>
        </div>
  )
}

export default CallToActionSection
