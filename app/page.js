"use client";

import PageLoader from "@/components/PageLoader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/fixing"); 
  }, [router]);

  return <PageLoader />;
}
