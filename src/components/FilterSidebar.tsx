import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface FilterSidebarProps {
  filters: {
    priceRange: [number, number];
    departureTime: string;
    busType: string;
    operator: string;
  };
  onFiltersChange: (filters: {
    priceRange: [number, number];
    departureTime: string;
    busType: string;
    operator: string;
  }) => void;
  sortBy: string;
  onSortChange: (sortBy: 'price' | 'price-high' | 'duration' | 'departure' | 'departure-late') => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  sortBy,
  onSortChange
}) => {
  const updateFilter = (key: keyof typeof filters, value: any) => {
    const updatedFilters = { ...filters };
    if (key === 'priceRange') {
      updatedFilters[key] = value as [number, number];
    } else {
      (updatedFilters as any)[key] = value;
    }
    onFiltersChange(updatedFilters);
  };

  return (
    <Card className="p-6 h-fit sticky top-4">
      <div className="space-y-8">
        {/* Sort Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <Label className="font-semibold text-lg">Sort By</Label>
          </div>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="duration">Duration (Shortest)</SelectItem>
              <SelectItem value="departure">Departure Time (Early)</SelectItem>
              <SelectItem value="departure-late">Departure Time (Late)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-6" />

        {/* Filter Section */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Filter className="w-5 h-5 text-primary" />
            <Label className="font-semibold text-lg">Filters</Label>
          </div>

          {/* Price Range */}
          <div className="space-y-4 mb-8">
            <Label className="text-base font-medium">Price Range</Label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                max={3000}
                min={0}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>₹{filters.priceRange[0]}</span>
                <span>₹{filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Departure Time */}
          <div className="space-y-4 mb-8">
            <Label className="text-base font-medium">Departure Time</Label>
            <Select 
              value={filters.departureTime} 
              onValueChange={(value) => updateFilter('departureTime', value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Time</SelectItem>
                <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                <SelectItem value="evening">Evening (6PM - 10PM)</SelectItem>
                <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bus Type */}
          <div className="space-y-4 mb-8">
            <Label className="text-base font-medium">Bus Type</Label>
            <Select 
              value={filters.busType} 
              onValueChange={(value) => updateFilter('busType', value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All Types</SelectItem>
                <SelectItem value="ac">AC</SelectItem>
                <SelectItem value="non-ac">Non-AC</SelectItem>
                <SelectItem value="sleeper">Sleeper</SelectItem>
                <SelectItem value="seater">Seater</SelectItem>
                <SelectItem value="semi-sleeper">Semi-Sleeper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bus Operator */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Bus Operator</Label>
            <Select 
              value={filters.operator} 
              onValueChange={(value) => updateFilter('operator', value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All Operators</SelectItem>
                <SelectItem value="travels">Travels Express</SelectItem>
                <SelectItem value="royal">Royal Cruiser</SelectItem>
                <SelectItem value="metro">Metro Travels</SelectItem>
                <SelectItem value="swift">Swift Journey</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FilterSidebar;