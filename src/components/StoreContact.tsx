
import { Phone, MapPin, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface StoreContactProps {
  store: {
    name: string;
    address: string;
    phone: string;
    hours: string;
    image: string;
  };
  product: string;
  onClose: () => void;
}

export function StoreContact({ store, product, onClose }: StoreContactProps) {
  const [message, setMessage] = useState("");
  
  const handleCall = () => {
    // In a real app, this would use a tel: link
    toast({
      title: "Calling store",
      description: `Connecting you to ${store.name} (${store.phone})`,
    });
  };
  
  const handleSendMessage = () => {
    // In a real app, this would send the message to the store
    if (!message.trim()) {
      toast({
        title: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Message sent",
      description: "The store will get back to you shortly.",
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-auto">
        <div className="relative p-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center mb-6">
            <img 
              src={store.image} 
              alt={store.name} 
              className="h-12 w-12 rounded-full mr-4 object-cover"
            />
            <div>
              <h3 className="font-bold text-lg">{store.name}</h3>
              <p className="text-sm text-muted-foreground">Contact store about: {product}</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex">
              <MapPin className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
              <p className="text-sm">{store.address}</p>
            </div>
            
            <div className="flex">
              <Phone className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
              <p className="text-sm">{store.phone}</p>
            </div>
            
            <div className="flex">
              <Clock className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
              <p className="text-sm">{store.hours}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Message to store (optional)
            </label>
            <textarea 
              className="w-full border rounded-md p-2 text-sm"
              rows={3}
              placeholder="I'm interested in this product. Is it still available?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1"
              onClick={handleCall}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Store
            </Button>
            
            <Button 
              className="flex-1"
              onClick={handleSendMessage}
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
