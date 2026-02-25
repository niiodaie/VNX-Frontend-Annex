import * as z from "zod";
import { useState } from "react";
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
import { Loader2, ArrowLeft } from "lucide-react";

// Define form validation schema
const formSchema = z.object({
  username: z.string().min(3, "Please enter your username (minimum 3 characters)"),
});

interface ForgotPasswordFormProps {
  onCancel?: () => void;
}

export default function ForgotPasswordForm({ onCancel }: ForgotPasswordFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/forgot-password", values);
      setResetSent(true);
      toast({
        title: "Reset link sent",
        description: "If an account with that username exists, a password reset link has been created.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (resetSent) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-2">Reset Link Generated</h3>
        <p className="mb-6">
          If an account with that username exists, we've created a password reset link.
          Please use the link to reset your password.
        </p>
        
        {/* For testing purposes in development */}
        <div className="p-4 bg-[#1E1E1E] rounded-md border border-[#2D2D2D] text-xs">
          <p className="text-gray-400 mb-2">For development testing only:</p>
          <p>Since email sending is not set up, you can find the reset token in the server logs.</p>
          <p>Or use this link format to reset your password:</p>
          <code className="block mt-2 bg-black p-2 rounded text-purple-400 word-break">
            /reset-password?token=your_token_here
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onCancel && (
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel} 
          className="p-0 h-auto text-purple-400 hover:text-purple-300 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to login
        </Button>
      )}
      <h3 className="text-2xl font-semibold mb-2">Reset Password</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Enter your username and we'll create a reset link for your password.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your username" 
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
            className="w-full bg-purple-700 hover:bg-purple-800"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}