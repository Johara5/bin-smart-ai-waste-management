import { useState, useRef } from 'react';
import { Camera, Upload, Scan, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { apiService } from '@/lib/api';

interface WasteType {
  name: string;
  color: string;
  bgColor: string;
  points: number;
  description: string;
  examples: string[];
}

interface ScanResult {
  wasteType: WasteType;
  confidence: number;
  pointsEarned: number;
}

const WasteScanner = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const wasteTypes: WasteType[] = [
    {
      name: 'Plastic',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      points: 10,
      description: 'Bottles, containers, packaging materials',
      examples: ['Water bottles', 'Food containers', 'Plastic bags', 'Packaging']
    },
    {
      name: 'Organic',
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      points: 5,
      description: 'Food scraps, biodegradable materials',
      examples: ['Fruit peels', 'Vegetable scraps', 'Food waste', 'Garden waste']
    },
    {
      name: 'Paper',
      color: 'text-orange-600',
      bgColor: 'bg-orange-500',
      points: 8,
      description: 'Newspapers, cardboard, documents',
      examples: ['Newspapers', 'Cardboard boxes', 'Office paper', 'Books']
    },
    {
      name: 'E-Waste',
      color: 'text-red-600',
      bgColor: 'bg-red-500',
      points: 20,
      description: 'Electronics, batteries, circuits',
      examples: ['Old phones', 'Batteries', 'Computer parts', 'Cables']
    },
    {
      name: 'Glass',
      color: 'text-purple-600',
      bgColor: 'bg-purple-500',
      points: 12,
      description: 'Bottles, jars, broken glass',
      examples: ['Glass bottles', 'Jars', 'Windows', 'Mirrors']
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIScan = async (): Promise<ScanResult> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Randomly select a waste type for demo
    const randomType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-100% confidence
    
    // Submit scan to MySQL database via Python backend
    try {
      const userId = 1; // For demo - in real app, get from user context
      const apiResult = await apiService.submitScan(userId, randomType.name, confidence);
      
      return {
        wasteType: randomType,
        confidence: apiResult.confidence,
        pointsEarned: apiResult.points_earned
      };
    } catch (error) {
      console.error('Failed to save scan to database:', error);
      // Fallback to local scan result if API fails
      return {
        wasteType: randomType,
        confidence,
        pointsEarned: randomType.points
      };
    }
  };

  const handleScan = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload or capture an image first",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await simulateAIScan();
      setScanResult(result);
      
      toast({
        title: "Scan Complete!",
        description: `Found ${result.wasteType.name} waste. +${result.pointsEarned} points earned!`,
        duration: 5000
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Please try again with a clearer image",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    // For demo, we'll just trigger the file input
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Waste Scanner
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use our AI-powered scanner to identify your waste type and earn points for proper disposal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scan Your Waste Section */}
          <Card className="shadow-card-eco border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-6 h-6 text-primary" />
                <span>Scan Your Waste</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload/Display Area */}
              <div className="relative">
                <div className="w-full h-80 bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
                  {selectedImage ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={selectedImage} 
                        alt="Selected waste" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {scanResult && (
                        <div className="absolute top-4 left-4 right-4">
                          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-eco">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-status-success" />
                              <span className="font-semibold text-foreground">
                                {scanResult.wasteType.name} Detected
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Confidence: {scanResult.confidence}%
                            </div>
                            <Badge variant="secondary" className="mt-2 bg-status-success/20 text-status-success">
                              +{scanResult.pointsEarned} points
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Ready to scan</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="eco"
                  size="lg"
                  onClick={handleCameraCapture}
                  className="w-full"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photo
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                </Button>
              </div>

              {/* Scan Button */}
              {selectedImage && (
                <Button
                  variant="nature"
                  size="lg"
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full"
                >
                  {isScanning ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Scan className="w-5 h-5 mr-2" />
                      Scan Waste
                    </>
                  )}
                </Button>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                capture="environment"
              />
            </CardContent>
          </Card>

          {/* Waste Classification Guide */}
          <Card className="shadow-card-eco border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Waste Classification Guide</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {wasteTypes.map((type, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors eco-hover"
                >
                  <div className={`w-12 h-12 ${type.bgColor} rounded-full flex items-center justify-center`}>
                    <span className="text-primary-foreground font-semibold">
                      {type.name[0]}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{type.name}</h3>
                      <Badge variant="secondary" className="bg-reward-gold/20 text-reward-gold">
                        {type.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {type.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {type.examples.slice(0, 2).map((example, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                      {type.examples.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{type.examples.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 shadow-card-eco border-0 bg-gradient-nature">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">💡</div>
              <h3 className="text-xl font-bold text-primary-foreground">
                Scanning Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-primary-foreground/90 text-sm">
                <p>📸 Take clear, well-lit photos</p>
                <p>🎯 Focus on the waste item</p>
                <p>🔍 Avoid cluttered backgrounds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WasteScanner;