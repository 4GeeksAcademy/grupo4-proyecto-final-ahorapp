import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { parseISO, getMonth, format } from "date-fns";
import { es } from "date-fns/locale";
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid} from "recharts";

const LinesChart = () => {

    const { store, actions } = useContext(Context);
    const [data, setData] = useState([])


    useEffect(() => {

        const fetchData = async () => {
            const grouped = {}

            const result = await actions.get_records()

            if(!result){
                console.log("No se pudieron traer los datos de las graficas")
                return;
            }
    
            store.records.forEach(record => {
                const month = format(parseISO(record.timestamp), "HH:mm", { locale: es });
        
                if(!grouped[month]){
                    grouped[month] = { month, income: 0, outcome: 0 };
                }
        
                if (record.amount > 0) {
                    grouped[month].income += record.amount
                } else {
                    grouped[month].outcome += Math.abs(record.amount);
                }
        
            });
           
            setData(Object.values(grouped)) 
            
        }

        fetchData()

    }, [JSON.stringify(store.records)]);

return (
    <div className="card p-3 shadow rounded-2">
      <h5 className="text-center mb-3 fw-bold">Resumen Diario</h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dataKey="income" type="monotone" stroke="#4caf50" name="Ingresos" />
          <Line dataKey="outcome" type="monotone" stroke="#f44336" name="Gastos" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LinesChart;