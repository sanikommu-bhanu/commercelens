import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';
import { useAuthStore } from '../../store/auth';

const fieldIn = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SignUp() {
  const navigate = useNavigate();
  const signUp = useAuthStore((s) => s.signUp);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email address.';
    if (password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (password !== confirm) e.confirm = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await signUp({ name, email, password });
    setLoading(false);
    if (!res.ok) {
      setErrors({ email: res.error || 'Something went wrong.' });
      return;
    }
    navigate('/onboarding');
  };

  return (
    <div
      className="app-shell flex flex-col px-6"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 32px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
      }}
    >
      <motion.div
        custom={0}
        initial="hidden"
        animate="show"
        variants={fieldIn}
        className="flex justify-center mb-6"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center shadow-soft"
          style={{
            background: 'linear-gradient(135deg, rgba(122,59,30,0.14), rgba(122,59,30,0.02))',
            border: '1px solid rgba(122,59,30,0.18)',
          }}
        >
          <Logo variant="mark" size={44} tone="light" />
        </div>
      </motion.div>

      <motion.h1
        custom={1}
        initial="hidden"
        animate="show"
        variants={fieldIn}
        className="font-display text-3xl font-semibold text-center mb-1"
      >
        Create Account
      </motion.h1>
      <motion.p
        custom={2}
        initial="hidden"
        animate="show"
        variants={fieldIn}
        className="text-center text-text-muted mb-8"
      >
        Start seeing more, selling smarter
      </motion.p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <motion.div custom={3} initial="hidden" animate="show" variants={fieldIn}>
          <Input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            className="focus:ring-2 focus:ring-brand-accent/30"
          />
        </motion.div>
        <motion.div custom={4} initial="hidden" animate="show" variants={fieldIn}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            className="focus:ring-2 focus:ring-brand-accent/30"
          />
        </motion.div>
        <motion.div custom={5} initial="hidden" animate="show" variants={fieldIn}>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            className="focus:ring-2 focus:ring-brand-accent/30"
          />
        </motion.div>
        <motion.div custom={6} initial="hidden" animate="show" variants={fieldIn}>
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
            className="focus:ring-2 focus:ring-brand-accent/30"
          />
        </motion.div>
        <motion.div custom={7} initial="hidden" animate="show" variants={fieldIn}>
          <Button type="submit" fullWidth disabled={loading} className="mt-2">
            {loading ? 'Creating Account…' : 'Sign Up'}
          </Button>
        </motion.div>
        <motion.p
          custom={8}
          initial="hidden"
          animate="show"
          variants={fieldIn}
          className="text-center text-sm text-text-muted mt-4"
        >
          Already have an account?{' '}
          <Link to="/signin" className="text-brand-accent font-semibold">
            Sign In
          </Link>
        </motion.p>
      </form>
    </div>
  );
}
