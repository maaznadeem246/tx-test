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
    superAdmin: route1,
    storeOwner: [...routes2, ...route1],
    staff: [], 
  };

  // const [allowedRoutesState ,setAllowedRoutes] =  useState<Record<string, string[]>>(
  //   {
  //     superAdmin: route1,
  //     storeOwner: [...routes2, ...route1],
  //     staff: [], 
  //   }
  // )

  const notIncluded = ['/login']

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'superAdmin') {
   
        allowedRoutes.superAdmin.forEach((route) => {
          router.prefetch(route);
        });
      } else if (role === 'storeOwner') {
     
        allowedRoutes.storeOwner.forEach((route) => {
          router.prefetch(route);
        });
      } else if (role === 'staff') {
     
        console.log('here')
        console.log(permissions)
        permissions.forEach((permission) => {
            if(routes2.includes(permission)){
              console.log('here2')
              console.log(permission)
              // let alr:string[] = [...allowedRoutesState.staff]
              // alr.push(permission);
              // setAllowedRoutes((prev) => ({...prev, staff:alr}))
              allowedRoutes.staff.push(permission)
              console.log(allowedRoutes)
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
        console.log(allowedRoutes)
        console.log( (allowedRoutes.staff.includes(currentRoute) && role == 'staff'))
        const isAllowed =
          ( (allowedRoutes.superAdmin.includes(currentRoute) && role == 'superAdmin') ||
          (allowedRoutes.storeOwner.includes(currentRoute) && role == 'storeOwner')  ||
          (allowedRoutes.staff.includes(currentRoute) && role == 'staff') )   || (notIncluded.includes(currentRoute)) || currentRoute == '/';
        console.log(isAllowed)
          isAllowedSetState(isAllowed)

        if (!isAllowed) {
        
          router.replace(`/unauthorized`)
        }
    }

  }, [allowedRoutes.staff.length,isAuthenticated]);





  return {isAllowed,allowedRoutes: role && allowedRoutes[role], role:role};
    };

export default useAllowed;