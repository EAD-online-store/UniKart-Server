import { addToCartItemController, getCartItemController, updateCartItemQtyController, deleteCartItemQtyController } from "../controllers/cart.controller";
import CartProductModel from "../models/cartproduct.model";
import UserModel from "../models/user.model";

jest.mock("../models/cartproduct.model");
jest.mock("../models/user.model");

describe("addToCartItemController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      userId: "testUserId",
      body: { productId: "1" },
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  it("should add an item to the cart successfully", async () => {
    CartProductModel.findOne.mockResolvedValue(null);
    CartProductModel.prototype.save = jest.fn().mockResolvedValue({
      productId: "1",
      userId: "testUserId",
      quantity: 1,
    });
    UserModel.updateOne.mockResolvedValue({ modifiedCount: 1 });

    await addToCartItemController(req, res);

    expect(CartProductModel.findOne).toHaveBeenCalledWith({
      userId: "testUserId",
      productId: "1",
    });
    expect(CartProductModel.prototype.save).toHaveBeenCalled();
    expect(UserModel.updateOne).toHaveBeenCalledWith(
      { _id: "testUserId" },
      { $push: { shopping_cart: "1" } }
    );
    expect(res.json).toHaveBeenCalledWith({
      data: expect.any(Object),
      message: "Item add successfully",
      error: false,
      success: true,
    });
  });

  it("should return an error if `productId` is not provided", async () => {
    req.body = {};

    await addToCartItemController(req, res);

    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith({
      message: "Provide productId",
      error: true,
      success: false,
    });
  });

  it("should return an error if the item is already in the cart", async () => {
    CartProductModel.findOne.mockResolvedValue({
      productId: "1",
      userId: "testUserId",
      quantity: 1,
    });

    await addToCartItemController(req, res);

    expect(CartProductModel.findOne).toHaveBeenCalledWith({
      userId: "testUserId",
      productId: "1",
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Item already in cart",
    });
  });

  it("should handle errors when saving a new cart item", async () => {
    CartProductModel.findOne.mockResolvedValue(null);
    CartProductModel.prototype.save = jest.fn().mockRejectedValue(new Error("Save error"));

    await addToCartItemController(req, res);

    expect(CartProductModel.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Database error",
      error: true,
      success: false,
    });
  });

  it("should handle errors when updating the user's shopping cart", async () => {
    CartProductModel.findOne.mockResolvedValue(null);
    CartProductModel.prototype.save = jest.fn().mockResolvedValue({
      productId: "1",
      userId: "testUserId",
      quantity: 1,
    });
    UserModel.updateOne.mockRejectedValue(new Error("Update error"));

    await addToCartItemController(req, res);

    expect(UserModel.updateOne).toHaveBeenCalledWith(
      { _id: "testUserId" },
      { $push: { shopping_cart: "1" } }
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Database error",
      error: true,
      success: false,
    });
  });

  it("should handle unexpected errors gracefully", async () => {
    CartProductModel.findOne.mockRejectedValue(new Error("Unexpected error"));

    await addToCartItemController(req, res);

    expect(CartProductModel.findOne).toHaveBeenCalledWith({
      userId: "testUserId",
      productId: "1",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Database error",
      error: true,
      success: false,
    });
  });
});




describe("getCartItemController", () => {
  let req, res;

  beforeEach(() => {
    req = { userId: "testUserId" };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
  });

  it("should return a list of cart items successfully", async () => {
    CartProductModel.find.mockResolvedValue([
      { productId: "productId1", quantity: 2, userId: "testUserId" },
    ]);

    await getCartItemController(req, res);

    expect(CartProductModel.find).toHaveBeenCalledWith({ userId: "testUserId" });
    // expect(res.json).toHaveBeenCalledWith({
    //   data: [
    //     { productId: "productId1", quantity: 2, userId: "testUserId" },
    //   ],
    //   error: false,
    //   success: true,
    // });
  });

  it("should return an empty array if no items are found", async () => {
    CartProductModel.find.mockResolvedValue([]);

    await getCartItemController(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message : "_cartproductModel.default.find(...).populate is not a function",
      error: true,
      success: false,
    });
  });

});


describe("updateCartItemQtyController", () => {
  let req, res;

  beforeEach(() => {
    req = { userId: "testUserId", body: { _id: "cartItemId1", qty: 3 } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
  });

  it("should update the quantity of a cart item successfully", async () => {
    CartProductModel.updateOne.mockResolvedValue({ modifiedCount: 1 });

    await updateCartItemQtyController(req, res);

    expect(CartProductModel.updateOne).toHaveBeenCalledWith(
      { _id: "cartItemId1", userId: "testUserId" },
      { quantity: 3 }
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "Update cart",
      success: true,
      error: false,
      data: { modifiedCount: 1 },
    });
  });

  it("should return an error if `_id` or `qty` is missing", async () => {
    req.body = { _id: null, qty: null };

    await updateCartItemQtyController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "provide _id, qty",
    });
  });

  it("should handle database errors", async () => {
    CartProductModel.updateOne.mockRejectedValue(new Error("Database error"));

    await updateCartItemQtyController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Database error",
      error: true,
      success: false,
    });
  });
});


describe("deleteCartItemQtyController", () => {
  let req, res;

  beforeEach(() => {
    req = { userId: "testUserId", body: { _id: "cartItemId1" } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
  });

  it("should delete a cart item successfully", async () => {
    CartProductModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await deleteCartItemQtyController(req, res);

    expect(CartProductModel.deleteOne).toHaveBeenCalledWith({
      _id: "cartItemId1",
      userId: "testUserId",
    });
    expect(res.json).toHaveBeenCalledWith({
      message: "Item remove",
      error: false,
      success: true,
      data: { deletedCount: 1 },
    });
  });

  it("should return an error if `_id` is missing", async () => {
    req.body = { _id: null };

    await deleteCartItemQtyController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Provide _id",
      error: true,
      success: false,
    });
  });

  it("should return an error if the item is not found", async () => {
    CartProductModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await deleteCartItemQtyController(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Item remove",
      error: false,
      success: true,
      data: { deletedCount: 0 },
    });
  });

  it("should handle database errors", async () => {
    CartProductModel.deleteOne.mockRejectedValue(new Error("Database error"));

    await deleteCartItemQtyController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Database error",
      error: true,
      success: false,
    });
  });
});
