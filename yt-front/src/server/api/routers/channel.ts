import { number, z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import HttpStatusCodes from "@/server/utils/HttpStatusCodes";
import { db } from "@/server/db";
import { channel } from "diagnostics_channel";
import { httpLink } from "@trpc/client";

export const channelRouter = createTRPCRouter({
  createChannel: publicProcedure
    .input(z.object({
      channelName: z.string(),
      description: z.string(),
      channelId: z.string(),
      profilePictureUrl: z.string().optional(),
      coverPhotoUrl: z.string().optional()
    }))
    .mutation(async opts => {
      const { channelName, channelId, description, profilePictureUrl, coverPhotoUrl } = opts.input;

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

        const isChannel = await db.channel.findFirst({
          where: {
            channelName: channelName
          }
        })

        if (isChannel) {
          return {
            code: HttpStatusCodes.BAD_REQUEST,
            message: "channel name already taken",
            channel: null
          }
        }

        const channel = await db.channel.create({
          data: {
            userId: user.id,
            channelName,
            description,
            profilePictureUrl,
            coverPhotoUrl,
            channelId
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
    }),
  getChannel: publicProcedure
    .input(z.object({
      channelId: z.string()
    }))
    .mutation(async opts => {
      const { channelId } = opts.input;

      try {

        const getChannel = await db.channel.findFirst({
          where: {
            channelId
          }
        })

        if (!getChannel) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "Channel not found",
            channel: null
          }
        }

        return {
          code: HttpStatusCodes.OK,
          message: "Channel found",
          channel: getChannel
        }

      } catch (err) {
        console.log(err);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          channel: null
        }
      } finally {
        await db.$disconnect();
      }

    }),
  getAllChannelsOfUser: publicProcedure
    .mutation(async opts => {
      try {

        if (!opts.ctx.username) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "login",
            channel: null
          }
        }

        const user = await db.user.findFirst({ where: { username: opts.ctx.username } });

        if (!user) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "user not found",
            channel: null
          }
        }

        const channel = await db.channel.findMany({
          where: {
            userId: user.id
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: "channels found",
          channel
        }

      } catch (err) {
        console.log(err);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          channel: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  getChannelById: publicProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async opts => {
      try {
        const { id } = opts.input;

        const channel = await db.channel.findFirst({ where: { id } });
        return {
          code: HttpStatusCodes.OK,
          message: "channel found",
          channel: channel
        }

      } catch (err) {
        console.log(err);
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
