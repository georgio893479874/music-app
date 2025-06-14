"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthSuccessContent />
    </Suspense>
  );
}

function OAuthSuccessContent() {
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
