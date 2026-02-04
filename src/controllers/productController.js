import Product from '../models/ProductModal.js'

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      })
    }

    const product = await Product.create({
      name,
      price,
      quantity
    })

    return res.status(201).json({
      success: true,
      message: 'Product created',
      product
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    return res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    })
  }
}

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated',
      product
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data'
    })
  }
}

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    await product.deleteOne()

    return res.status(200).json({
      success: true,
      message: 'Product deleted'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    })
  }
}
