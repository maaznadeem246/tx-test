import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/store';

const useAllowed = () => {
  const router = useRouter();
  const [isAllowed, isAllowedSetState] = useState(false);
  const { isAuthenticated, role, permissions, login, loading, user, error } = useAuthStore();
  const pathName = usePathname()
  

  useEffect(() => {
    if (!isAuthenticated) {
 
      router.replace('/login');
    } 
  }, [isAuthenticated, router]);

  let route1 = ['/users', '/subscriptions', '/merchants'];
  let routes2 = ['/questions', '/products', '/orders', '/staff', '/withdraws', '/reviews',]
  const allowedRoutes: Record<string, string[]> = {
   
  };

  const [allowedRoutesState ,setAllowedRoutes] =  useState<Record<string, string[]>>(
    {
      superAdmin: route1,
      storeOwner: [...routes2, ...route1],
      staff: [], 
    }
  )

  const notIncluded = ['/login']

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'superAdmin') {
   
        allowedRoutesState.superAdmin.forEach((route) => {
          router.prefetch(route);
        });
      } else if (role === 'storeOwner') {
     
        allowedRoutesState.storeOwner.forEach((route) => {
          router.prefetch(route);
        });
      } else if (role === 'staff') {
     
        console.log('here')
        console.log(permissions)
        permissions.forEach((permission) => {
            if(routes2.includes(permission)){
              console.log('here2')
              console.log(permission)
              let alr:string[] = []
              alr.push(permission);
              setAllowedRoutes((prev) => ({...prev, staff:alr}))
              console.log(role)
                router.prefetch(permission);
            }

        });
      }
    }
    if (!isAuthenticated) {
        router.replace('/login')
    }
  }, [isAuthenticated, role, permissions, router,]);


  useEffect(() => {
  
    if(isAuthenticated) {
        const currentRoute = pathName;
        const isAllowed =
          ( (allowedRoutesState.superAdmin.includes(currentRoute) && role == 'superAdmin') ||
          (allowedRoutesState.storeOwner.includes(currentRoute) && role == 'storeOwner')  ||
          (allowedRoutesState.staff.includes(currentRoute) && role == 'staff') )   || (notIncluded.includes(currentRoute)) || currentRoute == '/';
      
          isAllowedSetState(isAllowed)

        if (!isAllowed) {
        
          router.replace(`/unauthorized`)
        }
    }

  }, [allowedRoutesState,isAuthenticated]);





  return {isAllowed,allowedRoutes: role && allowedRoutesState[role], role:role};
    };

export default useAllowed;