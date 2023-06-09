"use client"
import useAllowed from "@/hooks/useAllowed";
import Link from "next/link"









const SideBar = () => {
    const {allowedRoutes, role} = useAllowed();
    console.log(role)
    return (
        <div className="w-full max-w-[400px] bg-primary rounded-md h-full p-5">
            {
               allowedRoutes && allowedRoutes.map((d) => (
                    <Link href={d} className="text-md py-2 text-white block capitalize">
                        {d.slice(1)}
                    </Link>    
                ))
            }
        </div>
    )
}

export default SideBar;