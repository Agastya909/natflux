import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const destination = "/home/agastya/Entertainment";
    callback(null, destination);
  },
  filename(req, file, callback) {
    const extension = file.mimetype.split("/").splice(-1)[0];
    callback(null, req.body.title + "." + extension);
  }
});

const upload = multer({ storage: storage });

export default upload;
