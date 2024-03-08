import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import inlineBase64 from 'nodemailer-plugin-inline-base64'
dotenv.config()
const sendEmailCreateOrder = async (email, orderItems) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other posts
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD
        },
        tls: { rejectUnauthorized: false }
    });
    transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));
    let listItem = '';
    const attachImage = [];
    //<div><img style="width: 60px, height: 60px" src=${order.image} alt="Sản phẩm"/></div>
    orderItems.forEach((order) => {
        listItem += `
            <div>
                <div>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> với giá là: <b>${order.price} VND</b></div>
            </div>
        `
        attachImage.push({ path: order.image })
    })
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT, // sender address
        to: 'buikienduy2020@gmail.com', // list of receivers
        subject: "Bạn đã đặt hàng tại cửa hàng ShopMobile", // Subject line
        text: "Hello world?", // plain text body
        html: `<div><div><b>Bạn đã đặt hàng thành công tại ShopMobile</b></div></div>${listItem}<div>Đây là danh sách hình ảnh</div>`, // html body
        attachments: attachImage
    });

}
const sendEmailResetPassword = async ({ email, html }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: { rejectUnauthorized: false }
    });
    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT, // sender address
        to: 'buikienduy2020@gmail.com', // list of receivers
        subject: "Reset password", // Subject line
        html: html
    });
}
module.exports = {
    sendEmailCreateOrder: sendEmailCreateOrder,
    sendEmailResetPassword: sendEmailResetPassword
}