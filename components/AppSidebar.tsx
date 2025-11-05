"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar'
import { Building, FileText, Heart, Home, Menu, Settings, X } from 'lucide-react'
import { NAVBAR_HEIGHT } from '../lib/constants'
import { cn } from '../lib/utils'
import Link from 'next/link'

const AppSidebar = ({userType}:AppSidebarProps) => {
    const pathname = usePathname()
    const {setOpen, open} = useSidebar()

    const navLinks = 
        userType === "manager" 
        ? [
            {icon:Building, label:"Properties", href:"/managers/properties"},
            {icon:FileText, label:"Applications", href:"/managers/applications"},
            {icon:Settings, label:"Settings", href:"/managers/settings"}
            
        ]
        :
        [
            {icon:Heart, label:"Favorites", href:"/tenants/favorites"},
            {icon:Home, label:"Residences", href:"/tenants/residences"},
            {icon:Settings, label:"Settings", href:"/managers/settings"}
        ]


    return (
    <Sidebar
        collapsible="icon"
        side='left'
        className={cn(
            "inset-y-0 left-0  bg-white shadow-lg transition-[width] duration-200 ",
            open ? "w-64" : "w-14 ",
        )}
        style={{
            top: `${NAVBAR_HEIGHT}px`,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
        onMouseEnter={()=>setOpen(true)} 
        onMouseLeave={()=>setOpen(false)}
    >
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className={
                        cn("flex min-h-[56px] w-full items-center pt-3 mb-3 ", 
                            open ? "justify-between px-6" : "justify-center"
                        )
                    }>
                        {  open ?
                            (<>
                                  <div
                                    className={cn(
                                    "overflow-hidden ",
                                    "whitespace-nowrap",               // que no haga salto de línea
                                    open ? "max-w-[12rem] opacity-100 ml-3" : "max-w-0 opacity-0 ml-0"
                                    )}
                                    aria-hidden={!open}
                                >
                                    <h1 className="text-xl font-bold text-gray-800">
                                    {userType === "manager" ? "Manager View" : "Renter View"}
                                    </h1>
                                </div>
                                
                            </>):
                            (
                                <button
                                    className='hover:bg-gray-100 p-2 rounded-sm'
                                    disabled
                    
                                >
                                    <Menu className='h-6 w-6 text-gray-600'/>
                                </button>
                            )
                        }
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                {
                    navLinks.map((el)=>{
                        const isActive = pathname === el.href
                        return(
                            <SidebarMenuItem key={el.href}>
                                <SidebarMenuButton
                                    asChild
                                    className={
                                        cn("flex items-center py-7 mr-5 ml-[8px]",
                                            isActive ? "bg-gray-100" 
                                            : "text-gray-600 hover:bg-gray-100",
                                            open ? "text-blue-700" : ""
                                        )
                                        
                                    }
                                >
                                    <Link href={el.href} className='w-full ' scroll={false}>
                                        <div className='flex items-center gap-5'>
                                        <el.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                                        <span className={`font-medium ${isActive ? 'text-blue-600' :'text-gray-500'} `}>{el.label}</span>
                                        </div>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })
                }
            </SidebarMenu>
        </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
