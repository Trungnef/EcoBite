import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Mail, Lock, User, EyeOff, Eye, Loader2, AlertCircle, Facebook, UserPlus, ArrowRight, CheckCircle2, XCircle, Info, Upload } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

interface PasswordStrength {
  score: number; // 0-4
  feedback: {
    warning?: string;
    suggestions: string[];
  };
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("buyer");
  const { register: registerUser, registerWithProvider, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [storeFormStep, setStoreFormStep] = useState(1);
  const [storeFormData, setStoreFormData] = useState({
    taxCode: "",
    address: "",
    businessType: [],
    commitmentChecked: false
  });
  const navigate = useNavigate();
  
  const { register, control, watch, handleSubmit, formState: { errors, touchedFields, isSubmitting } } = useForm<SignUpFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
    mode: "onChange"
  });
  
  const password = watch("password");
  
  // Calculate password strength
  useEffect(() => {
    if (password) {
      const calculateStrength = () => {
        // Basic password strength calculator
        let score = 0;
        const warnings = [];
        const suggestions = [];
        
        // Length check
        if (password.length < 8) {
          warnings.push("Mật khẩu quá ngắn");
          suggestions.push("Thêm ít nhất 8 ký tự");
        } else {
          score += 1;
        }
        
        // Complexity checks
        if (/[A-Z]/.test(password)) score += 1;
        else suggestions.push("Thêm chữ in hoa");
        
        if (/[a-z]/.test(password)) score += 1;
        else suggestions.push("Thêm chữ thường");
        
        if (/[0-9]/.test(password)) score += 1;
        else suggestions.push("Thêm số");
        
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else suggestions.push("Thêm ký tự đặc biệt");
        
        setPasswordStrength({
          score,
          feedback: {
            warning: warnings.length > 0 ? warnings[0] : undefined,
            suggestions
          }
        });
      };
      
      calculateStrength();
    } else {
      setPasswordStrength(null);
    }
  }, [password]);

  const getStrengthText = () => {
    if (!passwordStrength) return "";
    switch (passwordStrength.score) {
      case 0: return "Rất yếu";
      case 1: return "Yếu";
      case 2: return "Trung bình";
      case 3: return "Mạnh";
      case 4:
      case 5: return "Rất mạnh";
      default: return "";
    }
  };

  const getStrengthColor = () => {
    if (!passwordStrength) return "bg-gray-200";
    switch (passwordStrength.score) {
      case 0: return "bg-red-500";
      case 1: return "bg-orange-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-green-500";
      case 4:
      case 5: return "bg-green-600";
      default: return "bg-gray-200";
    }
  };

  const onSubmit = async (data: SignUpFormValues) => {
    setAuthError(null);
    try {
      console.log("Sign up data:", data, "role:", role);
      
      if (role === "seller") {
        try {
          // Đăng ký thông tin cơ bản cho người bán
          const success = await registerUser(data.email, data.password, data.name, "seller");
          
          if (success) {
            // Chuyển sang trang nhập thông tin cửa hàng
            toast.success("Đăng ký tài khoản thành công!", {
              description: "Vui lòng hoàn tất thông tin cửa hàng của bạn"
            });
            navigate("/store-register", { 
              state: { 
                email: data.email,
                name: data.name
              } 
            });
          }
        } catch (error) {
          console.error("Registration error:", error);
          setAuthError("Đã xảy ra lỗi khi đăng ký. Email có thể đã được sử dụng.");
          toast.error("Đăng ký thất bại", {
            description: "Vui lòng kiểm tra thông tin và thử lại"
          });
        }
        return;
      }
      
      // Đăng ký người mua
      const success = await registerUser(data.email, data.password, data.name, role);
      
      if (success) {
        toast.success("Đăng ký thành công! Chào mừng bạn đến với EcoBite", {
          description: "Tài khoản của bạn đã được tạo thành công"
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError("Đã xảy ra lỗi khi đăng ký. Email có thể đã được sử dụng.");
      toast.error("Đăng ký thất bại", {
        description: "Vui lòng kiểm tra thông tin và thử lại"
      });
    }
  };

  const handleSocialSignUp = async (provider: "google" | "facebook") => {
    try {
      setAuthError(null);
      const success = await registerWithProvider(provider, role);
      
      if (success) {
        toast.success(`Đăng ký với ${provider} thành công!`);
        if (role === "seller") {
          // Chuyển sang trang nhập thông tin cửa hàng
          navigate("/store-register", { 
            state: { 
              email: "socialmedia@example.com", // Placeholder email for social login
              name: "Store from " + provider
            } 
          });
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(`${provider} signup error:`, error);
      setAuthError(`Đăng ký bằng ${provider} thất bại. Vui lòng thử lại.`);
      toast.error(`Đăng ký bằng ${provider} thất bại`);
    }
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
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-2"
            >
              <h1 className="text-3xl font-bold">Tạo tài khoản</h1>
              <p className="text-muted-foreground">
                {role === "buyer" 
                  ? "Đăng ký để bắt đầu tiết kiệm với các ưu đãi xanh" 
                  : "Đăng ký để bắt đầu bán sản phẩm xanh của bạn"}
              </p>
            </motion.div>
            
            <Tabs 
              defaultValue="buyer" 
              className="w-full" 
              onValueChange={(value) => {
                setRole(value as UserRole);
                setStoreFormStep(1);
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buyer">Tài khoản Người mua</TabsTrigger>
                <TabsTrigger value="seller">Tài khoản Người bán</TabsTrigger>
              </TabsList>
            </Tabs>

            {authError && (
              <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{role === "buyer" ? "Họ và tên" : "Tên cửa hàng"}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder={role === "buyer" ? "Nguyễn Văn A" : "Tên cửa hàng của bạn"}
                    className={cn(
                      "pl-10",
                      errors.name ? "border-red-500 focus-visible:ring-red-500" : 
                      touchedFields.name ? "border-green-500 focus-visible:ring-green-500" : ""
                    )}
                    {...register("name", { 
                      required: role === "buyer" ? "Họ tên là bắt buộc" : "Tên cửa hàng là bắt buộc",
                      minLength: {
                        value: 2,
                        message: role === "buyer" ? "Họ tên phải có ít nhất 2 ký tự" : "Tên cửa hàng phải có ít nhất 2 ký tự"
                      }
                    })}
                  />
                  <AnimatePresence>
                    {touchedFields.name && !errors.name && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-3 top-3 text-green-500"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </motion.div>
                    )}
                    {errors.name && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-3 top-3 text-red-500"
                      >
                        <XCircle className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                    placeholder={role === "buyer" ? "you@example.com" : "email@cuahang.com"}
                    className={cn(
                      "pl-10",
                      errors.email ? "border-red-500 focus-visible:ring-red-500" : 
                      touchedFields.email ? "border-green-500 focus-visible:ring-green-500" : ""
                    )}
                    {...register("email", { 
                      required: "Email là bắt buộc", 
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Địa chỉ email không hợp lệ"
                      }
                    })}
                  />
                  <AnimatePresence>
                    {touchedFields.email && !errors.email && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-3 top-3 text-green-500"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </motion.div>
                    )}
                    {errors.email && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-3 top-3 text-red-500"
                      >
                        <XCircle className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  {passwordStrength && (
                    <span className={cn(
                      "text-xs font-medium",
                      passwordStrength.score <= 1 ? "text-red-500" :
                      passwordStrength.score === 2 ? "text-yellow-500" :
                      "text-green-500"
                    )}>
                      {getStrengthText()}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn(
                      "pl-10 pr-10",
                      errors.password ? "border-red-500 focus-visible:ring-red-500" : 
                      password && passwordStrength?.score && passwordStrength.score >= 3 ? "border-green-500 focus-visible:ring-green-500" : ""
                    )}
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
                
                {/* Password strength meter */}
                {password && (
                  <div className="space-y-1">
                    <Progress 
                      value={passwordStrength ? (passwordStrength.score / 5) * 100 : 0} 
                      className={cn("h-1 w-full", getStrengthColor())} 
                    />
                    
                    {passwordStrength && passwordStrength.feedback.warning && (
                      <p className="text-xs text-amber-600 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        {passwordStrength.feedback.warning}
                      </p>
                    )}
                    
                    {passwordStrength && passwordStrength.feedback.suggestions.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-xs text-muted-foreground"
                      >
                        <p className="font-medium mt-1 mb-1">Gợi ý:</p>
                        <ul className="space-y-1 list-disc list-inside">
                          {passwordStrength.feedback.suggestions.map((suggestion, i) => (
                            <motion.li 
                              key={i}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              {suggestion}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                )}
                
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
                      className={cn(
                        "mt-1",
                        errors.acceptTerms ? "border-red-500 data-[state=checked]:bg-red-500" : "data-[state=checked]:bg-primary"
                      )}
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

              <Button type="submit" className="w-full group" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    {role === "buyer" ? 
                      "Tạo tài khoản Người mua" : 
                      "Tạo tài khoản & Tiếp tục"}
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
                  onClick={() => handleSocialSignUp("google")}
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
                  onClick={() => handleSocialSignUp("facebook")}
                >
                  <Facebook className="mr-2 h-4 w-4 transition-transform" />
                  Facebook
                </Button>
              </motion.div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                <Link to="/signin" className="text-primary font-medium hover:underline group inline-flex items-center">
                  Đăng nhập
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
 