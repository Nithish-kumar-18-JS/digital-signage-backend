import { MediaType } from "@prisma/client";

export class UpdateMediaDto {
    name?: string;
    url?: string;
    type?: keyof typeof MediaType;
}