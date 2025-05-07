import Image from 'next/image'
import React from 'react'

const HeroSection2 = () => {
  return (
    <div className='flex flex-col justify-center items-center mt-10'>
        <h3 className='text-3xl '> 
            <b><i>AI in healthcare</i></b>
        </h3>
        <br />

        <p className='flex flex-wrap text-center text-xl ml-4 mr-4'>
        The artificial intelligence (AI) technologies becoming ever present
            in modern business and everyday life is also steadily being applied
            to healthcare. The use of artificial intelligence in healthcare has
            the potential to assist healthcare providers in many aspects of
            patient care and administrative processes. Most AI and healthcare
            technologies have strong relevance to the healthcare field, but the
            tactics they support can vary significantly. And while some articles
            on artificial intelligence in healthcare suggest that the use of
            artificial intelligence in healthcare can perform just as well or
            better than humans at certain procedures, such as diagnosing
            disease, it will be a significant number of years before AI in
            healthcare replaces humans for a broad range of medical tasks.
        </p>

        <div className='flex flex-col items-center justify-center mt-4 mb-4'>
            <Image
                src = "/images/healthcure.png"
                alt = ""
                height={800}
                width = {800}
                className='rounded-xl border-cyan-500 border-4'
            />
        </div>

        


       
    
    
    </div>
  )
}

export default HeroSection2