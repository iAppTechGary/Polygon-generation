import { useSelector }       from 'react-redux';
import { Navigate, Outlet }  from 'react-router-dom';
import type { RootState }    from '../../store';

/**
 * ProtectedRoute
 *
 * Wraps a group of `<Route>` elements. If the user is not authenticated
 * (no token in Redux state) they are redirected to `/signin`.
 *
 * Usage in the router:
 *
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *     <Route path="/settings"  element={<Settings />} />
 *   </Route>
 */
export default function ProtectedRoute() {
  const token = useSelector((state: RootState) => state.auth.token);

  return token ? <Outlet /> : <Navigate to="/signin" replace />;
}
