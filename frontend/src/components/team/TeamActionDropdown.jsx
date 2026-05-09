import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, RotateCcw } from 'lucide-react';

const TeamActionDropdown = ({ member, onRemove, onRestore, isRemoved }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-subtle hover:text-heading p-2 rounded-lg hover:bg-border-subtle transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg z-50 py-2 animate-in fade-in zoom-in duration-200">
          {!isRemoved ? (
            <button
              onClick={() => {
                onRemove(member);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-500 hover:bg-danger-500/5 transition-colors"
            >
              <Trash2 size={16} />
              Remove Team Member
            </button>
          ) : (
            <button
              onClick={() => {
                onRestore(member);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-success-500 hover:bg-success-500/5 transition-colors"
            >
              <RotateCcw size={16} />
              Restore Member
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamActionDropdown;
