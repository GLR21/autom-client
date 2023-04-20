import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { useField, useFormikContext } from "formik";


export const SelectWrapper = ( { name, options, ...otherProps  }:any ) => {

	const { setFieldValue } = useFormikContext();
	const [field, meta] = useField(name);


	const handleChange = ( event:any ) => {
		const { value } = event.target;
		setFieldValue(name, value);	
	}

	const configSelect = {
		...field,
		...otherProps,
		select: true,
		variant: 'outlined',
		fullWidth: true,
		onChange: handleChange 
	}

	if(meta && meta.touched && meta.error){
		configSelect.error = true;
		configSelect.helperText = meta.error;
	}

	return (
		<TextField {...configSelect}>
			{
				(Array.isArray(options) ? options.map(({id, nome })=> ([id, nome])) : Object.entries(options)).map(([key,value])=>
				{
          			return (
						<MenuItem key={key} value={key}>
							{value}
						</MenuItem>
					)
				})
			}

		</TextField>
		
	);
};