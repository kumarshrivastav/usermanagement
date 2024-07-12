import ErrorHandler from "../config/error.handler.js"
import TokenService from "../config/TokenService.js"
function verifyToken(req,res,next){
    try {
        const {accessToken}=req.cookies
        if(!accessToken){
            return next(ErrorHandler(401,'Unauthorized'))
        }
        const {user}=TokenService.verifyAccessToken(accessToken)
        // console.log(user)
        if(!user){
            return next(ErrorHandler(401,'Unauthorized'))
        }
        req.userId=user._id
        if(!user.isAdmin){
            req.isAdmin=false
        }
        req.isAdmin=true
        next()
    } catch (error) {
        next(error)
    }
}

export default verifyToken;