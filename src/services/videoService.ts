import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

type VideoDetails = {
  title: string;
  summary: string;
  genre: string;
  path: string;
  length: number;
  release_date: string;
};

async function getVideoById(id: string) {
  return Prisma.videoDetails.findUnique({ where: { id: id } });
}

async function getVideoByTitle(title: string) {
  return Prisma.videoDetails.findUnique({ where: { title: title } });
}

async function addVideoDetails(params: VideoDetails) {
  return Prisma.videoDetails.create({
    data: {
      title: params.title,
      summary: params.summary,
      genre: params.genre,
      path: params.path,
      length: params.length,
      release_date: params.release_date
    }
  });
}

export default { getVideoById, getVideoByTitle, addVideoDetails };
