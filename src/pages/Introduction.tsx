import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ecoHeroImage from '@/assets/ecobin-hero.jpg';

const Introduction = () => {
  const navigate = useNavigate();
  
  const goToAuth = () => {
    navigate('/');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goToBinLocator = () => {
    navigate('/bin-locator');
  };

  const goToWasteScanner = () => {
    navigate('/waste-scanner');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <img 
            src="/logo.svg" 
            alt="Bin Smart Logo" 
            className="w-32 h-32 mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">Welcome to Bin Smart</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Your intelligent companion for waste management and recycling
          </p>
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            <Button onClick={goToAuth} className="bg-green-600 hover:bg-green-700">
              Login / Register
            </Button>
            <Button onClick={goToDashboard} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Dashboard
            </Button>
            <Button onClick={goToBinLocator} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Bin Locator
            </Button>
            <Button onClick={goToWasteScanner} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Waste Scanner
            </Button>
          </div>
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
                Bin Smart uses advanced technology to help you properly sort and dispose of waste items.
                Simply scan your waste items, and our AI will guide you to the correct bin, helping you 
                contribute to a cleaner environment.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-3">Key Features</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Waste Scanner - Identify the correct bin for any waste item</li>
                <li>Bin Locator - Find recycling and waste bins near you</li>
                <li>Rewards System - Earn points for proper waste disposal</li>
                <li>Personal Dashboard - Track your environmental impact</li>
                <li>AI Assistant - Get help with any waste-related questions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Points & Rewards System</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-lg text-green-700 mb-4">Earn Points</h3>
              <p className="text-gray-700 mb-4">Every time you scan and properly dispose of waste, you earn eco-points:</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full mr-2">10 pts</span>
                  <span className="text-gray-700">Plastic items</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded-full mr-2">5 pts</span>
                  <span className="text-gray-700">Organic waste</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-yellow-100 text-yellow-800 font-medium px-2.5 py-0.5 rounded-full mr-2">8 pts</span>
                  <span className="text-gray-700">Paper items</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-purple-100 text-purple-800 font-medium px-2.5 py-0.5 rounded-full mr-2">20 pts</span>
                  <span className="text-gray-700">E-Waste items</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 font-medium px-2.5 py-0.5 rounded-full mr-2">12 pts</span>
                  <span className="text-gray-700">Glass items</span>
                </li>
              </ul>
              <p className="text-gray-700 mt-4">Points are automatically added to your account after each successful scan!</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-lg text-green-700 mb-4">Redeem Rewards</h3>
              <p className="text-gray-700 mb-4">Use your accumulated points to redeem exciting rewards:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Eco-friendly merchandise like reusable bags and bottles</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Discount coupons for sustainable products</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free coffee and food items from partner cafes</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Public transport credits and ride-sharing discounts</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">All redemptions are recorded in our database and your points balance is updated instantly!</p>
              </div>
            </div>
          </div>
        </div>

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
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Introduction;