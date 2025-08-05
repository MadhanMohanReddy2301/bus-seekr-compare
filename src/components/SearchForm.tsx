import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ArrowLeftRight, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { citySuggestionsApi, busSearchApi, BusSearchResponse } from '@/config/api';
interface City {
  id: string;
  name: string;
  state?: string;
}
interface SearchFormProps {
  onSearch: (searchData: {
    source: string;
    destination: string;
    date: Date;
    busData?: BusSearchResponse[];
  }) => void;
}
const SearchForm: React.FC<SearchFormProps> = ({
  onSearch
}) => {
  // Load initial values from session storage
  const getInitialSource = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('busSearch_source') || '';
    }
    return '';
  };

  const getInitialDestination = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('busSearch_destination') || '';
    }
    return '';
  };

  const getInitialDate = () => {
    if (typeof window !== 'undefined') {
      const savedDate = sessionStorage.getItem('busSearch_date');
      return savedDate ? new Date(savedDate) : new Date();
    }
    return new Date();
  };

  const [source, setSource] = useState(getInitialSource);
  const [destination, setDestination] = useState(getInitialDestination);
  const [date, setDate] = useState<Date>(getInitialDate);
  const [sourceSuggestions, setSourceSuggestions] = useState<City[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<City[]>([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSource, setIsLoadingSource] = useState(false);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const sourceRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  // Debounced function to prevent too many API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const fetchCitySuggestions = async (query: string): Promise<City[]> => {
    if (query.length < 1) return [];
    
    console.log('Fetching suggestions for:', query);
    
    try {
      const data = await citySuggestionsApi.get(query);
      console.log('Response data:', data);
      
      if (data && data.matches && Array.isArray(data.matches)) {
        const cities = data.matches.map((city: any) => ({
          id: city.id.toString(),
          name: city.display_text,
          state: city.state || ''
        }));
        console.log('Processed cities:', cities);
        return cities;
      }
      console.log('No matches found in response');
      return [];
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      console.error('Error details:', error.message);
      return [];
    }
  };


  // Debounced handlers for city suggestions
  const debouncedSourceSearch = useCallback(
    debounce(async (value: string) => {
      console.log('debouncedSourceSearch called with:', value);
      if (value.length >= 1) {
        console.log('Setting loading state for source');
        setIsLoadingSource(true);
        const suggestions = await fetchCitySuggestions(value);
        console.log('Source suggestions received:', suggestions);
        setSourceSuggestions(suggestions);
        setShowSourceSuggestions(true);
        setIsLoadingSource(false);
      } else {
        setShowSourceSuggestions(false);
        setIsLoadingSource(false);
      }
    }, 100),
    []
  );

  const debouncedDestinationSearch = useCallback(
    debounce(async (value: string) => {
      console.log('debouncedDestinationSearch called with:', value);
      if (value.length >= 1) {
        console.log('Setting loading state for destination');
        setIsLoadingDestination(true);
        const suggestions = await fetchCitySuggestions(value);
        console.log('Destination suggestions received:', suggestions);
        setDestinationSuggestions(suggestions);
        setShowDestinationSuggestions(true);
        setIsLoadingDestination(false);
      } else {
        setShowDestinationSuggestions(false);
        setIsLoadingDestination(false);
      }
    }, 100),
    []
  );

  // Save to session storage
  const saveToSessionStorage = (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, value);
    }
  };

  const handleSourceChange = (value: string) => {
    console.log('handleSourceChange called with:', value);
    setSource(value);
    saveToSessionStorage('busSearch_source', value);
    debouncedSourceSearch(value);
  };

  const handleDestinationChange = (value: string) => {
    console.log('handleDestinationChange called with:', value);
    setDestination(value);
    saveToSessionStorage('busSearch_destination', value);
    debouncedDestinationSearch(value);
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    saveToSessionStorage('busSearch_date', newDate.toISOString());
    setIsDatePickerOpen(false); // Close date picker after selection
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target as Node)) {
        setShowSourceSuggestions(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const swapCities = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };
  const handleSearch = async () => {
    if (source.trim() && destination.trim()) {
      setIsLoading(true);
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const allBusData = await busSearchApi.searchAll(
          source.trim(),
          destination.trim(),
          formattedDate
        );
        
        console.log('Bus search results from all platforms:', allBusData);
        
        onSearch({
          source: source.trim(),
          destination: destination.trim(),
          date,
          busData: allBusData // Pass all platform data to parent component
        });
      } catch (error) {
        console.error('Error searching buses:', error);
        // Still call onSearch but without bus data
        onSearch({
          source: source.trim(),
          destination: destination.trim(),
          date
        });
      } finally {
        setIsLoading(false);
      }
    }
  };


  return <Card className="card-gradient shadow-travel p-6 w-full max-w-4xl mx-auto my-[10px]">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Find Your Perfect Bus Journey
          </h2>
          <p className="text-muted-foreground">Compare prices across all major bus booking platforms</p>
        </div>

        <div className="space-y-4">
          {/* Input Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4 items-end bg-background/50 rounded-lg p-4 border">
            {/* Source City */}
            <div className="md:col-span-3 relative" ref={sourceRef}>
              <label className="block text-sm font-medium text-foreground mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                From
              </label>
              <div className="relative">
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Enter source city" 
                    value={source} 
                    onChange={e => handleSourceChange(e.target.value)} 
                    className="w-full transition-smooth pr-10" 
                    onFocus={() => source.length >= 1 && setShowSourceSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
                  />
                  {isLoadingSource && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                {showSourceSuggestions && (sourceSuggestions.length > 0 || isLoadingSource) && (
                  <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-popover border shadow-lg">
                    {isLoadingSource ? (
                      <div className="p-3 text-center text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                        Searching cities...
                      </div>
                    ) : sourceSuggestions.length > 0 ? (
                      sourceSuggestions.map(city => (
                        <div 
                          key={city.id} 
                          className="p-3 hover:bg-accent cursor-pointer transition-smooth" 
                          onClick={() => {
                            setSource(city.name);
                            saveToSessionStorage('busSearch_source', city.name);
                            setShowSourceSuggestions(false);
                          }}
                        >
                          <div className="font-medium">{city.name}</div>
                          {city.state && <div className="text-sm text-muted-foreground">{city.state}</div>}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-muted-foreground">
                        No cities found
                      </div>
                    )}
                  </Card>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <Button variant="outline" size="icon" onClick={swapCities} className="transition-bounce hover:rotate-180">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Destination City */}
            <div className="md:col-span-3 relative" ref={destinationRef}>
              <label className="block text-sm font-medium text-foreground mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                To
              </label>
              <div className="relative">
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Enter destination city" 
                    value={destination} 
                    onChange={e => handleDestinationChange(e.target.value)} 
                    className="w-full transition-smooth pr-10" 
                    onFocus={() => destination.length >= 1 && setShowDestinationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                  />
                  {isLoadingDestination && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                {showDestinationSuggestions && (destinationSuggestions.length > 0 || isLoadingDestination) && (
                  <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-popover border shadow-lg">
                    {isLoadingDestination ? (
                      <div className="p-3 text-center text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                        Searching cities...
                      </div>
                    ) : destinationSuggestions.length > 0 ? (
                      destinationSuggestions.map(city => (
                        <div 
                          key={city.id} 
                          className="p-3 hover:bg-accent cursor-pointer transition-smooth" 
                          onClick={() => {
                            setDestination(city.name);
                            saveToSessionStorage('busSearch_destination', city.name);
                            setShowDestinationSuggestions(false);
                          }}
                        >
                          <div className="font-medium">{city.name}</div>
                          {city.state && <div className="text-sm text-muted-foreground">{city.state}</div>}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-muted-foreground">
                        No cities found
                      </div>
                    )}
                  </Card>
                )}
              </div>
            </div>

            {/* Date Picker */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Journey Date
              </label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {format(date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent 
                    mode="single" 
                    selected={date} 
                    onSelect={date => date && handleDateChange(date)} 
                    disabled={date => date < new Date()} 
                    initialFocus 
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Search Button Row */}
          <div className="w-full">
            <Button onClick={handleSearch} disabled={!source.trim() || !destination.trim() || isLoading} size="lg" className="w-full hero-gradient text-white font-semibold transition-bounce hover:shadow-glow px-4 py-4 text-lg">
              {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" /> : <Search className="w-5 h-5 mr-2" />}
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </div>
    </Card>;
};
export default SearchForm;