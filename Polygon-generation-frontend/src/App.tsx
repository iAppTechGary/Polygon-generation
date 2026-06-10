import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Home             from './pages/Home';
import Signin           from './pages/Signin';
import Signup           from './pages/Signup';
import Dashboard        from './pages/Dashboard';
import Portfolio        from './pages/Portfolio';
import Templates        from './pages/Templates';
import Pricing          from './pages/Pricing';
import Paint            from './pages/Paint';
import PaletteSelection from './pages/PaletteSelection';
import ArtLesson        from './pages/ArtLesson';
import InviteTeam       from './pages/InviteTeam';
import Contact          from './pages/Contact';
import Viewer3D         from './pages/Viewer3D';
import Feature          from './pages/Feature';
import Price            from './pages/Price';
import ContactUs        from './pages/ContactUs';
import Setting          from './components/Setting/Setting';

import Headers          from './components/common/Header/Headers';
import Footer           from './components/common/Footer/Footer';
import Sidebar          from './components/common/Sidebar/Sidebar';
import ProtectedRoute   from './middleware/ProtectedRoute';

/**
 * EmbedLayout — strips all navigation chrome so the page can be safely
 * dropped into a third-party iframe via `?embed=1`.
 */
function EmbedLayout() {
  return (
    <main className="w-screen h-screen bg-neutral-1 dark:bg-neutral-8">
      <Routes>
        <Route path="/3d-viewer" element={<Viewer3D />} />
        <Route path="*"          element={<Viewer3D />} />
      </Routes>
    </main>
  );
}

/**
 * FullAppLayout — standard authenticated shell with sidebar, header, footer.
 */
function FullAppLayout() {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="grow min-w-0 bg-neutral-1 dark:bg-neutral-8 transition-colors duration-300">
          <Headers />
          <Routes>
            {/* Public routes */}
            <Route path="/"           element={<Home />} />
            <Route path="/signin"     element={<Signin />} />
            <Route path="/signup"     element={<Signup />} />
            <Route path="/feature"    element={<Feature />} />
            <Route path="/price"      element={<Price />} />
            <Route path="/contact-us" element={<ContactUs />} />

            {/* Protected routes — user must be authenticated */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard"         element={<Dashboard />} />
              <Route path="/portfolio"         element={<Portfolio />} />
              <Route path="/template"          element={<Templates />} />
              <Route path="/pricing"           element={<Pricing />} />
              <Route path="/settings"          element={<Setting />} />
              <Route path="/paint"             element={<Paint />} />
              <Route path="/palette-selection" element={<PaletteSelection />} />
              <Route path="/art-lesson"        element={<ArtLesson />} />
              <Route path="/invite-team"       element={<InviteTeam />} />
              <Route path="/contact"           element={<Contact />} />
              <Route path="/3d-viewer"         element={<Viewer3D />} />
              <Route path="*"                  element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}

/**
 * AppShell — reads the `embed` query param and renders the appropriate layout.
 * This keeps the routing logic in one place without duplicating route definitions.
 */
function AppShell() {
  const location  = useLocation();
  const isEmbed   = new URLSearchParams(location.search).get('embed') === '1';
  return isEmbed ? <EmbedLayout /> : <FullAppLayout />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
