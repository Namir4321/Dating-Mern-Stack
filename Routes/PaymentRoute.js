const express=require("express");
const router=express.Router();
const { userAuth } = require("../middleware/auth");
const paymentController=require("../controller/PaymentController");
router.post("/create",userAuth, paymentController.createPayment);
router.post("/webhooks",paymentController.createWebHooks);
router.post("/verify",paymentController.verifyPayment);
module.exports=router;