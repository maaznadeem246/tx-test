"use client"

import useAllowed from "@/hooks/useAllowed"
import { useAuthStore } from "@/store"
import { usePathname, useRouter } from "next/navigation"
import React, { ReactNode, useEffect } from "react"





const Auth = ({children}:{children:ReactNode}) => {


    // const isAuthenticated = useAuthStore((state) => state.isAuthenticated)



    const {isAllowed} = useAllowed();


        return (
            <>
                {
                  isAllowed ?  
                    <>
                        {children}
                    </>
                  : <div></div>
                }
            </>
        )
   

}

export default Auth