const Product = require('../models/Product');
const productModel = new Product();

module.exports.create = function (req, res) {
    const {name, price, description} = req.body;

    if (name == null || price == null || description == null) {
        res.status(400).send(`Provide name, price and description for the product`);
        return;
    }
    productModel.create(req.user.id, name, price, description)
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
        .then((productId) => {
            // console.log("productId: " + JSON.stringify(productId));
            res.setHeader('Location', `/product?id=${productId}`);
            res.status(201).send("OK");
        });

};
module.exports.readAll = function (req, res) {
    const {name, description, price, limit, page} = req.query;
    productModel.getAll({name: name, description: description, price: price, page: page, limit: limit})
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
        .then((product) => {
            res.status(200).send(product);
        });
};
module.exports.read = function (req, res) {
    if (req.query.id != null) {
        productModel.get(req.query.id)
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
            .then((product) => {
                res.status(200).send(product);
            });
    } else {
        res.status(404).send("Could not find a product with this id");
    }
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
