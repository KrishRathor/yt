import { number, z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import HttpStatusCodes from "@/server/utils/HttpStatusCodes";
import { db } from "@/server/db";
import { reportUnusedDisableDirectives } from ".eslintrc.cjs";
import { userInfo } from "os";
import { use } from "react";

export const subscribeRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(z.object({
      channelId: z.number()
    }))
    .mutation(async opts => {
      if (!opts.ctx.username) {
        return {
          code: HttpStatusCodes.UNAUTHORIZED,
          message: "Login before subscribe",
          subscribe: null
        }
      }

      try {

        const [user, channel] = await Promise.all([
          db.user.findFirst({ where: { username: opts.ctx.username } }),
          db.channel.findFirst({ where: { id: opts.input.channelId } })
        ])

        if (!user || !channel) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "user or channel not found",
            subscribe: null
          }
        }

        const subscribe = await db.subscription.create({
          data: {
            subscriberUserId: user.id,
            subscribedToChannelId: channel.id
          }
        })

        const increaseSubscribeCount = await db.channel.update({
          where: {
            id: channel.id
          },
          data: {
            subscribersCount: {
              increment: 1
            }
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: "subscribed to channel",
          subscribe: subscribe
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          subscribe: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  unsubscribe: publicProcedure
    .input(z.object({
      channelId: z.number()
    }))
    .mutation(async opts => {
      if (!opts.ctx.username) {
        return {
          code: HttpStatusCodes.UNAUTHORIZED,
          message: "Login before subscribe",
          subscribe: null
        }
      }

      try {

        const [user, channel] = await Promise.all([
          db.user.findFirst({ where: { username: opts.ctx.username } }),
          db.channel.findFirst({ where: { id: opts.input.channelId } })
        ])

        if (!user || !channel) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "user or channel not found",
            subscribe: null
          }
        }

        const subscribe = await db.subscription.findFirst({
          where: {
            AND: {
              subscriberUserId: user.id,
              subscribedToChannelId: channel.id
            }
          }
        })

        const unsubscribe = await db.subscription.delete({ where: { id: subscribe?.id } });

        const _dec = await db.channel.update({
          where: {
            id: channel.id
          },
          data: {
            subscribersCount: {
              decrement: 1
            }
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: "unsubscribed to channel",
          subscribe: unsubscribe
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          subscribe: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  getAllSubscribedChannels: publicProcedure
    .mutation(async opts => {
      if (!opts.ctx.username) {
        return {
          code: HttpStatusCodes.UNAUTHORIZED,
          message: "login first",
          channels: null
        }
      }

      try {

        const user = await db.user.findFirst({ where: { username: opts.ctx.username } });

        if (!user) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "user not found",
            channels: null
          }
        }

        const channels = await db.subscription.findMany({ where: { subscriberUserId: user.id } });
        const channelsId = channels.map((chnl => chnl.subscribedToChannelId));

        return {
          code: HttpStatusCodes.OK,
          message: "channels not found",
          channels: null
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          channels: null
        }
      } finally {
        await db.$disconnect();
      }

    })

})
