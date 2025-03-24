import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  Users, 
  Badge, 
  Building, 
  Leaf, 
  Award, 
  Mail, 
  ExternalLink,
  Heart,
  Clock,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";

// Import images correctly
import anImage from "./assets/team/an.jpg";
import caImage from "./assets/team/ca.jpg";
import truneImage from "./assets/team/trune.jpg";
import vanImage from "./assets/team/van.jpg";
import ngocImage from "./assets/team/ngoc.jpg";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 } 
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const AboutSection = ({ children, className = "", id = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <section 
      ref={ref}
      id={id}
      className={`py-16 md:py-24 ${className}`}
    >
      <div
        style={{
          transform: isInView ? "none" : "translateY(50px)",
          opacity: isInView ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s"
        }}
      >
        {children}
      </div>
    </section>
  );
};

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Add counter animation effect
  useEffect(() => {
    const animateCounters = () => {
      const counters = document.querySelectorAll('.counter-value');
      
      counters.forEach(counter => {
        // Target value from the HTML
        const target = parseInt(counter.textContent || '0', 10);
        const duration = 2000; // 2 seconds
        const stepTime = 50;
        const steps = duration / stepTime;
        const increment = target / steps;
        
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target.toString();
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current).toString();
          }
        }, stepTime);
      });
    };
    
    // Init counters when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    
    // Observe first counter element
    const firstCounter = document.querySelector('.counter-value');
    if (firstCounter) {
      observer.observe(firstCounter.parentElement || firstCounter);
    }
    
    return () => observer.disconnect();
  }, []);

  const team = [
    {
      name: "Qanh Cá",
      position: "Giám đốc Điều hành & Sáng lập",
      image: caImage, 
      bio: "Qanh Cá là người sáng lập EcoBite với khát vọng tạo nên một hệ sinh thái thực phẩm bền vững tại Việt Nam. Với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ và khởi nghiệp xanh.",
      social: {
        linkedin: "https://linkedin.com/in/hoa-an",
        twitter: "https://twitter.com/hoa_an",
        instagram: "https://instagram.com/hoa.an"
      }
    },
    {
      name: "Hòa An",
      position: "Giám đốc Marketing",
      image: anImage,
      bio: "Hòa An phụ trách chiến lược marketing và phát triển thương hiệu, đưa EcoBite đến gần hơn với người tiêu dùng. Chuyên gia về truyền thông xã hội và tiếp thị bền vững.",
      social: {
        linkedin: "https://linkedin.com/in/qanh-ca",
        twitter: "https://twitter.com/qanh_ca",
        instagram: "https://instagram.com/qanh.ca"
      }
    },
    {
      name: "Trune", 
      position: "Giám đốc Công nghệ",
      image: truneImage,
      bio: "Trune dẫn dắt đội ngũ kỹ thuật, phát triển nền tảng công nghệ tiên tiến cho EcoBite. Với kinh nghiệm phát triển các ứng dụng di động và web trong lĩnh vực thực phẩm và thương mại điện tử.",
      social: {
        linkedin: "https://linkedin.com/in/trune",
        twitter: "https://twitter.com/trune_tech",
        github: "https://github.com/trune",
        instagram: "https://instagram.com/trune_184"
      }
    },
    {
      name: "Hồng Vân",
      position: "Giám đốc Vận hành",
      image: vanImage, 
      bio: "Hồng Vân quản lý hoạt động hàng ngày, đảm bảo dịch vụ chất lượng cao cho khách hàng và đối tác. Chuyên gia về tối ưu hóa chuỗi cung ứng và quản lý vận hành bền vững.",
      social: {
        linkedin: "https://linkedin.com/in/hong-van",
        twitter: "https://twitter.com/hong_van",
        instagram: "https://instagram.com/hong.van"
      }
    },
    {
      name: "Nguyễn Ngọc",
      position: "Giám đốc Phát triển Kinh doanh",
      image: ngocImage,
      bio: "Nguyễn Ngọc phụ trách mở rộng mạng lưới đối tác và phát triển cơ hội kinh doanh mới cho EcoBite. Với nền tảng vững chắc trong phát triển kinh doanh bền vững và quan hệ đối tác chiến lược.",
      social: {
        linkedin: "https://linkedin.com/in/nguyen-ngoc",
        twitter: "https://twitter.com/nguyen_ngoc",
        instagram: "https://instagram.com/nguyen.ngoc"
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(0,128,0,0.08),transparent_60%)]"></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(0,128,0,0.05),transparent_70%)]"></div>

          {/* Decorative elements */}
          <div className="absolute top-40 -left-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          
          <Container>
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600" 
                variants={fadeInUp}
              >
                Sứ mệnh của chúng tôi
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
                variants={fadeInUp}
              >
                Tại EcoBite, chúng tôi có sứ mệnh <span className="text-primary font-medium">giảm lãng phí thực phẩm</span> tại Việt Nam bằng cách kết nối
                người tiêu dùng với thực phẩm sắp hết hạn từ các cửa hàng và siêu thị địa phương với
                giá cả phải chăng.
              </motion.p>
              
              <motion.div variants={fadeInUp}>
                <Button size="lg" className="rounded-full group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                  <span>Tham gia cùng chúng tôi</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>
          </Container>
        </section>
        
        {/* Our Story */}
        <AboutSection>
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Câu chuyện của chúng tôi
                </div>
                
                <h2 className="text-3xl font-bold mb-6 relative">
                  Từ ý tưởng đến tác động
                  <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary rounded-full"></div>
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    EcoBite được thành lập vào năm 2022 khi nhà sáng lập của chúng tôi, Quynh Anh, nhận thấy 
                    một lượng lớn thực phẩm còn tốt đang bị các siêu thị ở Thành phố Hồ Chí Minh vứt bỏ
                    chỉ vì chúng sắp đến ngày hết hạn.
                  </p>
                  
                  <p>
                    Nhận ra cả <span className="text-primary font-medium">vấn đề môi trường</span> và <span className="text-primary font-medium">cơ hội kinh doanh</span>, Cá Tạ
                    đã hình dung một nền tảng kết nối các cửa hàng với những người tiêu dùng
                    có ý thức về ngân sách, tạo ra tình huống ba bên cùng có lợi cho doanh nghiệp, người mua sắm, 
                    và hành tinh.
                  </p>
                  
                  <p>
                    Bắt đầu từ một dự án thử nghiệm nhỏ với chỉ ba cửa hàng địa phương, hiện đã phát triển
                    thành mạng lưới toàn quốc với hơn <span className="text-primary font-semibold">100 cửa hàng đối tác</span> trên khắp các thành phố lớn của Việt Nam.
                  </p>
                </div>

                <Button variant="ghost" className="mt-6 pl-0 group">
                  <span>Tìm hiểu thêm</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              
              <div className="order-1 md:order-2 relative">
                <div className="absolute -z-10 inset-0 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/4"></div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000" 
                    alt="Câu chuyện EcoBite" 
                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white text-sm md:text-base font-medium">
                      Cửa hàng đối tác đầu tiên của chúng tôi tại TP. Hà Nội (2022)
                    </p>
                    <div className="w-12 h-1 bg-primary mt-2 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </AboutSection>
        
        {/* Impact */}
        <AboutSection className="bg-primary/5 relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,128,0,0.08),transparent_70%)]"></div>
          
          <Container>
            <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                Tác động của chúng tôi
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Tạo sự khác biệt</h2>
              
              <div className="mx-auto w-16 h-1 bg-primary/40 rounded-full mb-6"></div>
              
              <p className="text-muted-foreground">
                Kể từ khi ra mắt, chúng tôi đã đạt được những bước tiến đáng kể trong việc giảm lãng phí thực phẩm
                và cung cấp các lựa chọn thực phẩm giá cả phải chăng trên khắp Việt Nam.
              </p>
            </div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div 
                className="bg-white rounded-xl border p-8 shadow-sm hover:shadow-lg transition-all"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-3 rounded-full bg-green-50 w-fit mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold mb-2 flex items-baseline">
                  <span className="counter-value">60</span>
                  <span className="text-xl">+ tấn</span>
                </div>
                <p className="text-muted-foreground text-sm">Lượng thực phẩm được ngăn chặn lãng phí hàng năm</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl border p-8 shadow-sm hover:shadow-lg transition-all"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-3 rounded-full bg-blue-50 w-fit mb-4">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold mb-2 flex items-baseline">
                  <span className="counter-value">100</span>
                  <span className="text-xl">+</span>
                </div>
                <p className="text-muted-foreground text-sm">Cửa hàng đối tác trên khắp Việt Nam</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl border p-8 shadow-sm hover:shadow-lg transition-all"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-3 rounded-full bg-amber-50 w-fit mb-4">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-3xl font-bold mb-2 flex items-baseline">
                  <span className="counter-value">50</span>
                  <span className="text-xl">.000+</span>
                </div>
                <p className="text-muted-foreground text-sm">Người dùng tích cực trên nền tảng</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl border p-8 shadow-sm hover:shadow-lg transition-all"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-3 rounded-full bg-purple-50 w-fit mb-4">
                  <Badge className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold mb-2 flex items-baseline">
                  <span className="counter-value">2</span>
                  <span className="text-xl"> tỷ+ ₫</span>
                </div>
                <p className="text-muted-foreground text-sm">Tiết kiệm cho người tiêu dùng</p>
              </motion.div>
            </motion.div>
          </Container>
        </AboutSection>
        
        {/* Team */}
        <AboutSection>
          <Container>
            <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                Đội ngũ
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
              
              <div className="mx-auto w-16 h-1 bg-primary/40 rounded-full mb-6"></div>
              
              <p className="text-muted-foreground">
                Gặp gỡ những người đam mê đằng sau EcoBite, những người làm việc không mệt mỏi 
                để giảm lãng phí thực phẩm tại Việt Nam.
              </p>
            </div>
            
            {/* Top 3 members */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {team.slice(0, 3).map((member, index) => (
                <motion.div 
                  key={index} 
                  className="rounded-xl overflow-hidden border group hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Social links on hover */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      {member.social.linkedin && (
                        <a 
                          href={member.social.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white/90 p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a 
                          href={member.social.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white/90 p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                          aria-label={`${member.name}'s Twitter`}
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {member.social.instagram && (
                        <a 
                          href={member.social.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white/90 p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                          aria-label={`${member.name}'s Instagram`}
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white">
                    <h3 className="font-semibold text-xl mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-3">{member.position}</p>
                    <p className="text-muted-foreground text-sm line-clamp-3">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom 2 members */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {team.slice(3).map((member, index) => (
                <motion.div 
                  key={index} 
                  className="rounded-xl overflow-hidden border group hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Social links on hover */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      {member.social.linkedin && (
                        <a 
                          href={member.social.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white/90 p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a 
                          href={member.social.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white/90 p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                          aria-label={`${member.name}'s Twitter`}
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {member.social.instagram && (
                        <a 
                          href={member.social.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white/90 p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                          aria-label={`${member.name}'s Instagram`}
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white">
                    <h3 className="font-semibold text-xl mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-3">{member.position}</p>
                    <p className="text-muted-foreground text-sm line-clamp-3">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </AboutSection>
        
        {/* Values */}
        <AboutSection className="bg-primary/5 relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(0,128,0,0.08),transparent_60%)]"></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(0,128,0,0.06),transparent_70%)]"></div>
          
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1557318041-1ce374d55ebf?q=80&w=1200" 
                    alt="Giá trị của EcoBite" 
                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/10 to-transparent opacity-30"></div>
                </div>
              </div>
              
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Giá trị cốt lõi
                </div>
                
                <h2 className="text-3xl font-bold mb-6 relative">
                  Giá trị dẫn dắt chúng tôi
                  <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary rounded-full"></div>
                </h2>
                
                <motion.div 
                  className="space-y-6 mt-8"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <motion.div 
                    className="flex gap-4 bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
                    variants={fadeInUp}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <div className="p-3 rounded-full bg-green-50 h-fit">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Tính bền vững</h3>
                      <p className="text-muted-foreground text-sm">
                        Chúng tôi đặt mục tiêu giảm thiểu tác động môi trường bằng cách giảm lãng phí thực phẩm và thúc đẩy tiêu dùng có trách nhiệm.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-4 bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
                    variants={fadeInUp}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <div className="p-3 rounded-full bg-amber-50 h-fit">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Sự công bằng</h3>
                      <p className="text-muted-foreground text-sm">
                        Chúng tôi tin vào việc mọi người đều xứng đáng có quyền tiếp cận thực phẩm chất lượng với giá cả phải chăng, bất kể hoàn cảnh của họ.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-4 bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
                    variants={fadeInUp}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <div className="p-3 rounded-full bg-blue-50 h-fit">
                      <Heart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Đổi mới</h3>
                      <p className="text-muted-foreground text-sm">
                        Chúng tôi liên tục tìm kiếm các giải pháp sáng tạo để giảm lãng phí thực phẩm và cải thiện trải nghiệm của người dùng.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </Container>
        </AboutSection>
        
        {/* CTA */}
        <AboutSection className="bg-gradient-to-br from-primary/10 to-primary/5 border-y relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,128,0,0.08),transparent_60%)]"></div>
          
          <Container>
            <motion.div 
              className="text-center max-w-2xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6"
                variants={fadeInUp}
              >
                Tham gia cùng chúng tôi trong cuộc chiến<br className="hidden md:block" /> chống lãng phí thực phẩm
              </motion.h2>
              
              <motion.div 
                className="mx-auto w-24 h-1 bg-primary/40 rounded-full mb-6"
                variants={fadeInUp}
              ></motion.div>
              
              <motion.p 
                className="text-muted-foreground mb-8"
                variants={fadeInUp}
              >
                Cho dù bạn là người tiêu dùng, chủ cửa hàng, hay nhà đầu tư tiềm năng, 
                chúng tôi mời bạn tham gia cùng chúng tôi trong sứ mệnh của mình.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={fadeInUp}
              >
                <Button 
                  size="lg" 
                  className="rounded-full transition-all hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                >
                  Tải ứng dụng
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full transition-all hover:bg-primary/5 hover:scale-105"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Liên hệ chúng tôi
                </Button>
              </motion.div>
            </motion.div>
          </Container>
        </AboutSection>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
