import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Mail, Lock, User, EyeOff, Eye, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("buyer");
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const { register, control, handleSubmit, formState: { errors } } = useForm<SignUpFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptTerms: false,
    }
  });

  const onSubmit = async (data: SignUpFormValues) => {
    console.log("Sign up data:", data, "role:", role);
    
    if (role === "seller") {
      // Redirect to store registration with this data pre-filled
      toast.info("Vui lòng hoàn tất đăng ký cửa hàng của bạn");
      navigate("/store/register", { 
        state: { 
          email: data.email,
          name: data.name
        } 
      });
      return;
    }
    
    const success = await registerUser(data.email, data.password, data.name, role);
    
    if (success) {
      navigate("/");
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container className="max-w-md mx-auto">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Tạo tài khoản</h1>
              <p className="text-muted-foreground">
                Đăng ký để bắt đầu tiết kiệm với các ưu đãi xanh
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
                <Label htmlFor="name">Họ và tên</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    className="pl-10"
                    {...register("name", { 
                      required: "Họ tên là bắt buộc",
                      minLength: {
                        value: 2,
                        message: "Họ tên phải có ít nhất 2 ký tự"
                      }
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

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
                        message: "Địa chỉ email không hợp lệ"
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
                        value: 8,
                        message: "Mật khẩu phải có ít nhất 8 ký tự"
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
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

              <div className="flex items-start space-x-2">
                <Controller
                  name="acceptTerms"
                  control={control}
                  rules={{ required: "Bạn phải đồng ý với điều khoản và điều kiện" }}
                  render={({ field }) => (
                    <Checkbox 
                      id="terms" 
                      className="mt-1"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <div>
                  <Label htmlFor="terms" className="text-sm font-normal">
                    Tôi đồng ý với{" "}
                    <Link to="#" className="text-primary hover:underline">
                      Điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link to="#" className="text-primary hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </Label>
                  {errors.acceptTerms && (
                    <p className="text-xs text-destructive">{errors.acceptTerms.message || "Bạn phải đồng ý với điều khoản sử dụng"}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  role === "buyer" ? 
                    "Tạo tài khoản Người mua" : 
                    "Tiếp tục đăng ký Cửa hàng"
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
              Đã có tài khoản?{" "}
              <Link to="/signin" className="text-primary font-medium hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
