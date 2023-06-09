"use client"
import Container from '@/components/container'
import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'
import { BaseSyntheticEvent, FormEvent, useEffect, } from 'react'

export default function Login() {

    const {login,loading, error,user, isAuthenticated} = useAuthStore()

    const router = useRouter();
    // const handleLogin = (data:{email:string,password:string}) => {

    // }

      useEffect(() => {
    console.log('herer1')
    console.log(loading && user != null && isAuthenticated)
    if(!loading && user != null && isAuthenticated){
        router.push('/')
    }
  },[loading,error,user, isAuthenticated])

    const handleSubmit = async (e: BaseSyntheticEvent<HTMLFormElement> | FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(e)
        const email = e.target[0].value;
        const password = e.target[1].value;


        await login(email,password)
      
        
    }

  return (
        <div className='w-full max-w-[500px] p-2  flex justify-center'>
        <form className='w-[80%] mx-auto space-y-5' onSubmit={ (e)  => handleSubmit(e)}>
            <div>
                <label className='block py-2'>Email</label>
                <input type='email' name='email' id="login-email" required className='border-2 rounded-md p-3 w-full'  />
            </div>
            <div>
                <label className='block py-2'>Password</label>
                <input type='password' name='password' id="login-password" required className='border-2 rounded-md p-3 w-full'  />
            </div>
            <button className='bg-primary text-white px-4 py-2 rounded-md' type='submit'>
                Login
            </button>
        </form>
        </div>
  )
}
