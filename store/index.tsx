



import axios from 'axios';
import { create } from 'zustand'
import {persist} from "zustand/middleware"

type rolesType = 'superAdmin' | 'staff' | 'storeOwner'

interface usersType{
  email:string,
  password:string,
  role:rolesType,
  permissions?:string[],
}


const users:usersType[] = [
  {email: "usama.irfan9791@gmail.com", password: "Test@1234", role:'superAdmin'},
  {email: "Store_owner1@gmail.com", password: "Store_owner1@gmail.com", role:'storeOwner'},
  {email: "Staff-11@gmail.com", password: "Staff-11@gmail.com",role:"staff",permissions:['/products']},
  {email: "Staff-22@gmail.com", password: "Staff-22@gmail.com",role:"staff",permissions:['/orders']}
]

interface authSateType {
  isAuthenticated:boolean,
    token:string | null,
    role: rolesType | null,
    permissions:string[]
    user:{
        name:string,
        email:string,
    }  | null,
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading:boolean,
    error:string | null,
}

export  const useAuthStore = create<authSateType>()(

  persist( (set) => ({
        isAuthenticated: false,
        token:null,
        user:null,
        role: null,
        permissions: [],
        loading:false,
        error:null,
        login: async (email, password) => {
          try {
            set({loading:true, });
            // const response = await axios.post('https://api.zues.ae', {
            //   email,
            //   password,
            // });
            // const { token, role, permissions } = response.data;
            let us = users.filter((usr) => usr.email == email && usr.password == password)
            if(us.length > 0){
              let userD = us[0]
              setTimeout(() => {
                set({ isAuthenticated: true, role:userD.role, permissions:userD?.permissions || [], user:{name:(userD.email).slice(0,7),email:userD.email}, loading:false,});
            },2000)
            }

          
          } catch (error) {
            console.error('Login error:', error);
          }
        },
      
        logout: () => {
          set({ isAuthenticated: false, role: null, user:null, permissions: [] });
        },
      }),
      {
        name:"auth-store"
      }
  )
  )






