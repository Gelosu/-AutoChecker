import React, { useState, useEffect } from "react";
import axios from "axios";
import Authenticate from "@/app/Authentication";
import Warning from "@/_Components/Default fix/warning";

const ImageInput1 = ({ onImageSelected }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [retrievedImage, setRetrievedImage] = useState(null);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
  };

  const uploadImage = async (imageData) => {
    try {
      const formData = new FormData();
      formData.append("image", imageData);

      await axios.post("http://localhost:3002/post-test2", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // After posting, trigger the getImage function for the uploaded image
      getImages();
    } catch (error) {
      console.error("Error posting image:", error);
    }
  };

  const getImages = async () => {
    try {
      const response = await axios.get("http://localhost:3002/get-test2", {
        responseType: "arraybuffer",
      });

      const blob = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setRetrievedImage(imageUrl);
    } catch (error) {
      console.error("Error getting image:", error);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      uploadImage(selectedImage);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (retrievedImage) {
      // Process the retrieved image
      onImageSelected(retrievedImage);
    }
  }, [retrievedImage, onImageSelected]);

  return (
    <>
      <Warning />
      <div>
        {/* File input */}
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {/* Display the retrieved image */}
      {retrievedImage && (
        <div>
          <img src={retrievedImage} alt="Retrieved" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </>
  );
};

export default Authenticate(ImageInput1);
