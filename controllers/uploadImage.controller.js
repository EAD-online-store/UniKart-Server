import uploadImageClodinary from "../utils/uploadImageClodinary.js";

const uploadImageController = async (request, response) => {
  try {
    const file = request.file;
    console.log("File", file);

    const uploadImage = await uploadImageClodinary(file);

    return response.json({
      message: "Upload done",
      data: uploadImage,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log("Upload Error", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default uploadImageController;