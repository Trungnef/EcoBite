import { Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { ShoppingBag, Facebook, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
              <span className="text-lg font-semibold tracking-tight">
                EcoBite
                <span className="font-light text-muted-foreground">Vietnam</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Kết nối người tiêu dùng với thực phẩm sắp hết hạn từ các cửa hàng và
              siêu thị tại Việt Nam với giá cả phải chăng.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@Ecobite.vn"
                aria-label="Email"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-4">Công ty</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link 
                  to="/careers" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link 
                  to="/press" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Báo chí
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/deals" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Xem ưu đãi
                </Link>
              </li>
              <li>
                <Link 
                  to="/stores" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Cửa hàng đối tác
                </Link>
              </li>
              <li>
                <Link 
                  to="/how-it-works" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Cách thức hoạt động
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-4">Pháp lý</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/terms" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookies" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Chính sách cookie
                </Link>
              </li>
              <li>
                <Link 
                  to="/partners" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Điều khoản đối tác
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} EcoBite Vietnam. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
           Make with 💚 from Hà Nội
          </p>
        </div>
      </Container>
    </footer>
  );
}
