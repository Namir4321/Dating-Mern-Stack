const Razorpay = require("razorpay");
const instance=new Razorpay({
    key_id:process.env.RAZORPAY_ID,
    key_secret:process.env.RAZORPAY_SECRET_KEY,
})

module.exports=instance;