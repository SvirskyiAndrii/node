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

import { getThumbnailImage } from "./getThumbnail";

const crypter = new WebCrypto();

// UPLOAD FILE
const upload = async ({ encrypt }) => {
  const filename = "./src/river-5.jpg"; // > 1 mb (6 chunks)
  const mimeType = "image/jpeg";

  // const filename = "./src/file-from-node.png"; // < 1 mb
  // const mimeType = "image/png";

  const folderId = "";

  const { size } = await fs.promises.stat(filename);

  const customFile = new LocalFileStream(size, filename, mimeType, folderId);

  const {
    data: {
      user_token: { token: oneTimeToken },
      endpoint,
    },
  } = await getOneTimeToken({
    filename: customFile.name,
    filesize: customFile.size,
  });
  let result;
  if (!encrypt) {
    result = await uploadFile({
      file: customFile,
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

    const base64Image = await getThumbnailImage({ path: filename });

    console.log("THIS IS THUMBNAIL ----------------->>>", base64Image);

    result = await crypter.encodeFile({
      file: customFile,
      oneTimeToken,
      endpoint,
      callback,
      handlers,
      key,
    });

    if (result) {
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
        slug: result?.data?.data?.slug,
        encryptedKeys: encryptedKeys,
      });

      const {
        data: {
          user_token: { token: thumbToken },
          endpoint: thumbEndpoint,
        },
      } = await getOneTimeToken({
        filename: customFile.name,
        filesize: customFile.size,
      });

      const instance = axios.create({
        headers: {
          "x-file-name": customFile.name,
          "Content-Type": "application/octet-stream",
          "one-time-token": thumbToken,
        },
      });

      if (base64Image) {
        await instance.post(
          `${thumbEndpoint}/chunked/thumb/${result?.data?.data?.slug}`,
          base64Image
        );
      }
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
