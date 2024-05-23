import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { options } from "prettier-plugin-tailwindcss";
import HttpStatusCodes from "@/server/utils/HttpStatusCodes";
import { db } from "@/server/db";
import { videoRotuer } from "./video";
import { reportUnusedDisableDirectives } from ".eslintrc.cjs";
import { comment } from "postcss";
import { hexToRgb } from "@mui/material";

export const commentRouter = createTRPCRouter({
  addComment: publicProcedure
    .input(z.object({
      commentText: z.string(),
      parentCommentId: z.number().optional(),
      videoId: z.number()
    }))
    .mutation(async opts => {
      const { commentText, parentCommentId, videoId } = opts.input;

      if (!opts.ctx.username) {
        return {
          code: HttpStatusCodes.UNAUTHORIZED,
          message: "Login before commenting",
          comment: null
        }
      }

      try {

        const video = await db.video.findFirst({ where: { id: videoId } });

        if (!video) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "Video not found",
            comment: null
          }
        }

        const user = await db.user.findFirst({ where: { username: opts.ctx.username } });

        if (!user) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "User not found",
            comment: null
          }
        }

        const comment = await db.comment.create({
          data: {
            commentText,
            videoId,
            parentCommentId,
            userId: user?.id
          }
        })

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          comment: null
        }
      } finally {
        await db.$disconnect();
      }

    }),
  getChildComment: publicProcedure
    .input(z.object({
      parentCommentId: z.number()
    }))
    .mutation(async opts => {
      try {
        const { parentCommentId } = opts.input;
        const comments = await db.comment.findMany({
          where: {
            parentCommentId
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: "Comments found",
          comment: comments
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          comment: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  likeComment: publicProcedure
    .input(z.object({
      commentId: z.number()
    }))
    .mutation(async opts => {
      if (!opts.ctx.username) {
        return {
          code: HttpStatusCodes.UNAUTHORIZED,
          message: "Login before liking a comment",
          comment: null
        }
      }

      try {

        const comment = await db.comment.findFirst({ where: { id: opts.input.commentId } });

        if (!comment) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "Comment not found",
            comment: null
          }
        }

        const likeComment = await db.comment.update({
          where: {
            id: opts.input.commentId
          },
          data: {
            likes: {
              increment: 1
            }
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: "liked comment",
          comment: likeComment
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          comment: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  dislikeComment: publicProcedure
    .input(z.object({
      commentId: z.number()
    }))
    .mutation(async opts => {
      if (!opts.ctx.username) {
        return {
          code: HttpStatusCodes.UNAUTHORIZED,
          message: "Login before liking a comment",
          comment: null
        }
      }

      try {

        const comment = await db.comment.findFirst({ where: { id: opts.input.commentId } });

        if (!comment) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "Comment not found",
            comment: null
          }
        }

        const likeComment = await db.comment.update({
          where: {
            id: opts.input.commentId
          },
          data: {
            dislikes: {
              increment: 1
            }
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: "liked comment",
          comment: likeComment
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          comment: null
        }
      } finally {
        await db.$disconnect();
      }
    }),

})
