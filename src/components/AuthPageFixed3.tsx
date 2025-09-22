import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const AuthPageFixed3 = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Handle login using apiService - pass email as username since backend supports both
        const response = await apiService.login(formData.email, formData.password);

        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);

        toast({
          title: 'Login Successful',
          description: 'Welcome back to EcoBin!',
        });

        navigate('/dashboard');
      } else {
        // Handle registration using apiService
        const response = await apiService.register(formData.name, formData.email, formData.password, formData.city);

        // Store user data and token in localStorage
        if (response.token) {
          const userData = {
            id: response.user_id,
            username: response.username,
            email: formData.email,
          };

          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', response.token);

          toast({
            title: 'Registration Successful',
            description: 'Welcome to EcoBin!',
          });

          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');

      toast({
        title: 'Authentication Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-nature flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card-eco border-0">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-eco rounded-full flex items-center justify-center">
              <span className="text-2xl">♻️</span>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">EcoBin</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to start earning rewards.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Test Credentials Info */}
          {isLogin && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">✅ Test Credentials:</p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Email: <code className="bg-green-100 dark:bg-green-900 px-1 rounded">aishashaikh@gmail.com</code><br/>
                Password: <code className="bg-green-100 dark:bg-green-900 px-1 rounded">password</code>
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Or try: <code className="bg-green-100 dark:bg-green-900 px-1 rounded">testuser</code> with password <code className="bg-green-100 dark:bg-green-900 px-1 rounded">password</code>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {isLogin ? 'Email / Username' : 'Email'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
                  placeholder={isLogin ? "Enter email or username" : "Enter your email"}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="city"
                    type="text"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>

            {error && (
              <div className="text-sm text-red-500 text-center mt-2">
                {error}
              </div>
            )}
          </form>

          {isLogin && (
            <div className="text-center">
              <button className="text-sm text-accent hover:text-accent/80 transition-colors">
                Forgot Password?
              </button>
            </div>
          )}

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPageFixed3;
