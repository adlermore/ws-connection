'use client'
import React, { useEffect, useState } from 'react'
import LoginPopup from '../(auth)/components/login/LoginPopup'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import PageLoader from '@/components/PageLoader';
import { fetchUserInfo } from '@/redux/authSlice';

function Login() {

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false)

  const fetchUserData = async () => {
    setLoading(true)
    dispatch(fetchUserInfo())
      .then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          router.push('fixing')
        } else {
          console.error("Error:", response.error.message);
        }
      })
      .catch((error) => {
        console.error("Unexpected Error:", error);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  }

  useEffect(() => {
    fetchUserData()
  }, [router])

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className='login_page'><LoginPopup /></div>
  )
}

export default Login