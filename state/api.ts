import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { Application, Lease, Manager, Payment, Property, Tenant } from "../app/types/prismaTypes";
import { cleanParams, createNewUserInDatabase, withToast } from "../lib/utils";
import { FiltersState } from ".";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async(headers) =>{
       const session = await fetchAuthSession()
        const {idToken} = session.tokens ?? {}
        if(idToken) headers.set("Authorization", `Bearer ${idToken}`)
        return headers
    }
  }),
  reducerPath: "api",
  tagTypes: ["Managers", "Tenants", "Properties", "PropertyDetail", "Application", "Leases", "Payments"],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async(_, _queryApi, _extraoptions, fetchWithBQ) =>{
        try{
          const session = await fetchAuthSession()
          const {idToken} = session.tokens ?? {}
          const user = await getCurrentUser()
          const userRole = idToken?.payload["custom:role"] as string  

          const endpoint = userRole === "manager" ? `/managers/${user.userId}` : `/tenants/${user.userId}`
          let userDetailResponse = await fetchWithBQ(endpoint)
          console.log("details", userDetailResponse)
          if(userDetailResponse.error?.status === 404) {
            console.log("golaa")
            userDetailResponse = await createNewUserInDatabase(user,idToken,userRole,fetchWithBQ)
          }
          return {
            data:{
              cognitoInfo:{...user},
              userInfo: userDetailResponse.data as Tenant | Manager,
              userRole
            }
          }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch (error: any){
            return{error: error.message || "Could not fetch any data"}
        }
      }
    }),
    updateTenantSettings:  build.mutation<Tenant,{cognitoId:string} & Partial<Tenant>>({
      query:({cognitoId, ...updateTenant})=>({
        url:`tenants/${cognitoId}`,
        method:'PUT',
        body:updateTenant
      }),
      invalidatesTags:(result) =>[{type:"Tenants",id:result?.id}] //like react query invalidate a tag to refetch, will do these to align the front end data with the backend data
    }),
    updateManagerSettings:  build.mutation<Manager,{cognitoId:string} & Partial<Manager>>({
      query:({cognitoId, ...updateManager})=>({
        url:`managers/${cognitoId}`,
        method:'PUT',
        body:updateManager
      }),
      invalidatesTags:(result) =>[{type:"Managers",id:result?.id}] //like react query invalidate a tag to refetch, will do these to align the front end data with the backend data
    }),
    getTenant: build.query<Tenant,string >({
      query:(cogitoId)=>`tenants/${cogitoId}`,
      providesTags: (result) => [{type:"Tenants", id:result?.id}]
    }),
    getProperty : build.query<Property, number>({
      query:(propertyId)=> `properties/${propertyId}`,
      providesTags: (result,error,id) => [{type:'PropertyDetail', id}]
    }),
    getCurrentResidences: build.query<Property[], string>({
      query:(cogintoId) =>`tenants/${cogintoId}/current-residences`,
            providesTags: (result) =>
        result ?
            [ 
              ...result.map(({id})=> ({type:'Properties' as const, id })),
              {type:"Properties", id: "LIST"}
            ] 
            :
            [{type: "Properties", id: "LIST"}]
    }) ,
    getProperties: build.query<Property[], Partial<FiltersState> & {favoritesId?: number[]} >({
      query:(filters: FiltersState)=>{
        const params = cleanParams({
          location:filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(','),
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoritesIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        })
        return {url: "properties", params}
      },
      providesTags: (result) =>
        result ?
            [ 
              ...result.map(({id})=> ({type:'Properties' as const, id })),
              {type:"Properties", id: "LIST"}
            ] 
            :
            [{type: "Properties", id: "LIST"}]
    }),
    addFavoriteProperty:  build.mutation<Tenant, {cognitoId:string;propertyId: number; }>({
      query:({cognitoId,propertyId})=>({
        url:`tenants/${cognitoId}/favorites/${propertyId}`,
        method:'POST'
      }),
      invalidatesTags:(result)=>[
        {type:'Tenants', id:result?.id},
        {type:'Properties', id:'LIST'}
      ]
    }),
    getManagerProperties: build.query<Property[], string>({
      query: (cognitoId)=> `managers/${cognitoId}/properties`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to load manager profile.",
        });
      },
    }),
    removeFavoriteProperty: build.mutation<Tenant, {cognitoId:string ; propertyId:number;}>({
      query:({cognitoId,propertyId})=>({
        url:`tenants/${cognitoId}/favorites/${propertyId}`,
        method:'DELETE'
      }),
      invalidatesTags:(result) =>[
          {type:'Tenants', id:result?.id},
          {type:'Properties', id:'LISTS'},
      ],
    }),
        // lease related enpoints
    getLeases: build.query<Lease[], number>({
      query: () => "leases",
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch leases.",
        });
      },
    }),

    getPropertyLeases: build.query<Lease[], number>({
      query: (propertyId) => `properties/${propertyId}/leases`,
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch property leases.",
        });
      },
    }),

    getPayments: build.query<Payment[], number>({
      query: (leaseId) => `leases/${leaseId}/payments`,
      providesTags: ["Payments"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch payment info.",
        });
      },
    }),
    getApplications: build.query<Application[], {userId?:string, userType?:string}>({
      query:(params) =>{
        const queryParams = new URLSearchParams()
        if(params.userId){
          queryParams.append("userId",params.userId)
        }
        if(params.userType){
          queryParams.append("userType", params.userType)
        }
        return `applications?${queryParams.toString()}`
      },
      providesTags:['Application'],
      async onQueryStarted(_, {queryFulfilled}){
        await withToast(queryFulfilled,{
          error: "Failed to fetch applications."
        })
      }
    })
    ,
    updateApplicationStatus: build.mutation<Application & {lease?:Lease}, {id:number; status:string}>({
      query: ({id,status})=>({
        url:`applications/${id}/status`,
        method:'PUT',
        body:{status}
      }),
      invalidatesTags:['Application', "Leases"],
      async onQueryStarted(_, {queryFulfilled}){
        await withToast(queryFulfilled,{
          success: 'Application created successfully!',
          error: "Failed to create applications."
        })
      }
    }),
    createApplication: build.mutation<Application, Partial<Application>>({
      query: (body)=> ({
        url:`applications`,
        method:'POST',
        body
      }),
      invalidatesTags:['Application'],
      async onQueryStarted(_, {queryFulfilled}){
        await withToast(queryFulfilled,{
          success: 'Application created successfully!',
          error: "Failed to create applications."
        })
      }
    }),
    createProperty: build.mutation<Property,FormData>({
      query:(newProperty) =>({
        url:`properties`,
        method: 'POST',
        body:  newProperty
      }),
      invalidatesTags:(result)=> [
        {type:'Properties', id:'LIST'},
        {type:'Managers', id:result?.manager?.id}
      ]
    }) 
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation, 
  useUpdateManagerSettingsMutation, 
  useGetPropertiesQuery, 
  useGetLeasesQuery,
  useGetPaymentsQuery,
  useGetPropertyLeasesQuery,
  useGetCurrentResidencesQuery,
  useGetManagerPropertiesQuery,
  useGetApplicationsQuery,
  useGetPropertyQuery, 
  useUpdateApplicationStatusMutation,
  useCreateApplicationMutation ,
  useAddFavoritePropertyMutation, 
  useRemoveFavoritePropertyMutation, 
  useCreatePropertyMutation,
  useGetTenantQuery } = api;
