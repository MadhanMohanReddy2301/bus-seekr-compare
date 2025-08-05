import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, Users, Zap, Star, IndianRupee, ExternalLink, Search, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import FilterSidebar from './FilterSidebar';
import { BusSearchResponse, BusData, citySuggestionsApi, busSearchApi } from '@/config/api';

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
    busData?: BusSearchResponse[];
  };
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchData }) => {
  const [sortBy, setSortBy] = useState<'price' | 'price-high' | 'duration' | 'departure' | 'departure-late'>('price');
  const [filters, setFilters] = useState({
    priceRange: [0, 3000] as [number, number],
    departureTime: 'any',
    busType: 'any',
    operator: 'any'
  });

  // Search functionality state
  const [newSearchSource, setNewSearchSource] = useState(searchData.source);
  const [newSearchDestination, setNewSearchDestination] = useState(searchData.destination);
  const [newSearchDate, setNewSearchDate] = useState(searchData.date);
  const [sourceSuggestions, setSourceSuggestions] = useState<Array<{id: string, name: string, state?: string}>>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Array<{id: string, name: string, state?: string}>>([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced function for city suggestions
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const fetchCitySuggestions = async (query: string): Promise<Array<{id: string, name: string, state?: string}>> => {
    if (query.length < 1) return [];
    
    try {
      const data = await citySuggestionsApi.get(query);
      
      if (data && data.matches && Array.isArray(data.matches)) {
        return data.matches.map((city: any) => ({
          id: city.id.toString(),
          name: city.display_text,
          state: city.state || ''
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      return [];
    }
  };

  const debouncedSourceSearch = debounce(async (query: string) => {
    if (query.length >= 1) {
      const suggestions = await fetchCitySuggestions(query);
      setSourceSuggestions(suggestions);
    } else {
      setSourceSuggestions([]);
    }
  }, 300);

  const debouncedDestinationSearch = debounce(async (query: string) => {
    if (query.length >= 1) {
      const suggestions = await fetchCitySuggestions(query);
      setDestinationSuggestions(suggestions);
    } else {
      setDestinationSuggestions([]);
    }
  }, 300);

  const handleNewSearch = async () => {
    if (newSearchSource.trim() && newSearchDestination.trim()) {
      setIsSearching(true);
      try {
        const formattedDate = format(newSearchDate, 'yyyy-MM-dd');
        const allBusData = await busSearchApi.searchAll(
          newSearchSource.trim(),
          newSearchDestination.trim(),
          formattedDate
        );
        
        // Update the search data
        searchData.source = newSearchSource.trim();
        searchData.destination = newSearchDestination.trim();
        searchData.date = newSearchDate;
        searchData.busData = allBusData;
        
        // Force re-render by updating state
        setSortBy(sortBy);
      } catch (error) {
        console.error('Error in new search:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Convert real bus data to our internal format
  const convertBusData = (busData: BusData): Bus => ({
    id: `${busData.TravelsName}-${busData.StartTime}`,
    operator: busData.TravelsName,
    departureTime: busData.StartTime,
    arrivalTime: busData.ArriveTime,
    duration: busData.TravelTime,
    busType: busData.BusType,
    amenities: getAmenitiesFromBusType(busData.BusType),
    availableSeats: parseInt(busData.AvailableSeats),
    price: parseInt(busData.Price || busData.price || '0'), // Handle both Price and price fields
    rating: 4.2, // Default rating since not provided by API
    platform: 'abhibus' as const
  });

  // Helper function to get amenities based on bus type
  const getAmenitiesFromBusType = (busType: string): string[] => {
    const amenities: string[] = [];
    if (busType.includes('Sleeper')) {
      amenities.push('Sleeper');
    }
    if (busType.includes('Seater')) {
      amenities.push('Seater');
    }
    if (busType.includes('Luxury') || busType.includes('Deluxe')) {
      amenities.push('Premium');
    }
    return amenities;
  };

  // Use real bus data if available, otherwise fallback to mock data
  const realBuses: Bus[] = searchData.busData?.flatMap(platformData => 
    platformData.buses.map(busData => ({
      ...convertBusData(busData),
      platform: platformData.platform || 'abhibus'
    }))
  ) || [];
  
  // Debug logging
  console.log('SearchResults - busData:', searchData.busData);
  console.log('SearchResults - realBuses count:', realBuses.length);
  console.log('SearchResults - realBuses:', realBuses);
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
    abhibus: { 
      name: 'AbhiBus', 
      color: 'bg-red-500', 
      count: searchData.busData?.find(p => p.platform === 'abhibus')?.total_buses || 
             realBuses.filter(bus => bus.platform === 'abhibus').length || 0 
    },
    makemytrip: { 
      name: 'MakeMyTrip', 
      color: 'bg-blue-500', 
      count: searchData.busData?.find(p => p.platform === 'makemytrip')?.total_buses || 
             realBuses.filter(bus => bus.platform === 'makemytrip').length || 0 
    },
    paytm: { 
      name: 'Paytm', 
      color: 'bg-purple-500', 
      count: searchData.busData?.find(p => p.platform === 'paytm')?.total_buses || 
             realBuses.filter(bus => bus.platform === 'paytm').length || 0 
    },
    goibibo: { 
      name: 'Goibibo', 
      color: 'bg-green-500', 
      count: searchData.busData?.find(p => p.platform === 'goibibo')?.total_buses || 
             realBuses.filter(bus => bus.platform === 'goibibo').length || 0 
    }
  };

  const getFilteredBuses = (platform?: keyof typeof platformData) => {
    // Use real buses if available, otherwise fallback to mock buses
    const busesToUse = realBuses.length > 0 ? realBuses : mockBuses;
    let filtered = platform ? busesToUse.filter(bus => bus.platform === platform) : busesToUse;
    
    // Apply filters
    filtered = filtered.filter(bus => 
      bus.price >= filters.priceRange[0] && 
      bus.price <= filters.priceRange[1]
    );

    // Apply departure time filter
    if (filters.departureTime !== 'any') {
      filtered = filtered.filter(bus => {
        const hour = parseInt(bus.departureTime.split(':')[0]);
        switch (filters.departureTime) {
          case 'morning':
            return hour >= 6 && hour < 12;
          case 'afternoon':
            return hour >= 12 && hour < 18;
          case 'evening':
            return hour >= 18 && hour < 22;
          case 'night':
            return hour >= 22 || hour < 6;
          default:
            return true;
        }
      });
    }

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
        case 'price-high':
          return b.price - a.price;
        case 'duration':
          // Parse duration like "4h 10m" to minutes for comparison
          const parseDuration = (duration: string) => {
            const match = duration.match(/(\d+)h\s*(\d+)m/);
            if (match) {
              return parseInt(match[1]) * 60 + parseInt(match[2]);
            }
            return 0;
          };
          return parseDuration(a.duration) - parseDuration(b.duration);
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        case 'departure-late':
          return b.departureTime.localeCompare(a.departureTime);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getBestPrice = () => {
    const busesToUse = realBuses.length > 0 ? realBuses : mockBuses;
    const prices = busesToUse.map(bus => bus.price);
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
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
          
          {/* Search Form */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-card border rounded-lg">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="From"
                value={newSearchSource}
                onChange={(e) => {
                  setNewSearchSource(e.target.value);
                  debouncedSourceSearch(e.target.value);
                }}
                onFocus={() => setShowSourceSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
                className="pl-10"
              />
              {showSourceSuggestions && sourceSuggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-popover border shadow-lg">
                  {sourceSuggestions.map(city => (
                    <div 
                      key={city.id} 
                      className="p-3 hover:bg-accent cursor-pointer transition-smooth" 
                      onClick={() => {
                        setNewSearchSource(city.name);
                        setShowSourceSuggestions(false);
                      }}
                    >
                      <div className="font-medium">{city.name}</div>
                      {city.state && <div className="text-sm text-muted-foreground">{city.state}</div>}
                    </div>
                  ))}
                </Card>
              )}
            </div>
            
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="To"
                value={newSearchDestination}
                onChange={(e) => {
                  setNewSearchDestination(e.target.value);
                  debouncedDestinationSearch(e.target.value);
                }}
                onFocus={() => setShowDestinationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                className="pl-10"
              />
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-popover border shadow-lg">
                  {destinationSuggestions.map(city => (
                    <div 
                      key={city.id} 
                      className="p-3 hover:bg-accent cursor-pointer transition-smooth" 
                      onClick={() => {
                        setNewSearchDestination(city.name);
                        setShowDestinationSuggestions(false);
                      }}
                    >
                      <div className="font-medium">{city.name}</div>
                      {city.state && <div className="text-sm text-muted-foreground">{city.state}</div>}
                    </div>
                  ))}
                </Card>
              )}
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(newSearchDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newSearchDate}
                  onSelect={(date) => date && setNewSearchDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              onClick={handleNewSearch} 
              disabled={isSearching || !newSearchSource.trim() || !newSearchDestination.trim()}
              className="w-full sm:w-auto"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Show warning if only one platform returned data */}
        {searchData.busData && searchData.busData.length === 1 && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ Only {searchData.busData[0].platform === 'abhibus' ? 'AbhiBus' : 'MakeMyTrip'} data is available. 
              {searchData.busData[0].platform === 'abhibus' ? 'MakeMyTrip' : 'AbhiBus'} is currently unavailable.
            </p>
          </div>
        )}
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
                <Badge variant="secondary">{realBuses.length > 0 ? realBuses.length : mockBuses.length}</Badge>
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
                {getFilteredBuses().length > 0 ? (
                  <>
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800">
                        Showing {getFilteredBuses().length} of {realBuses.length > 0 ? realBuses.length : mockBuses.length} buses
                      </p>
                    </div>
                    {getFilteredBuses().map(renderBusCard)}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No buses found matching your criteria</p>
                  </div>
                )}
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