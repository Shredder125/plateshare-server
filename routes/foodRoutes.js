router.get("/featured", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 }).limit(6);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Error fetching featured foods" });
  }
});
