"use client"
import HeroSection from './HeroSection'
import FeatureSection from './FeatureSection'
import DiscoverSection from './DiscoverSection'
import CallToActionSection from './CallToActionSection'
import FooterSection from './FooterSection'
import ImageGallery from './ImageGallery'

const Landing = () => {
  return (
    <div className=''>
        <HeroSection/>
        <FeatureSection/>
        <ImageGallery/>
        <DiscoverSection/>
        <CallToActionSection/>
        <FooterSection/>
    </div>
  )
}

export default Landing
