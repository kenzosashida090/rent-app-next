
import {motion} from "framer-motion"
import Image from "next/image"
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
const ImageGallery = () => {
return (
    <motion.div
        initial="hidden"
        whileInView={"visible"}
        viewport={{once:true, amount:0.2}}
        variants={containerVariants}
        className='py-16 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white'
    >
        <div className='max-w-4xl xl:max-w-6xl mx-auto'>
            <motion.div
                variants={itemVariant}
                className=' text-center'
            >
                <h2 className="text-3xl font-semibold leading-tight text-gray-800 "> Image Gallery</h2>
                <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
                    Browse our handpicked selection of rental properties and find the perfect home for you!
                </p>
            </motion.div>
            <div className=''>
                <DiscoverCard/>
            </div>
        </div>
    </motion.div>
  )
}
const DiscoverCard = ()=>(
<section className="max-w-6xl mx-auto mt-8">
  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
    {/* item */}
    <figure className="mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-lg bg-white hover:scale-[1.1199] transition-transform duration-300 ease-out">
      <Image
        src="/landing-i1.png"
        alt="Image 1"
        width={1200}
        height={800}
        className="w-full h-auto object-cover"
      />
    </figure>

    <figure className="mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-lg bg-white hover:scale-[1.1199] transition-transform duration-300 ease-out">
      <Image src="/landing-i2.png" alt="Image 2" width={1200} height={800} className="w-full h-auto object-cover" />
    </figure>
    <figure className="mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-lg bg-white hover:scale-[1.1199] transition-transform duration-300 ease-out">
      <Image src="/landing-i3.png" alt="Image 2" width={1200} height={800} className="w-full h-auto object-cover" />
    </figure>
    <figure className="mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-lg bg-white hover:scale-[1.1199] transition-transform duration-300 ease-out">
      <Image src="/landing-i4.png" alt="Image 2" width={1200} height={800} className="w-full h-auto object-cover" />
    </figure>
    <figure className="mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-lg bg-white hover:scale-[1.1199] transition-transform duration-300 ease-out">
      <Image src="/landing-i5.png" alt="Image 2" width={1200} height={800} className="w-full h-auto object-cover" />
    </figure>
    <figure className="mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-lg bg-white hover:scale-[1.1199] transition-transform duration-300 ease-out">
      <Image src="/landing-i6.png" alt="Image 2" width={1200} height={800} className="w-full h-auto object-cover" />
    </figure>
    <figure className="mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-lg bg-white hover:scale-[1.1199] transition-transform duration-300 ease-out">
      <Image src="/landing-i7.png" alt="Image 2" width={1200} height={800} className="w-full h-auto object-cover" />
    </figure>

    {/* …repite una figure por imagen */}
  </div>
</section>
)
export default ImageGallery
