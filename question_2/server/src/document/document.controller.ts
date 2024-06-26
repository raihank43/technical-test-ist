import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { multerConfig } from 'src/config/multer.config';
import { DocumentService } from './document.service';
import { Document } from '@prisma/client';
import { IUploadResponse } from 'src/interfaces/uploadResponse.interface';

@UseGuards(JwtAuthGuard)
@Controller()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('document')
  async getUserDocuments(
    @Request() req: any,
    @Query('orderBy') orderBy: 'asc' | 'desc',
    @Query('sortBy') sortBy: 'title' | 'createdAt',
    @Query('extension') extension: string,
  ): Promise<Document[]> {
    return this.documentService.getUserDocuments(
      req.user,
      orderBy,
      sortBy,
      extension,
    );
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadDocument(
    @UploadedFile() file,
    @Request() req: any,
  ): Promise<IUploadResponse | HttpException> {
    return this.documentService.uploadDocument(file, req.user);
  }

  @Delete('document/:id')
  async deleteDocument(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<{ message: string; document: Document }> {
    return this.documentService.deleteDocument(Number(id), req.user);
  }
}
