import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    // Create JWT token
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    //payload: An object literal, buffer or string representing the payload to sign.
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return token;
}