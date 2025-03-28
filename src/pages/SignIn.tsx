import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Mail, Lock, EyeOff, Eye, Loader2, AlertCircle, Facebook, LogIn, ArrowRight, KeyRound, UserCircle2, Store } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface SignInFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ForgotPasswordValues {
  email: string;
}

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithProvider, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  
  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    }
  });

  const { register: registerForgotPassword, handleSubmit: handleForgotPasswordSubmit, formState: { errors: forgotPasswordErrors } } = useForm<ForgotPasswordValues>({
    defaultValues: {
      email: "",
    }
  });

  const setDefaultUser = (email: string, password: string = "Password123!") => {
    setValue("email", email);
    setValue("password", password);
  };

  const onSubmit = async (data: SignInFormValues) => {
    setAuthError(null);
    try {
      console.log("Sign in data:", data);
      
      // Kiểm tra email để xác định role
      const role = data.email.includes("seller") ? "seller" : "buyer";
      
      const success = await login(data.email, data.password, role);
      
      if (success) {
        toast.success(`Đăng nhập thành công! Chào mừng trở lại!`);
        if (role === "seller") {
          navigate("/store/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
      toast.error("Đăng nhập thất bại", {
        description: "Email hoặc mật khẩu không chính xác",
      });
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      setAuthError(null);
      // Mặc định là buyer khi đăng nhập bằng mạng xã hội
      const success = await loginWithProvider(provider, "buyer");
      
      if (success) {
        toast.success(`Đăng nhập với ${provider} thành công!`);
        navigate("/");
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setAuthError(`Đăng nhập bằng ${provider} thất bại. Vui lòng thử lại.`);
      toast.error(`Đăng nhập bằng ${provider} thất bại`);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordValues) => {
    setIsSubmittingReset(true);
    try {
      // Implement actual password reset functionality here
      // This is a mockup for demonstration
      console.log("Password reset requested for:", data.email);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setResetEmailSent(true);
      toast.success("Email đặt lại mật khẩu đã được gửi", {
        description: "Vui lòng kiểm tra hộp thư đến của bạn"
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Không thể gửi email đặt lại mật khẩu");
    } finally {
      setIsSubmittingReset(false);
    }
  };

  const resetForgotPasswordForm = () => {
    setResetEmailSent(false);
    setIsForgotPasswordOpen(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Chào mừng trở lại</h1>
              <p className="text-muted-foreground">
                Đăng nhập để tiếp tục
              </p>
            </div>
            
            {/* Tài khoản demo
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer border-primary/40 hover:border-primary hover:shadow-md transition-all"
                    onClick={() => setDefaultUser("buyer@example.com")}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <UserCircle2 className="w-4 h-4 mr-1" /> Tài khoản Người mua
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3 text-xs text-muted-foreground">
                  <div>buyer@example.com</div>
                  <div>Password123!</div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer border-primary/40 hover:border-primary hover:shadow-md transition-all"
                    onClick={() => setDefaultUser("seller@example.com")}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Store className="w-4 h-4 mr-1" /> Tài khoản Người bán
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3 text-xs text-muted-foreground">
                  <div>seller@example.com</div>
                  <div>Password123!</div>
                </CardContent>
              </Card>
            </div> */}

            {authError && (
              <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    {...register("email", { 
                      required: "Email là bắt buộc", 
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email không hợp lệ"
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...register("password", { 
                      required: "Mật khẩu là bắt buộc",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự"
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
                <div className="flex justify-end">
                  <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                    <DialogTrigger asChild>
                      <button type="button" className="text-sm font-medium text-primary hover:underline">
                        Quên mật khẩu?
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{resetEmailSent ? "Email đã được gửi" : "Đặt lại mật khẩu"}</DialogTitle>
                        <DialogDescription>
                          {resetEmailSent 
                            ? "Kiểm tra hộp thư đến của bạn để được hướng dẫn đặt lại mật khẩu."
                            : "Nhập email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu."}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {!resetEmailSent ? (
                        <form onSubmit={handleForgotPasswordSubmit(handleForgotPassword)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="reset-email"
                                type="email"
                                placeholder="you@example.com"
                                className="pl-10"
                                {...registerForgotPassword("email", { 
                                  required: "Email là bắt buộc", 
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email không hợp lệ"
                                  }
                                })}
                              />
                            </div>
                            {forgotPasswordErrors.email && (
                              <p className="text-sm text-destructive">{forgotPasswordErrors.email.message}</p>
                            )}
                          </div>
                          <DialogFooter className="sm:justify-between">
                            <Button type="button" variant="ghost" onClick={() => setIsForgotPasswordOpen(false)}>
                              Hủy
                            </Button>
                            <Button type="submit" disabled={isSubmittingReset}>
                              {isSubmittingReset ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Đang gửi...
                                </>
                              ) : (
                                "Gửi email đặt lại"
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      ) : (
                        <DialogFooter>
                          <Button onClick={resetForgotPasswordForm} className="w-full">
                            Quay lại đăng nhập
                          </Button>
                        </DialogFooter>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <Checkbox 
                      id="remember-me"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="remember-me" className="text-sm font-normal">
                  Ghi nhớ đăng nhập trong 30 ngày
                </Label>
              </div>

              <Button type="submit" className="w-full group" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    Đăng nhập
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  hoặc tiếp tục với
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  variant="outline" 
                  className="w-full group hover:border-red-500 hover:text-red-500 transition-colors"
                  onClick={() => handleSocialLogin("google")}
                >
                  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 transition-transform" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                  Google
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  variant="outline" 
                  className="w-full group hover:border-blue-600 hover:text-blue-600 transition-colors"
                  onClick={() => handleSocialLogin("facebook")}
                >
                  <Facebook className="mr-2 h-4 w-4 transition-transform" />
                  Facebook
                </Button>
              </motion.div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                <Link to="/signup" className="text-primary font-medium hover:underline group inline-flex items-center">
                  Đăng ký
                  <ArrowRight className="ml-1 h-3 w-3 opacity-70 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.span>
            </p>
          </motion.div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
 