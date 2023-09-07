// @ts-nocheck
import { uploadFile, downloadFile } from "gdgateway-client/lib/es5";
import * as fs from "fs";
import authRequest from "./auth-request.js";
const axios = require("axios");

const updateProgressCallback = (
  id: string,
  progress: string | number,
  timeLeft: string | number,
  dispatch: any
) => {
  console.log("updateProgressCallback");
};
const encodeFileData = {
  callbacks: {
    onProgress: updateProgressCallback,
  },
  handlers: ["onProgress"],
};

const { handlers, callbacks } = encodeFileData;

const callback = ({ type, params }) => {
  if (handlers.includes(type)) {
    callbacks[type]({ ...params });
  } else {
    console.error(`Handler "${type}" isn't provided`);
  }
};

const getOneTimeToken = ({ filesize = "", filename = "" }) => {
  const url = `https://api.dev.ghostdrive.com/api/user/generate/token`;
  return authRequest.post(url, { filesize, filename });
};
const getDownloadOTT = (body) => {
  const url = `https://api.dev.ghostdrive.com/api/download/generate/token`;
  return authRequest.post(url, body);
};

class CustomFile {
  constructor(size, stream, filename, mimeType, fileFolderId) {
    this.stream = () => stream;
    this.isStream = true;
    this.name = filename;
    this.type = mimeType;
    this.folderId = fileFolderId;
    this.size = size;
    this.upload_id = `${filename}_${size}_${fileFolderId}`;
  }
}
// UPLOAD FILE
const upload = async () => {
  const filePath = "./src/file-from-node.png";
  const filename = "file-from-node.png";
  const mimeType = "image/png";
  const folderId = "";

  const fileStream = fs.createReadStream(filePath);
  const { size } = await fs.promises.stat(filePath);

  const customFile = new CustomFile(
    size,
    fileStream,
    filename,
    mimeType,
    folderId
  );

  const {
    data: {
      user_token: { token: oneTimeToken },
      endpoint,
    },
  } = await getOneTimeToken({
    filename: customFile.name,
    filesize: customFile.size,
  });

  const { data } = await uploadFile({
    file: customFile,
    oneTimeToken,
    endpoint,
    callback,
    handlers,
  });

  console.log("___________________________SUCCESSFULLY UPLOADED", data);
  return data;
};

// DOWNLOAD FILE
const download = async () => {
  const { data } = await upload();

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

download();
