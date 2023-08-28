// @ts-nocheck
import { uploadFile } from "gdgateway-client/lib/es5";
import * as fs from "fs";
import authRequest from "./auth-request.js";

export const getProgressFromLSCallback = () => {
  // it will be removed
  console.log("getProgressFromLSCallback");
};

export const setProgressToLSCallback = (progress: string) => {
  // it will be removed
  console.log("setProgressToLSCallback");
};

export const clearProgressCallback = () => {
  // it will be removed
  console.log("clearProgressCallback");
};

export const updateProgressCallback = (
  id: string,
  progress: string | number,
  timeLeft: string | number,
  dispatch: any
) => {
  // need to figure out how to use redux's dispatches here
  console.log("updateProgressCallback");
  // dispatch(
  //   uploadActions.uploadChangeProgress({
  //     progress,
  //     id: id,
  //   })
  // );
  // dispatch(
  //   uploadActions.uploadChangeSecondsLeft({
  //     timeLeft,
  //     id: id,
  //   })
  // );
};

export const getOneTimeToken = ({ filesize = "", filename = "" }) => {
  const url = `https://api.dev.ghostdrive.com/api/user/generate/token`;
  return authRequest.post(url, { filesize, filename });
};

class CustomFile {
  constructor(buffer, filename, mimeType, fileSize, fileFolderId) {
    this.arrayBuffer = () => buffer;
    this.name = filename;
    this.type = mimeType;
    this.folderId = fileFolderId;
    this.size = fileSize;
    this.upload_id = `${filename}_${fileSize}_${fileFolderId}`;
  }
}
const func = async () => {
  const startTime = Date.now();
  // FILE STARTS
  const fileBuffer = await fs.promises.readFile("./src/file-from-node.png");
  const filename = "file-from-node.png";
  const mimeType = "image/png";
  const fileSize = fileBuffer.byteLength;
  const folderId = ""; // - that means main folder (or give a slug of the folder to be uploaded in)

  const customFileObject = new CustomFile(
    fileBuffer,
    filename,
    mimeType,
    fileSize,
    folderId
  );

  const {
    data: {
      user_token: { token: oneTimeToken },
      endpoint,
    },
  } = await getOneTimeToken({
    filename: customFileObject.name,
    filesize: customFileObject.size,
  });

  const dispatch = null; // figure out

  const result = await uploadFile(
    customFileObject,
    startTime,
    oneTimeToken,
    endpoint,
    dispatch,
    updateProgressCallback,
    getProgressFromLSCallback,
    setProgressToLSCallback,
    clearProgressCallback
  );

  console.log("___________________________SUCCESSFUL RESULT", result);
};
func();
