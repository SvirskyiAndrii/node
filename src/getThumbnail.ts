import * as fs from "fs";
import * as sharp from "sharp";

export const getThumbnailImage = ({ path }: { path: string }) => {
  return new Promise((resolve, reject) => {
    const inputStream = fs.createReadStream(path);

    inputStream
      .pipe(sharp().resize(240, 240).jpeg({ quality: 10 }))
      .toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          const base64Thumbnail = `data:image/jpeg;base64,${buffer.toString(
            "base64"
          )}`;
          resolve(base64Thumbnail);
        }
      });
  });
};
