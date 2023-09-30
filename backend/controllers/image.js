// backend\controllers\image.js
const Image = require('../models/Image');

exports.saveImage = async (req, res) => {
    try {
        const image = new Image({ ...req.body, user: req.user._id });
        await image.save();
        res.status(201).send(image);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.listImages = async (req, res) => {
    try {
        const images = await Image.find({ user: req.user._id });
        res.send(images);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.editImage = async (req, res) => {
    try {
        const image = await Image.findOne({ _id: req.params.imageId, user: req.user._id });
        if (!image) {
            return res.status(404).send();
        }
        const updates = Object.keys(req.body);
        updates.forEach((update) => image[update] = req.body[update]);
        await image.save();
        res.send(image);
    } catch (error) {
        res.status(400).send(error);
    }
};
