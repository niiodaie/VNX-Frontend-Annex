import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const AuthPage = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  const { loading, isAuthenticated, login, loginAsGuest, register } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);
  
  // Login form state
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: ""
  });

  // Register form state
  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phoneNumber: ""
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInfo({
      ...registerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginCredentials.username, loginCredentials.password);
      // Navigation happens in the useEffect when isAuthenticated changes
    } catch (error) {
      // Error is already handled in the AuthContext login function
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerInfo);
      // Navigation happens in the useEffect when isAuthenticated changes
    } catch (error) {
      // Error is already handled in the AuthContext register function
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      // Navigation happens in the useEffect when isAuthenticated changes
    } catch (error) {
      // Error is already handled in the AuthContext loginAsGuest function
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 items-center">
        {/* Left side - Hero content */}
        <div className="space-y-6 text-center md:text-left order-2 md:order-1">
          <h1 className="text-4xl font-bold tracking-tight">
            Discover African Cuisine
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore authentic recipes, cultural insights, and find the best African restaurants near you.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                1
              </div>
              <p className="text-lg">Find authentic restaurants</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                2
              </div>
              <p className="text-lg">Learn cultural food stories</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                3
              </div>
              <p className="text-lg">Book reservations instantly</p>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="order-1 md:order-2">
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome to African Cuisine Explorer</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account or create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input 
                        id="login-username" 
                        name="username" 
                        placeholder="Enter your username"
                        value={loginCredentials.username}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input 
                        id="login-password" 
                        name="password" 
                        type="password" 
                        placeholder="Enter your password"
                        value={loginCredentials.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-username">Username</Label>
                        <Input 
                          id="reg-username" 
                          name="username" 
                          placeholder="Choose a username"
                          value={registerInfo.username}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <Input 
                          id="reg-password" 
                          name="password" 
                          type="password" 
                          placeholder="Create a password"
                          value={registerInfo.password}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-fullName">Full Name</Label>
                      <Input 
                        id="reg-fullName" 
                        name="fullName" 
                        placeholder="Enter your full name"
                        value={registerInfo.fullName}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input 
                        id="reg-email" 
                        name="email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={registerInfo.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-phone">Phone Number (optional)</Label>
                      <Input 
                        id="reg-phone" 
                        name="phoneNumber" 
                        placeholder="Enter your phone number"
                        value={registerInfo.phoneNumber}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="relative w-full flex items-center justify-center mt-2 mb-4">
                <hr className="w-full" />
                <span className="absolute bg-card px-2 text-muted-foreground">or</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGuestLogin}
                disabled={loading}
              >
                Continue as Guest
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Guest access provides limited features. Create an account for full access.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;