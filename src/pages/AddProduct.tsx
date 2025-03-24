
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { ProductForm } from "@/components/ProductForm";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Info } from "lucide-react";

export default function AddProduct() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <ShoppingBag className="h-7 w-7 mr-2 text-primary" />
                Add Near-Expiry Product
              </h1>
              <p className="text-muted-foreground">
                List your products that are approaching their expiration date at a discounted price.
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <div className="flex">
                <Info className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Listing Guidelines</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• All products must be safe for consumption and within their expiration dates</li>
                    <li>• Clearly state any quality issues or defects</li>
                    <li>• Set a fair discounted price based on the product's condition</li>
                    <li>• Upload clear, accurate images of the actual product</li>
                    <li>• Products should have at least 24 hours of shelf life remaining</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <ProductForm />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
