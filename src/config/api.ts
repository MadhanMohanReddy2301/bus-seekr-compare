// TypeScript interfaces for API responses
export interface BusData {
  TravelsName: string;
  busTypeName: string;
  StartTime: string;
  ArriveTime: string;
  TravelTime: string;
  AvailableSeats: string;
  Price: string;
  price?: string; // For MakeMyTrip API compatibility
  JourneyDate: string;
  BusType: string;
}

export interface BusSearchResponse {
  source: string;
  destination: string;
  journey_date: string;
  total_buses: number;
  buses: BusData[];
  platform?: 'abhibus' | 'makemytrip' | 'paytm' | 'goibibo';
}

// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  PROXY_BASE_URL: import.meta.env.VITE_API_PROXY_BASE_URL || '/api', // For Vite proxy in development
  
  // City Suggestions API
  CITY_SUGGESTIONS: {
    endpoint: '/AbhiBusAPI/city-suggestions/',
    method: 'GET',
    params: ['query']
  },
  
  // AbhiBus API
  ABHIBUS_SEARCH: {
    endpoint: '/AbhiBusAPI/bus-data/',
    method: 'GET',
    params: ['source', 'destination', 'date']
  },
  
  // MakeMyTrip API
  MAKEMYTRIP_SEARCH: {
    endpoint: '/MakeMyTripAPI/mmt-bus/',
    method: 'GET',
    params: ['source', 'destination', 'date']
  },
  // Paytm API
  PAYTM_SEARCH: {
    endpoint: '/PaytmBusAPI/paytm-bus/',
    method: 'GET',
    params: ['source', 'destination', 'date']
  },
  // Goibibo API
  GOIBIBO_SEARCH: {
    endpoint: '/GoibiboAPI/goibibo-bus/',
    method: 'GET',
    params: ['source', 'destination', 'date']
  },
  
  // Bus Details API (for future use)
  BUS_DETAILS: {
    endpoint: '/AbhiBusAPI/bus-details/',
    method: 'GET',
    params: ['busId']
  },
  
  // Route Information API (for future use)
  ROUTE_INFO: {
    endpoint: '/AbhiBusAPI/route-info/',
    method: 'GET',
    params: ['source', 'destination']
  },
  
  // Booking API (for future use)
  BOOKING: {
    endpoint: '/AbhiBusAPI/booking/',
    method: 'POST',
    params: ['busId', 'passengers', 'date']
  }
} as const;

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  const baseUrl = import.meta.env.DEV ? API_CONFIG.PROXY_BASE_URL : API_CONFIG.BASE_URL;
  let url = `${baseUrl}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};

// Helper function to make API calls
export const apiCall = async <T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: Record<string, string>;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> => {
  const { method = 'GET', params, body, headers = {} } = options;
  
  const url = buildApiUrl(endpoint, params);
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  
  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Specific API functions
export const citySuggestionsApi = {
  get: (query: string) => 
    apiCall<{ query: string; matches: Array<{ display_text: string; id: number; state: string | null; type: string | null }> }>(
      API_CONFIG.CITY_SUGGESTIONS.endpoint,
      { params: { query } }
    )
};

export const abhiBusApi = {
  search: (source: string, destination: string, date: string) =>
    apiCall<BusSearchResponse>(API_CONFIG.ABHIBUS_SEARCH.endpoint, {
      method: 'GET',
      params: { source, destination, date }
    })
};

export const makeMyTripApi = {
  search: async (source: string, destination: string, date: string) => {
    try {
      // Convert date format from yyyy-MM-dd to dd-MM-yyyy for MakeMyTrip
      const dateParts = date.split('-');
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      
      console.log('MakeMyTrip API call with formatted date:', formattedDate);
      
      return await apiCall<BusSearchResponse>(API_CONFIG.MAKEMYTRIP_SEARCH.endpoint, {
        method: 'GET',
        params: { source, destination, date: formattedDate }
      });
    } catch (error) {
      console.error('MakeMyTrip API error:', error);
      throw error;
    }
  }
};

export const paytmApi = {
  search: async (source: string, destination: string, date: string) => {
    try {
      // Use yyyy-MM-dd format as per example
      return await apiCall<BusSearchResponse>(API_CONFIG.PAYTM_SEARCH.endpoint, {
        method: 'GET',
        params: { source, destination, date }
      });
    } catch (error) {
      console.error('Paytm API error:', error);
      throw error;
    }
  }
};

export const goibiboApi = {
  search: async (source: string, destination: string, date: string) => {
    try {
      // Use yyyy-MM-dd format as per example
      return await apiCall<BusSearchResponse>(API_CONFIG.GOIBIBO_SEARCH.endpoint, {
        method: 'GET',
        params: { source, destination, date }
      });
    } catch (error) {
      console.error('Goibibo API error:', error);
      throw error;
    }
  }
};

// Combined bus search API that calls both platforms
export const busSearchApi = {
  searchAll: async (source: string, destination: string, date: string) => {
    try {
      console.log('Starting multi-platform bus search...');
      const timeout = 15000; // 15 seconds
      const [abhiBusData, makeMyTripData, paytmData, goibiboData] = await Promise.allSettled([
        Promise.race([
          abhiBusApi.search(source, destination, date),
          new Promise((_, reject) => setTimeout(() => reject(new Error('AbhiBus API timeout')), timeout))
        ]),
        Promise.race([
          makeMyTripApi.search(source, destination, date),
          new Promise((_, reject) => setTimeout(() => reject(new Error('MakeMyTrip API timeout')), timeout))
        ]),
        Promise.race([
          paytmApi.search(source, destination, date),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Paytm API timeout')), timeout))
        ]),
        Promise.race([
          goibiboApi.search(source, destination, date),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Goibibo API timeout')), timeout))
        ])
      ]);
      console.log('AbhiBus result:', abhiBusData);
      console.log('MakeMyTrip result:', makeMyTripData);
      console.log('Paytm result:', paytmData);
      console.log('Goibibo result:', goibiboData);
      const results: BusSearchResponse[] = [];
      if (abhiBusData.status === 'fulfilled') {
        const result = abhiBusData.value as BusSearchResponse;
        results.push({ ...result, platform: 'abhibus' as const });
      }
      if (makeMyTripData.status === 'fulfilled') {
        const result = makeMyTripData.value as BusSearchResponse;
        results.push({ ...result, platform: 'makemytrip' as const });
      }
      if (paytmData.status === 'fulfilled') {
        const result = paytmData.value as BusSearchResponse;
        results.push({ ...result, platform: 'paytm' as const });
      }
      if (goibiboData.status === 'fulfilled') {
        const result = goibiboData.value as BusSearchResponse;
        results.push({ ...result, platform: 'goibibo' as const });
      }
      return results;
    } catch (error) {
      console.error('Error in searchAll:', error);
      return [];
    }
  }
};

export const busDetailsApi = {
  get: (busId: string) =>
    apiCall(API_CONFIG.BUS_DETAILS.endpoint, {
      params: { busId }
    })
};

export const routeInfoApi = {
  get: (source: string, destination: string) =>
    apiCall(API_CONFIG.ROUTE_INFO.endpoint, {
      params: { source, destination }
    })
};

export const bookingApi = {
  create: (busId: string, passengers: any[], date: string) =>
    apiCall(API_CONFIG.BOOKING.endpoint, {
      method: 'POST',
      body: { busId, passengers, date }
    })
}; 