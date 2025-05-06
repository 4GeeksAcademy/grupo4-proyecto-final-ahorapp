import React, {useContext, useState} from "react";
import { Context } from "../store/appContext";
import { toast } from "react-toastify";



const PayPalBtn = () => {

  const { actions } = useContext(Context);
  const [amount, setAmount] = useState(15)

  const handlePay = async () => {
    try {
        const approvalUrl = await actions.createOrderPayPal(amount);

        if(approvalUrl){
            window.location.href = approvalUrl;
        }else{
            toast.error("No se pudo iniciar el pago")
            return;
        }
    } catch (error) {
        console.error(error)
        toast.error("No se pudo iniciar el pago")

    }
  };

  return (
    <button
      onClick={handlePay}
      id="paypal-button"
      className="btn btn-light border d-flex align-items-center gap-2 px-3 py-2 m-3"
    >
      <img
        src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
        alt="PayPal"
        width="24"
        height="24"
      />
      Pagar con PayPal
    </button>
  );
};

export default PayPalBtn;
