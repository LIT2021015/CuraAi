import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black">
        <div className='flex flex-wrap items-center'>
            <Image
                src="/images/logo2.png"
                alt=''
                height={200}
                width={200}
            />

        </div>
    </nav>
  )
}

export default Header