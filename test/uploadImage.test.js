import uploadImageController from "../controllers/uploadImage.controller";
import uploadImageClodinary from "../utils/uploadImageClodinary";

jest.mock("../utils/uploadImageClodinary");

describe("uploadImageController", () => {
  let req, res,req2;

  beforeEach(() => {
    req = {
      file: {
        originalname: "test.jpg",
        buffer: Buffer.from("test file"),
      },
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  it("should successfully upload an image", async () => {
    const mockCloudinaryResponse = {
      url: "http://example.com/test.jpg",
      public_id: "sample_public_id",
    };
    uploadImageClodinary.mockResolvedValue(mockCloudinaryResponse);

    await uploadImageController(req, res);

    expect(uploadImageClodinary).toHaveBeenCalledWith(req.file);
    expect(res.json).toHaveBeenCalledWith({
      message: "Upload done",
      data: mockCloudinaryResponse,
      success: true,
      error: false,
    });
  });

  it("should handle unexpected errors", async () => {
    uploadImageClodinary.mockRejectedValue(new Error("Unexpected error"));

    await uploadImageController(req, res);

    expect(uploadImageClodinary).toHaveBeenCalledWith(req.file);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unexpected error",
      error: true,
      success: false,
    });
  });
});
