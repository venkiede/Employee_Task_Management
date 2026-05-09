import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const TeamMemberForm = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Full Name"
        placeholder="e.g. Jane Doe"
        error={errors.full_name?.message}
        icon={<User size={18} />}
        {...register('full_name', { required: 'Full name is required' })}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="jane@company.com"
        error={errors.email?.message}
        icon={<Mail size={18} />}
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
        placeholder="••••••••"
        error={errors.password?.message}
        icon={<Lock size={18} />}
        {...register('password', { 
          required: 'Password is required',
          minLength: { value: 8, message: 'Must be at least 8 characters' }
        })}
      />

      <div className="pt-4 border-t border-border flex justify-end gap-3">
        <Button type="submit" isLoading={isLoading} fullWidth>
          Save Member
        </Button>
      </div>
    </form>
  );
};

export default TeamMemberForm;
