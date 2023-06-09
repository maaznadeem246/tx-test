import { ReactNode } from "react"





const Heading = ({children}:{children:ReactNode}) => {
    return (
        <div className="text-xl font-bold text-center capitalize">
            {children}
        </div>
    )
}


export default Heading;