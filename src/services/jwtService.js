import jwt from 'jsonwebtoken'
require('dotenv').config()
// GENERATE ACCESS TOKEN WHEN LOG IN
export const generalAccessToken = (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, {expiresIn: '10s'})
    return access_token
}
// GENERATE REFRESH TOKEN WHEN LOG IN
export const generalRefreshToken = (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, {expiresIn: '1d'})
    return refresh_token;
}
// REFRESH TOKEN
const refreshTokenJWT = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            jwt.verify(JSON.parse(token), process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    resolve({
                        status: 'ERR',
                        message: 'The authentication refresh'
                    })
                }
                const access_token = await jwt.sign({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                }, process.env.ACCESS_TOKEN, {expiresIn: '30s'})
                resolve({
                    status: 'OK',
                    message: 'REFRESH TOKEN SUCCESS',
                    access_token: access_token
                })
            })
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    generalAccessToken,
    generalRefreshToken,
    refreshTokenJWT
}