import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Control, FieldValues, Path } from "react-hook-form";
import { ComponentType, ChangeEvent, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  value?: string | number;
  onChange?: (value: string | number | ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
};

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  inputComponent?: ComponentType<InputProps>;
  placeholder?: string;
}

const CustomFormField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  inputComponent: InputComponent = Input,
  placeholder,
}: FormFieldProps<T>) => {
  return (
    <div className="col-span-1 p-4 border rounded-md">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
            <FormControl>
              <InputComponent
                {...field}
                placeholder={placeholder}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CustomFormField;
