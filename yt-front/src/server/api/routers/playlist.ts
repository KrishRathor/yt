import React from "react";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { nullable, number, string, z } from "zod";
import HttpStatusCodes from "@/server/utils/HttpStatusCodes";
import { db } from "@/server/db";
import { resourceUsage } from "process";
import { channel } from "diagnostics_channel";

export const playlistRouter = createTRPCRouter({
  createPlaylist: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      channelId: z.number()
    }))
    .mutation(async opts => {
      if (!opts.ctx.username) {
        return {
          code: HttpStatusCodes.UNAUTHORIZED,
          message: "login first",
          playlist: null
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
            message: 'user not foudn',
            playlist: null
          }
        }

        const { title, description, channelId } = opts.input;

        const channel = await db.channel.findFirst({
          where: {
            id: channelId
          }
        })

        if (!channel) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: 'channel not found',
            playlist: null
          }
        }

        const isPlaylist = await db.playlist.findFirst({
          where: { title }
        })

        if (isPlaylist) {
          return {
            code: HttpStatusCodes.BAD_REQUEST,
            message: "playlist already exist",
            playlist: null
          }
        }

        const playlist = await db.playlist.create({
          data: {
            userId: user.id,
            channelId,
            title,
            description,
            privacyStatus: 'public'
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: 'created playlist',
          playlist
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          playlist: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  addVideo: publicProcedure
    .input(z.object({
      videoId: z.number(),
      playlistId: z.number(),
    }))
    .mutation(async opts => {
      try {

        if (!opts.ctx.username) {
          return {
            code: HttpStatusCodes.UNAUTHORIZED,
            message: 'login first',
            playlist: null
          }
        }

        const { videoId, playlistId } = opts.input;

        const [video, playlist] = await Promise.all([
          await db.video.findFirst({ where: { id: videoId } }),
          await db.playlist.findFirst({ where: { id: playlistId } })
        ]);

        if (!video || !playlist) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "playlist or video not found",
            playlist: null
          }
        }

        const createPlaylistItem = await db.playlistItem.create({
          data: {
            videoId,
            playlistId
          }
        })

        return {
          code: HttpStatusCodes.OK,
          message: 'added video',
          playlist: createPlaylistItem
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          playlist: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  getAllVideosOfPlaylist: publicProcedure
    .input(z.object({
      playlistId: z.number()
    }))
    .mutation(async opts => {
      try {

        const { playlistId } = opts.input;

        const playlist = await db.playlist.findFirst({ where: { id: playlistId } });

        if (!playlistId) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: "playlist not found",
            videos: null
          }
        }

        const getPlaylistItems = await db.playlistItem.findMany({
          where: {
            playlistId
          }
        })
        const videoIds = getPlaylistItems.map(item => item.videoId);

        const videos = await Promise.all(videoIds.map(async item => {
          const video = await db.video.findFirst({ where: { id: item } });
          if (video) return video;
        }))

        return {
          code: HttpStatusCodes.OK,
          message: 'videos found',
          videos: { videos, playlist }
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          videos: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  getAllPlaylistsOfChannel: publicProcedure
    .input(z.object({
      channelId: z.number()
    }))
    .mutation(async opts => {
      try {

        const { channelId } = opts.input;

        const channel = await db.channel.findFirst({ where: { id: channelId } });

        if (!channel) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: 'channel not found',
            playlist: null
          }
        }

        const playlists = await db.playlist.findMany({
          where: {
            channelId
          }
        })

        const playlistsAndCover = await Promise.all(playlists.map(async playlist => {
          const playlistItem = await db.playlistItem.findFirst({ where: { id: playlist.id } });
          if (playlistItem) {
            const video = await db.video.findFirst({ where: { id: playlistItem.videoId } });
            if (video) {
              return { playlist, image: video?.thumbnailUrl };

            }
          }
        }))

        return {
          code: HttpStatusCodes.OK,
          message: 'found',
          playlist: playlistsAndCover
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "INTERNAL_SERVER_ERROR",
          playlist: null
        }
      } finally {
        await db.$disconnect();
      }
    })
})
