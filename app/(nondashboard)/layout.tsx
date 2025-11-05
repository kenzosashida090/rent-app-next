"use client"
import React, { useEffect, useState } from 'react'
import { NAVBAR_HEIGHT } from '../../lib/constants'
import Navbar from '../../components/Navbar'
import { useGetAuthUserQuery } from '../../state/api'
import { usePathname, useRouter } from 'next/navigation'
const Layout = ({children}:{children:React.ReactNode}) => {
  const {data: authUser, isLoading:authLoading} = useGetAuthUserQuery()
  console.log("authuser",authUser)
    const router = useRouter()
    const pathname = usePathname()
    const [isLoading, setLoading] =  useState(true)
  
    useEffect(()=>{
      const userRole = authUser?.userRole?.toLowerCase()
      if(
        (userRole === "manager" && pathname.includes("/search")) ||
        (userRole === "manager" && pathname.includes("/"))
      ){
        router.push("/managers/properties")
      }else{
        
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false)
      }
    },[authUser, pathname, router])
    if(authLoading || isLoading) return <>Loading</>
  return (
    <div className='h-full w-full'>
      <Navbar/>
      <main className={`h-full flex w-full  flex-col  `}
        style={{paddingTop: `${NAVBAR_HEIGHT}px`}}
      >
        {children}
      </main>
    </div>
  )
}

export default Layout
