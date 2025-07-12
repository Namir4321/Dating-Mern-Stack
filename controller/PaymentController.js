const razorpayInstance = require("../utils/razorpay");
const { memberShipAmount } = require("../utils/MemberShipTypeAmount");
const Payment = require("../model/Payment");
exports.createPayment = async (req, res, next) => {
  const { memberShipType } = req.body;
  const { firstName, lastName, email } = req.user;
  console.log(memberShipAmount[memberShipType] * 100);

  try {
    const order = await razorpayInstance.orders.create({
      amount: memberShipAmount[memberShipType] * 100,
      currency: "INR",
      receipt: "recepit#1",
      notes: {
        firstName,
        lastName,
        email,
        membershipType: memberShipType,
      },
    });
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_ID });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.createWebHooks = async (req, res, next) => {
  try {
    console.log("Webhook Called");
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      console.log("INvalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    console.log("User saved");

    await user.save();
    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.verifyPayment = async (req, res, next) => {
  const user = req.user.toJSON();
  console.log(user);
  if (user.isPremium) {
    return res.json({ ...user });
  }
  return res.json({ ...user });
};
