import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

type VideoDetails = {
  title: string;
  summary: string;
  genre: string;
  path: string;
  size: number;
  length: number;
  release_date: string;
  thumbnail_path: string;
  uploader_id: string;
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
      size: params.size,
      length: params.length,
      release_date: params.release_date,
      thumbnail_path: params.thumbnail_path,
      uploader_id: params.uploader_id
    }
  });
}

const getVideos = async (limit: number, offset: number) => {
  return Prisma.videoDetails.findMany({
    skip: offset,
    take: limit
  });
};

const searchByTitle = async (term: string, offset: number, limit: number) => {
  return Prisma.videoDetails.findMany({
    where: {
      title: { contains: term }
    },
    skip: offset,
    take: limit
  });
};

export default { getVideoById, getVideoByTitle, addVideoDetails, getVideos, searchByTitle };
