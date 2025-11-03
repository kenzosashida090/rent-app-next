"use client"
import {motion} from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'

const containerVariants = { // cascadian effect
    hidden:{opacity:0, y:50},
    visible:{
        opacity:1, y:0, transition:{duration: 0.5, staggerChildren:0.2 } // staggerChildren is the difference of displaying each children of the container
    }

}
const itemVariant = {
    hidden:{opacity:0, y:20},
    visible:{opacity:1, y:0}
}
const DiscoverSection = () => {
  return (
    <div className="relative py-24">
        <Image 
          src="/enig.png"
          alt="toaction"
          fill
          
          className='object-cover object-center '  
        />
      <div className='absolute inset-0 bg-black bg-opacity-70'></div>
    <motion.div
        initial="hidden"
        whileInView={"visible"}
        viewport={{once:true, amount:0.2}}
        variants={containerVariants}
        className='relative py-16 px-6 sm:px-8 lg:px-12 xl:px-16 '
        >
        <div className='max-w-4xl xl:max-w-6xl mx-auto'>
            <motion.div
                variants={itemVariant}
                className=' text-center'
            >
                <h2 className="text-3xl font-semibold leading-tight text-gray-200 "> Discover </h2>
                <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto mb-8">
                    Searching for your dream rental property has never been easier. With our user-friendly search feature, youn can quickly find the perfect
                    home that meets all your needs. Start your search today and discover your dream rental property!. 
                </p>
            </motion.div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 text-center '>
                {[
                    {
                        imageSrc:"/landing-icon-wand.png",
                        title:"Search Properties",
                        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur recusandae ex quibusdam repudiandae rerum? Saepe, eius, voluptates iure soluta odio aliquam pariatur error dolore modi quod hic blanditiis in adipisci."

                    },
                    {
                        imageSrc:"/landing-icon-calendar.png",
                        title:"Book your rental",
                        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur recusandae ex quibusdam repudiandae rerum? Saepe, eius, voluptates iure soluta odio aliquam pariatur error dolore modi quod hic blanditiis in adipisci."
                        
                    },
                    {
                        imageSrc:"/landing-icon-heart.png",
                        title:"Enjoy your new home",
                        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur recusandae ex quibusdam repudiandae rerum? Saepe, eius, voluptates iure soluta odio aliquam pariatur error dolore modi quod hic blanditiis in adipisci."
                        
                    },
                ].map((card,index)=>(
                    <motion.div key={index} variants={itemVariant}>
                        {<DiscoverCard {...card}/>}
                    </motion.div>
                ))}
            </div>
        </div>
    </motion.div>
    </div>
  )
}
type DiscoverCardT = {
    imageSrc:string;
    title:string;
    description:string; 
}
const DiscoverCard = ({imageSrc, title, description,}: DiscoverCardT)=>(
    <div className='px-4 py-12 shadow-lg rounded-lg bg-primary-50 md:h-[22rem] text-clip'>
        <div className='bg-primary-700 p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto'>
            <Image
                src={imageSrc}
                alt={title}
                width={400}
                height={400}
                className='w-full h-full '
                />

        </div>
        <h3 className='text-xl font-semibold mb-2 text-ellipsis '>{title}</h3>
        <p className='mt-2 text-base text-gray-500 text-wrap'>{description}</p>
    </div>
)
export default DiscoverSection
