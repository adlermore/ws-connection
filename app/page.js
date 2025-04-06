"use client";

import PageLoader from "@/components/PageLoader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const lang = "en";

  useEffect(() => {
    if (user === undefined ||  !user?.role_id) router.replace("/login"); 
    if (user?.role_id) {      
      if (user.role_id !== 4) {
        const token = localStorage.getItem("token");
        if (token) {
          window.location.href = `https://newadmin.goldcenter.am?token=${token}&lang=${lang}`;
        }
      }
      else {
        router.replace("/fixing");
      }
    } else {
      router.replace("/login");
    }
  }, [router, user]);

  return <PageLoader />;
}
