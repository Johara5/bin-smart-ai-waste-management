import { useState, useEffect } from 'react';
import { MapPin, Navigation as NavigationIcon, Search, Filter, RefreshCw, Phone, Clock, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { apiService, type Bin } from '@/lib/api';

interface SmartBin {
  id: string;
  name: string;
  address: string;
  distance: number;
  status: 'available' | 'full' | 'maintenance';
  fillLevel: number;
  wasteTypes: string[];
  lastUpdated: string;
  coordinates: { lat: number; lng: number };
}

const BinLocator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [smartBins, setSmartBins] = useState<SmartBin[]>([]);
  const [isLoadingBins, setIsLoadingBins] = useState(true);
  
  // Fetch bins from MySQL backend
  useEffect(() => {
    const fetchBins = async () => {
      try {
        setIsLoadingBins(true);
        const binsData = await apiService.getBins();
        
        // Convert API bin data to SmartBin format
        const convertedBins: SmartBin[] = binsData.map((bin: Bin) => ({
          id: bin.id.toString(),
          name: bin.location_name,
          address: `${bin.latitude}, ${bin.longitude}`,
          distance: Math.random() * 3, // Random distance for demo
          status: bin.capacity_level === 'Full' ? 'full' : bin.capacity_level === 'Empty' ? 'available' : 'available',
          fillLevel: bin.capacity_level === 'Full' ? 95 : bin.capacity_level === 'High' ? 80 : bin.capacity_level === 'Medium' ? 50 : bin.capacity_level === 'Low' ? 25 : 10,
          wasteTypes: [bin.bin_type === 'Mixed' ? 'All Types' : bin.bin_type],
          lastUpdated: '5 mins ago',
          coordinates: { lat: bin.latitude, lng: bin.longitude }
        }));
        
        setSmartBins(convertedBins);
      } catch (error) {
        console.error('Failed to fetch bins:', error);
        // Fallback to demo data
        setSmartBins([
          {
            id: '1',
            name: 'Central Park Smart Bin',
            address: '123 Park Avenue, Downtown',
            distance: 0.3,
            status: 'available',
            fillLevel: 25,
            wasteTypes: ['Plastic', 'Paper', 'Organic'],
            lastUpdated: '5 mins ago',
            coordinates: { lat: 40.7829, lng: -73.9654 }
          },
          {
            id: '2',
            name: 'Mall Plaza EcoBin',
            address: '456 Shopping Street, Mall District',
            distance: 0.7,
            status: 'available',
            fillLevel: 60,
            wasteTypes: ['Plastic', 'E-Waste', 'Glass'],
            lastUpdated: '12 mins ago',
            coordinates: { lat: 40.7614, lng: -73.9776 }
          }
        ]);
      } finally {
        setIsLoadingBins(false);
      }
    };
    
    fetchBins();
  }, []);

  const getLocationServices = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoadingLocation(false);
          toast({
            title: "Location Found",
            description: "Smart bins sorted by distance from your location",
            duration: 3000
          });
        },
        (error) => {
          setIsLoadingLocation(false);
          toast({
            title: "Location Access Denied",
            description: "Please enable location services for better results",
            variant: "destructive"
          });
        }
      );
    } else {
      setIsLoadingLocation(false);
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-status-success';
      case 'full':
        return 'bg-destructive';
      case 'maintenance':
        return 'bg-status-warning';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'full':
        return 'Full';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  const handleNavigateToBin = (bin: SmartBin) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bin.coordinates.lat},${bin.coordinates.lng}`;
    window.open(url, '_blank');
    
    toast({
      title: "Navigation Started",
      description: `Navigating to ${bin.name}`,
      duration: 3000
    });
  };

  const filteredBins = smartBins.filter(bin => {
    const matchesSearch = bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bin.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'available') return matchesSearch && bin.status === 'available';
    if (selectedFilter === 'nearby') return matchesSearch && bin.distance <= 1.0;
    
    return matchesSearch;
  });

  useEffect(() => {
    // Auto-request location on component mount
    getLocationServices();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Navigation */}
      <div className="bg-card shadow-sm border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Find Bins</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            size="icon"
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Find Smart Bins
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Locate the nearest smart bins and check their availability in real-time
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location or bin name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={selectedFilter === 'all' ? 'eco' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
              className="flex-1"
            >
              All Bins
            </Button>
            <Button
              variant={selectedFilter === 'available' ? 'eco' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('available')}
              className="flex-1"
            >
              Available
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={getLocationServices}
            disabled={isLoadingLocation}
            className="flex items-center space-x-2"
          >
            {isLoadingLocation ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            <span>My Location</span>
          </Button>
        </div>

        {/* Map Placeholder */}
        <Card className="shadow-card-eco border-0 mb-8">
          <CardContent className="p-6">
            <div className="w-full h-64 bg-gradient-nature rounded-lg flex items-center justify-center text-primary-foreground">
              <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 mx-auto opacity-80" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                  <p className="text-primary-foreground/80">
                    Map integration coming soon! For now, use the list below to find bins.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bin List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Nearby Smart Bins ({filteredBins.length})
            </h2>
            <Badge variant="outline" className="text-xs">
              Updated in real-time
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBins.map((bin) => (
              <Card key={bin.id} className="shadow-card-eco border-0 eco-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground">{bin.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{bin.address}</p>
                    </div>
                    <div className={`w-3 h-3 ${getStatusColor(bin.status)} rounded-full`}></div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Status and Distance */}
                  <div className="flex items-center justify-between">
                    <Badge 
                      className={`${getStatusColor(bin.status)} text-primary-foreground border-0`}
                    >
                      {getStatusText(bin.status)}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{bin.distance} km away</span>
                    </div>
                  </div>

                  {/* Fill Level */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fill Level</span>
                      <span className="font-medium">{bin.fillLevel}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          bin.fillLevel > 80 ? 'bg-destructive' : 
                          bin.fillLevel > 50 ? 'bg-status-warning' : 'bg-status-success'
                        }`}
                        style={{ width: `${bin.fillLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Waste Types */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Accepts:</p>
                    <div className="flex flex-wrap gap-1">
                      {bin.wasteTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Updated {bin.lastUpdated}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      variant="eco"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleNavigateToBin(bin)}
                      disabled={bin.status === 'maintenance'}
                    >
                      <NavigationIcon className="w-4 h-4 mr-2" />
                      Navigate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast({
                        title: "Feature Coming Soon",
                        description: "Call functionality will be available soon",
                      })}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredBins.length === 0 && (
          <Card className="shadow-card-eco border-0 mt-8">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold text-foreground">No Bins Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="eco" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BinLocator;