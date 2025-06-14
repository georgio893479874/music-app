"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      document.cookie = `authToken=${token}; path=/`;
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [token, router]);

  return <p>Logging in...</p>;
}
