"use client"
import React from 'react'
import { useGetAuthUserQuery, useUpdateManagerSettingsMutation } from '../../../../state/api'
import SettingsForm from '../../../../components/SettingsForm'
const ManagerSettings = () => {
  const {data:authUser, isLoading} = useGetAuthUserQuery()
  const [updateManager] = useUpdateManagerSettingsMutation()
  if(isLoading) return <>Loading</>
  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,

  }
  const handleSubmit = async(data: typeof initialData) => {
    await updateManager({
      cognitoId: authUser!.cognitoInfo.userId,
      ...data
    })
  }
    return (
    <div>
      <SettingsForm initialData={initialData} onSubmit={handleSubmit} userType={authUser?.userRole}  />
    </div>
  )
}

export default ManagerSettings
