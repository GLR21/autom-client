import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Box } from "@mui/material";


export const PedidosByPessoaChart = () => {

	const [state, setState] = useState<any>(
		{
					options:
					{
			    		chart:
						{
			      			id: "basic-bar"
			    		},
			    		xaxis:
						{
			      			categories: []
			    		}
			  		},
			  		series:
					[
			    		{
			      			name: "Quntidade de Pedidos", 
			      			data: []
			    		}
			  		]
				}
	);
	const apiPrivate = useAxiosPrivate();

	const getQuantidadePedidosByPessoa = async () => {
	
		try
		{
			const response = await apiPrivate.get('/app/getquantidadepedidosbypessoa');

			let data = {
				options:
				{
					chart:
					{
						  id: "basic-bar"
					},
					xaxis:
					{
						  categories: new Array<string>()
					}
				  },
				  series:
				[
					{
						  name: "Quantidade de Pedidos", 
						  data: new Array<number>()
					}
				  ]
			};

			console.log(response.data);

			response.data.forEach( (item: any) => {
				data.options.xaxis.categories.push(item.nome_pessoa);
				data.series[0].data.push(item.quantidade_pedidos);
			});
			setState(data);
		}
		catch (error)
		{
			console.log(error);
		}
	}

	useEffect( () => { getQuantidadePedidosByPessoa();  }, [] );

	return (
		<div style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop:'100px', height:'100%' }} >
			<h1>Pedidos por Pessoa</h1>
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              width="700"
			  height='400'
            />
          </div>
        </div>
		</div>
	)

}