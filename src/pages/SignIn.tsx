import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Mail, Lock, EyeOff, Eye, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignInFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("buyer");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const { register, control, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    }
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      console.log("Sign in data:", data, "role:", role);
      
      const success = await login(data.email, data.password, role);
      
      if (success) {
        // Redirect based on role
        if (role === "seller") {
          navigate("/store/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đã xảy ra lỗi trong quá trình đăng nhập");
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container className="max-w-md mx-auto">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Chào mừng trở lại</h1>
              <p className="text-muted-foreground">
                Đăng nhập để tiếp tục
              </p>
            </div>
            
            <Tabs 
              defaultValue="buyer" 
              className="w-full" 
              onValueChange={(value) => setRole(value as UserRole)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buyer">Tài khoản Người mua</TabsTrigger>
                <TabsTrigger value="seller">Tài khoản Người bán</TabsTrigger>
              </TabsList>
            </Tabs>

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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link to="#" className="text-sm font-medium text-primary hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  `Đăng nhập với vai trò ${role === 'buyer' ? 'Người mua' : 'Người bán'}`
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
              <Button variant="outline" className="w-full">
                Google
              </Button>
              <Button variant="outline" className="w-full">
                Facebook
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Đăng ký
              </Link>
            </p>
            
            {role === "seller" && (
              <p className="text-center text-sm text-muted-foreground">
                Cần đăng ký cửa hàng?{" "}
                <Link to="/store/register" className="text-primary font-medium hover:underline">
                  Đăng ký Cửa hàng
                </Link>
              </p>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
