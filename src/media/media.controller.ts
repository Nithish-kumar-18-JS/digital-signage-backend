import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    Req,
    UseGuards,
    BadRequestException,
    Get,
    Query,
    Delete,
    Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { AuthGuard } from '../auth/auth.guard';
import { MediaType } from '@prisma/client';

@Controller('media')
export class MediaController {
    constructor(private mediaService: MediaService) { }

    @UseGuards(AuthGuard)
    @Post('add-media')
    @UseInterceptors(FileInterceptor('file'))
    async addMedia(
        @UploadedFile() file: Express.Multer.File,
        @Body('name') name: string,
        @Body('type') type: string,
        @Req() req: any,
    ) {
        if (!file) throw new BadRequestException('No file provided');
        if (!name) throw new BadRequestException('Name is required');
        if (!req?.user?.sub) throw new BadRequestException('Unauthorized');

        return this.mediaService.createMedia(file, name, type as MediaType, req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Get('all-media')
    async getAllMedia(@Req() req: any, @Query('type') type: string) {
        if (!req?.user?.sub) throw new BadRequestException('Unauthorized');
        return this.mediaService.getAllMedia(req.user.sub, type as MediaType);
    }

    @UseGuards(AuthGuard)
    @Delete('delete-media')
    async deleteMedia(@Req() req: any, @Query('mediaId') mediaId: string) {
        if (!req?.user?.sub) throw new BadRequestException('Unauthorized');
        return this.mediaService.deleteMedia(req.user.sub, mediaId);
    }

    @UseGuards(AuthGuard)
    @Put('update-media')
    async updateMedia(@Req() req: any, @Query('mediaId') mediaId: string, @Body() mediaData: any) {
        if (!req?.user?.sub) throw new BadRequestException('Unauthorized');
        return this.mediaService.updateMedia(req.user.sub, mediaId, mediaData);
    }
}


