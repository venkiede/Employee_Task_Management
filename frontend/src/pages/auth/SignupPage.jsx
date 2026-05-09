import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const SignupPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Clear previous errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, []);

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(registerUser(data));
      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        // Handle field specific errors from Django backend
        let errMsg = 'Registration failed';
        if (resultAction.payload?.errors) {
            const errs = resultAction.payload.errors;
            const firstKey = Object.keys(errs)[0];
            errMsg = `${firstKey}: ${errs[firstKey][0]}`;
        } else if (resultAction.payload?.message) {
            errMsg = resultAction.payload.message;
        }
        toast.error(errMsg);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-heading mb-2">Create Account</h2>
        <p className="text-subtle">Join your team and start managing projects</p>
      </div>

      {error && !error.errors && (
        <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/50 rounded-lg text-danger-500 text-sm">
          {error.message || 'Registration failed'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          icon={<User size={18} />}
          placeholder="John Doe"
          error={errors.full_name?.message}
          {...register('full_name', { 
            required: 'Full name is required' 
          })}
        />

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Password"
            type="password"
            icon={<Lock size={18} />}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 8, message: 'Must be at least 8 characters' }
            })}
          />

          <Input
            label="Confirm Password"
            type="password"
            icon={<Lock size={18} />}
            placeholder="••••••••"
            error={errors.confirm_password?.message}
            {...register('confirm_password', { 
              required: 'Confirm password is required',
              validate: value => value === password || 'Passwords do not match'
            })}
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-body">Role</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-subtle">
              <Briefcase size={18} />
            </div>
            <select
              className={`
                flex h-10 w-full rounded-md border bg-surface px-3 py-2 text-sm text-heading
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500
                transition-colors pl-10 border-border
              `}
              {...register('role')}
              defaultValue="member"
            >
              <option value="member">Team Member</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          isLoading={loading}
          className="mt-6"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-subtle">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
