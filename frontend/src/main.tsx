import "./telemetry.js";
// import "./errorTracking";

import { createRoot } from 'react-dom/client'
import './index.css';

import App from './App.tsx'
import { ThemeProvider } from 'next-themes'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { Toaster } from "@/components/ui/sonner";
import { ApolloProvider } from "@apollo/client/react";
import client from './lib/apolloClient'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider attribute='class' defaultTheme='dark' forcedTheme='dark'>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </ThemeProvider>
)
