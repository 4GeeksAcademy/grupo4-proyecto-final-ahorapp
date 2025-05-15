import React, { useState, useEffect, useContext, useRef } from "react";
import ApexCharts from "react-apexcharts";
import { Context } from "../store/appContext";


const arraysDeepEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) {
            return false;
        }
    }
    return true;
};

const RadialProgressChart = () => {
    const { store, actions } = useContext(Context);
    const [numberOfWallets, setNumberOfWallets] = useState(0); 
    const [loading, setLoading] = useState(true);
    const [chartLabel, setChartLabel] = useState("Cargando Billeteras..."); 

    const hasFetchedWallets = useRef(false); 

    useEffect(() => {
      
        if (!hasFetchedWallets.current) {
            const fetchData = async () => {
                setLoading(true);
               
                await actions.getAllUserWallets(); 
                hasFetchedWallets.current = true;
            };
            fetchData();
        }
    }, [actions]); 
  
    useEffect(() => {
       
        if (store.wallets_from_user) {
            
            const walletsArray = store.wallets_from_user;

            const count = walletsArray.length; 
            setNumberOfWallets(count);

            if (count > 0) {
                
                setChartLabel(count === 1 ? "Billetera Activa" : "Billeteras Activas");
            } else {
                setChartLabel("Sin Billeteras");
            }
            setLoading(false);
        } else {
           
            setLoading(true); 
        }
    }, [store.wallets_from_user]); 


    const chartOptions = {
        chart: {
            type: "radialBar",
            background: "transparent",
            animations: {
                enabled: true, easing: 'easeout', speed: 800,
                animateGradually: { enabled: true, delay: 150 },
                dynamicAnimation: { enabled: true, speed: 350 }
            }
        },
        plotOptions: {
            radialBar: {
                hollow: { size: "70%" },
                dataLabels: {
                    name: {
                        show: true, fontSize: '14px', fontFamily: 'Helvetica, Arial, sans-serif', offsetY: -10,
                        color: 'var(--bs-body-color)'
                    },
                    value: {
                        fontSize: "24px", fontWeight: "bold", offsetY: 5, color: "var(--bs-body-color)",
                        formatter: function (val) {
                            return numberOfWallets.toString(); 
                        }
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark', type: 'horizontal', shadeIntensity: 0.5,
                gradientToColors: ['#87CEEB'], inverseColors: true, opacityFrom: 1, opacityTo: 1, stops: [0, 100]
            }
        },
        stroke: { lineCap: "round" },
        colors: ["#0d6efd"],
        labels: [chartLabel],
    };

    
    const chartSeriesValue = numberOfWallets > 0 ? 100 : 0; 

    return (
        <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
                {loading ? (
                    <p>Cargando información...</p>
                ) : (
                    <ApexCharts
                        options={chartOptions}
                        series={[chartSeriesValue]}
                        type="radialBar"
                        height={200}
                    />
                )}
            </div>
        </div>
    );
};

export default RadialProgressChart;