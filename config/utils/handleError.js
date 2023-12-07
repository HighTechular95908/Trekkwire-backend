module.exports = (err, res) => {
    console.log(err);
    return res.status(500).send({
        code:"500",
        error:"Internal Server Error"
    });
}