import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Zap, Star, IndianRupee, ExternalLink } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

interface Bus {
  id: string;
  operator: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  busType: string;
  amenities: string[];
  availableSeats: number;
  price: number;
  rating: number;
  platform: 'abhibus' | 'makemytrip' | 'paytm' | 'goibibo';
}

interface SearchResultsProps {
  searchData: {
    source: string;
    destination: string;
    date: Date;
  };
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchData }) => {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filters, setFilters] = useState({
    priceRange: [0, 3000] as [number, number],
    departureTime: 'any',
    busType: 'any',
    operator: 'any'
  });

  // Mock data - in real implementation, this would come from API calls
  const mockBuses: Bus[] = [
    {
      id: '1',
      operator: 'Travels Express',
      departureTime: '06:00',
      arrivalTime: '14:30',
      duration: '8h 30m',
      busType: 'AC Sleeper',
      amenities: ['WiFi', 'Charging Point', 'Water Bottle'],
      availableSeats: 12,
      price: 1200,
      rating: 4.2,
      platform: 'abhibus'
    },
    {
      id: '2',
      operator: 'Royal Cruiser',
      departureTime: '22:30',
      arrivalTime: '06:45',
      duration: '8h 15m',
      busType: 'AC Sleeper',
      amenities: ['WiFi', 'Blanket', 'Pillow'],
      availableSeats: 8,
      price: 950,
      rating: 4.5,
      platform: 'makemytrip'
    },
    {
      id: '3',
      operator: 'Metro Travels',
      departureTime: '08:15',
      arrivalTime: '16:00',
      duration: '7h 45m',
      busType: 'AC Seater',
      amenities: ['WiFi', 'Charging Point'],
      availableSeats: 15,
      price: 800,
      rating: 4.0,
      platform: 'paytm'
    },
    {
      id: '4',
      operator: 'Swift Journey',
      departureTime: '14:30',
      arrivalTime: '22:15',
      duration: '7h 45m',
      busType: 'AC Sleeper',
      amenities: ['WiFi', 'Entertainment', 'Snacks'],
      availableSeats: 6,
      price: 1350,
      rating: 4.3,
      platform: 'goibibo'
    }
  ];

  const platformData = {
    abhibus: { name: 'AbhiBus', color: 'bg-red-500', count: 1 },
    makemytrip: { name: 'MakeMyTrip', color: 'bg-blue-500', count: 1 },
    paytm: { name: 'Paytm', color: 'bg-purple-500', count: 1 },
    goibibo: { name: 'Goibibo', color: 'bg-green-500', count: 1 }
  };

  const getFilteredBuses = (platform?: keyof typeof platformData) => {
    let filtered = platform ? mockBuses.filter(bus => bus.platform === platform) : mockBuses;
    
    // Apply filters
    filtered = filtered.filter(bus => 
      bus.price >= filters.priceRange[0] && 
      bus.price <= filters.priceRange[1]
    );

    if (filters.busType !== 'any') {
      filtered = filtered.filter(bus => bus.busType.toLowerCase().includes(filters.busType.toLowerCase()));
    }

    if (filters.operator !== 'any') {
      filtered = filtered.filter(bus => bus.operator.toLowerCase().includes(filters.operator.toLowerCase()));
    }

    // Sort buses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return parseFloat(a.duration) - parseFloat(b.duration);
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getBestPrice = () => {
    const prices = mockBuses.map(bus => bus.price);
    return Math.min(...prices);
  };

  const renderBusCard = (bus: Bus) => {
    const isLowestPrice = bus.price === getBestPrice();
    
    return (
      <Card key={bus.id} className={`p-4 mb-4 transition-smooth hover:shadow-lg ${isLowestPrice ? 'ring-2 ring-travel-green' : ''}`}>
        {isLowestPrice && (
          <div className="mb-2">
            <Badge className="bg-travel-green text-white">Best Price</Badge>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Operator & Bus Type */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-foreground">{bus.operator}</h3>
            <p className="text-sm text-muted-foreground">{bus.busType}</p>
            <div className="flex items-center mt-1">
              <Star className="w-3 h-3 text-yellow-500 mr-1" />
              <span className="text-sm">{bus.rating}</span>
            </div>
          </div>

          {/* Timing */}
          <div className="lg:col-span-3">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="font-bold text-lg">{bus.departureTime}</div>
                <div className="text-xs text-muted-foreground">{searchData.source}</div>
              </div>
              <div className="flex-1 text-center">
                <Clock className="w-4 h-4 mx-auto text-muted-foreground" />
                <div className="text-sm text-muted-foreground">{bus.duration}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{bus.arrivalTime}</div>
                <div className="text-xs text-muted-foreground">{searchData.destination}</div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-1">
              {bus.amenities.slice(0, 2).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {bus.amenities.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{bus.amenities.length - 2}
                </Badge>
              )}
            </div>
          </div>

          {/* Seats */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {bus.availableSeats} seats left
              </span>
            </div>
          </div>

          {/* Price & Book */}
          <div className="lg:col-span-2">
            <div className="text-right">
              <div className="flex items-center justify-end">
                <IndianRupee className="w-4 h-4" />
                <span className="text-2xl font-bold">{bus.price}</span>
              </div>
              <Button className="mt-2 w-full" size="sm">
                <ExternalLink className="w-3 h-3 mr-1" />
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {searchData.source} → {searchData.destination}
        </h2>
        <p className="text-muted-foreground">
          {searchData.date.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <span>All</span>
                <Badge variant="secondary">{mockBuses.length}</Badge>
              </TabsTrigger>
              
              {Object.entries(platformData).map(([key, platform]) => (
                <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                  <span>{platform.name}</span>
                  <Badge variant="secondary">{platform.count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {getFilteredBuses().map(renderBusCard)}
              </div>
            </TabsContent>

            {Object.keys(platformData).map(platform => (
              <TabsContent key={platform} value={platform}>
                <div className="space-y-4">
                  {getFilteredBuses(platform as keyof typeof platformData).map(renderBusCard)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;