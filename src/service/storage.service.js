const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadImage(base64ImageFile) {
    const response = await imagekit.upload({
        file: base64ImageFile,
        fileName: "test.jpg",
    });
    return response.url;
} 
