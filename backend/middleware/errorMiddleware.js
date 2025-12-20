const errorHandler = function(err , req , res , next){
    console.error("❌ SERVER ERROR:", err);
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}
export default errorHandler;