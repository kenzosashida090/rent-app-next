import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { Manager, Tenant } from "../app/types/prismaTypes";

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
  tagTypes: [],
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
          return {
            data:{
              cognitoInfo:{...user},
              userInfo: userDetailResponse.data as Tenant | Manager,
              userRole
            }
          }

        }catch (error: any){
            return{error: error.message || "Could not fetch any data"}
        }
      }
    })
  }),
});

export const {} = api;
