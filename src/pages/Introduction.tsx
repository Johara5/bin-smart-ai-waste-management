import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Leaf, Recycle, MapPin, QrCode, Gift, BarChart3, ArrowRight } from 'lucide-react';
import ecoHeroImage from '@/assets/ecobin-hero.jpg';
=======
import { Camera, MapPin, Gift, Trophy, Recycle, Leaf } from 'lucide-react';
>>>>>>> f04f7a748d2d287f7dfa658231ea07b3cabffc21

const Introduction = () => {
  const navigate = useNavigate();

  const goToAuth = () => {
    navigate('/auth');
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Recycle className="h-12 w-12 text-green-600" />
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-3xl font-bold text-green-800">EcoBin</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">How EcoBin Works</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Your intelligent companion for waste management and recycling
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img
              src={ecoHeroImage}
              alt="Eco-friendly waste management"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-3">How It Works</h2>
              <p className="text-gray-700">
                EcoBin uses advanced technology to help you properly sort and dispose of waste items.
                Simply scan your waste items, and our AI will guide you to the correct bin, helping you
                contribute to a cleaner environment while earning rewards for your eco-friendly actions.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-3">Key Features</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-3 bg-green-100 p-2 rounded-full">
                    <QrCode className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Waste Scanner</span>
                    <p className="text-gray-700">Identify the correct bin for any waste item</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 bg-green-100 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Bin Locator</span>
                    <p className="text-gray-700">Find recycling and waste bins near you</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 bg-green-100 p-2 rounded-full">
                    <Gift className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Rewards System</span>
                    <p className="text-gray-700">Earn points for proper waste disposal</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 bg-green-100 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Personal Dashboard</span>
                    <p className="text-gray-700">Track your environmental impact</p>
                  </div>
                </li>
              </ul>
            </div>
=======
    <div className="min-h-screen bg-gradient-nature">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <Recycle className="w-16 h-16 text-primary-foreground" />
              <Leaf className="absolute -top-1 -right-1 w-6 h-6 text-accent-foreground animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold text-primary-foreground">BinSmart</h1>
          </div>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Your intelligent companion for waste management and recycling
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary-foreground text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-center">
              <CardContent className="p-6">
                <Camera className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">1. Scan Waste</h3>
                <p className="text-primary-foreground/80 text-sm">Take a photo of your waste item</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-center">
              <CardContent className="p-6">
                <Recycle className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">2. AI Identifies</h3>
                <p className="text-primary-foreground/80 text-sm">Our AI identifies the waste type</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-center">
              <CardContent className="p-6">
                <MapPin className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">3. Find Bin</h3>
                <p className="text-primary-foreground/80 text-sm">Locate the nearest appropriate bin</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-center">
              <CardContent className="p-6">
                <Trophy className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">4. Earn Points</h3>
                <p className="text-primary-foreground/80 text-sm">Get rewarded for proper disposal</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary-foreground text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-6 text-center">
                <Camera className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">Waste Scanner</h3>
                <p className="text-primary-foreground/80 text-sm">AI-powered waste identification</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">Bin Locator</h3>
                <p className="text-primary-foreground/80 text-sm">Find nearby smart bins</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-6 text-center">
                <Gift className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">Rewards System</h3>
                <p className="text-primary-foreground/80 text-sm">Earn points for proper disposal</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">Track Progress</h3>
                <p className="text-primary-foreground/80 text-sm">Monitor your environmental impact</p>
              </CardContent>
            </Card>
>>>>>>> f04f7a748d2d287f7dfa658231ea07b3cabffc21
          </div>
        </div>

        {/* Points System */}
        <div className="mb-16">
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary-foreground text-center mb-8">Points & Rewards System</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">10</span>
                  </div>
                  <p className="text-primary-foreground text-sm">Plastic</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <p className="text-primary-foreground text-sm">Organic</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">8</span>
                  </div>
                  <p className="text-primary-foreground text-sm">Paper</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">20</span>
                  </div>
                  <p className="text-primary-foreground text-sm">E-Waste</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">12</span>
                  </div>
                  <p className="text-primary-foreground text-sm">Glass</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary-foreground text-center mb-12">Why Use BinSmart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Recycle className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-primary-foreground mb-2">Reduce Waste</h3>
                <p className="text-primary-foreground/80">Learn proper sorting and reduce your environmental footprint</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-primary-foreground mb-2">Earn Rewards</h3>
                <p className="text-primary-foreground/80">Get points for every proper disposal and redeem amazing rewards</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-primary-foreground mb-2">Save Planet</h3>
                <p className="text-primary-foreground/80">Make a real difference in your community and environment</p>
              </CardContent>
            </Card>
          </div>
        </div>

<<<<<<< HEAD
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Why Use Bin Smart?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Reduce Waste</h3>
              <p className="text-gray-600">Learn how to properly sort and reduce your waste footprint</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Save Time</h3>
              <p className="text-gray-600">Quickly identify the right bin without confusion</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Environmental Impact</h3>
              <p className="text-gray-600">Make a real difference in your community and the planet</p>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="text-center mt-8">
          <Button
            onClick={goToAuth}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all"
=======
        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={goToAuth} 
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold py-4 px-12 text-lg shadow-glow"
>>>>>>> f04f7a748d2d287f7dfa658231ea07b3cabffc21
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
