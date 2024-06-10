import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { verifyPayment } from "../../utils/api_payment";

export default function PaymentVerify() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  // extract query string from the url
  const billplz_id = searchParams.get("billplz[id]");
  const billplz_paid = searchParams.get("billplz[paid]");
  const billplz_paid_at = searchParams.get("billplz[paid_at]");
  const billplz_x_signature = searchParams.get("billplz[x_signature]");

  //   console.log(billplz_id);
  //   console.log(billplz_paid);
  //   console.log(billplz_paid_at);
  //   console.log(billplz_x_signature);

  useEffect(() => {
    // trigger the payment verification mutation when page load
    verifyPaymentMutation.mutate({
      billplz_id: billplz_id,
      billplz_paid: billplz_paid,
      billplz_paid_at: billplz_paid_at,
      billplz_x_signature: billplz_x_signature,
    });
  }, []);

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (updatedOrder) => {
      // check if the order is paid or not
      // if it's paid, show the payment success message
      if (updatedOrder.status === "paid") {
        enqueueSnackbar("Payment is succeful", {
          variant: "success",
        });
      }
      // if it's failed, show the payment failure message
      if (updatedOrder.status === "failed") {
        enqueueSnackbar("Payment failed", {
          variant: "error",
        });
      }
      // redirect the user to /orders page
      navigate("/profile/" + currentUser._id);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  return <>Verifying your payment...</>;
}
