import { ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ToastHost from './components/ui/ToastHost';
import AuthGuard from './routes/AuthGuard';

import Splash from './pages/storefront/Splash';
import SignIn from './pages/storefront/SignIn';
import SignUp from './pages/storefront/SignUp';
import Onboarding from './pages/storefront/Onboarding';
import Home from './pages/storefront/Home';
import Listing from './pages/storefront/Listing';
import FilterSheet from './pages/storefront/FilterSheet';
import ProductDetails from './pages/storefront/ProductDetails';
import Cart from './pages/storefront/Cart';
import Checkout from './pages/storefront/Checkout';
import Payment from './pages/storefront/Payment';
import Review from './pages/storefront/Review';
import Wishlist from './pages/storefront/Wishlist';
import Profile from './pages/storefront/Profile';
import SupportChat from './pages/storefront/SupportChat';
import PlaceholderPage from './pages/storefront/PlaceholderPage';

import Overview from './pages/dashboard/Overview';
import Inventory from './pages/dashboard/Inventory';
import Funnel from './pages/dashboard/Funnel';
import Customers from './pages/dashboard/Customers';
import Heatmaps from './pages/dashboard/Heatmaps';
import CreateReport from './pages/dashboard/CreateReport';
import ReportPreview from './pages/dashboard/ReportPreview';
import Pricing from './pages/dashboard/Pricing';
import Products from './pages/dashboard/Products';
import ProductDetailsAdmin from './pages/dashboard/ProductDetailsAdmin';
import ProductAnalytics from './pages/dashboard/ProductAnalytics';
import Competitor from './pages/dashboard/Competitor';
import Forecast from './pages/dashboard/Forecast';
import AddProduct from './pages/dashboard/AddProduct';
import Alerts from './pages/dashboard/Alerts';
import Settings from './pages/dashboard/Settings';
import DashboardProfile from './pages/dashboard/Profile';
import Support from './pages/dashboard/Support';
import More from './pages/dashboard/More';

function PageWrap({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<PageWrap><Splash /></PageWrap>} />
          <Route path="/signin" element={<PageWrap><SignIn /></PageWrap>} />
          <Route path="/signup" element={<PageWrap><SignUp /></PageWrap>} />
          <Route path="/onboarding" element={<PageWrap><Onboarding /></PageWrap>} />

          {/* Storefront */}
          <Route path="/home" element={<AuthGuard><PageWrap><Home /></PageWrap></AuthGuard>} />
          <Route path="/listing/:category" element={<AuthGuard><PageWrap><Listing /></PageWrap></AuthGuard>} />
          <Route path="/filter" element={<AuthGuard><PageWrap><FilterSheet /></PageWrap></AuthGuard>} />
          <Route path="/product/:id" element={<AuthGuard><PageWrap><ProductDetails /></PageWrap></AuthGuard>} />
          <Route path="/cart" element={<AuthGuard><PageWrap><Cart /></PageWrap></AuthGuard>} />
          <Route path="/checkout" element={<AuthGuard><PageWrap><Checkout /></PageWrap></AuthGuard>} />
          <Route path="/payment" element={<AuthGuard><PageWrap><Payment /></PageWrap></AuthGuard>} />
          <Route path="/review" element={<AuthGuard><PageWrap><Review /></PageWrap></AuthGuard>} />
          <Route path="/wishlist" element={<AuthGuard><PageWrap><Wishlist /></PageWrap></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><PageWrap><Profile /></PageWrap></AuthGuard>} />
          <Route path="/support-chat" element={<AuthGuard><PageWrap><SupportChat /></PageWrap></AuthGuard>} />
          <Route path="/orders" element={<AuthGuard><PageWrap><PlaceholderPage title="My Orders" /></PageWrap></AuthGuard>} />
          <Route path="/addresses" element={<AuthGuard><PageWrap><PlaceholderPage title="Shipping Addresses" /></PageWrap></AuthGuard>} />
          <Route path="/payment-methods" element={<AuthGuard><PageWrap><PlaceholderPage title="Payment Methods" /></PageWrap></AuthGuard>} />
          <Route path="/notifications" element={<AuthGuard><PageWrap><PlaceholderPage title="Notifications" /></PageWrap></AuthGuard>} />
          <Route path="/help" element={<AuthGuard><PageWrap><PlaceholderPage title="Help & Support" /></PageWrap></AuthGuard>} />

          {/* Studio Dashboard */}
          <Route path="/dashboard/overview" element={<AuthGuard><PageWrap><Overview /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/inventory" element={<AuthGuard><PageWrap><Inventory /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/funnel" element={<AuthGuard><PageWrap><Funnel /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/customers" element={<AuthGuard><PageWrap><Customers /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/heatmaps" element={<AuthGuard><PageWrap><Heatmaps /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/reports/create" element={<AuthGuard><PageWrap><CreateReport /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/reports/preview" element={<AuthGuard><PageWrap><ReportPreview /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/pricing" element={<AuthGuard><PageWrap><Pricing /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/products" element={<AuthGuard><PageWrap><Products /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/products/:id" element={<AuthGuard><PageWrap><ProductDetailsAdmin /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/products/:id/analytics" element={<AuthGuard><PageWrap><ProductAnalytics /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/competitor" element={<AuthGuard><PageWrap><Competitor /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/forecast" element={<AuthGuard><PageWrap><Forecast /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/products/new" element={<AuthGuard><PageWrap><AddProduct /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/alerts" element={<AuthGuard><PageWrap><Alerts /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/settings" element={<AuthGuard><PageWrap><Settings /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/profile" element={<AuthGuard><PageWrap><DashboardProfile /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/support" element={<AuthGuard><PageWrap><Support /></PageWrap></AuthGuard>} />
          <Route path="/dashboard/more" element={<AuthGuard><PageWrap><More /></PageWrap></AuthGuard>} />

          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </AnimatePresence>
      <ToastHost />
    </>
  );
}
