import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Auth() {
  const [_, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/");
    }, 1500);
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthLogo />

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-card/50 backdrop-blur-sm border border-border">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-display">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access the mainframe.</CardDescription>
              </CardHeader>
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-display">New User Protocol</CardTitle>
                <CardDescription>Create an account to join the network.</CardDescription>
              </CardHeader>
              <RegisterForm />
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AuthLayout>
  );
}
