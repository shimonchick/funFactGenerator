const Product = require('../models/Product');
const productModel = new Product();

module.exports.create = function (req, res) {
    const {sellerId, name, price, description} = req.body;
    if (sellerId == null || name == null || price == null || description == null) {
        res.status(400).send(`Provide sellerId, name, price and description for the product`);
    }
    productModel.create({ sellerId: sellerId, name: name, price: price, description: description})
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
        .then(() => {
            res.status(200).send("OK");
        });

};
module.exports.read = function (req, res) {
    //Priority of properties most to least: id, name, description, price
    let productPromise;
    if(req.query.id != null){
        productPromise = productModel.get({id: req.query.id});
    }
    else if(req.query.name != null){
        productPromise = productModel.get({name: req.query.name});
    }
    else if(req.query.description != null){
        productPromise = productModel.get({description: req.query.description});
    }
    else if(req.query.price != null){
        productPromise = productModel.get({price: req.query.price});
    }
    else{
        res.status(400).send("No product query properties specified");
    }
    productPromise
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
        .then((product) => {
            res.status(200).send(product);
        });
};

module.exports.update = function (req, res) {
    const {id, description, name, price} = req.body;
    if (id == null || name == null || price == null || description == null) {
        res.status(400).send("Provide id, name, price and description for the product");
    }
    productModel.update({id: id, description: description, name: name, price: price})
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
        .then(() => {
            res.status(200).send("OK");
        });

};

module.exports.delete = function (req, res) {
    const id = req.body.id;
    if (id == null) {
        res.status(400).send("Provide id of the product to be deleted");
    }
    productModel.delete(id)
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
        .then(() => {
            res.status(200).send("OK");
        });

};
