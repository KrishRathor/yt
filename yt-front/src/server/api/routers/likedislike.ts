import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import HttpStatusCodes from "@/server/utils/HttpStatusCodes";
import { db } from "@/server/db";
import { videoRotuer } from "./video";
import { reportUnusedDisableDirectives } from ".eslintrc.cjs";

export const likeDislikeRouter = createTRPCRouter({
  likeVideo: publicProcedure
    .input(z.object({
      videoId: z.number(),
    }))
    .mutation(async opts => {
      if (!opts.ctx.username) {
        return {
          code: HttpStatusCodes.UNAUTHORIZED,
          message: "Login before liking a video",
          like: null
        }
      }


      try {
        const { videoId } = opts.input;

        const video = await db.video.findFirst({ where: { id: videoId } });

        if (!video) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: 'Video not found',
            video: null
          }
        }

        const user = await db.user.findFirst({ where: { username: opts.ctx.username } });

        if (!user) {
        return {
          code: HttpStatusCodes.NOT_FOUND,
          message: "user not found, (not possible)",
          video: null
        }
      }

        const likeVideo = await db.video.update({
          where: {
            id: videoId
          },
          data: {
            likes: {
              increment: 1
            }
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: "Video Liked",
          video: likeVideo
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'INTERNAL_SERVER_ERROR',
          like: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
    dislikeVideo: publicProcedure
    .input(z.object({
      videoId: z.number(),
    }))
    .mutation(async opts => {
      if (!opts.ctx.username) {
        return {
          code: HttpStatusCodes.UNAUTHORIZED,
          message: "Login before liking a video",
          like: null
        }
      }


      try {
        const { videoId } = opts.input;

        const video = await db.video.findFirst({ where: { id: videoId } });

        if (!video) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: 'Video not found',
            video: null
          }
        }

        const user = await db.user.findFirst({ where: { username: opts.ctx.username } });

        if (!user) {
        return {
          code: HttpStatusCodes.NOT_FOUND,
          message: "user not found, (not possible)",
          video: null
        }
      }

        const likeVideo = await db.video.update({
          where: {
            id: videoId
          },
          data: {
            dislikes: {
              increment: 1
            }
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: "Video Liked",
          video: likeVideo
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'INTERNAL_SERVER_ERROR',
          like: null
        }
      } finally {
        await db.$disconnect();
      }
    }), 
})
