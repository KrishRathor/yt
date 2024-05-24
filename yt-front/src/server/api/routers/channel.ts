import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import HttpStatusCodes from "@/server/utils/HttpStatusCodes";
import { db } from "@/server/db";

export const channelRouter = createTRPCRouter({
  createChannel: publicProcedure
    .input(z.object({
      channelName: z.string(),
      description: z.string(),
      profilePictureUrl: z.string().optional(),
      coverPhotoUrl: z.string().optional()
    }))
    .mutation(async opts => {
      const { channelName, description, profilePictureUrl, coverPhotoUrl } = opts.input;

      if (!opts.ctx.username) {
        return {
          code: HttpStatusCodes.NOT_FOUND,
          message: "User token not found",
          channel: null
        }
      }

      try {

        const user = await db.user.findFirst({ where: { username: opts.ctx.username } });

        if (!user) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "User not found",
            channel: null
          }
        }

        const channel = await db.channel.create({
          data: {
            userId: user.id,
            channelName,
            description,
            profilePictureUrl,
            coverPhotoUrl
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: "channel created successfully",
          channel
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          channel: null
        }
      } finally {
        await db.$disconnect();
      }
    })
})
