"use client"
import { useAddFavoritePropertyMutation, useGetAuthUserQuery, useGetTenantQuery, useRemoveFavoritePropertyMutation } from '../../../../state/api'
import Card from '../../../../components/Card'
import Header from '../../../../components/Header'
    
    const Favorites = () => {
            const {data: authUser} = useGetAuthUserQuery()
            const [addFavorite] = useAddFavoritePropertyMutation()
            const [removeFavorite] = useRemoveFavoritePropertyMutation()
            const {data: tenant } = useGetTenantQuery(authUser?.cognitoInfo.userId || "",
                {
                    skip: !authUser?.cognitoInfo.userId // Skip tells that only fetch tenants when the cognitoId of the user exists
                }
            ) 
              const handleToggleFavorites = async(id:number)=>{
                    const isPropertyFavorite = tenant.favorites.some((property: Property)=> property.id === id)
                    if(isPropertyFavorite ){
                        await removeFavorite({cognitoId:authUser!.cognitoInfo.userId, propertyId:id })
                        return
                    }
                    await addFavorite({cognitoId:authUser!.cognitoInfo.userId, propertyId:id })
                }
      return (
        <div className='dashboard-container'>
            <Header title='Favorited Properties' subtitle='Browse and manage your saved property listings' />
        <div className='grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8'>
  
            {tenant?.favorites?.map((properties)=>(
                <div key={properties.id} className='w-full '>
                <Card 
                
                property={properties}
                isFavorite={
                                true
                            }
                            onFavoriteToggle={()=> handleToggleFavorites(properties.id)}
                            showFavoriteButton = {!!authUser}
                            propertyLink={`/tenants/residences/${properties.id}`}
                            />
            </div>
                        ))}
        </div>
                        {(!tenant?.favorites || tenant?.favorites.length === 0 ) && <p>There is no Favorite properties added.</p> }
                        </div>
      )
    }
    
    export default Favorites
    