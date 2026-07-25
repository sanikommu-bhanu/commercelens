import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';
import { useWishlistStore } from '../store/wishlist';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthed, isReady, user } = useAuthStore();
  const loadCart = useCartStore((s) => s.load);
  const loadWishlist = useWishlistStore((s) => s.load);

  useEffect(() => {
    if (user) {
      loadCart(user.id);
      loadWishlist(user.id);
    }
  }, [user, loadCart, loadWishlist]);

  if (!isReady) return null;
  if (!isAuthed) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}
