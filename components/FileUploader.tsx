"use client";

import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange?: (files: File[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (onChange) onChange(acceptedFiles);
    },
    [onChange]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="Uploaded image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image src="/assets/icons/upload.svg" height={40} width={40} alt="upload" />
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">Click to upload</span> or drag and drop
            </p>
            <p>SVG, PNG, JPG or Gif (max 800x400)</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;
