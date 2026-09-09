'use client';
import { useId, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PasswordInput({ id, className, onKeyDown, onKeyUp, onBlur, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const generatedId = useId(), inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false), [caps, setCaps] = useState(false);
  return <div>
    <div className="relative">
      <input {...props} id={inputId} type={visible ? 'text' : 'password'} className={cn(className, 'pr-14')}
        aria-describedby={[props['aria-describedby'], caps ? `${inputId}-caps` : null].filter(Boolean).join(' ') || undefined}
        onKeyDown={e => { setCaps(e.getModifierState('CapsLock')); onKeyDown?.(e); }}
        onKeyUp={e => { setCaps(e.getModifierState('CapsLock')); onKeyUp?.(e); }}
        onBlur={e => { setCaps(false); onBlur?.(e); }} />
      <button type="button" disabled={props.disabled} aria-controls={inputId} aria-pressed={visible}
        aria-label={visible ? 'Şifreyi gizle' : 'Şifreyi göster'} onClick={() => setVisible(value => !value)}
        className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-brand-xlight hover:text-brand focus-visible:outline-2 focus-visible:outline-brand">
        {visible ? <EyeOff size={20} aria-hidden="true"/> : <Eye size={20} aria-hidden="true"/>}
      </button>
    </div>
    {caps && <p id={`${inputId}-caps`} role="status" className="mt-2 text-sm text-muted">Caps Lock açık.</p>}
  </div>;
}
