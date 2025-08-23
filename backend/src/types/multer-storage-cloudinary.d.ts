// src/types/multer-storage-cloudinary.d.ts
declare module "multer-storage-cloudinary" {
  import { StorageEngine } from "multer";
  import { UploadApiOptions } from "cloudinary";

  interface CloudinaryStorageOptions {
    cloudinary: any;
    params?: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: (error: any, params?: UploadApiOptions) => void
    ) => void | UploadApiOptions | Promise<UploadApiOptions>;
  }

  class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error?: any, info?: Partial<Express.Multer.File>) => void
    ): void;
    _removeFile(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error) => void
    ): void;
  }

  export = CloudinaryStorage;
}
