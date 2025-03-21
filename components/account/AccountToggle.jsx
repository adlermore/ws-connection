"use client";

import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "@/redux/authSlice";
import IconUser from "@/public/icons/IconUser";
import useOnClickOutside from "@/utils/hooks/useOnClickOutside";
import Link from "next/link";
import { resetWishlist } from "@/redux/wishlistSlice";
import Cookies from "js-cookie";


function AccountToggle() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [dropActive, setDropActive] = useState(false);
  const accountRef = useRef();
  const dispatch = useDispatch();
  
  const detectScrollBarWidth = () => {
    const documentWidth = document.documentElement.clientWidth;
    const windowWidth = window.innerWidth;
    const scrollBarWidth = windowWidth - documentWidth;
    return scrollBarWidth;
  };

  //Login Popup Open
  const loginPopupOpen = (e) => {
    e.preventDefault();
    const scrollBarWidth = detectScrollBarWidth();
    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    document.body.classList.add("login_opened");
    const fixedElements = document.querySelectorAll(".fixed-element");
    fixedElements.forEach((el) => {
      el.style.paddingRight = `${scrollBarWidth}px`;
    });

    setDropActive(false);
  };

  //Registr Popup Open
  const registerPopupOpen = (e) => {
    e.preventDefault();
    const scrollBarWidth = detectScrollBarWidth();
    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    document.body.classList.add("register_opened");
    const fixedElements = document.querySelectorAll(".fixed-element");
    fixedElements.forEach((el) => {
      el.style.paddingRight = `${scrollBarWidth}px`;
    });

    setDropActive(false);
  };

  // Handle logout
  const handleLogout = () => {
    setDropActive(false);
    setTimeout(() => {
      dispatch(setAuthenticated(false));
      dispatch(resetWishlist());
      localStorage.removeItem("token");
      Cookies.remove("token");
      window.location.reload();
    }, 300);
  };

  const dropToggle = () => {
    setDropActive(!dropActive);
  };

  useOnClickOutside(accountRef, () => {
    if (dropActive) {
      setDropActive(false);
    }
  });

  return (
    <div className="account_toggle flex justify-center items-center ">
      <div
        className={`${dropActive && "drop_opened"} account_drop`}
        ref={accountRef}
      >
        <div className="drop_btn cursor-pointer" onClick={dropToggle}>
          <div className="flex relative duration-300 cursor-pointer hover:opacity-70">
            <IconUser className="text-white [&>path]:fill-white" />
          </div>
        </div>
        <div className="account_drop">
          {isAuth ? (
            <div className="drop_ist" onClick={(e) => e.stopPropagation()}>
              <div className="drop_inner">
                <div className="border-[#D3BA87] border-b-2 pb-[5px] borderSilver">{`Hi ${user?.firstname || "User"
                  }`}</div>
                <Link href='/account/userInfo' className="mt-[10px]"> My Account</Link>
                <div
                  className="p-[5px] mt-[10px]  duration-300 cursor-pointer hover:opacity-50"
                  onClick={handleLogout}
                >
                  {" "}
                  Logout{" "}
                </div>
              </div>
            </div>
          ) : (
            <div className="drop_ist">
              <div className="drop_inner">
                <div className="border-[#D3BA87] border-b-2 pb-[5px] borderSilver">
                  My Account
                </div>
                <a
                  href="/"
                  className=" mt-[10px] whitespace-nowrap"
                  onClick={(e) => registerPopupOpen(e)}
                >
                  Create Account
                </a>
                <a
                  href="/"
                  className="mt-[10px]"
                  onClick={(e) => loginPopupOpen(e)}
                >
                  Sign In
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountToggle;
