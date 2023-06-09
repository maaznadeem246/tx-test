import { ReactNode } from "react"
import SideBar from "../sidebar"




const LayoutContainer = ({children}:{children:ReactNode}) => {
    return (
        <div className="flex flex-nowrap justify-between">
        <div className="w-[30%]">
          <SideBar />
        </div>
        <div className="w-[70%] p-4">
          {children}
        </div>
        
      </div>
    )
}

export default LayoutContainer