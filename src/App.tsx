import { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, CheckCircle, Sparkles, Crown, 
  MapPin, User, Star,
  MessageCircle, Heart, X,
  Users, DollarSign, Package, ArrowUp,
  Zap, Image as ImageIcon, Send,
  Truck, Clock, ThumbsUp,
  Wand2, Gavel, LogIn, Verified
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import './App.css';

// Types
interface Listing {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  location: string;
  weight?: string;
  seller: {
    name: string;
    type: 'individual' | 'farm' | 'company';
    verified: boolean;
    premium: boolean;
    rating: number;
    avatar: string;
  };
  featured: boolean;
  aiEnhanced: boolean;
  photoCount: number;
  isAuction: boolean;
  auctionEnd?: string;
  currentBid?: number;
}

interface DemoAccount {
  id: string;
  name: string;
  type: 'buyer' | 'seller' | 'admin';
  avatar: string;
  description: string;
  verified: boolean;
}

// Animal Icons Map
const animalIcons: Record<string, string> = {
  'Cattle': '/images/icon-cow.png',
  'Goats': '/images/icon-goat.png',
  'Sheep': '/images/icon-sheep.png',
  'Chickens': '/images/icon-chicken.png',
  'Horses': '/images/icon-horse.png',
  'Swine': '/images/icon-pig.png',
  'Pigs': '/images/icon-pig.png',
  'Ducks': '/images/icon-duck.png',
  'Rabbits': '/images/icon-rabbit.png',
  'Alpacas': '/images/icon-alpaca.png',
  'Donkeys': '/images/icon-donkey.png',
  'Peafowl': '/images/icon-peacock.png',
  'Emus': '/images/icon-emu.png',
};

// Demo Data
const demoAccounts: DemoAccount[] = [
  { id: 'buyer1', name: 'John Smith', type: 'buyer', avatar: 'JS', description: 'Individual buyer looking for cattle', verified: true },
  { id: 'seller1', name: 'Van der Merwe Farms', type: 'seller', avatar: 'VD', description: 'Premium verified farm seller', verified: true },
  { id: 'admin1', name: 'Admin User', type: 'admin', avatar: 'AD', description: 'Platform administrator', verified: true },
];

const listings: Listing[] = [
  {
    id: 1,
    title: 'Premium Angus Cattle',
    price: 25000,
    image: '/images/angus-cattle.jpg',
    category: 'Cattle',
    location: 'Free State',
    weight: '450 kg',
    seller: { name: 'Van der Merwe Farms', type: 'farm', verified: true, premium: true, rating: 4.9, avatar: 'VD' },
    featured: true,
    aiEnhanced: true,
    photoCount: 8,
    isAuction: false
  },
  {
    id: 2,
    title: 'Purebred Boer Goats',
    price: 3500,
    image: '/images/boer-goats.jpg',
    category: 'Goats',
    location: 'Limpopo',
    seller: { name: 'Khumalo Livestock', type: 'company', verified: true, premium: true, rating: 4.9, avatar: 'KL' },
    featured: false,
    aiEnhanced: true,
    photoCount: 5,
    isAuction: true,
    auctionEnd: '2 days left',
    currentBid: 3200
  },
  {
    id: 3,
    title: 'Layer Chickens (100 units)',
    price: 3200,
    image: '/images/chickens.jpg',
    category: 'Chickens',
    location: 'Western Cape',
    seller: { name: 'De Jong Poultry', type: 'farm', verified: true, premium: false, rating: 4.8, avatar: 'DJ' },
    featured: false,
    aiEnhanced: false,
    photoCount: 3,
    isAuction: false
  },
  {
    id: 4,
    title: 'Merino Sheep - Breeding Stock',
    price: 4200,
    image: '/images/merino-sheep.jpg',
    category: 'Sheep',
    location: 'Eastern Cape',
    seller: { name: 'Smit Wools', type: 'farm', verified: true, premium: false, rating: 4.7, avatar: 'SW' },
    featured: false,
    aiEnhanced: false,
    photoCount: 4,
    isAuction: true,
    auctionEnd: '5 hours left',
    currentBid: 3800
  },
  {
    id: 5,
    title: 'Quarter Horse Gelding',
    price: 45000,
    image: '/images/quarter-horse.jpg',
    category: 'Horses',
    location: 'Gauteng',
    seller: { name: 'Equine Estate', type: 'company', verified: true, premium: true, rating: 5.0, avatar: 'EE' },
    featured: true,
    aiEnhanced: true,
    photoCount: 4,
    isAuction: false
  },
  {
    id: 6,
    title: 'New Zealand White Rabbits',
    price: 350,
    image: '/images/rabbits.jpg',
    category: 'Rabbits',
    location: 'KZN',
    seller: { name: 'Bunny Haven', type: 'individual', verified: false, premium: false, rating: 4.2, avatar: 'BH' },
    featured: false,
    aiEnhanced: false,
    photoCount: 2,
    isAuction: false
  },
  {
    id: 7,
    title: 'Pekin Ducks (20)',
    price: 1800,
    image: '/images/ducks.jpg',
    category: 'Ducks',
    location: 'Mpumalanga',
    seller: { name: 'Duck Haven', type: 'individual', verified: true, premium: false, rating: 4.6, avatar: 'DH' },
    featured: false,
    aiEnhanced: false,
    photoCount: 3,
    isAuction: true,
    auctionEnd: '1 day left',
    currentBid: 1500
  },
  {
    id: 8,
    title: 'Suri Alpacas - Breeding Pair',
    price: 12000,
    image: '/images/alpacas.jpg',
    category: 'Alpacas',
    location: 'Western Cape',
    seller: { name: 'Alpaca Dreams', type: 'farm', verified: true, premium: true, rating: 4.8, avatar: 'AD' },
    featured: false,
    aiEnhanced: true,
    photoCount: 6,
    isAuction: false
  },
  {
    id: 9,
    title: 'Kalahari Red Goats',
    price: 2800,
    image: '/images/kalahari-goats.jpg',
    category: 'Goats',
    location: 'Northern Cape',
    seller: { name: 'Red Rock Farm', type: 'farm', verified: true, premium: false, rating: 4.7, avatar: 'RR' },
    featured: false,
    aiEnhanced: false,
    photoCount: 4,
    isAuction: false
  },
  {
    id: 10,
    title: 'Brahman Heifers',
    price: 18000,
    image: '/images/brahman-cattle.jpg',
    category: 'Cattle',
    location: 'Limpopo',
    seller: { name: 'Northern Livestock', type: 'company', verified: true, premium: true, rating: 4.9, avatar: 'NL' },
    featured: true,
    aiEnhanced: true,
    photoCount: 5,
    isAuction: true,
    auctionEnd: '3 days left',
    currentBid: 16500
  },
  {
    id: 11,
    title: 'Dohne Merino Lambs',
    price: 2500,
    image: '/images/dohne-merino.jpg',
    category: 'Sheep',
    location: 'Eastern Cape',
    seller: { name: 'Green Pastures', type: 'farm', verified: true, premium: false, rating: 4.9, avatar: 'GP' },
    featured: false,
    aiEnhanced: false,
    photoCount: 3,
    isAuction: false
  },
  {
    id: 12,
    title: 'Large White Sows',
    price: 6500,
    image: '/images/pigs.jpg',
    category: 'Swine',
    location: 'North West',
    seller: { name: 'Piggy Bank Farms', type: 'farm', verified: true, premium: false, rating: 4.5, avatar: 'PB' },
    featured: false,
    aiEnhanced: false,
    photoCount: 4,
    isAuction: false
  }
];

const categories = [
  'All Animals', 'Cattle', 'Goats', 'Sheep', 'Chickens', 'Horses', 
  'Swine', 'Ducks', 'Rabbits', 'Alpacas', 'Donkeys', 'Peafowl', 'Emus'
];

// Flash Screen Component
function FlashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 3;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500">
      <div className="text-center px-4">
        <div className="w-28 h-28 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
          <img src="/images/icon-cow.png" alt="Logo" className="w-20 h-20" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">BuyLiveStock</h1>
        <p className="text-xl text-white/90 mb-8 animate-fade-in-up delay-200">South Africa's #1 Livestock Marketplace 🐄🐐🐑</p>
        <div className="w-72 h-2 bg-white/30 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-center gap-3 mt-8">
          {['/images/icon-chicken.png', '/images/icon-goat.png', '/images/icon-cow.png', '/images/icon-sheep.png', '/images/icon-horse.png'].map((src, i) => (
            <img key={i} src={src} alt="" className="w-12 h-12 animate-bounce-in hover:scale-125 transition-transform" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Sign Up Modal
function SignUpModal({ isOpen, onClose, onSignUp }: { isOpen: boolean; onClose: () => void; onSignUp: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Join BuyLiveStock - It's Free!
          </DialogTitle>
          <DialogDescription>
            Create your free account to buy, sell, and bid on livestock
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 ? (
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
              <h4 className="font-semibold text-amber-800 mb-2">✨ Free Membership Includes:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Browse all listings</li>
                <li>• Buy and sell livestock</li>
                <li>• Participate in auctions</li>
                <li>• Chat with sellers</li>
                <li>• Save favorites to watchlist</li>
              </ul>
            </div>
            <div className="space-y-3">
              <Input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <Input placeholder="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <Input placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <Button onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
              Continue <ArrowUp className="w-4 h-4 ml-2 rotate-90" />
            </Button>
            <p className="text-xs text-center text-gray-500">
              Already have an account? <button className="text-amber-600 font-medium">Log in</button>
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Verified className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="font-semibold text-lg">Quick Verification</h4>
              <p className="text-sm text-gray-500">For everyone's safety, we verify all users</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                <span className="text-sm">Verify phone number via SMS</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                <span className="text-sm">Upload ID document (quick scan)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                <span className="text-sm">Selfie for verification (30 seconds)</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={() => { onSignUp(); onClose(); }} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                <CheckCircle className="w-4 h-4 mr-2" /> Complete
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// User Account Modal with AI Photo Enhancement
function UserAccountModal({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: DemoAccount | null }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const enhanceImage = () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast.success('Image enhanced successfully!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="w-6 h-6 text-amber-500" />
            My Account
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="ai-enhance">
              <Sparkles className="w-4 h-4 mr-1" /> AI Enhance
            </TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-2xl bg-amber-500 text-white">{user?.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-gray-500">{user?.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-green-500"><Verified className="w-3 h-3 mr-1" /> Verified</Badge>
                  <Badge className="bg-purple-500"><Crown className="w-3 h-3 mr-1" /> Premium</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">12</p>
                  <p className="text-sm text-gray-500">Listings</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">48</p>
                  <p className="text-sm text-gray-500">Sales</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">4.9</p>
                  <p className="text-sm text-gray-500">Rating</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-enhance" className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
              <h4 className="font-semibold text-purple-800 flex items-center gap-2">
                <Wand2 className="w-5 h-5" /> AI Photo Enhancement
              </h4>
              <p className="text-sm text-purple-600 mt-1">Transform your livestock photos with AI magic!</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className="font-medium">Upload Photo</h5>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-amber-400 transition-colors">
                  {selectedImage ? (
                    <img src={selectedImage} alt="Original" className="max-h-40 mx-auto rounded-lg" />
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="ai-upload" />
                      <Button onClick={() => document.getElementById('ai-upload')?.click()} variant="outline" size="sm">Select Image</Button>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h5 className="font-medium">Enhanced Result</h5>
                <div className="border-2 border-gray-200 rounded-xl p-6 text-center bg-gray-50 min-h-[180px] flex items-center justify-center">
                  {isProcessing ? (
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 relative">
                        <div className="absolute inset-0 border-3 border-amber-200 rounded-full" />
                        <div className="absolute inset-0 border-3 border-amber-500 rounded-full border-t-transparent animate-spin" />
                      </div>
                      <Progress value={progress} className="w-32 mx-auto" />
                    </div>
                  ) : selectedImage && progress === 100 ? (
                    <img src={selectedImage} alt="Enhanced" className="max-h-40 mx-auto rounded-lg" />
                  ) : (
                    <Sparkles className="w-12 h-12 text-gray-300" />
                  )}
                </div>
              </div>
            </div>
            <Button onClick={enhanceImage} disabled={!selectedImage || isProcessing} className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Wand2 className="w-4 h-4 mr-2" /> Enhance with AI
            </Button>
          </TabsContent>

          <TabsContent value="verification">
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Verified className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="font-semibold text-lg">You're Verified! ✅</h4>
              <p className="text-gray-500 mt-2">Your account has been verified for safety</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Chatbot Component
function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{text: string; isUser: boolean}[]>([
    { text: 'Hey there! 🐄 I\'m your livestock buddy! How can I help you today?', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setTimeout(() => {
      const responses = [
        'Looking for some amazing livestock? Check out our marketplace! 🐑',
        'Our AI can enhance your animal photos to look professional! 📸✨',
        'You can filter by any animal type - we have them all! 🦆🐐🐄',
        'Premium members get priority listing and more features! 👑',
        'Our escrow keeps both buyers and sellers safe! 🛡️'
      ];
      setMessages(prev => [...prev, { text: responses[Math.floor(Math.random() * responses.length)], isUser: false }]);
    }, 800);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border-2 border-amber-300 animate-slide-up">
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/icon-cow.png" alt="Bot" className="w-8 h-8" />
          <span className="text-white font-semibold">Livestock Buddy</span>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <ScrollArea className="h-72 p-3" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-2 rounded-xl text-sm ${msg.isUser ? 'bg-amber-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-2 border-t border-gray-200 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type..." className="flex-1 text-sm" />
        <Button onClick={handleSend} size="icon" className="bg-amber-500 hover:bg-amber-600 h-8 w-8"><Send className="w-3 h-3" /></Button>
      </div>
    </div>
  );
}

// Chat System Component
function ChatSystem({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[70vh] p-0 overflow-hidden">
        <div className="flex h-full">
          <div className="w-64 border-r border-gray-200 bg-gray-50 p-3">
            <h3 className="font-semibold mb-3">Messages</h3>
            <div className="space-y-2">
              {['Van der Merwe Farms', 'Khumalo Livestock', 'De Jong Poultry'].map((name, i) => (
                <div key={i} className="flex items-center gap-2 p-2 hover:bg-white rounded-lg cursor-pointer">
                  <Avatar className="w-8 h-8"><AvatarFallback className="bg-amber-500 text-white text-xs">{name[0]}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-gray-500 truncate">Hey, is this still available?</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="p-3 border-b border-gray-200 flex items-center gap-2">
              <Avatar className="w-8 h-8"><AvatarFallback className="bg-amber-500 text-white">V</AvatarFallback></Avatar>
              <span className="font-medium">Van der Merwe Farms</span>
              <div className="w-2 h-2 bg-green-500 rounded-full ml-auto" />
            </div>
            <div className="flex-1 p-4 bg-gray-50">
              <div className="space-y-3">
                <div className="flex justify-start"><div className="bg-white p-2 rounded-lg rounded-bl-none text-sm shadow-sm">Hi! Interested in the Angus cattle?</div></div>
                <div className="flex justify-end"><div className="bg-amber-500 text-white p-2 rounded-lg rounded-br-none text-sm">Yes! Are they still available?</div></div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-200 flex gap-2">
              <Input placeholder="Type a message..." className="flex-1" />
              <Button size="icon" className="bg-amber-500"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Light & Fun Admin Dashboard
function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Users', value: '12,450', icon: Users, color: 'bg-blue-400', emoji: '👥' },
    { label: 'Listings', value: '3,210', icon: Package, color: 'bg-green-400', emoji: '📦' },
    { label: 'Revenue', value: 'R2.4M', icon: DollarSign, color: 'bg-amber-400', emoji: '💰' },
    { label: 'Happy Users', value: '98%', icon: ThumbsUp, color: 'bg-pink-400', emoji: '😊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" className="border-gray-300">
              <ArrowUp className="w-4 h-4 mr-2 rotate-[-90deg]" /> Back
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span className="text-3xl">🎉</span> Admin Dashboard
            </h1>
          </div>
          <Avatar><AvatarFallback className="bg-gradient-to-r from-amber-400 to-orange-400 text-white">AD</AvatarFallback></Avatar>
        </div>

        {/* Fun Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-0 shadow-lg hover:scale-105 transition-transform">
              <CardContent className="p-4">
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white shadow-md mb-4">
            {['overview', 'users', 'listings', 'verifications'].map(tab => (
              <TabsTrigger key={tab} value={tab} className="capitalize">{tab}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg">
                <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /> Recent Activity</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { emoji: '👤', text: 'New user: John Smith joined', time: '2m ago' },
                      { emoji: '🐄', text: 'New listing: Angus Cattle', time: '5m ago' },
                      { emoji: '✅', text: 'Verification: Khumalo Livestock', time: '12m ago' },
                      { emoji: '💸', text: 'Sale completed: R18,000', time: '25m ago' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <span className="text-xl">{item.emoji}</span>
                        <span className="flex-1 text-sm">{item.text}</span>
                        <span className="text-xs text-gray-400">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Quick Actions</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Manage Users', emoji: '👥' },
                      { label: 'Moderate', emoji: '📋' },
                      { label: 'Reports', emoji: '🚨' },
                      { label: 'Verify', emoji: '✅' },
                    ].map((action, i) => (
                      <Button key={i} variant="outline" className="justify-start border-gray-200 hover:bg-amber-50">
                        <span className="mr-2">{action.emoji}</span> {action.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Demo Accounts Modal
function DemoAccountsModal({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (account: DemoAccount) => void }) {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" /> Demo Accounts
          </DialogTitle>
          <DialogDescription>Try the platform as different user types</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {demoAccounts.map((account) => (
            <div key={account.id} onClick={() => { onSelect(account); onClose(); }} 
              className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center gap-4">
              <Avatar className="w-14 h-14">
                <AvatarFallback className={`text-lg ${account.type === 'buyer' ? 'bg-blue-500' : account.type === 'seller' ? 'bg-green-500' : 'bg-purple-500'} text-white`}>{account.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold">{account.name}</h4>
                <p className="text-sm text-gray-500">{account.description}</p>
                <div className="flex gap-2 mt-1">
                  <Badge className={account.type === 'buyer' ? 'bg-blue-100 text-blue-700' : account.type === 'seller' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}>
                    {account.type}
                  </Badge>
                  {account.verified && <Badge className="bg-green-500"><Verified className="w-3 h-3 mr-1" /> Verified</Badge>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main App Component
function App() {
  const [showFlash, setShowFlash] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [demoAccountsOpen, setDemoAccountsOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [userAccountOpen, setUserAccountOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<DemoAccount | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Animals');
  const [watchlist, setWatchlist] = useState<number[]>([]);

  const toggleWatchlist = (id: number) => {
    setWatchlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    toast.success(watchlist.includes(id) ? 'Removed from watchlist' : 'Added to watchlist');
  };

  const handleBuyClick = () => {
    if (!currentUser) {
      setSignUpOpen(true);
    } else {
      toast.success('Purchase initiated!');
    }
  };

  const filteredListings = selectedCategory === 'All Animals' 
    ? listings 
    : listings.filter(l => l.category === selectedCategory);

  if (showFlash) return <FlashScreen onComplete={() => setShowFlash(false)} />;
  if (currentView === 'admin') return <AdminDashboard onBack={() => setCurrentView('home')} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Colorful Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                <img src="/images/icon-cow.png" alt="Logo" className="w-8 h-8" />
              </div>
              <span className="text-xl font-bold text-white drop-shadow-md">BuyLiveStock</span>
            </div>

            <nav className="hidden md:flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
              {['Home', 'Marketplace', 'Auctions', 'Wanted'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-1.5 text-white font-medium hover:bg-white/20 rounded-full transition-colors">
                  {item}
                </a>
              ))}
              <button onClick={() => setCurrentView('admin')} className="px-4 py-1.5 text-white font-medium hover:bg-white/20 rounded-full transition-colors">Admin</button>
            </nav>

            <div className="flex items-center gap-2">
              {currentUser ? (
                <div onClick={() => setUserAccountOpen(true)} className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5 cursor-pointer hover:bg-white/30 transition-colors">
                  <Avatar className="w-7 h-7"><AvatarFallback className="bg-white text-amber-600 text-xs">{currentUser.avatar}</AvatarFallback></Avatar>
                  <span className="text-white text-sm font-medium">{currentUser.name.split(' ')[0]}</span>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setSignUpOpen(true)} className="bg-white/20 border-white text-white hover:bg-white hover:text-amber-600">
                  <LogIn className="w-4 h-4 mr-1" /> Login
                </Button>
              )}
              <Button size="sm" onClick={() => setDemoAccountsOpen(true)} className="bg-white text-amber-600 hover:bg-gray-100">
                <Users className="w-4 h-4 mr-1" /> Demo
              </Button>
              <Button size="icon" onClick={() => setChatOpen(true)} className="bg-white/20 text-white hover:bg-white/30 border-0">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-bg.jpg" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-amber-500 rounded-full text-sm font-medium animate-pulse">🎉 South Africa's #1 Marketplace</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Buy & Sell <span className="text-amber-300">Livestock</span> with Confidence
            </h1>
            <p className="text-lg mb-6 text-white/90">
              Join thousands of farmers, breeders, and buyers. Free to join, verified for safety! 🐄🐐🐑
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                <Search className="w-5 h-5 mr-2" /> Browse Animals
              </Button>
              <Button size="lg" className="bg-violet-500 hover:bg-violet-600 text-white">
                <PlusCircle className="w-5 h-5 mr-2" /> Start Selling
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              {['✅ Verified Users', '🛡️ Escrow Protection', '⚡ AI Features', '👑 Premium'].map((badge, i) => (
                <span key={i} className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compact Premium Banner */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-4 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold">Get Verified & Stand Out! 👑</h3>
              <p className="text-sm text-white/80">Priority ranking • Unlimited listings • Badge</p>
            </div>
          </div>
          <Button size="sm" className="bg-white text-purple-600 hover:bg-gray-100">
            <Crown className="w-4 h-4 mr-1" /> Upgrade R99/mo
          </Button>
        </div>
      </section>

      {/* Compact AI Transport Estimator */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">AI Transport Estimator 🚛</h3>
                <p className="text-sm text-white/80">Get instant shipping quotes</p>
              </div>
            </div>
            <div className="flex-1 flex flex-wrap gap-2">
              <Input placeholder="From" className="w-32 bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm" />
              <Input placeholder="To" className="w-32 bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm" />
              <select className="w-28 bg-white/20 border border-white/30 rounded-md px-2 py-1.5 text-white text-sm">
                <option className="text-gray-800">Cattle</option>
                <option className="text-gray-800">Goats</option>
                <option className="text-gray-800">Sheep</option>
              </select>
              <Button size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                <Sparkles className="w-4 h-4 mr-1" /> Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="max-w-7xl mx-auto px-4 py-4">
        {/* Animated Category Filters */}
        <div className="mb-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-amber-100 border border-gray-200'
                  }`}
                >
                  {cat !== 'All Animals' && animalIcons[cat] && (
                    <img src={animalIcons[cat]} alt="" className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
                  )}
                  {cat === 'All Animals' && <span className="text-lg">🐾</span>}
                  {cat}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Listings Grid */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured <span className="text-amber-600">Livestock</span> 🐄</h2>
          <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
            <option>Most Recent</option>
            <option>Price: Low to High</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <div className="relative">
                <img src={listing.image} alt={listing.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                {listing.isAuction && (
                  <Badge className="absolute top-2 left-2 bg-red-500 animate-pulse">
                    <Gavel className="w-3 h-3 mr-1" /> Auction
                  </Badge>
                )}
                {listing.seller.premium && (
                  <Badge className="absolute top-2 right-2 bg-violet-500"><Crown className="w-3 h-3 mr-1" /> Premium</Badge>
                )}
                <button onClick={() => toggleWatchlist(listing.id)} className="absolute bottom-2 right-2">
                  <Heart className={`w-5 h-5 ${watchlist.includes(listing.id) ? 'fill-red-500 text-red-500' : 'text-white drop-shadow-md'}`} />
                </button>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm mb-1">{listing.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-amber-600">R {listing.price.toLocaleString()}</span>
                  {listing.isAuction && (
                    <span className="text-xs text-red-500 font-medium">Bid: R{listing.currentBid?.toLocaleString()}</span>
                  )}
                </div>
                {listing.isAuction && (
                  <p className="text-xs text-red-500 mb-2">⏰ {listing.auctionEnd}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <MapPin className="w-3 h-3" /> {listing.location}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <Avatar className="w-6 h-6"><AvatarFallback className="bg-amber-100 text-amber-700 text-xs">{listing.seller.avatar}</AvatarFallback></Avatar>
                  <span className="text-xs truncate flex-1">{listing.seller.name}</span>
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs">{listing.seller.rating}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button onClick={handleBuyClick} size="sm" className="flex-1 bg-amber-500 hover:bg-amber-600 text-xs">
                    {listing.isAuction ? 'Place Bid' : 'Buy Now'}
                  </Button>
                  <Button onClick={() => setChatOpen(true)} size="sm" variant="outline" className="text-xs">
                    <MessageCircle className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Enhanced Wanted Section with Animated Animals */}
      <section id="wanted" className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎯</span>
              <div>
                <h2 className="text-2xl font-bold">Wanted Ads</h2>
                <p className="text-gray-600">Looking for something specific? Post here!</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500">
              <PlusCircle className="w-4 h-4 mr-2" /> Post Wanted
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { image: '/images/wanted-goat.png', title: 'Boer Goats', detail: '10 breeding does needed', location: 'KZN', reward: 'R35,000' },
              { image: '/images/wanted-chicken.png', title: 'Layer Chicks', detail: '500 day-old chicks', location: 'Any', reward: 'R15,000' },
              { image: '/images/wanted-cow.png', title: 'Angus Bulls', detail: '5 young bulls', location: 'Free State', reward: 'R125,000' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105">
                <div className="flex items-start gap-4">
                  <img src={item.image} alt="" className="w-24 h-24 object-contain animate-bounce" style={{ animationDuration: '3s' }} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.detail}</p>
                    <p className="text-xs text-gray-400 mt-1">📍 {item.location}</p>
                    <p className="text-sm font-bold text-green-600 mt-2">💰 {item.reward}</p>
                  </div>
                </div>
                <Button onClick={handleBuyClick} size="sm" className="w-full mt-3 bg-gradient-to-r from-amber-400 to-orange-400">
                  I Have This! 🙋
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compact Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/images/icon-cow.png" alt="" className="w-8 h-8" />
              <span className="font-bold">BuyLiveStock</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-amber-400 transition-colors">Marketplace</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Auctions</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Support</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Terms</a>
            </div>
            <p className="text-sm text-gray-500">&copy; 2024 BuyLiveStock 🐄</p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <button onClick={() => setChatbotOpen(!chatbotOpen)} className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-50 border-4 border-white">
        <img src="/images/icon-cow.png" alt="Chat" className="w-8 h-8" />
      </button>

      {/* Modals */}
      <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
      <ChatSystem isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <DemoAccountsModal isOpen={demoAccountsOpen} onClose={() => setDemoAccountsOpen(false)} onSelect={setCurrentUser} />
      <SignUpModal isOpen={signUpOpen} onClose={() => setSignUpOpen(false)} onSignUp={() => { setCurrentUser(demoAccounts[0]); toast.success('Welcome! You are now logged in.'); }} />
      <UserAccountModal isOpen={userAccountOpen} onClose={() => setUserAccountOpen(false)} user={currentUser} />
    </div>
  );
}

export default App;
