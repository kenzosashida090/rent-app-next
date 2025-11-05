"use client"
import React from 'react'
import Navbar from '../../components/Navbar'
import { NAVBAR_HEIGHT } from '../../lib/constants'
import {  SidebarProvider, useSidebar } from '../../components/ui/sidebar'
import Sidebar from "../../components/AppSidebar"
import { useGetAuthUserQuery } from '../../state/api'
import { cn } from '../../lib/utils'

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar()
  const { data: authUser } = useGetAuthUserQuery()

  return (
    <div className="min-h-screen w-full bg-primary-100">
      {/* TODO: Si Navbar usa useSidebar, debe permanecer aquí adentro */}
      <Navbar />

      <Sidebar userType={authUser?.userRole} />

      <main
        className={cn(
          "transition-[margin-left] duration-200",
          "md:ml-14",        // colapsado
          open && "md:ml-64" // expandido
        )}
        style={{ marginTop: `${NAVBAR_HEIGHT}px` }}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
const DashboardLayout = ({children}:{children:React.ReactNode}) => {
    const {data:authUser} = useGetAuthUserQuery()
  return (
    <SidebarProvider>
        <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  )
}

export default DashboardLayout
