import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { videoRotuer } from "./routers/video";
import { likeDislikeRouter } from "./routers/likedislike";
import { channelRouter } from "./routers/channel";
import { commentRouter } from "./routers/comment";
import { subscribeRouter } from "./routers/subscription";
import { playlistRouter } from "./routers/playlist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  video: videoRotuer,
  like: likeDislikeRouter,
  channel: channelRouter,
  comment: commentRouter,
  subscriber: subscribeRouter,
  playlist: playlistRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
