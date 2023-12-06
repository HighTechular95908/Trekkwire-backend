const fs = require("fs");

module.exports = {

    async importSingle(req, res) {

        try {

            if (req.file == undefined) {
                return res.status(400).send({ message: "Please upload a file!" });
            }

            return res.status(201).send({
                image: req.file,
                message: 'Image uploaded successfully'
            });

        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error! Try again, please!' })
        }
    },

    async importArray(req, res) {

        try {

            if (req.files.length < 1) {
                return res.status(400).send({ message: "Please upload files!" });
            }

            return res.status(201).send({
                images: req.files,
                message: 'Images uploaded successfully'
            });

        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error! Try again, please!' })
        }
    },

    async importMultiple(req, res) {

        try {

            return res.status(201).send({
                images: req.files,
                message: 'Images uploaded successfully'
            });

        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error! Try again, please!' })
        }
    },

    async deleteFile(req, res) {

        try {

            const { filename } = req.body;

            if (filename == undefined) {
                return res.status(400).send({ message: "Please type a filename!" });
            }


            if (!fs.existsSync(`images/${filename}`)) {
                return res.status(400).send({ message: `the filename ${filename} does not exists!` });
            }

            fs.unlink(`images/${filename}`,function(err){
                if (err) {
                return res.status(400).send({ message: `Could not delete the file!` });
                    
                }
           });

            return res.status(200).send({
                message: 'Image deleted successfully'
            });

        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error! Try again, please!' })
        }
    }
}