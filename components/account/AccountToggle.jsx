"use client";

import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "@/redux/authSlice";
import IconUser from "@/public/icons/IconUser";
import useOnClickOutside from "@/utils/hooks/useOnClickOutside";
import Link from "next/link";
import Cookies from "js-cookie";

function AccountToggle() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [dropActive, setDropActive] = useState(false);
  const accountRef = useRef();
  const dispatch = useDispatch();

  // Handle logout
  const handleLogout = () => {
    setDropActive(false);
    setTimeout(() => {
      dispatch(setAuthenticated(false));
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
                <div className="border-[#D3BA87] border-b-2 pb-[5px] borderSilver">{`Բարև ${user?.firstname || "User"
                  }`}</div>
                {/* <Link href='/account/userInfo' className="mt-[10px]"> My Account</Link> */}
                <div
                  className="p-[5px] mt-[10px]  duration-300 cursor-pointer hover:opacity-50"
                  onClick={handleLogout}
                >
                  {" "}
                  Դուրս Գալ{" "}
                </div>
              </div>
            </div>
          ) : (
            <div className="drop_ist">
              <div className="drop_inner">
                <div className="border-[#D3BA87] border-b-2 pb-[5px] borderSilver">
                  Account
                </div>
                <a
                  href="/register"
                  className=" mt-[10px] whitespace-nowrap"
                >
                  Create Account
                </a>
                <a
                  href="/login"
                  className="mt-[10px]"
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
