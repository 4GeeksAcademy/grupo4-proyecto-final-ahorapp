import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { Context } from "../store/appContext";
import Chart from "react-apexcharts";

const CalculadoraAhorro = () => {
  const { actions } = useContext(Context);
  const [formData, setFormData] = useState({
    ingresos: "",
    gastos_fijos: "",
    gastos_variables: "",
    objetivo_ahorro: ""
  });

  const [result, setResult] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [firstLoad, setFirstLoad] = useState(() => {
    return sessionStorage.getItem("calcAnimated") !== "true";
  });

  useEffect(() => {
    if (firstLoad) {
      sessionStorage.setItem("calcAnimated", "true");
      setFirstLoad(false);
    }
  }, [firstLoad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actions.calcularAhorro(formData);
      setResult(res);
      setShowChart(true);
    } catch {
      alert("Ocurrió un error al calcular el ahorro.");
    }
  };

  const chartOptions = {
    chart: {
      type: "bar",
      animations: { enabled: true, easing: "easeinout", speed: 800 },
      foreColor: undefined 
    },
    xaxis: {
      categories: ["Ingresos", "Gastos Fijos", "Gastos Variables", "Ahorro"]
    }
  };

  const chartSeries = [
    {
      name: "Cantidad ($)",
      data: [
        parseFloat(formData.ingresos || 0),
        parseFloat(formData.gastos_fijos || 0),
        parseFloat(formData.gastos_variables || 0),
        result ? result.ahorro : 0
      ]
    }
  ];

  return (
    <motion.div
      initial={firstLoad ? { opacity: 0, y: 30 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: firstLoad ? 0.6 : 0, ease: "easeOut" }}
      className="container mt-4 p-4 bg-body rounded shadow"
    >
      <h5 className="mb-3">Calculadora de Ahorro Mensual</h5>

      <form onSubmit={handleSubmit} className="row g-3">
        {["ingresos", "gastos_fijos", "gastos_variables", "objetivo_ahorro"].map((field) => (
          <div className="col-md-6" key={field}>
            <label className="form-label text-capitalize">
              {field.replace("_", " ")}
            </label>
            <input
              type="number"
              className="form-control"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              min="0"
              step="any"
              required={field !== "objetivo_ahorro"}
            />
          </div>
        ))}
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary mt-2">
            Calcular
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-4">
          <p>
            <strong>Ahorro Potencial:</strong>{" "}
            ${parseFloat(result.ahorro).toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
          <p>
            <strong>Porcentaje Ahorro:</strong> {result.porcentaje_ahorro}%
          </p>
        </div>
      )}

      {showChart && (
        <div className="mt-4">
          <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
        </div>
      )}
    </motion.div>
  );
};

export default CalculadoraAhorro;




