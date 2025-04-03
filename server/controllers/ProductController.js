const Product = require("../models/product");

// Create a Product
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
};

//Update Product
const updateProduct = async (req, res) => {
    try {
        const { serialNumber } = req.query;
        const updatedProduct = await Product.findOneAndUpdate({ serialNumber }, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// Get Single Product
const getProductById = async (req, res) => {
    try {
        const { serialNumber } = req.params;
        const product = await Product.findOne({ serialNumber });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};

const updateProductStatus = async (req, res) => {
    try {
        const { serialNumber } = req.params;
        const { status } = req.body; // Ensure status is destructured from request body

        const updatedProduct = await Product.findOneAndUpdate(
            { serialNumber },
            { status },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product status", error });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findOneAndDelete({ serialNumber: id });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};

module.exports = { createProduct, getProducts, getProductById, deleteProduct, updateProductStatus, updateProduct };
