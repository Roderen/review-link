import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
            gcTime: 10 * 60 * 1000, // 10 минут - время до удаления из кэша (было cacheTime)
            refetchOnWindowFocus: true, // не перезапрашивать при фокусе окна
        },
    },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
  </StrictMode>
);
