import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { LucideUploadCloud } from "lucide-react";

type Props = {
  children?: React.ReactNode;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function Dropzone(props: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    props.setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex h-32 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <div className="flex w-full flex-col items-center justify-center rounded-md bg-slate-500">
          <p className="mb-4">Drop the files here</p>
          <LucideUploadCloud
            width={24}
            height={24}
            className="scale-[1.2] text-white transition-all"
          />
        </div>
      ) : (
        <div className="flex w-full cursor-pointer flex-col items-center justify-center">
          <p className="mb-4">Drag and drop an image here or click</p>
          <LucideUploadCloud width={24} height={24} className=" text-slate-400" />
        </div>
      )}
    </div>
  );
}
