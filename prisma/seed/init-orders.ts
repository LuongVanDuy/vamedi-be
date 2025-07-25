import { PrismaClient } from "@prisma/client";

export const initOrders = async (prisma: PrismaClient) => {
  console.log("---Init Orders Begin---");
  try {
    const orders = [
      {
        id: "order_1",
        projectName: "Project Alpha",
        service: "Photo Editing",
        uploadImage: "image1.jpg",
        quantity: 10,
        designStyle: "Modern",
        photoDetail: "High-quality portraits",
        customerId: 3,
        servicePrice: 100.0,
        additionalService: "Rush Delivery",
        additionalServicePrice: 20.0,
        orderTotal: 120.0,
        status: "READY",
        isAgreed: 1,
      },
      {
        id: "order_2",
        projectName: "Project Beta",
        service: "Logo Design",
        uploadImage: "image2.jpg",
        quantity: 5,
        designStyle: "Minimalist",
        photoDetail: "Flat vector design",
        customerId: 3,
        servicePrice: 200.0,
        additionalService: null,
        additionalServicePrice: null,
        orderTotal: 200.0,
        status: "AWAITING",
        isAgreed: 1,
      },
      {
        id: "order_3",
        projectName: "Project Gamma",
        service: "3D Rendering",
        uploadImage: "image3.jpg",
        quantity: 1,
        designStyle: "Realistic",
        photoDetail: "Detailed interiors",
        customerId: 3,
        servicePrice: 500.0,
        additionalService: "Priority Support",
        additionalServicePrice: 50.0,
        orderTotal: 550.0,
        status: "REWORK",
        isAgreed: 0,
      },
      {
        id: "order_4",
        projectName: "Project Delta",
        service: "Video Editing",
        uploadImage: "video_thumbnail.jpg",
        quantity: 3,
        designStyle: "Cinematic",
        photoDetail: "Short promotional clips",
        customerId: 3,
        servicePrice: 300.0,
        additionalService: null,
        additionalServicePrice: null,
        orderTotal: 300.0,
        status: "DONE",
        isAgreed: 1,
      },
      {
        id: "order_5",
        projectName: "Project Epsilon",
        service: "Poster Design",
        uploadImage: "poster_image.jpg",
        quantity: 20,
        designStyle: "Abstract",
        photoDetail: "Event posters",
        customerId: 3,
        servicePrice: 50.0,
        additionalService: null,
        additionalServicePrice: null,
        orderTotal: 50.0,
        status: "DRAFT",
        isAgreed: 0,
      },
    ];

    for (const order of orders) {
      await prisma.order.create({
        data: order,
      });
    }

    console.log("---Init Orders Success---");
  } catch (err) {
    console.error("---Init Orders Failed---");
    console.error(err);
  }
};
