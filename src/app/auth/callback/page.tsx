"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        router.push("/login");
        return;
      }

      if (data.session) {
        toast.success("Successfully signed in!");
        router.push("/dashboard");
      } else {
        const { data: retryData } = await supabase.auth.getUser();
        if (retryData.user) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-alt">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl mx-auto">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <h1 className="text-2xl font-black text-navy-dark tracking-tight italic">
          Completing Sign In...
        </h1>
        <p className="text-slate-500 font-medium">
          Verifying your credentials with Supabase.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-alt">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
