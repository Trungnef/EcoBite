import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Menu, X, ShoppingBag, ShoppingCart, User, LogOut, Store, Heart, Search, MapPin, Bell, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu and search when route changes
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Khuyến mãi", path: "/deals" },
    { name: "Cửa hàng", path: "/stores" },
    { name: "Giới thiệu", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirect to search results page (if available)
      console.log("Searching for:", searchTerm);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm py-2"
          : "bg-white/80 backdrop-blur-sm py-3"
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 text-primary"
            aria-label="EcoBite Vietnam"
          >
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 400 }}
            >
              <ShoppingBag className="h-8 w-8" strokeWidth={1.5} />
            </motion.div>
            <motion.span 
              className="text-xl font-semibold tracking-tight"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              EcoBite
              <span className="font-light text-muted-foreground ml-0.5">Vietnam</span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1.5 mx-4 bg-muted/30 px-2 py-1 rounded-full">
            {navLinks.map(link => (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-1.5">
            {/* Desktop Search Button */}
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.form
                  key="search-form"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 260, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 26 }}
                  className="relative"
                  onSubmit={handleSearch}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-12 h-9 rounded-full border-muted focus-visible:ring-primary focus-visible:ring-offset-0"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="search-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsSearchOpen(true)}
                    className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full h-9 w-9"
                  >
                    <Search className="h-4.5 w-4.5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full h-9 w-9"
              >
                <Bell className="h-4.5 w-4.5" />
              </Button>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/cart" className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full h-9 w-9"
                >
                  <ShoppingCart className="h-4.5 w-4.5" />
                  {itemCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-0.5 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold rounded-full"
                      variant="destructive"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </motion.div>
            
            {/* User Menu */}
            {isAuthenticated && user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-9 w-9 p-0 border-2 border-primary/10 hover:border-primary/30 hover:shadow-sm overflow-hidden"
                    >
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user.profileImage} alt={user.name} />
                        <AvatarFallback className="bg-primary/5 text-primary">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 mt-1 rounded-xl">
                    <div className="flex items-center justify-start gap-3 p-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImage} alt={user.name} />
                        <AvatarFallback className="bg-primary/5 text-primary">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {user.role === "buyer" ? (
                      <>
                        <DropdownMenuItem asChild className="py-2 focus:bg-primary/5">
                          <Link to="/profile" className="cursor-pointer w-full flex items-center">
                            <User className="mr-2 h-4 w-4 text-primary" />
                            Tài khoản của tôi
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="py-2 focus:bg-primary/5">
                          <Link to="/profile?tab=favorites" className="cursor-pointer w-full flex items-center">
                            <Heart className="mr-2 h-4 w-4 text-red-500" />
                            Yêu thích
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="py-2 focus:bg-primary/5">
                          <Link to="/profile?tab=orders" className="cursor-pointer w-full flex items-center">
                            <ShoppingBag className="mr-2 h-4 w-4 text-green-600" />
                            Đơn hàng của tôi
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="py-2 focus:bg-primary/5">
                          <Link to="/profile?tab=address" className="cursor-pointer w-full flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                            Địa chỉ giao hàng
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem asChild className="py-2 focus:bg-primary/5">
                        <Link to="/store/dashboard" className="cursor-pointer w-full flex items-center">
                          <Store className="mr-2 h-4 w-4 text-primary" />
                          Quản lý cửa hàng
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="cursor-pointer text-destructive py-2 focus:bg-red-50 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/signin">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 px-4 rounded-full hover:border-primary hover:bg-primary/5 font-medium text-muted-foreground hover:text-primary border-muted"
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/signup">
                    <Button 
                      size="sm" 
                      className="h-9 px-4 rounded-full bg-primary hover:bg-primary/90 font-medium shadow-sm"
                    >
                      Đăng ký
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-primary rounded-full"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge 
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold rounded-full"
                      variant="destructive"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-primary p-2 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
          </div>
        </nav>

        {/* Mobile Search Bar - Floating */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="md:hidden mt-2 rounded-full overflow-hidden shadow-md"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm cửa hàng, sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-16 h-10 rounded-full border-none bg-white"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 rounded-full text-sm font-normal"
                  onClick={() => setIsSearchOpen(false)}
                >
                  Hủy
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Menu Panel */}
              <motion.div 
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ duration: 0.3, type: "spring", damping: 20 }}
                className="md:hidden fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-white shadow-xl rounded-l-2xl z-50 overflow-auto"
              >
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    <span className="text-lg font-semibold tracking-tight">
                      EcoBite<span className="text-muted-foreground font-normal">Vietnam</span>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex flex-col py-3 px-4 space-y-1">
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-base font-medium p-3 hover:bg-primary/5 rounded-xl transition-colors flex items-center space-x-3 ${
                        isActive(link.path)
                          ? "text-primary bg-primary/10"
                          : "text-foreground"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.path === "/" && <ShoppingBag className="h-5 w-5" />}
                      {link.path === "/deals" && <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary" variant="default">%</Badge>}
                      {link.path === "/stores" && <Store className="h-5 w-5" />}
                      {link.path === "/about" && <Info className="h-5 w-5" />}
                      <span>{link.name}</span>
                    </Link>
                  ))}
                  
                  <div className="pt-3 border-t border-t-muted/20 flex flex-col space-y-2 mt-2">
                    {isAuthenticated && user ? (
                      <>
                        <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-xl">
                          <Avatar className="h-12 w-12 border-2 border-primary/10">
                            <AvatarImage src={user.profileImage} alt={user.name} />
                            <AvatarFallback className="bg-primary/5 text-primary">{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1 mt-2">
                          {user.role === "buyer" ? (
                            <>
                              <Link 
                                to="/profile" 
                                className="flex items-center p-3 hover:bg-primary/5 rounded-xl transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <User className="mr-3 h-5 w-5 text-primary" />
                                <span>Tài khoản của tôi</span>
                              </Link>
                              <Link 
                                to="/profile?tab=favorites" 
                                className="flex items-center p-3 hover:bg-primary/5 rounded-xl transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <Heart className="mr-3 h-5 w-5 text-red-500" />
                                <span>Yêu thích</span>
                              </Link>
                              <Link 
                                to="/profile?tab=orders" 
                                className="flex items-center p-3 hover:bg-primary/5 rounded-xl transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <ShoppingBag className="mr-3 h-5 w-5 text-green-600" />
                                <span>Đơn hàng của tôi</span>
                              </Link>
                              <Link 
                                to="/profile?tab=address" 
                                className="flex items-center p-3 hover:bg-primary/5 rounded-xl transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <MapPin className="mr-3 h-5 w-5 text-blue-500" />
                                <span>Địa chỉ giao hàng</span>
                              </Link>
                            </>
                          ) : (
                            <Link 
                              to="/store/dashboard" 
                              className="flex items-center p-3 hover:bg-primary/5 rounded-xl transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <Store className="mr-3 h-5 w-5 text-primary" />
                              <span>Quản lý cửa hàng</span>
                            </Link>
                          )}
                          
                          <motion.button 
                            className="flex items-center w-full p-3 hover:bg-red-50 text-red-600 rounded-xl transition-colors mt-2"
                            onClick={() => {
                              handleLogout();
                              setIsMenuOpen(false);
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            <span>Đăng xuất</span>
                          </motion.button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col space-y-2 p-3">
                        <Link to="/signin" className="w-full" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-center rounded-xl h-11">
                            Đăng nhập
                          </Button>
                        </Link>
                        <Link to="/signup" className="w-full" onClick={() => setIsMenuOpen(false)}>
                          <Button className="w-full justify-center rounded-xl h-11 bg-primary">Đăng ký</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border-t mt-4 text-center text-sm text-muted-foreground">
                  <p>© {new Date().getFullYear()} EcoBite Vietnam</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}
