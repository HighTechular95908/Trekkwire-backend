module.exports = (err, res) => {
    console.error("Internal Server Error")
    return res.status(500).send({
        code:"500",
        error:"Internal Server Error"
    });
}