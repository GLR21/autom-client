import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, useFormikContext } from 'formik';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

const PedidosForm = () => {

	const apiPrivate = useAxiosPrivate();
	const history = useNavigate();
	const [pecas,setPecas] = useState<any>([ { id: 0, nome: 'Selecione uma peça', valor_unidade: 0 }]);
	const [pessoas,setPessoas] = useState<any>([ { id: 0, nome: 'Selecione uma pessoa' } ]);	
	const [fields, setFields] = useState({ cliente: 0, fields: [{ peca: 0, quantidade: 0 ,valor_unidade: 0 }] });

	const getPecas = async () => {

		try
		{
			const response = await apiPrivate.get('http://localhost:8080/app/getpecas');

			let pecasLoad = [ { id: 0, nome: 'Selecione uma peça', valor_unidade: 0 } ];

			response.data.map( (peca:any) => { pecasLoad.push( { id: peca.id, nome: peca.nome, valor_unidade: peca.valor_compra } ) });
			setPecas(pecasLoad);
		}
		catch( error )
		{
			console.log(error);
		}
	}

	const pecaChangeHandler = async ( id:any ) => {
		
		try
		{
			const response = await apiPrivate.get('http://localhost:8080/app/getpeca/', { params: { id: id } } );
			return response.data;
		}
		catch( error )
		{
			console.log(error);
		}
	}

	const getPessoas = async () => {

		try
		{
			const response = await apiPrivate.get('http://localhost:8080/app/getpessoas');

			let pessoasLoad = [ { id: 0, nome: 'Selecione uma pessoa' } ];

			response.data.map( (pessoa:any) => { pessoasLoad.push( { id: pessoa.id, nome: pessoa.nome } ) });
			setPessoas(pessoasLoad);
		}
		catch( error )
		{
			console.log(error);
		}
	}
	
	useEffect( () => { getPecas();getPessoas(); }, [] );

	return (
    <Formik
      initialValues={fields}
      onSubmit={

			async (values,actions)=>
			{
				console.log(values);

				let param = {
					ref_pessoa: values.cliente,
					total: 0,
					//Status para pendente
					status: 2,
					pecasPedido: [{ ref_peca: 0, quantidade: 0}]
				}

				param.pecasPedido.shift();
				values.fields.map( async (field:any) => 
				{
					param.total+= parseFloat( field.valor_total );
					param.pecasPedido.push( { ref_peca: field.peca, quantidade: field.quantidade } );
				});

				try
				{
					const response = await apiPrivate.post('http://localhost:8080/app/createpedido', param );
					history('/pedidosList');
				}
				catch( error )
				{
					console.log(error);
				}
			}
	  }
	  enableReinitialize={true}
    >

      {({ values, handleChange, setFieldValue, getFieldProps }) => (
        <Form>
			<Stack spacing={2} direction="column">
				
				<TextField 
					select={true}
					variant='outlined'
					name='cliente'
					onChange={handleChange}
					style={{ width: '780px' }}

				>
					{
						(Array.isArray(pessoas) ? pessoas.map(({id, nome })=> ([id, nome])) : Object.entries(pessoas)).map(([key,value])=>
						{
							return (
								<MenuItem key={key} value={key}>
									{value}
								</MenuItem>
							)
						})
					}
				</TextField>
		  
				<FieldArray name="fields">
					{({ push, remove }) => (
					<>
						{values.fields.map((field, index ) => (
							<div key={index}>
								<Stack spacing={2} direction="row">
									<Stack spacing={0} direction="row">

										<TextField
											select={true}
											variant='outlined'
											fullWidth={true}
											name={`fields.${index}.peca`}
											value={field.peca}
											style={{ width: '300px' }}
											onChange={ async (e:any) => {

												const { value } = e.target;
												const peca = await pecaChangeHandler( value );
												
												const valorQuantidade = getFieldProps( `fields.${index}.quantidade` ).value;

												setFieldValue( `fields.${index}.valor_unidade`, peca.valor_revenda, false );
												setFieldValue( `fields.${index}.valor_total`, (peca.valor_revenda * valorQuantidade).toFixed(2), false );
												

												handleChange(e);
											}}
										>
										{
											(Array.isArray(pecas) ? pecas.map(({id, nome })=> ([id, nome])) : Object.entries(pecas)).map(([key,value])=>
											{
												return (
													<MenuItem key={key} value={key}>
														{value}
													</MenuItem>
												)
											})
										}
										</TextField>
										<Field
											
											as={TextField}
											name={`fields.${index}.quantidade`}
											variant="outlined"
											label="Quantidade"
											value={field.quantidade}
											type="number"
											style={{ width: '100px' }}
											onChange=
											{
												(e:any) => {

													const { value } = e.target;
													const valorUnidade = getFieldProps( `fields.${index}.valor_unidade` ).value;

													setFieldValue( `fields.${index}.valor_total`, (valorUnidade * value).toFixed(2), false );
													handleChange(e);
											} }
										/>
										<Field as={TextField} style={{ width: '150px' }} name={`fields.${index}.valor_unidade`} variant="outlined" label="Valor Unitário" defaultValue='0' disabled/>
										<Field as={TextField} style={{ width: '150px' }} name={`fields.${index}.valor_total`} variant="outlined" label="Valor Total" defaultValue='0' disabled/>
									</Stack>
									<Stack spacing={2} direction="row">
										{
											index <= 0 &&
											<Button	variant="outlined"	color="primary"	onClick={() => push( { peca: 0, quantidade: 0 } )}> <Add></Add> </Button>
										}
										{
											index > 0 &&
											<Button variant="outlined" color="secondary" onClick={() => remove(index)}><Delete></Delete></Button>
										}
									</Stack>
								</Stack>
							</div>
						))}
						
					</>
					)}
				</FieldArray>
				<Button variant="contained" color="primary" type="submit">
					Enviar
				</Button>
			</Stack>
        </Form>
      )}
    </Formik>
  );

};

export default PedidosForm;
