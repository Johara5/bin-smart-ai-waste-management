import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Gift, Trophy, Recycle, Leaf } from 'lucide-react';

const Introduction = () => {
  const navigate = useNavigate();
  
  const goToAuth = () => {
    navigate('/auth');
  };

  return (
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

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={goToAuth} 
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold py-4 px-12 text-lg shadow-glow"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Introduction;