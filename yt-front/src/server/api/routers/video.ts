import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import HttpStatusCodes from "@/server/utils/HttpStatusCodes";
import { db } from "@/server/db";
import { getServerSideProps } from "next/dist/build/templates/pages";
import { channel } from "diagnostics_channel";
import { dataTagSymbol } from "@tanstack/react-query";

export const videoRotuer = createTRPCRouter({
  uploadVideo: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      duration: z.number(),
      thumbnailUrl: z.string().optional(),
      status: z.string(),
      category: z.string(),
      language: z.string(),
      channelId: z.string(),
      tags: z.string().array(),
      video: z.string().array()
    }))
    .mutation(async opts => {

      if (!opts.ctx.username) {
        return {
          code: HttpStatusCodes.UNAUTHORIZED,
          message: 'UNAUTHORIZED',
          video: null
        }
      }

      try {

        const user = await db.user.findFirst({
          where: {
            username: opts.ctx.username
          }
        })

        if (!user) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "user not found",
            video: null
          }
        }

        const checkVideoTitle = await db.video.findFirst({ where: { title: opts.input.title } });

        if (checkVideoTitle) {
          return {
            code: HttpStatusCodes.BAD_REQUEST,
            message: 'Video title not unique',
            video: null
          }
        }

        const { title, tags, status, category, language, description, thumbnailUrl, channelId, video, duration } = opts.input;

        const channel = await db.channel.findFirst({ where: { channelId } });

        if (!channel) {
          return {
            code: HttpStatusCodes.BAD_REQUEST,
            message: 'No channel found',
            video: null
          }
        }

        const createVideo = await db.video.create({
          data: {
            title, description, tags, thumbnailUrl, status, channelId: channel.id, category, language, videoUrl: video,
            duration, userId: user.id
          }
        })

        if (!createVideo) {
          return {
            code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            message: 'error with db',
            video: null
          }
        }

        return {
          code: HttpStatusCodes.OK,
          message: 'uploaded video successfully',
          video: createVideo
        }

      } catch (err) {
        console.log(err);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'INTERNAL_SERVER_ERROR',
          video: null
        }
      } finally {
        await db.$disconnect();
      }

    }),
  getVideoByTitle: publicProcedure
    .input(z.object({
      title: z.string(),
    }))
    .mutation(async opts => {
      try {
        const video = await db.video.findFirst({ where: { title: opts.input.title } });

        if (!video) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: 'video not found',
            video: null
          }
        }

        return {
          code: HttpStatusCodes.OK,
          message: 'video found',
          video
        }
      } catch (err) {
        console.log(err);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'INTERNAL_SERVER_ERROR',
          video: null
        }
      } finally {
        await db.$disconnect();
      }

    }),
  getVideoById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async opts => {
      try {
        const video = await db.video.findFirst({ where: { id: opts.input.id } });

        if (!video) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: 'video not found',
            video: null
          }
        }

        return {
          code: HttpStatusCodes.OK,
          message: 'video found',
          video
        }
      } catch (err) {
        console.log(err);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'INTERNAL_SERVER_ERROR',
          video: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  getVideoByTag: publicProcedure
    .input(z.object({
      tag: z.string(),
    }))
    .mutation(async opts => {
      try {
        const video = await db.video.findMany({ where: { tags: { has: opts.input.tag } } });

        if (video.length === 0) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: 'video not found',
            video: null
          }
        }

        return {
          code: HttpStatusCodes.OK,
          message: 'video found',
          video
        }
      } catch (err) {
        console.log(err);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'INTERNAL_SERVER_ERROR',
          video: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  getComments: publicProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async opts => {
      const { id } = opts.input;

      try {
        const video = await db.video.findFirst({ where: { id } });

        if (!video) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "No video found",
            comments: null
          }
        }

        const getComments = await db.comment.findMany({
          where: {
            videoId: video.id
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: 'comments found',
          comments: getComments
        }

      } catch (err) {
        console.log(err);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'INTERNAL_SERVER_ERROR',
          video: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  getVideoByCategory: publicProcedure
    .input(z.object({
      category: z.string()
    }))
    .mutation(async opts => {
      try {
        const { category } = opts.input;
        const video = await db.video.findMany({
          where: {
            category
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: "Videos found",
          category
        }

      } catch (err) {
        console.log(err);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'INTERNAL_SERVER_ERROR',
          video: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  getVideoByChannel: publicProcedure
    .input(z.object({
      channelId: z.string()
    }))
    .mutation(async opts => {
      try {
        const { channelId } = opts.input;

        const channel = await db.channel.findFirst({ where: { channelId } });

        if (!channel) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "channel not found",
            video: null
          }
        }

        const videos = await db.video.findMany({
          where: {
            channelId: channel.id
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: "videos found",
          video: videos
        }

      } catch (err) {
        console.log(err);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          video: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  getAllVideos: publicProcedure
    .mutation(async opts => {
      try {

        const getVideos = await db.video.findMany();

        const data = await Promise.all(getVideos.map(async video => {
          const channelId = video.channelId;
          const channel = await db.channel.findFirst({ where: { id: channelId } });
          if (channel) {
            return {
              ...video,
              channelName: channel.channelName,
              profile: channel.profilePictureUrl
            }
          }
        }))

        return {
          code: HttpStatusCodes.OK,
          message: "videos found",
          video: data
        }

      } catch (err) {
        console.log(err);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          video: null
        }
      } finally {
        await db.$disconnect();
      }
    })
})

