import React from "react";
import { Tag } from "antd";
export const ImageViewer = ({ ImgArray, ipc }) => {
  let handleImagePreview = (base64Data: string) => {
    if (ipc) {
      ipc.source.postMessage(
        {
          action: "openImageView",
          values: {
            imageData: base64Data
          }
        },
        "*"
      );
    }
  };
  return (
    <div className="filePreviewer">
      {Object.keys(ImgArray).map((img, index) => {
        return (
          <span
            className="form-files-preview-item"
            style={{ width: "auto" }}
            key={index}
            onClick={() => handleImagePreview(ImgArray[`${img}`].value)}
          >
            <span className="form-files-preview-item-image">
              <img src={`${ImgArray[`${img}`].value}`} alt="uploadedImage" />;
            </span>
            <div className="fileNameWrapper">
              <Tag color="#cb1e1a" className="tagWrapper">
                {img}
              </Tag>
            </div>
          </span>
        );
      })}
    </div>
  );
};
