import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// Route-level code splitting (Brief C4): only the marketing Home ships in
// the main chunk. The Spanish event gallery, the admin dashboard, the QR
// scanner (jsqr), and the 404 page load on demand.
const EventoPage = lazy(() => import("./pages/EventoPage"));
const AdminEventoPage = lazy(() => import("./pages/AdminEventoPage"));
const CheckInPage = lazy(() => import("./pages/CheckInPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#00D4FF]/30 border-t-[#00D4FF] animate-spin" aria-label="Loading" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/support"} component={SupportPage} />
        <Route path={"/soporte"} component={SupportPage} />
        <Route path={"/evento"} component={EventoPage} />
        <Route path={"/admin/evento/checkin"} component={CheckInPage} />
        <Route path={"/admin/evento"} component={AdminEventoPage} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
