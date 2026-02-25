import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to home if user is already logged in
    if (user) {
      setLocation("/");
      return;
    }

    // Get token from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    setToken(tokenParam);
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with logo */}
      <header className="container mx-auto py-6">
        <Link href="/">
          <h1 className="text-2xl font-bold text-purple-500 tracking-wider cursor-pointer">
            DarkNotes
          </h1>
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 container mx-auto flex flex-col lg:flex-row justify-center items-center py-10 px-4 md:px-6">
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-[#121212] border-[#2D2D2D] shadow-xl">
            <CardContent className="pt-6">
              <ResetPasswordForm token={token || ""} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2D2D2D] py-6">
        <div className="container mx-auto text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} DarkNotes. All rights reserved.
        </div>
      </footer>
    </div>
  );
}