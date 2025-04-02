// create a token and save that in cookies
const sendToken = (artist: any, statusCode : any, res : any) => {
    const token = artist.getJwtToken();

    //the option for cookies
    const option = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };

    res.status(statusCode).cookie("token", token, option).json({
        success: true,
        artist,
        token
    });
};

export default sendToken