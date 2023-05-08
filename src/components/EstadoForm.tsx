
import Button from '@mui/material/Button';
import { Field, Form, Formik } from 'formik';
import { GenericField } from './GenericField';
import { estadoSchema } from '../schemas/Estado.schema';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Values
{
	
	id?: number|undefined|string;
	nome: string;
	sigla: string;
	cod_ibge: number;
}

export const EstadoForm = ( param:any ) => {

	const history = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [initialValues, setInitialValues] = useState<Values>( { id: '0', nome: '', sigla: '', cod_ibge: 0 } );
	const apiPrivate = useAxiosPrivate();

	const getEstado = async ( id:any ) =>
	{
		try
		{
			const response = await apiPrivate.get('http://localhost:8080/app/getestado',{ params: { id: id } } )
			setInitialValues( response.data );
		}
		catch( error )
		{
			console.log(error);
		}

		
	}

	useEffect( () => { if( typeof id != 'undefined' ) { getEstado( id ); } }, [] );

	return (
				<Formik initialValues={initialValues}
					enableReinitialize={true}
					onSubmit=
					{
						async (values,actions)=>
						{
							if( typeof values.id == 'undefined' || values.id === '0' )
							{
								await apiPrivate.post('http://localhost:8080/app/createestado', { nome: values.nome, sigla: values.sigla, cod_ibge: values.cod_ibge } ).then( (response) => { history('/estadosList') } ).catch( (error) => { console.log(error) } );
							}
							else
							{
								await apiPrivate.put(`http://localhost:8080/app/updateestado`, values).then( (response) => { history('/estadosList') } ).catch( (error) => { console.log(error) } );
							}

							
						}
					}

					validationSchema={estadoSchema}
				>
					{
						({ values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit }) =>
						(

							<Form>
								<div><Field name='id' placeholder='Código' label="Código" disabled={true}component={ GenericField } /> </div>
								<div><Field name='nome' placeholder='Nome' label="Nome" error={ ( errors.nome && touched.nome ) } helperText={ (errors.nome && touched.nome ) ? errors.nome : '' }  component={ GenericField } /> </div>
								<div><Field name='sigla' placeholder='Sigla' label="Sigla" error={ ( errors.sigla && touched.sigla ) } helperText={ (  errors.sigla && touched.sigla ) ? errors.sigla : '' } component={ GenericField } /> </div>
								<div><Field name='cod_ibge' placeholder='Código IBGE' label="Código IBGE" type="number" component={ GenericField } /> </div>
								<Button type='submit' variant='contained' color='success' size='small'  disabled={isSubmitting} >Enviar</Button>
							</Form>
						)
						
					}
				</Formik>
			);
}
