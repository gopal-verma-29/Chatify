import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "10d",
    }); 

 res.cookie("jwt", token, {
    maxAge: 10 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    httpOnly: true, // prevents XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF protection
    secure: process.env.NODE_ENV === "development" ? false : true ,// set to true in production
 });
 return token;
};
export default generateToken;