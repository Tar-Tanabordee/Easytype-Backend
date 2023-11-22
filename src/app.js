require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const authRoute = require("../src/routes/auth-route");
const productRoute = require("../src/routes/product-route");
const shoppingCartRoute = require("../src/routes/shoppingcart-route");
const addressRoute = require("../src/routes/address-route");
const orderRoute = require("../src/routes/order-route");
const paymentRoute = require("../src/routes/payment-route");

const notFoundMiddleware = require("../src/middlewares/not-found");
const errorMiddleware = require("../src/middlewares/error");

app.use(express.json());
app.use(cors());

app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/shoppingCart", shoppingCartRoute);
app.use("/address", addressRoute);
app.use("/order", orderRoute);
app.use("/payment", paymentRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || "8000";
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
