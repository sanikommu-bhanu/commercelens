import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Boxes,
  Users,
  FileBarChart,
  MoreHorizontal,
  Map,
  DollarSign,
  ShoppingBag,
  Bell,
  Settings,
  HelpCircle,
} from 'lucide-react';

const mobileItems = [
  { to: '/dashboard/overview', label: 'Overview', icon: LayoutGrid },
  { to: '/dashboard/inventory', label: 'Inventory', icon: Boxes },
  { to: '/dashboard/customers', label: 'Customers', icon: Users },
  { to: '/dashboard/heatmaps', label: 'Reports', icon: FileBarChart },
  { to: '/dashboard/more', label: 'More', icon: MoreHorizontal },
];

export const sidebarItems = [
  { to: '/dashboard/overview', label: 'Overview', icon: LayoutGrid },
  { to: '/dashboard/inventory', label: 'Inventory', icon: Boxes },
  { to: '/dashboard/funnel', label: 'Sales Funnel', icon: Map },
  { to: '/dashboard/customers', label: 'Customers', icon: Users },
  { to: '/dashboard/heatmaps', label: 'Heatmaps & Reports', icon: FileBarChart },
  { to: '/dashboard/pricing', label: 'Pricing', icon: DollarSign },
  { to: '/dashboard/products', label: 'Products', icon: ShoppingBag },
  { to: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/support', label: 'Help & Support', icon: HelpCircle },
];

export function DashboardBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-shell mx-auto bg-warm-white dark:bg-dark-surface border-t border-brand-tan/20 dark:border-white/10 flex items-center justify-between px-4 py-2.5">
      {mobileItems.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className="flex flex-col items-center gap-1 px-1">
          {({ isActive }) => (
            <>
              <Icon size={20} className={isActive ? 'text-brand-accent' : 'text-text-muted'} />
              <span className={`text-[10px] ${isActive ? 'text-brand-accent font-semibold' : 'text-text-muted'}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
