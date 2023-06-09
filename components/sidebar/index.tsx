"use client"
import useAllowed from "@/hooks/useAllowed";
import Link from "next/link"
import { useEffect, useState } from "react";









const SideBar = () => {
    const {allowedRoutes, role} = useAllowed();
    const [alroute, setAlRoute] = useState<string[]>([])
    useEffect(()=>{
        console.log(allowedRoutes)
        if(allowedRoutes){
            setAlRoute(allowedRoutes)
        }

    },[allowedRoutes?.length])
    return (
        <div className="w-full max-w-[400px] bg-primary rounded-md h-full p-5">
            {
               alroute &&  alroute.map((d) => (
                    <Link href={d} className="text-md py-2 text-white block capitalize">
                        {d.slice(1)}
                    </Link>    
                ))
            }
        </div>
    )
}

export default SideBar;