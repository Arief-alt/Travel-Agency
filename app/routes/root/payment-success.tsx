import { useEffect } from "react";
import { Link, type LoaderFunctionArgs } from "react-router"
import confetti from 'canvas-confetti';
import {LEFT_CONFETTI, RIGHT_CONFETTI} from "~/constants";
import type {Route} from "../../../.react-router/types/app/routes/root/+types/payment-success";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

export async function loader({params}: LoaderFunctionArgs) {
    return params
}

const PaymentSuccess = ({loaderData}: Route.ComponentProps) => {
    useEffect(() => {
        confetti(LEFT_CONFETTI)
        confetti(RIGHT_CONFETTI)
    }, []);

    return (
        <main className="payment-success wrapper">
            <section>
                <article>
                    <img
                        src="/assets/icons/check.svg"
                        alt="check"
                        className="size-24"
                    />

                    <h1>Thank $ Welcome Aboard!</h1>
                </article>

                <p>
                    Your trip is booked - can't wait to have you on this adventure. Get ready to explore & make memories! ✨
                </p>

                <Link
                    to={`/travel/${loaderData?.tripId}`}
                    className="w-full"
                >
                    <ButtonComponent className="button-class !h-11 !w-full">
                        <img
                            src="/assets/icons/itinerary-button.svg"
                            alt="itinerary"
                            className="size-5"
                        />

                        <span className="p-16-semibold text-white">
                            View trip details
                        </span>
                    </ButtonComponent>
                </Link>

                <Link
                    to="/"
                    className="w-full"
                >
                    <img
                        src="/assets/icons/arrow-left.svg"
                        alt="arrow"
                        className="size-5"
                    />

                    <span className="p-16-semibold text-dark-100">Return to homepage</span>
                </Link>
            </section>
        </main>
    )
}
export default PaymentSuccess

