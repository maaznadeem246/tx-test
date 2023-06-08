import { ReactNode } from "react"





const Container = ({children}:{children:ReactNode}) => {
    return (
        <div className="w-[85%] max-w-[1400px] mx-auto py-5">
            {children}
        </div>
    )
}


export default Container;