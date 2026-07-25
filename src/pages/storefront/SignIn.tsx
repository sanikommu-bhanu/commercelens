import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Github } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';

const fieldIn = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SignIn() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const pushToast = useUiStore((s) => s.pushToast);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || 'Something went wrong.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    navigate('/home');
  };

  const socialToast = () => pushToast('Not available in demo', 'default');

  return (
    <div
      className="app-shell flex flex-col px-6"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 32px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
      }}
    >
      <motion.div
        animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          custom={0}
          initial="hidden"
          animate="show"
          variants={fieldIn}
          className="flex justify-center mb-6"
        >
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center shadow-soft"
            style={{
              background: 'linear-gradient(135deg, rgba(122,59,30,0.14), rgba(122,59,30,0.02))',
              border: '1px solid rgba(122,59,30,0.18)',
            }}
          >
            <Logo variant="mark" size={52} tone="light" />
          </div>
        </motion.div>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fieldIn}
          className="font-display text-3xl font-semibold text-center mb-1"
        >
          Welcome Back
        </motion.h1>
        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fieldIn}
          className="text-center text-text-muted mb-8"
        >
          Sign in to continue
        </motion.p>

        {forgot ? (
          <ForgotPassword onBack={() => setForgot(false)} />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <motion.div custom={3} initial="hidden" animate="show" variants={fieldIn}>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-2 focus:ring-brand-accent/30"
                required
              />
            </motion.div>
            <motion.div custom={4} initial="hidden" animate="show" variants={fieldIn} className="relative">
              <Input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                required
                className="pr-11 focus:ring-2 focus:ring-brand-accent/30"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-text-muted"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>
            <motion.button
              custom={5}
              initial="hidden"
              animate="show"
              variants={fieldIn}
              type="button"
              onClick={() => setForgot(true)}
              className="self-end text-sm text-brand-accent font-medium -mt-1 mb-2 min-h-[44px] flex items-center"
            >
              Forgot password?
            </motion.button>
            <motion.div custom={6} initial="hidden" animate="show" variants={fieldIn}>
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Signing In…' : 'Sign In'}
              </Button>
            </motion.div>

            <motion.p
              custom={7}
              initial="hidden"
              animate="show"
              variants={fieldIn}
              className="text-center text-text-muted text-sm my-3"
            >
              or continue with
            </motion.p>
            <motion.div
              custom={8}
              initial="hidden"
              animate="show"
              variants={fieldIn}
              className="flex items-center justify-center gap-4"
            >
              <button
                type="button"
                onClick={socialToast}
                aria-label="Continue with Google"
                className="w-12 h-12 rounded-full border border-brand-tan/30 flex items-center justify-center bg-white dark:bg-dark-surface"
              >
                <span className="font-bold text-brand-dark">G</span>
              </button>
              <button
                type="button"
                onClick={socialToast}
                aria-label="Continue with GitHub"
                className="w-12 h-12 rounded-full border border-brand-tan/30 flex items-center justify-center bg-white dark:bg-dark-surface"
              >
                <Github size={20} className="text-brand-dark dark:text-cream" />
              </button>
            </motion.div>

            <motion.p
              custom={9}
              initial="hidden"
              animate="show"
              variants={fieldIn}
              className="text-center text-sm text-text-muted mt-4"
            >
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-brand-accent font-semibold">
                Sign Up
              </Link>
            </motion.p>
          </form>
        )}
      </motion.div>
    </div>
  );
}

function ForgotPassword({ onBack }: { onBack: () => void }) {
  const pushToast = useUiStore((s) => s.pushToast);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    pushToast('Reset link sent — check your inbox', 'success');
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <p className="text-sm text-text-muted -mt-2 mb-1">
        Enter the email on your account and we&apos;ll send a mock reset link.
      </p>
      <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Button type="submit" fullWidth disabled={sent}>
        {sent ? 'Link Sent' : 'Send Reset Link'}
      </Button>
      <button type="button" onClick={onBack} className="text-center text-sm text-brand-accent font-medium mt-2 min-h-[44px]">
        Back to Sign In
      </button>
    </form>
  );
}
