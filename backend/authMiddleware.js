import jwt from 'jsonwebtoken';
const  authMiddleware = function(req , res){
    try {
        const token = req.cookies?.token;
        if(!token){
            return res.status(404).json({message: "User not logged in"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
export default authMiddleware;