var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    router = express.Router(),
    jimp = require('jimp');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(router);

app.listen(3000, function () {
    console.log("Node server running on http://localhost:3000");
});

const Response = require('./src/Http/Response');
const response = new Response();

app.get('/', function (req, res) {
    res.send(response.success(200, {userId: 123}));
});

// https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png

var fileName = 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png';
var defaultOutputImagesFolder = 'tmp';
var destinationFileName = defaultOutputImagesFolder + '/' + 'testing.png';
var imageCaption = 'Text example :D';
var loadedImage;

app.route('/generate')
    .get(function (req, res) {
        jimp.read(fileName)
            .then(function (image) {
                loadedImage = image;
                return jimp.loadFont(jimp.FONT_SANS_64_BLACK);
            })
            .then(function (font) {
                var textWidth = jimp.measureText(font, imageCaption);
                var textHeight = jimp.measureTextHeight(font, imageCaption, textWidth);
                loadedImage
                    .print(font,
                        (loadedImage.bitmap.width/2) - (textWidth/2),
                        loadedImage.bitmap.height/2,
                        {
                            text: imageCaption,
                            alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
                            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
                        },
                        150,
                        150,
                        (err, loadedImage, {x, y}) => {
                            loadedImage.print(font, x, y + 20, 'More text on another line', 50);
                        })
                    .normalize()
                    .write(destinationFileName);
                res.send(response.success(200, "Created on: " + destinationFileName));
            })
            .catch(function (err) {
                console.error(err);
                res.send(response.fail(500, err));
            });
    });