import React from 'react'
import { useAddFavoritePropertyMutation, useGetAuthUserQuery, useGetPropertiesQuery, useGetTenantQuery, useRemoveFavoritePropertyMutation } from '../../../state/api'
import { useAppSelector } from '../../../state/redux'
import { Property } from '../../types/prismaTypes'
import Card from '../../../components/Card'
import { property } from 'lodash'
import CardCompact from '../../../components/CompactCard'

const Listings = () => {
    const {data: authUser} = useGetAuthUserQuery()
    const {data: tenant } = useGetTenantQuery(authUser?.cognitoInfo.userId || "",
        {
            skip: !authUser?.cognitoInfo.userId // Skip tells that only fetch tenants when the cognitoId of the user exists
        }
    ) 
    const [ addFavorite ] = useAddFavoritePropertyMutation()
    const [ removeFavorite] = useRemoveFavoritePropertyMutation()
    const viewMode = useAppSelector((state)=>state.global.viewMode)
    const filters = useAppSelector((state)=>state.global.filters)
    const {data: properties, isLoading, isError} = useGetPropertiesQuery(filters)
    const handleToggleFavorites = async(id:number)=>{
        const isPropertyFavorite = tenant.favorites.some((property: Property)=> property.id === id)
        if(isPropertyFavorite ){
            await removeFavorite({cognitoId:authUser!.cognitoInfo.userId, propertyId:id })
            return
        }
        await addFavorite({cognitoId:authUser!.cognitoInfo.userId, propertyId:id })
    }

    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>ERROR..</p>
    return (
    <div className='w-full'>
        <h3 className='text-sm px-4 font-bold'>
            {properties?.length} {" "}
            <span className='text-gray-700 font-normal'>
                Places in {filters.location}
            </span>
        </h3>
      <div className="flex">
        <div className='p-4 w-full'>
            {
                properties?.map((properties)=>
                    viewMode === "grid" ? 
                    <Card
                        key={properties.id}
                        property={properties}
                        isFavorite={
                            tenant?.favorites?.some((favorite:Property)=> favorite.id === properties.id) || false
                        }
                        onFavoriteToggle={()=> handleToggleFavorites(properties.id)}
                        showFavoriteButton = {!!authUser}
                        propertyLink={`/search/${properties.id}`}
                    />
                    
                    : 
                      <CardCompact
                        key={properties.id}
                        property={properties}
                        isFavorite={
                            tenant?.favorites?.some((favorite:Property)=> favorite.id === properties.id) || false
                        }
                        onFavoriteToggle={()=> handleToggleFavorites(properties.id)}
                        showFavoriteButton = {!!authUser}
                        propertyLink={`/search/${properties.id}`}
                    />
                )
            }
        </div>

      </div>
    </div>
  )
}

export default Listings
