import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuthStore } from '../store/authStore';

const initialForm = { name: '', email: '', password: '' };

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading } = useAuthStore();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      email: form.email,
      password: form.password,
    };
    if (mode === 'register') {
      payload.name = form.name;
    }
    const success = mode === 'login' ? await login(payload) : await register(payload);
    if (success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-md p-8">
          <CardContent className="space-y-6 p-0">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Welcome</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Pro Task Manager</h1>
              <p className="mt-2 text-sm text-slate-400">
                {mode === 'login'
                  ? 'Sign in to orchestrate your team.'
                  : 'Create an account to power your workflow.'}
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nova Miles"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@team.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              </Button>
            </form>
            <div className="text-center text-sm text-slate-400">
              {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
              <button
                type="button"
                className="text-neon-400 hover:text-neon-500"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
