import Heading from '@/components/heading'
import Image from 'next/image'

export default function Unauthorized() {
  return (
    <main className="flex  flex-col items-center justify-between">
         <Heading>
                 You are not authorized, Contact your Admin
         </Heading> 
    </main>
  )
}
