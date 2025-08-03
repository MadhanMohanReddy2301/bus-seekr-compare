import React, { useState } from 'react';
import { Bus, MapPin, Star, Users, Calendar } from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';

const Index = () => {
  const [searchData, setSearchData] = useState<{
    source: string;
    destination: string;
    date: Date;
  } | null>(null);

  const handleSearch = (data: { source: string; destination: string; date: Date }) => {
    setSearchData(data);
  };

  const resetSearch = () => {
    setSearchData(null);
  };

  if (searchData) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center space-x-2 cursor-pointer" 
                onClick={resetSearch}
              >
                <Bus className="w-8 h-8 text-travel-blue" />
                <h1 className="text-2xl font-bold hero-gradient bg-clip-text text-transparent">
                  BusScanner
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Compare • Book • Travel
              </p>
            </div>
          </div>
        </header>

        {/* Search Results */}
        <main className="py-8">
          <SearchResults searchData={searchData} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Bus className="w-12 h-12 text-white" />
              <h1 className="text-5xl font-bold text-white">BusScanner</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Compare bus tickets across all major booking platforms in India. 
              Find the best prices, timings, and comfort - all in one place.
            </p>
          </div>

          {/* Search Form */}
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose BusScanner?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make bus booking simple by bringing together all major platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">All Routes Covered</h3>
              <p className="text-sm text-muted-foreground">
                Search across 1000+ cities and towns in India
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Best Prices</h3>
              <p className="text-sm text-muted-foreground">
                Compare prices across AbhiBus, MakeMyTrip, Paytm & Goibibo
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Trusted Platform</h3>
              <p className="text-sm text-muted-foreground">
                Secure booking through verified partners
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Booking</h3>
              <p className="text-sm text-muted-foreground">
                Book tickets in just a few clicks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Popular Bus Routes
            </h2>
            <p className="text-muted-foreground">
              Most searched routes by travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              'Delhi → Mumbai',
              'Bangalore → Chennai',
              'Mumbai → Pune',
              'Delhi → Jaipur',
              'Hyderabad → Bangalore',
              'Chennai → Coimbatore',
              'Pune → Goa',
              'Delhi → Chandigarh'
            ].map((route) => (
              <div
                key={route}
                className="bg-card p-4 rounded-lg border hover:shadow-md transition-smooth cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{route}</span>
                  <Bus className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bus className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">BusScanner</span>
          </div>
          <p className="text-muted-foreground">
            Your one-stop platform for comparing bus tickets across India
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
