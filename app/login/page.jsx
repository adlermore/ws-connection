'use client'
import React, { useEffect } from 'react'
import LoginPopup from '../(auth)/components/login/LoginPopup'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux';

function Login() {

  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      router.push('fixing')
    }
  }, [router, user])

  return (
    <div className='login_page'><LoginPopup /></div>
  )
}

export default Login