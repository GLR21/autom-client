import { FieldProps } from 'formik';
import { TextField } from '@mui/material';
import * as React from 'react';

interface GenericFieldProps extends FieldProps{
	placeholder: string;
	label: string;
	disabled?: boolean;
	type: string;
	error?: boolean;
	helperText?: string;
}

export const GenericField: React.FC<GenericFieldProps> = ({ field, form, placeholder, label, disabled, type, error, helperText }) => {
	return <TextField variant="standard" placeholder={placeholder}  label={label} disabled={disabled} type={type} error={ error } helperText={ helperText } defaultValue={undefined} {...field}/>;
}
