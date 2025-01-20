module.exports = {
    errorHandler: (err, req, res, next) => {
        console.error(err);
        res.status(err.status || 500).json({
            error: true,
            message: err.message || "Server error",
        })
    }
}