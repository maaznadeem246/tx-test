"use client"

import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store"
import Link from "next/link"
import { useEffect, useState } from "react"




const AuthActions = () => {
    const isAuthenticate = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore(state => state.user)
    const role = useAuthStore(state => state.role)
    const [authState,setAuthState] = useState(false)
    const logout = useAuthStore((state) => state.logout)
    console.log(isAuthenticate)

    useEffect(() => {
        setAuthState(isAuthenticate)
    },[isAuthenticate])
    return (
        <div className="flex gap-2">
        
           { !authState && <Link href="/login" className={cn("text-lg outline-none")} >
                Login
            </Link>
            }

            { authState && <div className="text-white text-lg">{user?.name} {role}</div>
            }
      
           { authState && <button type="button" className={cn("text-lg outline-none")} onClick={logout}>
                Logout
            </button>   
            }
        
        </div>
    )
}

export default AuthActions;