"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PNBRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/tools/bank-statement"); }, [router]);
  return null;
}
