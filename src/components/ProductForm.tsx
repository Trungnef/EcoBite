
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Image as ImageIcon, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  originalPrice: z.coerce.number().min(1000, { message: "Price must be at least 1,000₫" }),
  discountPrice: z.coerce.number().min(1, { message: "Price must be at least 1₫" }),
  expiryDate: z.date({
    required_error: "Expiration date is required",
  }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1" }),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const categories = [
  { value: "produce", label: "Fresh Produce" },
  { value: "bakery", label: "Bakery" },
  { value: "dairy", label: "Dairy & Eggs" },
  { value: "meat", label: "Meat & Seafood" },
  { value: "pantry", label: "Pantry & Dry Goods" },
  { value: "beverages", label: "Beverages" },
  { value: "snacks", label: "Snacks & Sweets" },
  { value: "prepared", label: "Prepared Foods" },
  { value: "frozen", label: "Frozen Foods" },
];

export function ProductForm() {
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      originalPrice: undefined,
      discountPrice: undefined,
      quantity: 1,
      description: "",
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    setIsSubmitting(true);
    
    // Validate that discount price is less than original price
    if (data.discountPrice >= data.originalPrice) {
      form.setError("discountPrice", {
        type: "manual",
        message: "Discount price must be less than original price",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Validate expiry date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (data.expiryDate < today) {
      form.setError("expiryDate", {
        type: "manual",
        message: "Expiration date cannot be in the past",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      console.log("Product data:", { ...data, images });
      setIsSubmitting(false);
      
      toast({
        title: "Product added successfully",
        description: "Your product has been posted and is now visible to customers.",
      });
      
      // Reset form
      form.reset();
      setImages([]);
    }, 1500);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    
    // In a real app, these would be uploaded to a server
    // Here we just create local URLs for display
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  // Calculate discount percentage
  const calculateDiscount = () => {
    const originalPrice = form.watch("originalPrice");
    const discountPrice = form.watch("discountPrice");
    
    if (!originalPrice || !discountPrice || originalPrice <= 0) return 0;
    
    const discount = ((originalPrice - discountPrice) / originalPrice) * 100;
    return Math.round(discount);
  };
  
  const discountPercentage = calculateDiscount();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price (₫)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 150000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="discountPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Price (₫)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 90000" {...field} />
                </FormControl>
                {discountPercentage > 0 && (
                  <p className="text-sm text-Eco-600 font-medium">
                    {discountPercentage}% discount
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiration Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select when the product expires
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity Available</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormDescription>
                  Number of items available
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a description of the product (optional)" 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Describe the product, its condition, and any other relevant details
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Product Images</FormLabel>
          <div className="mt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                  <img 
                    src={image} 
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <label className="aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Add Image</span>
                <input 
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  multiple
                />
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload up to 5 images of your product (optional)
            </p>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
