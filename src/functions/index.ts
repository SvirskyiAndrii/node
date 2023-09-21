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

export const getThumbnailImage = (file: LocalFile) => {
  return new Promise((resolve, reject) => {
    const imageURL = URL.createObjectURL(file);
    const image = new Image();
    image.src = imageURL;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    image.onload = () => {
      const aspectRatio = image.width / image.height;

      let newWidth = MAX_WIDTH;
      let newHeight = MAX_HEIGHT;

      if (image.width > image.height) {
        newHeight = MAX_WIDTH / aspectRatio;
      } else {
        newWidth = MAX_HEIGHT * aspectRatio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx?.drawImage(image, 0, 0, newWidth, newHeight);

      const qualityReduction = getReductionFactor(file.size);

      const dataURL = canvas.toDataURL(
        "image/jpeg",
        +qualityReduction.toFixed(1)
      );
      URL.revokeObjectURL(imageURL);

      resolve(dataURL);
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
};

export const getThumbnailVideo = (file: LocalFile) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const aspectRatio = video.videoWidth / video.videoHeight;

      let newWidth = MAX_WIDTH;
      let newHeight = MAX_HEIGHT;

      if (video.videoWidth > video.videoHeight) {
        newHeight = MAX_WIDTH / aspectRatio;
      } else {
        newWidth = MAX_HEIGHT * aspectRatio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      video.currentTime = 0.1;

      video.onseeked = () => {
        ctx?.drawImage(video, 0, 0, newWidth, newHeight);

        const qualityReduction = getReductionFactor(file.size);

        const dataURL = canvas.toDataURL(
          "image/jpeg",
          +qualityReduction.toFixed(1)
        );
        resolve(dataURL);
      };

      video.onerror = (error) => {
        reject(error);
      };
    };

    video.onerror = (error) => {
      reject(error);
    };
  });
};
