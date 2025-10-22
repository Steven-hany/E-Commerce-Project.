create: async (req, res) => {
    try {
      const orderRepo = AppDataSource.getRepository(Order);
      const newOrder = orderRepo.create(req.body);
      await orderRepo.save(newOrder);
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("❌ Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });

    }
  },
{}