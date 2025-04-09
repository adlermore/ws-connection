'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Twirl as Hamburger } from "hamburger-react";
import mainLogo from '@/public/images/newLogo.png'
import AccountToggle from '../account/AccountToggle'
import LgToggle from '../lgToggle/LgToggle'
import { useDispatch, useSelector } from 'react-redux'
import { initializeAuth } from '@/redux/authSlice'
import PriceToggle from '../priceToggle/PriceToggle'
import SearchToggle from '../search/SearchToggle'
import Image from 'next/image'
import HeaderMenu from '../menu/HeaderMenu'

function Header() {

  const dispatch = useDispatch();
  const pathname = usePathname();

  const [isOpen, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (document.body.classList.contains('menu_opened')) {
      setOpen(false)
    }
    if (window.scrollY > 10) {
      setIsScrolled(true);
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add('menu_opened');
    } else {
      document.body.classList.remove('menu_opened');
      document.body.style.overflow = "visible";
    }

    dispatch(initializeAuth());

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else if (pathname == '/') {
        setIsScrolled(false);
      }
    };

    if (pathname !== '/' || window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, [isOpen, pathname, dispatch]);


  return (
    <header className={`fixed fixed-element duration-500 transition-colors bg-[#0C1B20] top-0 h-[85px] tablet::h-[70px] left-0 right-0 z-[9999] laptop:bg-[#0C1B20]`}>
      <div className='cover_container header_inner h-full justify-between flex items-center  gap-20 '  >
        <Link href='/' className='z-20 mobile:mx-auto'>
          <Image
            width={350}
            height={80}
            src={mainLogo}
            alt="Ricardo portrait"
            priority={true}
          />
        </Link>
        <div className={isOpen ? 'menu-open laptop:fixed  z-20 ml-auto  laptop:z-0 laptop:w-full laptop:ml-0   laptop:h-full laptop:bottom-0  laptop:right-0  duration-[0.7s] mobile:duration-[0.5s]  ' : ' mobile:duration-[0.5s] duration-[0.7s] laptop:right-0 laptop:fixed  z-20 ml-auto  laptop:z-0 laptop:w-0 laptop:ml-0   laptop:h-full laptop:bottom-0  '}>
          <div className='ml-auto header_wrapp laptop:w-full  w-full laptop:m-0 laptop:flex laptop:justify-end laptop:z-[-1] tablet:w-[calc(100vw)] laptop:left-0 laptop:h-full z-20 laptop:bg-blueDark1 laptop:bg-opacity-35   tablet:bg-white mobile:bg-transparent tablet:text-black laptop:top-[86px] tablet:top-[100px] relative  '>
            {/* <HeaderMenu isScrolled={isScrolled} /> */}
          </div>
        </div>
        <div className='flex items-center ml-auto gap-[20px]  action_block'>
          <div className='tablet:hidden'><SearchToggle /> </div>
          <AccountToggle />
          <LgToggle />
          <PriceToggle />
        </div>
        {/* <div className="hidden z-20 laptop:flex  items-center justify-center relative before:absolute before:w-40 before:bg-blueDark1 before:h-40 mobile:right-[-5px]">
          <Hamburger
            toggled={isOpen}
            toggle={setOpen}
            size={22}
            color="#fff"
          />
        </div> */}
      </div>
    </header>
  )
}

export default Header