import React, { useState, useEffect } from 'react';
import { Search, ArrowLeftRight, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
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
  }) => void;
}
const SearchForm: React.FC<SearchFormProps> = ({
  onSearch
}) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [sourceSuggestions, setSourceSuggestions] = useState<City[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<City[]>([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchCitySuggestions = async (query: string): Promise<City[]> => {
    if (query.length < 1) return [];
    try {
      const response = await fetch(`https://cors-anywhere.herokuapp.com/https://www.abhibus.com/wap/abus-autocompleter/api/v1/results?s=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data && Array.isArray(data)) {
        return data.map((city: any) => ({
          id: city.id.toString(),
          name: city.display_text,
          state: city.display_subtext
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      return [];
    }
  };
  const handleSourceChange = async (value: string) => {
    setSource(value);
    if (value.length >= 1) {
      const suggestions = await fetchCitySuggestions(value);
      setSourceSuggestions(suggestions);
      setShowSourceSuggestions(true);
    } else {
      setShowSourceSuggestions(false);
    }
  };
  const handleDestinationChange = async (value: string) => {
    setDestination(value);
    if (value.length >= 1) {
      const suggestions = await fetchCitySuggestions(value);
      setDestinationSuggestions(suggestions);
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };
  const swapCities = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };
  const handleSearch = () => {
    if (source.trim() && destination.trim()) {
      setIsLoading(true);
      onSearch({
        source: source.trim(),
        destination: destination.trim(),
        date
      });
      setTimeout(() => setIsLoading(false), 2000); // Simulate API call
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
            <div className="md:col-span-3 relative">
              <label className="block text-sm font-medium text-foreground mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                From
              </label>
              <div className="relative">
                <Input type="text" placeholder="Enter source city" value={source} onChange={e => handleSourceChange(e.target.value)} className="w-full transition-smooth" onFocus={() => source.length >= 1 && setShowSourceSuggestions(true)} />
                {showSourceSuggestions && sourceSuggestions.length > 0 && <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-popover border shadow-lg">
                    {sourceSuggestions.map(city => <div key={city.id} className="p-3 hover:bg-accent cursor-pointer transition-smooth" onClick={() => {
                  setSource(city.name);
                  setShowSourceSuggestions(false);
                }}>
                        <div className="font-medium">{city.name}</div>
                        {city.state && <div className="text-sm text-muted-foreground">{city.state}</div>}
                      </div>)}
                  </Card>}
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <Button variant="outline" size="icon" onClick={swapCities} className="transition-bounce hover:rotate-180">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Destination City */}
            <div className="md:col-span-3 relative">
              <label className="block text-sm font-medium text-foreground mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                To
              </label>
              <div className="relative">
                <Input type="text" placeholder="Enter destination city" value={destination} onChange={e => handleDestinationChange(e.target.value)} className="w-full transition-smooth" onFocus={() => destination.length >= 1 && setShowDestinationSuggestions(true)} />
                {showDestinationSuggestions && destinationSuggestions.length > 0 && <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-popover border shadow-lg">
                    {destinationSuggestions.map(city => <div key={city.id} className="p-3 hover:bg-accent cursor-pointer transition-smooth" onClick={() => {
                  setDestination(city.name);
                  setShowDestinationSuggestions(false);
                }}>
                        <div className="font-medium">{city.name}</div>
                        {city.state && <div className="text-sm text-muted-foreground">{city.state}</div>}
                      </div>)}
                  </Card>}
              </div>
            </div>

            {/* Date Picker */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Journey Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {format(date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={date} onSelect={date => date && setDate(date)} disabled={date => date < new Date()} initialFocus />
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