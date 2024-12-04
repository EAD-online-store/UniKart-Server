import { AddSubCategoryController, getSubCategoryController, updateSubCategoryController, deleteSubCategoryController } from "../controllers/subCategory.controller";
import SubCategoryModel from "../models/subCategory.model";

jest.mock("../models/subCategory.model");

describe("AddSubCategoryController", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {
          name: "Electronics",
          image: "image-url",
          category: ["category-id"],
        },
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      jest.clearAllMocks();
    });
  
    it("should create a subcategory successfully", async () => {
      SubCategoryModel.prototype.save = jest.fn().mockResolvedValue({
        name: "Electronics",
        image: "image-url",
        category: ["category-id"],
      });
  
      await AddSubCategoryController(req, res);
  
      expect(SubCategoryModel.prototype.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Sub Category Created",
        data: expect.any(Object),
        error: false,
        success: true,
      });
    });
  
    it("should return an error if name, image, or category is missing", async () => {
      req.body = {};
      await AddSubCategoryController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cannot read properties of undefined (reading '0')",
        error: true,
        success: false,
      });
    });
  
    it("should handle database errors gracefully", async () => {
      SubCategoryModel.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));
  
      await AddSubCategoryController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
        error: true,
        success: false,
      });
    });
  });

  

  describe("getSubCategoryController", () => {
    let req, res;
  
    beforeEach(() => {
      req = {};
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      jest.clearAllMocks();
    });
  
    it("should fetch subcategories successfully", async () => {
      SubCategoryModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue([
            { name: "Electronics", image: "image-url", category: ["category-id"] },
          ]),
        }),
      });
  
      await getSubCategoryController(req, res);
  
      expect(SubCategoryModel.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Sub Category data",
        data: expect.any(Array),
        error: false,
        success: true,
      });
    });
  
    it("should handle database errors gracefully", async () => {
      SubCategoryModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(new Error("Database error")),
        }),
      });
  
      await getSubCategoryController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
        error: true,
        success: false,
      });
    });
   });

  
  describe("updateSubCategoryController", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {
          _id: "subcategory-id",
          name: "Updated Electronics",
          image: "updated-image-url",
          category: ["updated-category-id"],
        },
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      jest.clearAllMocks();
    });
  
    it("should update the subcategory successfully", async () => {
      SubCategoryModel.findById.mockResolvedValue({ _id: "subcategory-id" });
      SubCategoryModel.findByIdAndUpdate.mockResolvedValue({
        _id: "subcategory-id",
        name: "Updated Electronics",
        image: "updated-image-url",
        category: ["updated-category-id"],
      });
  
      await updateSubCategoryController(req, res);
  
      expect(SubCategoryModel.findById).toHaveBeenCalledWith("subcategory-id");
      expect(SubCategoryModel.findByIdAndUpdate).toHaveBeenCalledWith("subcategory-id", {
        name: "Updated Electronics",
        image: "updated-image-url",
        category: ["updated-category-id"],
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Updated Successfully",
        data: expect.any(Object),
        error: false,
        success: true,
      });
    });
  
    it("should return an error if the subcategory is not found", async () => {
      SubCategoryModel.findById.mockResolvedValue(null);
  
      await updateSubCategoryController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Check your _id",
        error: true,
        success: false,
      });
    });
  
    it("should handle database errors gracefully", async () => {
      SubCategoryModel.findById.mockRejectedValue(new Error("Database error"));
  
      await updateSubCategoryController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
        error: true,
        success: false,
      });
    });
  });

  
  describe("deleteSubCategoryController", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {
          _id: "subcategory-id",
        },
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      jest.clearAllMocks();
    });
  
    it("should delete the subcategory successfully", async () => {
      SubCategoryModel.findByIdAndDelete.mockResolvedValue({
        _id: "subcategory-id",
        name: "Electronics",
        image: "image-url",
        category: ["category-id"],
      });
  
      await deleteSubCategoryController(req, res);
  
      expect(SubCategoryModel.findByIdAndDelete).toHaveBeenCalledWith("subcategory-id");
      expect(res.json).toHaveBeenCalledWith({
        message: "Delete successfully",
        data: expect.any(Object),
        error: false,
        success: true,
      });
    });
  
    it("should handle database errors gracefully", async () => {
      SubCategoryModel.findByIdAndDelete.mockRejectedValue(new Error("Database error"));
  
      await deleteSubCategoryController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
        error: true,
        success: false,
      });
    });
  });
  