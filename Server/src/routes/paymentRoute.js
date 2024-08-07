import express from "express";
import { authorize, isStudent } from "../middleware/authorization.js";
import { capturePayment, verifySignature } from "../controllers/payment.js";

const paymentRouter = express.Router();

paymentRouter.post("/capturePayment", authorize, isStudent, capturePayment);
paymentRouter.post("/verifyPayment",authorize, isStudent, verifySignature);

export default paymentRouter;