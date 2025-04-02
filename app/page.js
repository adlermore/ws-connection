"use client";

import PageLoader from "@/components/PageLoader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  
  useEffect(() => {
    if(user){
      router.replace("/fixing"); 
    }else{
      router.replace("/login"); 
    }
  }, [router, user]);

  return <PageLoader />;
}
