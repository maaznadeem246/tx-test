import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { ReactNode } from "react"





const Container = ({children,className}:{children:ReactNode,className?:ClassValue}) => {
    return (
        <div className={cn("w-[85%] max-w-[1400px] mx-auto py-5",className)}>
            {children}
        </div>
    )
}


export default Container;