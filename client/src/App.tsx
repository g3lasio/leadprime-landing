import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProgramasPage from "./pages/ProgramasPage";

// Route-level code splitting (Brief C4): only the marketing pages (Home and
// the Programs page, which reuses Home's sections) ship in the main chunk.
// The Spanish event gallery, the admin dashboard, and the 404 page load on
// demand.
const EventoPage = lazy(() => import("./pages/EventoPage"));
const EventosPage = lazy(() => import("./pages/EventosPage"));
const AdminRegistradosPage = lazy(() => import("./pages/AdminRegistradosPage"));
const AdminEventoPage = lazy(() => import("./pages/AdminEventoPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const TallerPage = lazy(() => import("./pages/TallerPage"));
const TallerEquipoPage = lazy(() => import("./pages/TallerEquipoPage"));
const AdminTallerPage = lazy(() => import("./pages/AdminTallerPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#00D4FF]/30 border-t-[#00D4FF] animate-spin" aria-label="Loading" />
    </div>
  );
}

/**
 * Check-in del dueño (7-nov-2026): la ÚNICA puerta de asistencia es la
 * lista de registrados con su checkbox (/admin/registrados). Toda
 * variante razonable del admin — el hub /admin, /registrados, y la
 * ruta vieja del escáner QR, que operaba la tabla legacy del
 * Networking Fairfield y no ve a los registrados del tour — redirige
 * aquí en vez de caer en el 404 del SPA. El servidor además responde
 * 301 para estas mismas rutas (server/_core/index.ts), así que el
 * aterrizaje correcto no depende de qué bundle traiga el teléfono.
 */
function RedirectToRegistrados() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/admin/registrados", { replace: true });
  }, [setLocation]);
  return <RouteFallback />;
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        {/* Bilingual marketing pages: each reads its language from the path */}
        <Route path={"/"} component={Home} />
        <Route path={"/es"} component={Home} />
        <Route path={"/programas"} component={ProgramasPage} />
        <Route path={"/programs"} component={ProgramasPage} />
        <Route path={"/support"} component={SupportPage} />
        <Route path={"/soporte"} component={SupportPage} />
        <Route path={"/evento"} component={EventoPage} />
        <Route path={"/eventos"} component={EventosPage} />
        <Route path={"/admin/registrados"} component={AdminRegistradosPage} />
        <Route path={"/taller"} component={TallerPage} />
        <Route path={"/taller/equipo"} component={TallerEquipoPage} />
        <Route path={"/admin/taller"} component={AdminTallerPage} />
        {/* La ruta vieja del QR ya no abre el escáner: redirige a la
            lista de registrados, que es el check-in vigente. */}
        <Route path={"/admin/evento/checkin"} component={RedirectToRegistrados} />
        <Route path={"/admin/evento"} component={AdminEventoPage} />
        {/* Atajos del dueño (7-nov-2026): ninguna variante razonable
            del admin cae en el 404. */}
        <Route path={"/admin"} component={RedirectToRegistrados} />
        <Route path={"/admin/checkin"} component={RedirectToRegistrados} />
        <Route path={"/registrados"} component={RedirectToRegistrados} />
        <Route path={"/checkin"} component={RedirectToRegistrados} />
        <Route path={"/admin/*"}>
          <RedirectToRegistrados />
        </Route>
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
