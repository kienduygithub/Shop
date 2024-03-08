import db from "../models"
import bcrypt, {genSaltSync, hashSync} from 'bcryptjs'
import {generalAccessToken, generalRefreshToken} from "./jwtService"
import {sendEmailResetPassword} from './emailServices'
const salt = bcrypt.genSaltSync(10)
import crypto from 'crypto'
import {Op} from "sequelize"
// CREATE
const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {email, password, confirmPassword} = newUser
            let checkUser = await db.User.findOne({
                where: {email: email},
                raw: true
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already'
                })
            } else {
                let hashedPassword = await hashPassword(password)
                const createdUser = await db.User.create({
                    email: email,
                    password: hashedPassword,
                })
                if (createUser) {
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: createdUser
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const hashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newPassword = bcrypt.hashSync(password, salt)
            resolve(newPassword)
        } catch (error) {
            reject(error)
        }
    })
}
// LOGIN USER
const loginUser = (userCheck) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {email, password} = userCheck;
            let user = await db.User.findOne({
                where: {email: email},
                raw: true,
                logger: false
            })
            if (user) {
                const comparePassword = await bcrypt.compareSync(password, user.password);
                if (!comparePassword) {
                    resolve({
                        status: 'ERR',
                        message: 'Wrong password!',
                        err_fields: 'password'
                    })
                } else {
                    const access_token = await generalAccessToken({
                        id: user.id,
                        isAdmin: user.isAdmin === 0 ? false : true
                    })
                    const refresh_token = await generalRefreshToken({
                        id: user.id,
                        isAdmin: user.isAdmin === 0 ? false : true
                    })
                    resolve({
                        status: 'OK',
                        message: 'LOGIN SUCCESS',
                        data: user,
                        access_token: access_token,
                        refresh_token: refresh_token
                    })
                }
            } else {
                resolve({
                    status: 'ERR',
                    message: 'The email is not exist!!',
                    err_fields: 'email'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
// UPDATE USER
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: id},
            })
            let response = {}
            if (user) {
                if (data?.name) {
                    user.name = data.name;
                }
                if (data?.email) {
                    user.email = data.email;
                }
                if (data?.phone) {
                    user.phone = data.phone;
                }
                if (data?.address) {
                    user.address = data.address;
                }
                if (data?.avatar) {
                    user.avatar = data.avatar;
                }
                if (data?.city) {
                    user.city = data.city
                }
                await user.save();

                response = {
                    status: 'OK',
                    message: 'Update success',
                    updatedUser: user
                }
            } else {
                response = {
                    status: 'OK',
                    message: 'The user is not defined'
                }
            }
            resolve(response)

        } catch (error) {
            reject(error)
        }
    })
}
// DELETE USER
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: id}
            })
            let response = {}
            if (!user) {
                response = {
                    status: 'OK',
                    message: 'The user is not defined'
                }
            } else {
                await user.destroy();
                let userList = await db.User.findAll({
                    raw: true
                });
                response = {
                    status: 'OK',
                    message: 'Delete success',
                    data: userList
                }
            }
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
// READ USER
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let userList = await db.User.findAll({
                raw: true,
            })
            if (userList && userList.length > 0) {
                resolve({
                    status: 'OK',
                    message: 'All Users here!',
                    data: userList
                })
            } else {
                resolve({
                    status: 'ERR',
                    message: 'Not Found'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
// READ DETAIL USER
const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                raw: true,
                where: {id: id},

            })
            if (!user) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            } else {
                resolve({
                    status: 'OK',
                    message: 'Get Info success',
                    data: user
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

// DELETE MANY
const deleteMany = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.destroy({
                where: {id: ids}
            })
            let userList = await db.User.findAll({
                raw: true
            });
            resolve({
                status: 'OK',
                message: 'DELETE SUCCESS',
                data: userList
            })
        } catch (error) {
            reject(error)
        }
    })
}
// CHANGE PASSWORD
const changePassword = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: id}
            })
            if (!user) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            let curPasswordHashed = user.password
            let {password, newPassword} = data;
            let isPasswordCorrect = await bcrypt.compareSync(password, curPasswordHashed);
            if (!isPasswordCorrect) {
                resolve({
                    status: 'ERR',
                    message: 'The password is incorrect'
                })
            } else {
                let newPasswordHashed = bcrypt.hashSync(newPassword, salt);
                user.password = newPasswordHashed;
                await user.save();
                let dataUser = await db.User.findOne({
                    where: {password: newPasswordHashed}
                })
                resolve({
                    status: 'OK',
                    message: 'CHANGE PASSWORD SUCCESS',
                    data: dataUser
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
// FORGOT PASSWORD
const forgotPassword = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: email}
            })
            if (!user) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const {resetToken, passwordResetToken, passwordResetExpires} = await createPasswordChangedToken();
            user.passwordResetToken = passwordResetToken;
            user.passwordResetExpires = passwordResetExpires;
            await user.save();
            // const html = `Xin quý khách vui lòng nhấn vào đường link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 5p <a href=${process.env.URL_CLIENT}/reset-password/${resetToken}>Nhấn vào đây</a>`
            const html = `Xin quý khách vui lòng ghi nhớ OTP dưới đây. Mã OTP sẽ hết hạn trong vòng 5 phút kể từ lúc nhận: <div><b>${passwordResetToken}</b></div>`
            sendEmailResetPassword({email, html});
            resolve({
                status: 'OK',
                message: 'FORGOT PASSWORD',
                data: {resetToken, passwordResetToken, passwordResetExpires},
            })
        } catch (error) {
            reject(error)
        }
    })
}
const createPasswordChangedToken = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const resetToken = `${Math.floor(1000 + Math.random() * 9000)}`
            const passwordResetToken = resetToken;
            const passwordResetExpires = Date.now() + 5 * 60 * 60;
            resolve({
                resetToken,
                passwordResetToken,
                passwordResetExpires
            })
        } catch (error) {
            reject(error)
        }
    })
}
// RESET PASSWORD
const verifyOTP = (otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    passwordResetToken: otp,
                    passwordResetExpires: {
                        [Op.gte]: Date.now()
                    }
                }
            })
            if (!user) {
                resolve({
                    status: 'ERR',
                    message: 'INVALID OTP'
                })
            }
            resolve({
                status: 'OK',
                message: 'VALID OTP'
            })
        } catch (error) {
            reject(error);
        }
    })
}
const resetPassword = (password, otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    passwordResetToken: otp
                }
            })
            if (!user) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const passwordHash = await hashPassword(password);
            user.password = passwordHash;
            user.passwordChangedAt = Date.now();
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            resolve({
                status: 'OK',
                message: 'RESET PASSWORD SUCCESS',
            })
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    deleteMany,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyOTP
}