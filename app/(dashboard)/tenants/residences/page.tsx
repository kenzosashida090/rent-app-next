"use client"
import { useGetAuthUserQuery, useGetCurrentResidencesQuery, } from '../../../../state/api'
import Card from '../../../../components/Card'
import Header from '../../../../components/Header'
    
    const Residences = () => {
            const {data: authUser} = useGetAuthUserQuery()

            const {data: residences, isLoading, isError } = useGetCurrentResidencesQuery(authUser?.cognitoInfo.userId || "")
        if(isLoading) return <p>Loading...</p>
        if(isError) return <p>There was an error please try again later.</p>
      return (
        <div className='dashboard-container'>
            <Header title='Current Residences' subtitle='View and manage your current living spaces' />
        <div className='grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8'>
  
            {residences?.map((properties)=>(
                <div key={properties.id} className='w-full '>
                <Card 
                
                property={properties}
                isFavorite={
                                true
                            }
                            onFavoriteToggle={()=> {}}
                            showFavoriteButton = {false}
                            propertyLink={`/tenants/residences/${properties.id}`}
                            />
            </div>
                        ))}
        </div>
                        {(residences?.length === 0 ) && <p>There is no Favorite properties added.</p> }
                        </div>
      )
    }
    
    export default Residences
    