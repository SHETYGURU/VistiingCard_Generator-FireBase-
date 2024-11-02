import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton } from "react-share";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaEnvelope, FaLink } from "react-icons/fa"; // Import FaLink for Copy Link
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getFirestore, doc, setDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import firebaseConfig from "./connection_db"; 
import { initializeApp } from "firebase/app";
import Alert from "./Alert";
import Navbar from "./Navbar"
import "../css/Editor.css";
import "../css/template1.css";
import "../css/template2.css";
import "../css/template3.css";
import preview1 from '../assets/design1.PNG';
import preview2 from '../assets/design2.PNG';
import preview3 from '../assets/design3.PNG';
import brandLogo from '../assets/brand.png'; 
import template2Logo from '../assets/brand2.png'; 


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Editor() {
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (message) => {
    setAlertMessage(message);
  };
  const { templateId } = useParams();
  const defaultLogo =
    templateId === "1" ? brandLogo :  template2Logo;
  const [cardDetails, setCardDetails] = useState({
    name: "Your Name",
    position: "Your Position",
    company: "Your Company",
    phone: "+000 777 666 99",
    website: "www.yourweb.com",
    address: "123 street down xt, 43 garden LA",
    email: "Email@info.com",
    logoUrl: defaultLogo, // Set the default logo
  });
  
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Track saving state
  const cardRef = useRef();

  const handleInputChange = (field, value) => {
    setCardDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCardDetails((prevDetails) => ({
        ...prevDetails,
        logoUrl: objectUrl,
      }));
      // Clear previous object URL to avoid memory leak
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const renderTemplate = () => {
    switch (templateId) {
      case "1":
        return (
          <div className="card-template template1" style={{ backgroundImage: `url(${preview1})` }}>
          <img src={cardDetails.logoUrl} alt="Logo" className="logo" />
          <h2 className="name">{cardDetails.name}</h2>
          <p className="position">{cardDetails.position || '\u00A0'}</p>
          <p className="company">{cardDetails.company || '\u00A0'}</p>
          <div className="contact-info">
            <p className="phone">{cardDetails.phone || '\u00A0'}</p>
            <p className="website">{cardDetails.website || '\u00A0'}</p>
            <p className="email">{cardDetails.email || '\u00A0'}</p>
         
            <p className="address">
  {cardDetails.address
    ? cardDetails.address.split(",").map((part, index) => (
        <span key={index}>
          {part.trim()}
          {index < cardDetails.address.split(",").length - 1 && <br />}
        </span>
      ))
    : '\u00A0'}
</p>

      
  </div>
</div>

        );
        case "2":
          return (
            <div className="card-template template2" style={{ backgroundImage: `url(${preview2})` }}>
              <img src={cardDetails.logoUrl} alt="Logo" className="logo" />
              <h2 className="company">{cardDetails.company}</h2>
              <h3 className="name">{cardDetails.name || '\u00A0'}</h3>
              <p className="position">{cardDetails.position || '\u00A0'}</p>
              <div className="contact-info">
                <p>
                  {cardDetails.address
                    ? cardDetails.address.split(",").map((part, index) => (
                        <span key={index}>
                          {part.trim()}
                          {index < cardDetails.address.split(",").length - 1 && <br />}
                        </span>
                      ))
                    : '\u00A0'}
                </p>
                <p>{cardDetails.phone || '\u00A0'}</p>
                <p>{cardDetails.website || '\u00A0'}</p>
                <p>{cardDetails.email || '\u00A0'}</p>
              </div>
            </div>
          );
        
      case "3":
        return (
          <div className="card-template template3" style={{ backgroundImage: `url(${preview3})` }}>
            <h2 className="name">{cardDetails.name}</h2>
            <p className="position">{cardDetails.position || '\u00A0'}</p>
            <h3 className="company">{cardDetails.company || '\u00A0'}</h3>
            <img src={cardDetails.logoUrl} alt="Logo" className="logo template3-logo" />
            <div className="contact-info"> 
              <p> {cardDetails.phone || '\u00A0'}</p>
              <p>{cardDetails.website || '\u00A0'}</p>
              <p> {cardDetails.email || '\u00A0'}</p>
              <p > {cardDetails.address || '\u00A0'}</p>
            </div>
          </div>
        );
      default:
        return <p>Template not found</p>;
    }
  };

  const handleSaveAsImage = async () => {
    setIsSaving(true);
    try {
      const cardElement = cardRef.current;
      const canvas = await html2canvas(cardElement);
      const imgData = canvas.toDataURL("image/png");

      const userEmail = localStorage.getItem("email");
      if (!userEmail) {
        showAlert("Failed to save image. Please try again.");
        return;
      }

      const fileName = `visiting_card_${Date.now()}.png`;
      const storage = getStorage(app);
      const storageRef = ref(storage, `visiting_cards/${userEmail}/${fileName}`);

      const response = await fetch(imgData);
      const blob = await response.blob();

      const uploadResult = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      const userDocRef = doc(db, "users", userEmail);
      await setDoc(
        userDocRef,
        {
          images: arrayUnion(downloadURL),
        },
        { merge: true }
      );

      localStorage.setItem("savedImageURL", downloadURL);
      alert("Image saved successfully!");
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    const canvas = await html2canvas(cardRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 180, 160);
    pdf.save("visiting_card.pdf");
  };

  const toggleSharePopup = () => {
    const savedImageURL = localStorage.getItem("savedImageURL");
    if (savedImageURL) {
      setShowSharePopup(!showSharePopup);
    } else {
      alert("Please save the image first to share.");
    }
  };

  const copyToClipboard = () => {
    const savedImageURL = localStorage.getItem("savedImageURL");
    if (savedImageURL) {
      navigator.clipboard.writeText(savedImageURL);
      alert("Link copied to clipboard!");
    } else {
      alert("No image URL found to copy.");
    }
  };

  return (
    <div  style={{ zIndex: 999 }}>
      <Navbar />
    <div className="editor-container">
           

      {isSaving && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          
          <div className="loader"></div>
        </div>
      )}
      <div className="template-preview" ref={cardRef}>
        {renderTemplate()}
      </div>
      
      <div className="editor">
        <h2>Editing Template {templateId}</h2>
        <div className="input-fields">
          <div className="input-group">
            <label>Logo</label>
            <input type="file" onChange={handleFileChange} className="file-input" />
          </div>
          {Object.keys(cardDetails).map(
            (field) =>
              field !== "logoUrl" && (
                <div className="input-group" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input
                    type="text"
                    value={cardDetails[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="text-input"
                  />
                </div>
              )
          )}
         <div className="button-group flex space-x-4 mb-4">
  <button 
    onClick={handleSaveAsImage} 
    className="text-blue-500 bg-white py-2 px-4 rounded-md shadow-md hover:text-blue-600 hover:shadow-lg transition"
  >
    Save
  </button>
  <button 
    onClick={handleDownloadPDF} 
    className="text-green-500 bg-white py-2 px-4 rounded-md shadow-md hover:text-green-600 hover:shadow-lg transition"
  >
    Download
  </button>
  <button 
    onClick={toggleSharePopup} 
    className="text-indigo-500 bg-white py-2 px-4 rounded-md shadow-md hover:text-indigo-600 hover:shadow-lg transition"
  >
    Share
  </button>
</div>

        </div>
        {showSharePopup && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center transition-opacity duration-300 ease-out animate-fadeIn">
            <div className="bg-white rounded-lg p-6 shadow-xl w-3/4 max-w-sm mx-auto">
              <h3 className="text-lg font-semibold mb-4">Share via</h3>
              <div className="share-buttons flex gap-4 justify-center">
                <FacebookShareButton url={localStorage.getItem("savedImageURL")}><FaFacebookF size={24} className="text-blue-600" /></FacebookShareButton>
                <TwitterShareButton url={localStorage.getItem("savedImageURL")}><FaTwitter size={24} className="text-blue-400" /></TwitterShareButton>
                <WhatsappShareButton url={localStorage.getItem("savedImageURL")}><FaWhatsapp size={24} className="text-green-500" /></WhatsappShareButton>
                <EmailShareButton url={localStorage.getItem("savedImageURL")}><FaEnvelope size={24} className="text-gray-500" /></EmailShareButton>
                <button onClick={copyToClipboard}><FaLink size={24} className="text-gray-700" /></button>
              </div>
              <button onClick={() => setShowSharePopup(false)} className="mt-4 text-sm text-red-500">Close</button>
            </div>
          </div>
        )}
      </div>
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage("")} />}

    </div>
    </div>

  );
}

export default Editor;
