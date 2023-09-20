var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


var usersRouter = require('./routes/users_routes');
var productsRouter = require('./routes/products_router');
var categoriesRouter = require('./routes/categories_router');
var ordersRouter = require('./routes/orders_router');
var cartRouter = require('./routes/cart_router');
var emailRoute = require('./routes/email_router');
var stripeRouter = require('./routes/stripe');
var contactUs = require('./routes/contactUs_router');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    cors({
        credentials:true,
        origin:'*',
        optionsSuccessStatus:200
    })
)

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/carts', cartRouter);
app.use('/emails', emailRoute);
app.use('/stripe', stripeRouter);
app.use('/contactUs', contactUs);

module.exports = app;
