import { PrismaClient } from "@prisma/client";

export const seedPosts = async (prisma: PrismaClient) => {
  console.log("---Seeding Blog Posts Begin---");
  try {
    const author = await prisma.user.findFirst({
      where: { email: "admin@example.com" },
    });

    if (!author) {
      console.log("Author not found. Please make sure the admin user exists.");
      return;
    }

    const posts = [
      {
        title: "Introduction to Prisma",
        slug: "introduction-to-prisma-" + Date.now(),
        content:
          "Prisma is a next-generation ORM that simplifies database workflows.",
        authorId: author.id,
      },
      {
        title: "Building REST APIs with NestJS",
        slug: "building-rest-apis-with-nestjs-" + Date.now(),
        content:
          "NestJS is a powerful framework for building efficient, reliable, and scalable server-side applications.",
        authorId: author.id,
      },
      {
        title: "Getting Started with TypeScript",
        slug: "getting-started-with-typescript-" + Date.now(),
        content:
          "TypeScript adds optional types to JavaScript, improving readability and catching errors early.",
        authorId: author.id,
      },
      {
        title: "Deploying Apps on Vercel",
        slug: "deploying-apps-on-vercel-" + Date.now(),
        content:
          "Vercel provides a simple way to deploy web apps with support for Next.js, React, and more.",
        authorId: author.id,
      },
      {
        title: "Understanding JWT Authentication",
        slug: "understanding-jwt-authentication-" + Date.now(),
        content:
          "JWT (JSON Web Token) is a compact way to securely transmit information between parties.",
        authorId: author.id,
      },
    ];

    for (const post of posts) {
      await prisma.post.create({
        data: post,
      });
    }

    console.log("---Seeding Blog Posts Success---");
  } catch (err) {
    console.error("Error seeding blog posts:", err);
  }
};
