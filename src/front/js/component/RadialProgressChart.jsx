import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

const RadialProgressChart = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
       
        const simulatedProgress = 65; 
        setTimeout(() => setProgress(simulatedProgress), 800); 
    }, []);

    const chartOptions = {
        chart: {
            type: "radialBar",
            background: "transparent"
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: "70%",
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "var(--bs-body-color)",
                    }
                }
            }
        },
        stroke: {
            lineCap: "round"
        },
        colors: ["#0d6efd"], 
        labels: ["Progreso"],
    };

    return (
        <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body d-flex justify-content-center align-items-center">
                <ApexCharts
                    options={chartOptions}
                    series={[progress]}
                    type="radialBar"
                    height={200}
                />
            </div>
        </div>
    );
};

export default RadialProgressChart;





