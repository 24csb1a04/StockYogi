import mongoose from "mongoose"
const holdingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  assettype : {type: String , required : true}
});

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    holdings: [holdingSchema],
  },
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export const Holding = mongoose.model("Holding" , holdingSchema);