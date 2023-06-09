// import { Inter } from 'next/font/google'

import Auth from "@/components/auth"

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
  dashboard1,
  dashboard2,
}: {
  children: React.ReactNode,
  dashboard1:React.ReactNode,
  dashboard2:React.ReactNode,
}) {
  return (
    <>
      {/* {children} */}
      
       {/* {dashboard2} */}
      <Auth>
          {children}
          {/* {dashboard1}
       
          {dashboard2} */}
    
      </Auth>
    </>
  )
}
