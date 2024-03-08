import userService from '../services/userServices'
import jwtService from '../services/jwtService'
import jwt from 'jsonwebtoken';
require('dotenv').config();
// SIGN UP
const createUser = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,3}$/;
    // /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const isCheckEmail = reg.test(email);
    if (!email || !password || !confirmPassword) {
        return res.status(200).json({
            status: 'ERR',
            message: 'The inputs is required'
        })
    } else if (!isCheckEmail) {
        return res.status(200).json({
            status: 'ERR',
            message: 'The input is email'
        })
    } else if (password !== confirmPassword) {
        return res.status(200).json({
            status: 'ERR',
            message: 'The password is equal confirmPassword'
        })
    }
    let response = await userService.createUser(req.body);
    return res.status(200).json({
        response
    })
}

// SIGN IN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,3}$/;
        const isCheckEmail = reg.test(email)
        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: `The input is required ${ email }`
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        const response = await userService.loginUser(req.body);
        const { refresh_token, ...newResponse } = response;
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })
        return res.status(200).json(
            response
        )

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// UPDATE
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if (!userId) {
            return res.status(200).json({
                status: 'OK',
                message: 'The userId is required'
            })
        }
        const response = await userService.updateUser(userId, data)
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'OK',
                message: 'The userId is required'
            })
        }
        const response = await userService.deleteUser(userId)
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// READ
const getAllUser = async (req, res) => {
    try {
        const response = await userService.getAllUser();
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// READ DETAIL
const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'OK',
                message: 'The user is not defined'
            })
        }
        const response = await userService.getDetailUser(userId);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// REFRESH TOKEN
const refreshToken = async (req, res) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return res.status(403).json({
                status: 'ERR',
                message: 'Unauthorization token!'
            })
        }
        jwt.verify(refresh_token, process.env.REFRESH_TOKEN, (err, user) => {
            if (err) {
                return res.status(401).json({
                    status: 'ERR',
                    message: 'The token expired!'
                })
            }
            const payload = {
                id: user.id,
                isAdmin: user.isAdmin
            }
            const access_token = jwtService.generalAccessToken(payload);
            return res.status(200).json({
                status: 'OK',
                message: 'REFRESH TOKEN',
                access_token: access_token
            })
        })
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// LOGOUT
const logoutUser = (req, res) => {
    try {
        // console.log('refresh_token', res)
        res.clearCookie('refresh_token');
        return res.status(200).json({
            status: 'OK',
            message: 'LOG OUT SUCCESS'
        })
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// DELETE MANY
const deleteMany = async (req, res) => {
    try {
        const ids = req.body;
        if (!ids) {
            return res.status(200).json({
                status: 'OK',
                message: 'The ids is required'
            })
        }
        const response = await userService.deleteMany(ids)
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// CHANGE PASSWORD
const changePassword = async (req, res) => {
    try {
        let userId = req.params.id;
        let data = req.body;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await userService.changePassword(userId, data);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        let { email } = req.body;
        if (!email) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The email is required'
            })
        }
        const response = await userService.forgotPassword(email);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
// RESET PASSWORD
const verifyOTP = async (req, res) => {
    try {
        const otp = req.body.otp;
        if (!otp) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The OTP is required'
            })
        }
        const response = await userService.verifyOTP(otp);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
const resetPassword = async (req, res) => {
    try {
        const { password, otp } = req.query;
        if (!password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The inputs is required'
            })
        }
        const response = await userService.resetPassword(password, otp);
        return res.status(200).json(
            response
        )
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refreshToken,
    logoutUser,
    deleteMany,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyOTP
}
