// @ts-nocheck
import * as Base64 from "base64-js";

import authRequest from "../auth-request.js";

export const getKeysByWorkspace = (): AxiosResponse<{
  keys: Array<string>;
  usersMissedCount: number;
}> => {
  // @ts-ignore
  return authRequest.get(
    `https://api.dev.ghostdrive.com/api/keys/get_workspace`
  );
};

export const convertArrayBufferToBase64 = (buffer: any) => {
  const bytes = new Uint8Array(buffer);
  const base64 = Base64.fromByteArray(bytes);
  return base64;
};

export const saveEncryptedFileKeys = async (
  body: any
): Promise<{ data: string }> => {
  // @ts-ignore
  return authRequest.post(
    `https://api.dev.ghostdrive.com/api/keys/save_encrypted_file_keys`,
    body
  );
};

export const updateProgressCallback = (
  id: string,
  progress: string | number,
  timeLeft: string | number,
  dispatch: any
) => {
  console.log("updateProgressCallback");
};

export const encodeFileData = {
  callbacks: {
    onProgress: updateProgressCallback,
  },
  handlers: ["onProgress"],
};

export const { handlers, callbacks } = encodeFileData;

export const callback = ({ type, params }) => {
  if (handlers.includes(type)) {
    callbacks[type]({ ...params });
  } else {
    console.error(`Handler "${type}" isn't provided`);
  }
};

export const getOneTimeToken = ({ filesize = "", filename = "" }) => {
  const url = `https://api.dev.ghostdrive.com/api/user/generate/token`;
  return authRequest.post(url, { filesize, filename });
};

export const getDownloadOTT = (body) => {
  const url = `https://api.dev.ghostdrive.com/api/download/generate/token`;
  return authRequest.post(url, body);
};

export class CustomFile {
  constructor(size, stream, filename, mimeType, fileFolderId) {
    this.stream = () => stream;
    this.isStream = true;
    this.name = filename;
    this.type = mimeType;
    this.folderId = fileFolderId;
    this.size = size;
    this.uploadId = `${filename}_${size}_${fileFolderId}`;
  }
}
