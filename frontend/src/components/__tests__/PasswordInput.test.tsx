import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { PasswordInput } from '../ui/PasswordInput';
it('toggles password visibility without submitting or changing its value',()=>{
 const submit=vi.fn(e=>e.preventDefault());render(<form onSubmit={submit}><label htmlFor="password">Şifre</label><PasswordInput id="password" defaultValue="PrivateExample123" autoComplete="current-password"/></form>);
 const input=screen.getByLabelText('Şifre');expect(input).toHaveAttribute('type','password');fireEvent.click(screen.getByRole('button',{name:'Şifreyi göster'}));expect(input).toHaveAttribute('type','text');expect(input).toHaveValue('PrivateExample123');expect(submit).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'Şifreyi gizle'}));expect(input).toHaveAttribute('type','password');
});
it('preserves error association and prevents toggling while disabled',()=>{
 render(<PasswordInput id="disabled-password" disabled aria-invalid aria-describedby="password-error"/>);expect(screen.getByRole('button')).toBeDisabled();expect(document.getElementById('disabled-password')).toHaveAttribute('aria-describedby','password-error');
});
