import { Input } from '@/_shared/ui/input';
import { Label } from '@/_shared/ui/label';
import { FieldValues, UseFormRegister, FieldError, Path } from 'react-hook-form';

type FormFieldProps<T extends FieldValues> = {
  label: string;
  id: Path<T>;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
};

export const FormField = <T extends FieldValues>({ label, id, placeholder, type = 'text', register, error }: FormFieldProps<T>) => (
  <div className="grid gap-2">
    <Label htmlFor={id as string}>{label}</Label>
    <Input
      id={id as string}
      placeholder={placeholder}
      type={type}
      {...register(id)}
    />
    {error ? <div className='text-sm text-red-500'>{error.message}</div> : null}
  </div>
);