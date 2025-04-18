"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/loginSchema";
import { login } from "@/redux/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/PageLoader";

function LoginPopup() {
  const ref = useRef();
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { status } = useSelector((state) => state.auth);
  const lang = "en";

  //validation init
  const {
    register: loginForm,
    reset,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsLogin },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  //sumbition Data
  const loginSubmit = async (dataForm) => {
    dispatch(login(dataForm)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const roleId = res.payload?.role_id;
        if (roleId !== 4) {
          const token = localStorage.getItem("token");
          if (token) {
            window.location.href = `https://newadmin.goldcenter.am?token=${token}&lang=${lang}`;
          }
        }
        else if (roleId) {
          setLoading(true)
          router.replace("/fixing");
        }
      }
    });
    reset();
  };

  useEffect(() => {
    return () => {
      setLoading(false)
    };
  }, [])

  const passToggle = () => {
    setShowPass(!showPass);
  };

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="login_popup fixed  fixed-element left-0  top-0 right-0 bottom-0 flex items-center justify-center transition-[top]  pointer-events-none opacity-0 w-full h-full z-[9999] overflow-x-hidden  bg-black bg-opacity-20 tablet:!p-20 tablet:h-[100dvh]">
      <div
        className="popup_container mobile:h-fit mobile:overflow-x-hidden bg-[#F8F6F5] relative pt-40 px-[60px] pb-[25px] w-full max-w-[550px] z-30 mx-auto mobile:p-[20px]"
        ref={ref}
      >
        <div className="title_line  w-full gap-10">
          <div className="popup_title text-[24px] uppercase mobile:text-xl ">Մուտք</div>
          <div className="mt-[25px] text-[16px] mobile:mt-15 mobile:text-sm">
            Մուտք գործեք ձեր հաշիվ ,որպեսզի կարողանաք օգտվել բոլոր հնարավորություններից
          </div>
          {status === "failed" && (
            <div className="text-siteRed text-center">
              Սխալ մուտքագրված էլ. փոստ կամ գաղտնաբառ
            </div>
          )}
        </div>
        <div className="login_form mt-[25px]">
          <form onSubmit={handleSubmitForm(loginSubmit)} className="w-full">
            <div
              className={
                errorsLogin?.email ? "form_block has_error" : "form_block"
              }
            >
              <div className="loginForm_label text-light mb-[5px]">Էլ․ փոստ</div>
              <input
                placeholder="Enter your email address"
                autoComplete="on"
                className="form-control"
                name="email"
                {...loginForm("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
              />
              <p className="form_error text-xs absolute right-0 text-siteRed font-semibold duration-300 opacity-0">
                {errorsLogin?.email?.message}
              </p>
            </div>
            <div
              className={
                errorsLogin?.password ? "form_block has_error" : "form_block"
              }
            >
              <div className="loginForm_label text-base font-light mb-[5px]">
                Գաղտնաբառ
              </div>
              <input
                placeholder="Enter password"
                autoComplete="on"
                className="form-control"
                name="password"
                type={showPass ? "text " : "password"}
                {...loginForm("password", { required: true, minLength: 5 })}
              />
              <p className="form_error text-xs absolute right-0 text-siteRed font-semibold duration-300 opacity-0">
                {errorsLogin?.password?.message}
              </p>
            </div>
            <div className="checkbox_line mt-[20px]">
              <label htmlFor="checkbox1">
                <input type="checkbox" id="checkbox1" onChange={passToggle} />
                <span className="square_block"></span>
                <span className="check_label">Տեսնել գաղտնաբառը</span>
              </label>
            </div>
            <div className="checkbox_line mt-[5px] mb-[20px]">
              <label htmlFor="checkbox2">
                <input type="checkbox" id="checkbox2" />
                <span className="square_block"></span>
                <span className="check_label ">Պահպանել</span>
              </label>
            </div>
            <button
              type="submit"
              className={`${status === "loading" ? 'pointer-events-none' : ''}  relative submit_btn h-[40px] w-full bg-siteCrem text-base font-semibold text-white duration-300 hover:opacity-70 mx-auto justify-center flex items-center`}
            >
              {status === "loading" ? <span className="loader_spinner"></span> : " Մուտք գործել"}
            </button>
            <div className="mt-[20px] pointer-events-none flex mobile:text-sm items-center justify-center gap-[20px]">Չունեք Հաշիվ՞ <Link href="/register" className="font-bold">Գրանցվել Հիմա</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPopup;
