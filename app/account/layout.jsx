'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';
import "@/styles/account.scss";
import IconUser from '@/public/icons/IconUser';
import IconHeart from '@/public/icons/IconHeart';
import IconProductCard from '@/public/icons/IconProductCard';
import IconNotifi from '@/public/icons/IconNotifi';
import IconGroup from '@/public/icons/IconGroup';
import IconLogOut from '@/public/icons/IconLogOut';
import { setAuthenticated } from '@/redux/authSlice';
import PageLoader from '@/components/PageLoader';
import request from '@/utils/hooks/request';
import { JsonContext } from '@/context/jsonContext';
import Cookies from 'js-cookie';

export default function AccountLayout({ children }) {

  const pathname = usePathname();
  const router = useRouter();
  const isAuth = useSelector((state) => state.auth.isAuthenticated); 
  const [isAuthChecked, setIsAuthChecked] = useState(false); 
  const [activePage, setActivePage] = useState(''); 
  const [pageName , setPageName] = useState('');
  const dispatch = useDispatch();

  const { silverMode } = useContext(JsonContext);

  const [productResponse , setProductResponse] = useState(null);


  useEffect(() => {
    if (typeof isAuth !== 'undefined') {
      setIsAuthChecked(true);
    }
  }, [isAuth , activePage]);

  
  useEffect(() => {
    const path = router.asPath;
    setActivePage(path);
    setPageName(getPageName(pathname));
  }, [pathname]); 


  useEffect(()=>{
    request(`${process.env.NEXT_PUBLIC_DATA_API}/catalog/top/${silverMode ? 'silver' : 'gold' }`)
    .then((data) => {
      setProductResponse(data);
    })
  },[silverMode])

  const getPageName = (path) => {
    switch (path) {
      case '/account/userInfo':
        return 'User Info';
      case '/account/wishList':
        return 'Liked';
      case '/account/myCart':
        return 'My Cart';
      case '/account/notifications':
        return 'Notifications';
      case '/account/personalList':
        return 'Personal Occasions';
      default:
        return '';
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(setAuthenticated(false));
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.push('/');
  };

  if(!productResponse){
    return <PageLoader />
  }

  return (
    <div className='mt-[100px] account_section '>
      <div className="custom_container !py-[90px] laptop:!py-[60px]">
        <div className="active-page text-black text-[25px] uppercase">{pageName}</div>
        <div className='account_line mb-[40px]'>
          <nav>
            <ul>
              <li>
                <Link href="/account/userInfo" className={pathname === '/account/userInfo' ? 'active-link' : ''}>
                 <IconUser /> User Info
                </Link>
              </li>
              <li>
                <Link href="/account/wishList" className={pathname === '/account/wishList' ? 'active-link' : ''}>
                 <IconHeart /> Favorites 
                </Link>
              </li>
              <li>
                <Link href="/account/myCart" className={pathname === '/account/myCart' ? 'active-link' : ''}>
                  <IconProductCard /> My Cart
                </Link>
              </li>
              <li>
                <Link href="/account/notifications" className={pathname === '/account/notifications' ? 'active-link' : ''}>
                 <IconNotifi /> Messages 
                </Link>
              </li>
              <li>
                <Link href="/account/personalList" className={pathname === '/account/personalList' ? 'active-link' : ''}>
                 <IconGroup />  Pursonal occasions
                </Link>
              </li>
              <li className='log_out'>
                <a  href="/"    onClick={(e) =>handleLogout(e)}>
                 <IconLogOut /> Log Out
                </a>
              </li>
            </ul>
          </nav>
          <main className='inner_wrapper w-full pr-[30px] tablet:pr-[10px]'>{children}</main>
        </div>
        {/* <ProductSlider sliderContent={productResponse.best_sales} title='You may also like' /> */}
      </div>
    </div>
  );
}

