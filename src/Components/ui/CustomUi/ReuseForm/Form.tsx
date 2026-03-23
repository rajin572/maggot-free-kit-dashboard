import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../field";
import { Input } from "../../input";
import { ReactNode, useState } from "react";
import { Textarea } from "../../textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../../select";
import { Checkbox } from "../../checkbox";
import { EyeIcon, EyeOffIcon, Calendar as CalendarIcon } from "lucide-react";
import { MultiSelect } from "./MultiSelect";
import { FileUpload } from "./FileUpload";
import { cn } from "@/lib/utils";
import { Button } from "../../button";
import { Calendar } from "../../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { format } from "date-fns";

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = {
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
};

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?: boolean;
  controlFirst?: boolean;
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>["render"]
    >[0]["field"] & {
      "aria-invalid": boolean;
      id: string;
    }
  ) => ReactNode;
};

export type FormControlFunc<
  ExtraProps extends Record<string, unknown> = Record<never, never>
> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps
) => ReactNode;

export function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>({
  children,
  control,
  label,
  name,
  description,
  controlFirst,
  horizontal,
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            <FieldLabel className="font-bold! text-base!" htmlFor={field.name}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        );
        const control = children({
          ...field,
          id: field.name,
          "aria-invalid": fieldState.invalid,
        });
        const errorElem = fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        );

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? "horizontal" : undefined}
          >
            {controlFirst ? (
              <>
                {control}
                <FieldContent>
                  {labelElement}
                  {errorElem}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent>{labelElement}</FieldContent>
                {control}
                {errorElem}
              </>
            )}
          </Field>
        );
      }}
    />
  );
}

export const FormInput: FormControlFunc<{
  prefix?: ReactNode;
  suffix?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}> = (props) => {
  const { prefix, suffix, placeholder, disabled, type, ...restProps } = props;

  return (
    <FormBase {...restProps}>
      {(field) => (
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 flex items-center pointer-events-none">
              {prefix}
            </div>
          )}
          <Input
            className={cn(
              "border-[#E5E5E5]! bg-[#F5F5F5]! outline-none! shadow-none! ring-0! text-base! py-5!",
              prefix && "pl-10",
              suffix && "pr-10"
            )}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            {...field}
          />
          {suffix && (
            <div className="absolute right-3 flex items-center">
              {suffix}
            </div>
          )}
        </div>
      )}
    </FormBase>
  );
};

export const FormTextarea: FormControlFunc<{ prefix?: ReactNode; suffix?: ReactNode; placeholder?: string }> = (props) => {
  const { prefix, suffix, placeholder, ...restProps } = props;

  return (
    <FormBase {...restProps}>
      {(field) => (
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-3 flex items-start pointer-events-none">
              {prefix}
            </div>
          )}
          <Textarea
            className={cn(
              "border-[#E5E5E5]! bg-[#F5F5F5]! outline-none! shadow-none! ring-0! text-base! py-5!",
              prefix && "pl-10",
              suffix && "pr-10"
            )}
            placeholder={placeholder}
            {...field}
          />
          {suffix && (
            <div className="absolute right-3 top-3 flex items-start">
              {suffix}
            </div>
          )}
        </div>
      )}
    </FormBase>
  );
};

export const FormPassword: FormControlFunc<{ prefix?: ReactNode; placeholder?: string }> = (props) => {
  const { prefix, placeholder, ...restProps } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <FormBase {...restProps}>
      {(field) => (
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {prefix}
            </div>
          )}
          <Input
            className={cn(
              "border-[#E5E5E5]! bg-[#F5F5F5]! outline-none! shadow-none! ring-0! text-base! py-5!",
              prefix && "pl-10",
              "pr-10" // Always add right padding for eye icon
            )}
            type={isPasswordVisible ? "text" : "password"}
            placeholder={placeholder}
            {...field}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-color"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>
      )}
    </FormBase>
  );
};

export const FormSelect: FormControlFunc<{
  children: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
}> = ({ children, prefix, suffix, ...props }) => {
  return (
    <FormBase {...props}>
      {({ onChange, onBlur, ...field }) => (
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              {prefix}
            </div>
          )}
          <Select {...field} onValueChange={onChange}>
            <SelectTrigger
              className={cn(
                prefix && "pl-10",
                suffix && "pr-10"
              )}
              aria-invalid={field["aria-invalid"]}
              id={field.id}
              onBlur={onBlur}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>{children}</SelectContent>
          </Select>
          {suffix && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10">
              {suffix}
            </div>
          )}
        </div>
      )}
    </FormBase>
  );
};

// FormMultiSelect component following FormBase pattern
export const FormMultiSelect: FormControlFunc<{
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}> = ({ options, placeholder = "Select items...", prefix, suffix, ...props }) => {
  return (
    <FormBase {...props}>
      {({ onChange, value, ...field }) => (
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              {prefix}
            </div>
          )}
          <MultiSelect
            {...field}
            className={cn(
              prefix && "pl-10",
              suffix && "pr-10"
            )}
            options={options}
            placeholder={placeholder}
            value={value || []}
            onChange={onChange}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
              {suffix}
            </div>
          )}
        </div>
      )}
    </FormBase>
  );
};



export const FormCheckbox: FormControlFunc = (props) => {
  return (
    <FormBase {...props} horizontal controlFirst>
      {({ onChange, value, ...field }) => (
        <Checkbox
          className="border-secondary-color bg-base-color/5"
          {...field}
          checked={value}
          onCheckedChange={onChange}
        />
      )}
    </FormBase>
  );
};

// FormUpload component that integrates FileUpload
export const FormUpload: FormControlFunc<{
  maxFiles?: number;
  accept?: string;
}> = ({ maxFiles = 5, accept = "image/*", ...props }) => {
  return (
    <FormBase {...props}>
      {({ onChange, value, ...field }) => (
        <FileUpload
          {...field}
          maxFiles={maxFiles}
          accept={accept}
          value={value || []}
          onChange={onChange}
        />
      )}
    </FormBase>
  );
};

export const FormDatePicker: FormControlFunc<{
  placeholder?: string;
  disablePast?: boolean;
}> = ({ placeholder = "Pick a date", disablePast = false, ...props }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <FormBase {...props}>
      {({ onChange, value }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              data-empty={!value}
              className="w-full justify-start text-left font-normal border-[#E5E5E5]! bg-[#F5F5F5]! py-5! text-base! data-[empty=true]:text-muted-foreground"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value as Date, "PPP") : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value as Date | undefined}
              onSelect={onChange}
              disabled={
                disablePast
                  ? (date) => {
                      const d = new Date(date);
                      d.setHours(0, 0, 0, 0);
                      return d < today;
                    }
                  : undefined
              }
            />
          </PopoverContent>
        </Popover>
      )}
    </FormBase>
  );
};