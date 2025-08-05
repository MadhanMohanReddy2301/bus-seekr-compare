# API Configuration Guide

## Overview
This project uses a centralized API configuration system to manage all API endpoints in one place.

## File Structure
```
src/
├── config/
│   └── api.ts          # Main API configuration
├── components/
│   └── SearchForm.tsx  # Uses the API config
└── ...
```

## Configuration Files

### 1. `src/config/api.ts`
Centralized API configuration with:
- **API_CONFIG**: All endpoint definitions
- **buildApiUrl()**: Helper to build URLs with parameters
- **apiCall()**: Generic function for making API requests
- **Specific API functions**: Type-safe functions for each endpoint

### 2. `env.example`
Environment variables template:
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_API_PROXY_BASE_URL=/api
VITE_NODE_ENV=development
```

## How to Use

### 1. Adding a New API Endpoint

Add to `API_CONFIG` in `src/config/api.ts`:
```typescript
export const API_CONFIG = {
  // ... existing configs
  
  // New API endpoint
  NEW_API: {
    endpoint: '/AbhiBusAPI/new-endpoint/',
    method: 'POST',
    params: ['param1', 'param2']
  }
} as const;
```

### 2. Creating a Type-Safe API Function

Add to the bottom of `src/config/api.ts`:
```typescript
export const newApi = {
  create: (param1: string, param2: string) =>
    apiCall(API_CONFIG.NEW_API.endpoint, {
      method: 'POST',
      body: { param1, param2 }
    })
};
```

### 3. Using in Components

```typescript
import { newApi } from '@/config/api';

// In your component
const handleApiCall = async () => {
  try {
    const result = await newApi.create('value1', 'value2');
    console.log(result);
  } catch (error) {
    console.error('API call failed:', error);
  }
};
```

## Current API Endpoints

### 1. City Suggestions
- **Endpoint**: `/AbhiBusAPI/city-suggestions/`
- **Method**: GET
- **Params**: `query`
- **Usage**: `citySuggestionsApi.get(query)`

### 2. Bus Search (Future)
- **Endpoint**: `/AbhiBusAPI/bus-search/`
- **Method**: POST
- **Params**: `source`, `destination`, `date`
- **Usage**: `busSearchApi.search(source, destination, date)`

### 3. Bus Details (Future)
- **Endpoint**: `/AbhiBusAPI/bus-details/`
- **Method**: GET
- **Params**: `busId`
- **Usage**: `busDetailsApi.get(busId)`

### 4. Route Info (Future)
- **Endpoint**: `/AbhiBusAPI/route-info/`
- **Method**: GET
- **Params**: `source`, `destination`
- **Usage**: `routeInfoApi.get(source, destination)`

### 5. Booking (Future)
- **Endpoint**: `/AbhiBusAPI/booking/`
- **Method**: POST
- **Params**: `busId`, `passengers`, `date`
- **Usage**: `bookingApi.create(busId, passengers, date)`

## Environment Variables

### Development
- Uses Vite proxy to avoid CORS issues
- API calls go through `/api` proxy
- Automatically forwards to `http://localhost:8000`

### Production
- Direct API calls to `VITE_API_BASE_URL`
- No proxy needed

## Benefits

1. **Centralized Management**: All API endpoints in one place
2. **Type Safety**: TypeScript support for all API calls
3. **Environment Aware**: Different URLs for dev/prod
4. **Easy Maintenance**: Change endpoints in one place
5. **Consistent Error Handling**: Standardized error handling
6. **CORS Solution**: Built-in proxy for development

## Example Usage in SearchForm

```typescript
import { citySuggestionsApi } from '@/config/api';

const fetchCitySuggestions = async (query: string) => {
  try {
    const data = await citySuggestionsApi.get(query);
    return data.matches.map(city => ({
      id: city.id.toString(),
      name: city.display_text,
      state: city.state || ''
    }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};
``` 