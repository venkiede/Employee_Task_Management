import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  id,
  className = '', 
  containerClassName = '',
  icon,
  type = 'text',
  ...props 
}, ref) => {
  
  const generatedId = id || Math.random().toString(36).substring(7);

  return (
    <div className={`flex flex-col space-y-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={generatedId} className="text-sm font-medium text-heading">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-subtle">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          id={generatedId}
          type={type}
          className={`
            flex h-10 w-full rounded-md border bg-surface px-3 py-2 text-sm text-heading
            file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-faint
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500
            disabled:cursor-not-allowed disabled:opacity-50
            transition-colors
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger-500 focus-visible:ring-danger-500' : 'border-border'}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-danger-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
