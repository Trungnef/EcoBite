import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Badge, Building, Leaf, Award, Mail } from "lucide-react";

// Import images correctly
import anImage from "./assets/team/an.jpg";
import caImage from "./assets/team/ca.jpg";
import truneImage from "./assets/team/trune.jpg";
import vanImage from "./assets/team/van.jpg";
import ngocImage from "./assets/team/ngoc.jpg";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const team = [
    {
      name: "Hòa An",
      position: "Giám đốc Điều hành & Sáng lập",
      image: anImage, 
      bio: "Hòa An là người sáng lập EcoBite với khát vọng tạo nên một hệ sinh thái thực phẩm bền vững tại Việt Nam."
    },
    {
      name: "Qanh Cá",
      position: "Giám đốc Marketing",
      image: caImage,
      bio: "Qanh Cá phụ trách chiến lược marketing và phát triển thương hiệu, đưa EcoBite đến gần hơn với người tiêu dùng."
    },
    {
      name: "Trune", 
      position: "Giám đốc Công nghệ",
      image: truneImage,
      bio: "Trune dẫn dắt đội ngũ kỹ thuật, phát triển nền tảng công nghệ tiên tiến cho EcoBite."
    },
    {
      name: "Hồng Vân",
      position: "Giám đốc Vận hành",
      image: vanImage, 
      bio: "Hồng Vân quản lý hoạt động hàng ngày, đảm bảo dịch vụ chất lượng cao cho khách hàng và đối tác."
    },
    {
      name: "Nguyễn Ngọc",
      position: "Giám đốc Phát triển Kinh doanh",
      image: ngocImage,
      bio: "Nguyễn Ngọc phụ trách mở rộng mạng lưới đối tác và phát triển cơ hội kinh doanh mới cho EcoBite."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(0,128,0,0.05),transparent)]"></div>
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">Sứ mệnh của chúng tôi</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up delay-100">
                Tại EcoBite, chúng tôi có sứ mệnh giảm lãng phí thực phẩm tại Việt Nam bằng cách kết nối
                người tiêu dùng với thực phẩm sắp hết hạn từ các cửa hàng và siêu thị địa phương với
                giá cả phải chăng.
              </p>
              <div className="animate-fade-in-up delay-200">
                <Button size="lg" className="rounded-full">
                  Tham gia cùng chúng tôi
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Container>
        </section>
        
        {/* Our Story */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 animate-fade-in-up">
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium mb-4 inline-block">
                  Câu chuyện của chúng tôi
                </span>
                <h2 className="text-3xl font-bold mb-4">Từ ý tưởng đến tác động</h2>
                <p className="text-muted-foreground mb-4">
                  EcoBite được thành lập vào năm 2022 khi nhà sáng lập của chúng tôi, Hòa An, nhận thấy 
                  một lượng lớn thực phẩm còn tốt đang bị các siêu thị ở Thành phố Hồ Chí Minh vứt bỏ
                  chỉ vì chúng sắp đến ngày hết hạn.
                </p>
                <p className="text-muted-foreground mb-4">
                  Nhận ra cả vấn đề môi trường và cơ hội kinh doanh, An
                  đã hình dung một nền tảng kết nối các cửa hàng với những người tiêu dùng
                  có ý thức về ngân sách, tạo ra tình huống ba bên cùng có lợi cho doanh nghiệp, người mua sắm, 
                  và hành tinh.
                </p>
                <p className="text-muted-foreground">
                  Bắt đầu từ một dự án thử nghiệm nhỏ với chỉ ba cửa hàng địa phương, hiện đã phát triển
                  thành mạng lưới toàn quốc với hơn 100 cửa hàng đối tác trên khắp các thành phố lớn của Việt Nam.
                </p>
              </div>
              <div className="order-1 md:order-2 animate-fade-in-up">
                <div className="relative rounded-lg overflow-hidden aspect-[4/3] shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000" 
                    alt="Câu chuyện EcoBite" 
                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white text-sm md:text-base font-medium">
                      Cửa hàng đối tác đầu tiên của chúng tôi tại TP. Hà Nội(2022)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
        
        {/* Impact */}
        <section className="py-16 md:py-24 bg-muted/30">
          <Container>
            <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
              <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium mb-4 inline-block">
                Tác động của chúng tôi
              </span>
              <h2 className="text-3xl font-bold mb-4">Tạo sự khác biệt</h2>
              <p className="text-muted-foreground">
                Kể từ khi ra mắt, chúng tôi đã đạt được những bước tiến đáng kể trong việc giảm lãng phí thực phẩm
                và cung cấp các lựa chọn thực phẩm giá cả phải chăng trên khắp Việt Nam.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">60+ tấn</div>
                <p className="text-muted-foreground text-sm">Lượng thực phẩm được ngăn chặn lãng phí hàng năm</p>
              </div>
              
              <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">100+</div>
                <p className="text-muted-foreground text-sm">Cửa hàng đối tác trên khắp Việt Nam</p>
              </div>
              
              <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">50.000+</div>
                <p className="text-muted-foreground text-sm">Người dùng tích cực trên nền tảng</p>
              </div>
              
              <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <Badge className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">2 tỷ+ ₫</div>
                <p className="text-muted-foreground text-sm">Tiết kiệm cho người tiêu dùng</p>
              </div>
            </div>
          </Container>
        </section>
        
        {/* Team */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
              <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium mb-4 inline-block">
                Đội ngũ
              </span>
              <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
              <p className="text-muted-foreground">
                Gặp gỡ những người đam mê đằng sau EcoBite, những người làm việc không mệt mỏi 
                để giảm lãng phí thực phẩm tại Việt Nam.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className="rounded-xl overflow-hidden border group hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="font-semibold text-xl mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-3">{member.position}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
        
        {/* Values */}
        <section className="py-16 md:py-24 bg-muted/30">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <div className="rounded-lg overflow-hidden aspect-[4/3] shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1557318041-1ce374d55ebf?q=80&w=1200" 
                    alt="Giá trị của EcoBite" 
                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
              
              <div className="animate-fade-in-up delay-100">
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium mb-4 inline-block">
                  Giá trị cốt lõi
                </span>
                <h2 className="text-3xl font-bold mb-6">Giá trị dẫn dắt chúng tôi</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="p-2 rounded-full bg-primary/10 h-fit">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Tính bền vững</h3>
                      <p className="text-muted-foreground text-sm">
                        Chúng tôi đặt mục tiêu giảm thiểu tác động môi trường bằng cách giảm lãng phí thực phẩm và thúc đẩy tiêu dùng có trách nhiệm.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="p-2 rounded-full bg-primary/10 h-fit">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Sự công bằng</h3>
                      <p className="text-muted-foreground text-sm">
                        Chúng tôi tin vào việc mọi người đều xứng đáng có quyền tiếp cận thực phẩm chất lượng với giá cả phải chăng, bất kể hoàn cảnh của họ.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="p-2 rounded-full bg-primary/10 h-fit">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Đổi mới</h3>
                      <p className="text-muted-foreground text-sm">
                        Chúng tôi liên tục tìm kiếm các giải pháp sáng tạo để giảm lãng phí thực phẩm và cải thiện trải nghiệm của người dùng.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
        
        {/* CTA */}
        <section className="py-16 md:py-24 bg-primary/5 border-y">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 animate-fade-in-up">
                Tham gia cùng chúng tôi trong cuộc chiến chống lãng phí thực phẩm
              </h2>
              <p className="text-muted-foreground mb-8 animate-fade-in-up delay-100">
                Cho dù bạn là người tiêu dùng, chủ cửa hàng, hay nhà đầu tư tiềm năng, 
                chúng tôi mời bạn tham gia cùng chúng tôi trong sứ mệnh của mình.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
                <Button size="lg" className="transition-transform hover:scale-105">
                  Tải ứng dụng
                </Button>
                <Button variant="outline" size="lg" className="transition-transform hover:scale-105">
                  <Mail className="mr-2 h-4 w-4" />
                  Liên hệ chúng tôi
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
