// @ts-nocheck
import * as forge from "node-forge";
import * as fs from "fs";
import axios from "axios";
import { Crypto } from "@peculiar/webcrypto";

import {
  uploadFile,
  downloadFile,
  WebCrypto,
  LocalFileStream,
  getThumbnailImage,
  getThumbnailVideo,
} from "separate-library/lib/es5";

import {
  convertArrayBufferToBase64,
  getDownloadOTT,
  getKeysByWorkspace,
  getOneTimeToken,
  saveEncryptedFileKeys,
  callback,
  handlers,
} from "./functions";

const crypter = new WebCrypto();

// UPLOAD FILE
const upload = async ({ encrypt }) => {
  // const filename = "./src/river-5.jpg"; // (6 chunks) -image
  // const mimeType = "image/jpeg";

  const filename = "./src/video.mp4"; // (30 chunks) - video
  const mimeType = "video/mp4";

  const folderId = "";

  const { size } = await fs.promises.stat(filename);

  const file = new LocalFileStream(size, filename, mimeType, folderId);

  const {
    data: {
      user_token: { token: oneTimeToken },
      endpoint,
    },
  } = await getOneTimeToken({
    filename: file.name,
    filesize: file.size,
  });

  let result;

  if (!encrypt) {
    result = await uploadFile({
      file,
      oneTimeToken,
      endpoint,
      callback,
      handlers,
    });
  } else {
    const crypto = new Crypto();
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const {
      data: { keys },
    } = await getKeysByWorkspace();

    result = await crypter.encodeFile({
      file,
      oneTimeToken,
      endpoint,
      callback,
      handlers,
      key,
      crypto,
    });

    if (result) {
      const slug = result?.data?.data?.slug;

      if (file.type.startsWith("image")) {
        await getThumbnailImage({
          file,
          path: filename,
          quality: 3,
          getOneTimeToken,
          slug,
        });
      } else if (file.type.startsWith("video")) {
        const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
        const ffmpeg = require("fluent-ffmpeg");

        ffmpeg.setFfmpegPath(ffmpegPath);

        const currentPath = process.cwd();
        const ffmpegCommand = ffmpeg(`${currentPath}/${filename}`);

        await getThumbnailVideo({
          file,
          path: filename,
          ffmpegCommand,
          quality: 3,
          getOneTimeToken,
          slug,
        });
      }
      const bufferKey = await crypto.subtle.exportKey("raw", key);
      const base64Key = convertArrayBufferToBase64(bufferKey);

      let encryptedKeys = [];

      for (let i = 0; i < keys.length; i++) {
        const publicKey = forge.pki.publicKeyFromPem(keys[i]);
        const encryptedKey = await publicKey.encrypt(base64Key);
        const encryptedHexKey = forge.util.bytesToHex(encryptedKey);
        encryptedKeys = [
          ...encryptedKeys,
          { publicKey: keys[i], encryptedFileKey: encryptedHexKey },
        ];
      }

      saveEncryptedFileKeys({
        slug,
        encryptedKeys: encryptedKeys,
      });
    }
  }

  console.log("SUCCESSFULLY UPLOADED ----------------->>>", result?.data?.data);

  return result;
};

upload({ encrypt: true }); // CHANGE 'encrypt' TO true IF NEED ENCRYPTION

// DOWNLOAD FILE
const download = async () => {
  const data = upload({ encrypt: true });
  const { CancelToken } = axios;
  const signal = CancelToken.source();
  const {
    data: {
      user_tokens: { token: oneTimeToken },
      endpoint,
    },
  } = await getDownloadOTT([{ slug: data.slug }]);
  const stream = await downloadFile({
    file: data,
    oneTimeToken,
    signal,
    endpoint,
    isEncrypted: false,
  });
  console.log("___________________________SUCCESSFULLY DOWNLOADED", stream);
};

// download();
