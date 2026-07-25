import { Home, ShoppingBag, Heart, MessageCircle, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCartStore } from '../../store/cart';

const items = [
  { to: '/home', icon: Home },
  { to: '/cart', icon: ShoppingBag },
  { to: '/wishlist', icon: Heart },
  { to: '/support-chat', icon: MessageCircle },
  { to: '/profile', icon: User },
];

export default function BottomNav() {
  const cartCount = useCartStore((s) => s.lines.reduce((a, l) => a + l.qty, 0));
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[380px]">
      <div className="bg-brand-dark rounded-full flex items-center justify-between px-6 py-3.5 shadow-soft">
        {items.map(({ to, icon: Icon }) => (
          <NavLink key={to} to={to} className="relative">
            {({ isActive }) => (
              <div className={isActive ? 'text-cream' : 'text-brand-tan/60'}>
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                {to === '/cart' && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-danger text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
