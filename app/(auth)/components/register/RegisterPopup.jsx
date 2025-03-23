'use client';

import React, {useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validation/registerSchema";
import { register } from '@/redux/authSlice';
import InputMask from "react-input-mask";
import Link from 'next/link';


function RegisterPopup() {

  const ref = useRef();
  const dispatch = useDispatch();

  const { status } = useSelector((state) => state.auth);

  //validation init
  const { register: registerForm, reset, handleSubmit: handleSubmitForm, formState: { errors: errorsRegister } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  //sumbition Data
  const registerSubmit = async (dataForm) => {

    const newData = {
      first_name: dataForm.name.split(" ")[0],
      last_name: dataForm.name.split(" ")[1] || '',
      password: dataForm.password,
      confirm_password: dataForm.password_confirmation,
      country: "armenia",
      email: dataForm.email,
      phone_number: dataForm.phone,
      role: "buyer"
    }

    dispatch(register(newData));
    reset()
  };

  return (
    <div className="register_popup fixed left-0 right-0 bottom-0 pointer-events-none flex items-center justify-center  transition-[top] top-0 opacity-0 w-full h-full z-[9999] overflow-x-hidden overflow-y-auto bg-black bg-opacity-20 tablet:!p-20 tablet:h-[100dvh]">
      <div className="popup_container mobile:h-fit mobile:overflow-x-hidden mobile:overflow-y-auto bg-[#F8F6F5] relative px-[60px] pt-[40px] pb-[30px] w-full max-w-[550px] z-30 mx-auto mobile:p-[30px]" ref={ref}>
        <div className="title_line w-full gap-10">
          <div className="popup_title text-[25px] uppercase mobile:text-xl">Create account</div>
          <div className='mt-[20px] text-[16px] mobile:text-sm mobile:mt-15'>Create free accoutn and save your time when making purchases</div>
        </div>
        <div className="register_form mt-[30px]">
          <form onSubmit={handleSubmitForm(registerSubmit)} className="w-full">
            <div className={errorsRegister?.name ? "form_block has_error" : "form_block"}>
              <div className="registerForm_label text-base font-light mb-[10px]">
                Full Name
              </div>
              <input
                placeholder="Enter full name"
                autoComplete="on"
                className="form-control"
                name="name"
                {...registerForm("name", { required: true, minLength: 5 })}
              />
              <p className="form_error text-xs absolute right-0 text-siteRed font-semibold duration-300 opacity-0">
                {errorsRegister?.name?.message}
              </p>
            </div>
            <div className='grid grid-cols-2 gap-[30px] mobile:grid-cols-1 mobile:gap-0'>
              <div className={errorsRegister?.email ? "form_block has_error" : "form_block"}  >
                <div className="registerForm_label text-base font-light mb-[5px]">
                  Email
                </div>
                <input
                  placeholder="Enter your email address"
                  autoComplete="on"
                  className="form-control"
                  name="email"
                  {...registerForm("email", {
                    required: true,
                    pattern: /^\S+@\S+$/i,
                  })}
                />
                <p className="form_error form_error text-xs absolute right-0 text-siteRed font-semibold duration-300 opacity-0">
                  {errorsRegister?.email?.message}
                </p>
              </div>
              <div
                className={errorsRegister.phone ? "form_block has_error" : "form_block"}
              >
                <div className="quoteForm_label text-base font-light mb-[5px]">
                  Phone
                </div>
                <InputMask
                  {...registerForm("phone", { required: true })}
                  mask="(999)-999-999"
                  placeholder="Enter phone"
                  type="tel"
                  autoComplete="on"
                  className="form-control"
                  defaultValue={''}
                />
                <p className="form_error text-xs absolute right-0 text-siteRed font-semibold duration-300 opacity-0">
                  {errorsRegister?.phone?.message}
                </p>
              </div>
            </div>
            <div className={errorsRegister?.password ? "form_block has_error" : "form_block"}>
              <div className="registerForm_label text-base font-light mb-[5px]">
                Password
              </div>
              <input
                placeholder="Enter password"
                autoComplete="on"
                className="form-control"
                name="password"
                type="password"
                {...registerForm("password", { required: true, minLength: 5 })}
              />
              <p className="form_error text-xs absolute right-0 text-siteRed font-semibold duration-300 opacity-0">
                {errorsRegister?.password?.message}
              </p>
            </div>
            <div className={errorsRegister?.password_confirmation ? "form_block has_error" : "form_block"}>
              <div className="registerForm_label text-base font-light mb-[5px]">
                Confirm Password
              </div>
              <input
                placeholder="Confirm your password"
                autoComplete="on"
                className="form-control"
                name="password_confirmation"
                type="password"
                {...registerForm("password_confirmation", { required: true, minLength: 5 })}
              />
              <p className="form_error text-xs absolute right-0 text-siteRed font-semibold duration-300 opacity-0">
                {errorsRegister?.password_confirmation?.message}
              </p>
            </div>
            <button
              type="submit"
              className={`${status === "loading" ? 'pointer-events-none' : ''} mt-[35px] relative [&>svg]:opacity-0 submit_btn h-[40px] w-full bg-siteCrem text-base font-semibold text-white duration-300 hover:opacity-70 mx-auto justify-center flex items-center`}
            >
              {status === "loading" ? <span className="loader_spinner"></span> : " Login"}
            </button>
            <div className="mt-[20px] flex items-center justify-center gap-[10px]">Already have an account,<Link href="/login" className='font-bold'>log In</Link></div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPopup;