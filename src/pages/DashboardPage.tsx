import { Navigate } from 'react-router-dom';

/**
 * Dashboard page that redirects to analytics
 */
function DashboardPage() {
    return <Navigate to="/analytics" replace />;
}

export default DashboardPage;
