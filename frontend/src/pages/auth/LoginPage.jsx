import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Clear previous errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(resultAction.payload?.message || 'Login failed');
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-heading mb-2">Sign In</h2>
        <p className="text-subtle">Enter your credentials to access your account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/50 rounded-lg text-danger-500 text-sm">
          {error.message || 'Login failed'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          icon={<Mail size={18} />}
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />

        <Input
          label="Password"
          type="password"
          icon={<Lock size={18} />}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { 
            required: 'Password is required' 
          })}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-border-subtle bg-surface text-primary-500 focus:ring-primary-500 focus:ring-offset-background" />
            <span className="text-body">Remember me</span>
          </label>
          <a href="#" className="text-primary-500 hover:text-primary-400 font-medium">
            Forgot password?
          </a>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          isLoading={loading}
          className="mt-2"
        >
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-subtle">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-500 hover:text-primary-400 font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
