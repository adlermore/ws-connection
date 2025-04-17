'use client'
import LoginPopup from '../(auth)/components/login/LoginPopup'
import fixingLogo from '@/public/images/fixing_logo.png'
import Image from 'next/image';

function Login() {
  return (
    <>
      <div className='fixing_log mx-auto flex justify-center mb-[40px] mobile:mb-[20px]'>
        <Image
          width={300}
          height={65}
          src={fixingLogo}
          unoptimized={true}
          alt="Fixing Logo"
          priority={true}
        />
      </div>
      <div className='login_page'>
        <LoginPopup />
      </div>
    </>
  )
}

export default Login