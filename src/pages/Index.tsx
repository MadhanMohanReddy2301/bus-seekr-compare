import React, { useState } from 'react';
import { Bus, MapPin, Star, Users, Calendar } from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';
import { BusSearchResponse } from '@/config/api';

const Index = () => {
  const [searchData, setSearchData] = useState<{
    source: string;
    destination: string;
    date: Date;
    busData?: BusSearchResponse[];
  } | null>(null);

  const handleSearch = (data: { 
    source: string; 
    destination: string; 
    date: Date;
    busData?: BusSearchResponse[];
  }) => {
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
      <section className="hero-gradient relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 w-full">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Bus className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-6xl font-bold text-white tracking-tight">
                Bus<span className="text-primary-glow">Scanner</span>
              </h1>
            </div>
            <p className="text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light">
              Compare bus tickets across all major booking platforms in India.<br />
              Find the best prices, timings, and comfort - all in one place.
            </p>
          </div>

          {/* Search Form */}
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Why Choose BusScanner?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We make bus booking simple by bringing together all major platforms with a beautiful, intuitive interface
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:shadow-travel transition-all duration-300 group-hover:scale-105">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">All Routes Covered</h3>
              <p className="text-muted-foreground leading-relaxed">
                Search across 1000+ cities and towns throughout India
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:shadow-travel transition-all duration-300 group-hover:scale-105">
                <Star className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Best Prices</h3>
              <p className="text-muted-foreground leading-relaxed">
                Compare prices across AbhiBus, MakeMyTrip, Paytm & Goibibo
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:shadow-travel transition-all duration-300 group-hover:scale-105">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Trusted Platform</h3>
              <p className="text-muted-foreground leading-relaxed">
                Secure booking through verified and trusted partners
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:shadow-travel transition-all duration-300 group-hover:scale-105">
                <Calendar className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Easy Booking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Book tickets in just a few simple clicks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Popular Bus Routes
            </h2>
            <p className="text-lg text-muted-foreground">
              Most searched routes by travelers across India
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
                className="bg-card p-6 rounded-xl border hover:shadow-elevated transition-all duration-300 cursor-pointer group hover:border-primary/20 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{route}</span>
                  <Bus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bus className="w-8 h-8 text-primary" />
            </div>
            <span className="font-bold text-2xl text-foreground">
              Bus<span className="text-primary">Scanner</span>
            </span>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Your one-stop platform for comparing bus tickets across India with style and elegance
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
