import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import HttpStatusCodes from "@/server/utils/HttpStatusCodes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export const userRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(z.object({
      username: z.string().min(3),
      email: z.string().min(3),
      password: z.string().min(3),
      image: z.string().min(5),
      country: z.string().min(2)
    }))
    .mutation(async (opts) => {
      const { username, email, password, image, country } = opts.input;

      try {
        const checkUser = await db.user.findFirst({
          where: {
            username: username
          }
        });

        if (checkUser) {
          return {
            code: HttpStatusCodes.BAD_REQUEST,
            message: 'User already registed!',
            user: null
          }
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const createUser = await db.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
            avatarUrl: image,
            country
          }
        })

        if (createUser) {
          return {
            code: HttpStatusCodes.CREATED,
            message: 'User created successfully',
            user: createUser
          }
        }

        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Error creating user, issue with db',
          user: null
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Intrnal server Error',
          user: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  login: publicProcedure
    .input(z.object({
      email: z.string(),
      password: z.string()
    }))
    .mutation(async opts => {
      const { email, password } = opts.input;
      try {

        const isUser = await db.user.findFirst({
          where: {
            email: email
          }
        });

        if (!isUser) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: 'Email not registered',
            token: null
          }
        }

        const passwordCorrect = await bcrypt.compare(password, isUser.password);

        if (!passwordCorrect) {
          return {
            code: HttpStatusCodes.UNAUTHORIZED,
            message: 'incorrect password',
            token: null
          }
        }

        const payload = {
          username: isUser.username,
          email: email
        };

        const secret = process.env.JWT_SECRET ?? '';
        console.log('secret from env', secret);
        const token = jwt.sign(payload, secret);

        return {
          code: HttpStatusCodes.OK,
          message: 'User logged in successfully',
          token
        }

      } catch (error) {
        console.log(error);
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          token: null
        }
      } finally {
        await db.$disconnect();
      }
    }),
  getUserById: publicProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async opts => {
      const { id } = opts.input;

      try {

        const getUser = await db.user.findFirst({
          where: {
            id: id
          }
        });

        if (!getUser) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: `User with id ${id} not found`,
            user: null
          }
        }

        return {
          code: HttpStatusCodes.OK,
          message: 'User found',
          user: getUser
        }

      } catch (error) {
        console.log(error)
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          user: null
        }
      } finally {
        await db.$disconnect();
      }

    }),
  getUserByUsername: publicProcedure
    .input(z.object({
      username: z.string()
    }))
    .mutation(async opts => {
      const { username } = opts.input;

      try {

        const getUser = await db.user.findFirst({
          where: {
            username
          }
        });

        if (!getUser) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: `User with username ${username} not found`,
            user: null
          }
        }

        return {
          code: HttpStatusCodes.OK,
          message: 'User found',
          user: getUser
        }

      } catch (error) {
        console.log(error)
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          user: null
        }
      } finally {
        await db.$disconnect();
      }

    }),
  getUserByEmail: publicProcedure
    .input(z.object({
      email: z.string()
    }))
    .mutation(async opts => {

      const { username } = opts.ctx;

      if (!username) {
        return {
          code: HttpStatusCodes.UNAUTHORIZED,
          message: 'Not authorized',
          user: null
        }
      }

      const { email } = opts.input;

      try {

        const getUser = await db.user.findFirst({
          where: {
            email
          }
        });

        if (!getUser) {
          return {
            code: HttpStatusCodes.NOT_FOUND,
            message: `User with email ${email} not found`,
            user: null
          }
        }

        return {
          code: HttpStatusCodes.OK,
          message: 'User found',
          user: getUser
        }

      } catch (error) {
        console.log(error)
        return {
          code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          user: null
        }
      } finally {
        await db.$disconnect();
      }

    }),
 
 }) 
