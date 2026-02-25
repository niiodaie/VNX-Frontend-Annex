import * as z from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

// Define form validation schema
const formSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    // Validate token (optional, we'll handle invalid tokens in the form submission)
    if (!token) {
      setTokenError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      setTokenError("Invalid reset token. Please request a new password reset link.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/reset-password", {
        token,
        password: values.password,
      });
      
      setResetComplete(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
      if (error.message && (
        error.message.includes("expired") || 
        error.message.includes("invalid")
      )) {
        setTokenError("Your reset link is invalid or has expired. Please request a new one.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (tokenError) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-2">Invalid Reset Link</h3>
        <p className="mb-4">
          {tokenError}
        </p>
        <Button asChild className="w-full bg-purple-700 hover:bg-purple-800">
          <Link href="/auth">
            Return to Login
          </Link>
        </Button>
      </div>
    );
  }

  if (resetComplete) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-2">Password Reset Complete</h3>
        <p className="mb-4">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <Button asChild className="w-full bg-purple-700 hover:bg-purple-800">
          <Link href="/auth">
            Log In Now
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold mb-2">Set New Password</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Create a new password for your account.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field}
                    className={cn(
                      "bg-background border border-input",
                      "focus-visible:ring-purple-500 focus-visible:ring-1"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field}
                    className={cn(
                      "bg-background border border-input",
                      "focus-visible:ring-purple-500 focus-visible:ring-1"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-purple-700 hover:bg-purple-800 mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}