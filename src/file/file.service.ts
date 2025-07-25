import * as path from "path";
import * as fs from "fs";
import { Injectable, NotFoundException } from "@nestjs/common";
import { SuccessType } from "src/common/types";

@Injectable()
export class FileService {
  private uploadDir = path.resolve(__dirname, "../../../public");

  async saveFile(
    file: Express.Multer.File
  ): Promise<{ data: string; success: boolean }> {
    if (!file) {
      throw new Error("No file provided");
    }

    const fileExtension = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExtension);
    const uniqueFileName = `${fileName}_${Date.now()}${fileExtension}`;
    const filePath = path.join(this.uploadDir, uniqueFileName);

    fs.writeFileSync(filePath, file.buffer);
    return { data: uniqueFileName, success: true };
  }

  async removeFile(
    fileName: string
  ): Promise<{ success: boolean; message: string }> {
    const filePath = path.join(this.uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${fileName} not found`);
    }

    fs.unlinkSync(filePath);
    return { success: true, message: `File ${fileName} has been deleted` };
  }
}
