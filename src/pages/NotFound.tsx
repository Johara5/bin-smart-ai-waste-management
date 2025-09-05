import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-nature p-4">
      <Card className="max-w-md w-full shadow-card-eco border-0">
        <CardContent className="p-8 text-center space-y-6">
          {/* 404 Icon */}
          <div className="text-6xl">🌱</div>
          
          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">404</h1>
            <p className="text-xl text-muted-foreground">Page Not Found</p>
            <p className="text-sm text-muted-foreground">
              The page you're looking for seems to have been recycled! 
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              asChild
              variant="eco"
              size="lg"
              className="w-full"
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Link>
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <Search className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Eco message */}
          <p className="text-xs text-muted-foreground pt-4">
            Let's get you back to saving the planet! 🌍
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
