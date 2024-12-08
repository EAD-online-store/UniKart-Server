import { addAddressController, getAddressController, updateAddressController, deleteAddresscontroller } from "../controllers/address.controller";
import AddressModel from "../models/address.model";
import UserModel from "../models/user.model";

jest.mock("../models/address.model");
jest.mock("../models/user.model");

describe("addAddressController", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        userId: "testUserId",
        body: {
          address_line: "123 Main St",
          city: "Springfield",
          state: "IL",
          pincode: "62704",
          country: "USA",
          mobile: "1234567890",
        },
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      jest.clearAllMocks();
    });
  
    it("should create an address successfully", async () => {
      AddressModel.prototype.save = jest.fn().mockResolvedValue({
        _id: "addressId",
        ...req.body,
        userId: req.userId,
      });
      UserModel.findByIdAndUpdate = jest.fn().mockResolvedValue({});
  
      await addAddressController(req, res);
  
      expect(AddressModel.prototype.save).toHaveBeenCalled();
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(req.userId, {
        $push: { address_details: "addressId" },
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Address Created Successfully",
        error: false,
        success: true,
        data: expect.any(Object),
      });
    });
  
    it("should handle database errors gracefully", async () => {
      AddressModel.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));
  
      await addAddressController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
        error: true,
        success: false,
      });
    });
  });
  
  describe("getAddressController", () => {
    let req, res;
  
    beforeEach(() => {
      req = { userId: "testUserId" };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      jest.clearAllMocks();
    });
  
    it("should fetch all addresses for the user", async () => {
      AddressModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          {
            _id: "addressId",
            address_line: "123 Main St",
            city: "Springfield",
            state: "IL",
            pincode: "62704",
            country: "USA",
            mobile: "1234567890",
            userId: "testUserId",
          },
        ]),
      });
  
      await getAddressController(req, res);
  
      expect(AddressModel.find).toHaveBeenCalledWith({ userId: "testUserId" });
      expect(res.json).toHaveBeenCalledWith({
        data: expect.any(Array),
        message: "List of address",
        error: false,
        success: true,
      });
    });
  
    it("should handle database errors gracefully", async () => {
      AddressModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("Database error")),
      });
  
      await getAddressController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
        error: true,
        success: false,
      });
    });
  });
  
  describe("updateAddressController", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        userId: "testUserId",
        body: {
          _id: "addressId",
          address_line: "456 Elm St",
          city: "Shelbyville",
          state: "IN",
          pincode: "46176",
          country: "USA",
          mobile: "0987654321",
        },
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      jest.clearAllMocks();
    });
  
    it("should update the address successfully", async () => {
      AddressModel.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
  
      await updateAddressController(req, res);
  
      expect(AddressModel.updateOne).toHaveBeenCalledWith(
        { _id: "addressId", userId: "testUserId" },
        {
          address_line: "456 Elm St",
          city: "Shelbyville",
          state: "IN",
          country: "USA",
          mobile: "0987654321",
          pincode: "46176",
        }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Address Updated",
        error: false,
        success: true,
        data: { modifiedCount: 1 },
      });
    });
  
    it("should handle database errors gracefully", async () => {
      AddressModel.updateOne = jest.fn().mockRejectedValue(new Error("Database error"));
  
      await updateAddressController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
        error: true,
        success: false,
      });
    });
  });
  

  describe("deleteAddressController", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        userId: "testUserId",
        body: { _id: "addressId" },
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      jest.clearAllMocks();
    });
  
    it("should disable the address successfully", async () => {
      AddressModel.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
  
      await deleteAddresscontroller(req, res);
  
      expect(AddressModel.updateOne).toHaveBeenCalledWith(
        { _id: "addressId", userId: "testUserId" },
        { status: false }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Address remove",
        error: false,
        success: true,
        data: { modifiedCount: 1 },
      });
    });
  
    it("should handle database errors gracefully", async () => {
      AddressModel.updateOne = jest.fn().mockRejectedValue(new Error("Database error"));
  
      await deleteAddresscontroller(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
        error: true,
        success: false,
      });
    });
  });
  