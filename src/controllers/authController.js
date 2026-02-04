import bcrypt from 'bcrypt'
import crypto from 'crypto'
import User from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import sendEmail from '../utils/sendEmail.js'
import resetPasswordTemplate from '../utils/resetPasswordTemplate.js'

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // 1. Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // 2. Check duplicate email
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            })
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // 4. Store user in MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            })
        }

        // 2. Verify email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // 3. Verify password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // 4. Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        )

        // 5. Return token & user details
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000
    await user.save()

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    await sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      html: resetPasswordTemplate(user.name, resetLink)
    })

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    })
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: 'Email could not be sent'
    })
  }
}


export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            })
        }

        // 1. Hash incoming token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        // 2. Find valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            })
        }

        // 3. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // 4. Update password & clear reset fields
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Password reset successful'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
}