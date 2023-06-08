import { ReactNode } from "react"





const Heading = ({children}:{children:ReactNode}) => {
    return (
        <div className="text-xl font-bold">
            {children}
        </div>
    )
}


export default Heading;