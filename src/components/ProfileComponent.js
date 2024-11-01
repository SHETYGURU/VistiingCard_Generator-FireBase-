import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { FaTrash, FaDownload, FaShareAlt, FaFacebookF, FaTwitter, FaWhatsapp, FaEnvelope, FaLink, FaTimes } from 'react-icons/fa';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton } from "react-share";
import Navbar from './Navbar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ProfileComponent = () => {
  const [images, setImages] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(null); // State to manage showing share buttons

  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    const userName = localStorage.getItem("username");
    setEmail(userEmail);
    setUsername(userName);

    const fetchImages = async () => {
      const userDocRef = doc(db, "users", userEmail);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setImages(userDoc.data().images || []);
      }
    };
    fetchImages();
  }, [db]);

  const handleDeleteImage = async (imageURL) => {
    try {
      const imageRef = ref(storage, imageURL);
      await deleteObject(imageRef);
      const userDocRef = doc(db, "users", email);
      await updateDoc(userDocRef, { images: arrayRemove(imageURL) });
      setImages((prevImages) => prevImages.filter((img) => img !== imageURL));
      alert("Image deleted successfully.");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
    }
  };

  const handleShareImage = (imageURL) => {
    setShowShareOptions(showShareOptions === imageURL ? null : imageURL);
  };

  const copyToClipboard = (imageURL) => {
    navigator.clipboard.writeText(imageURL);
    alert("Image link copied to clipboard!");
  };

  const handleDownloadImageAsPDF = async (imageURL) => {
    const canvas = await html2canvas(document.getElementById(imageURL));
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 190; // Adjust as needed
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`${username}_visiting_card.pdf`);
  };

  return (
    <div>
            <Navbar />

    
    <div className="flex flex-col items-center p-4">

      <h1 className="text-2xl font-semibold mb-6">Welcome....</h1>
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md text-center mb-8">
        <h2 className="text-xl font-bold">{username}</h2>
        <p className="text-gray-600">{email}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {images.map((imageURL) => (
          <div
            key={imageURL}
            id={imageURL} // Set an id to each image for html2canvas to target
            className="relative w-full h-48 bg-cover bg-center rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
            style={{ backgroundImage: `url(${imageURL})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-60 transition duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
              <button onClick={() => handleDeleteImage(imageURL)} className="text-red-500 mx-2 p-2 bg-white rounded-full hover:text-red-600">
                <FaTrash />
              </button>
              <button onClick={() => handleDownloadImageAsPDF(imageURL)} className="text-blue-500 mx-2 p-2 bg-white rounded-full hover:text-blue-600">
                <FaDownload />
              </button>
              <button onClick={() => handleShareImage(imageURL)} className="text-green-300 mx-2 p-2 bg-white rounded-full hover:text-green-600">
                <FaShareAlt />
              </button>
            </div>

            {/* Centered Share Options */}
            {showShareOptions === imageURL && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                <div className="relative bg-white rounded-lg p-4 shadow-md text-gray-800 w-48">
                  <button
                    onClick={() => setShowShareOptions(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                  <div className="flex justify-around">
                    <FacebookShareButton url={imageURL}>
                      <FaFacebookF size={18} className="text-blue-600" />
                    </FacebookShareButton>
                    <TwitterShareButton url={imageURL}>
                      <FaTwitter size={18} className="text-blue-400" />
                    </TwitterShareButton>
                    <WhatsappShareButton url={imageURL}>
                      <FaWhatsapp size={18} className="text-green-500" />
                    </WhatsappShareButton>
                    <EmailShareButton url={imageURL}>
                      <FaEnvelope size={18} className="text-gray-500" />
                    </EmailShareButton>
                    <button onClick={() => copyToClipboard(imageURL)}>
                      <FaLink size={18} className="text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ProfileComponent;
