import LoginPopup from '../(auth)/components/login/LoginPopup'
import fixingLogo from '@/public/images/fixing_logo.png'
import Image from 'next/image';

function Login() {
  return (
    <>
      <div className='fixing_log mx-auto flex justify-center mb-[40px]'>
        <Image
          width={228}
          height={51}
          src={fixingLogo}
          unoptimized={true}
          alt="Fixing Logo"
          priority={true}
        />
      </div>
      <div className='login_page'>
        <LoginPopup />
      </div>
      <input type="date" />
      <input type="time" />
      <input type="datetime-local" />
    </>

  )
}

export default Login