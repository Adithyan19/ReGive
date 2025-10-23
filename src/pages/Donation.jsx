import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {useAuth} from "../hooks/useAuth"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Donate() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const fileInputRef = useRef(null);
  const [draftTimer, setDraftTimer] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState({});

  const {user} =  useAuth()
  useEffect(() => {
    const draft = localStorage.getItem("donationDraft");
    if (draft) {
      const draftData = JSON.parse(draft);
      Object.keys(draftData).forEach((key) => {
        const element = document.querySelector(`[name="${key}"]`);
        if (element) {
          if (element.type === "checkbox" || element.type === "radio") {
            element.checked = draftData[key] === element.value || draftData[key] === "on";
          } else {
            element.value = draftData[key];
          }
        }
      });
      if (draftData.isPaid === "yes") setIsPaid(true);
    }

    const timer = setInterval(() => saveDraft(), 30000);
    setDraftTimer(timer);
    return () => clearInterval(timer);
  }, []);

  const saveDraft = () => {
    const formData = {};
    document.querySelectorAll('[name]').forEach(el => {
      if (el.type === 'checkbox' || el.type === 'radio') {
        if (el.checked) formData[el.name] = el.value;
      } else {
        formData[el.name] = el.value;
      }
    });
    formData.isPaid = document.querySelector('input[name="isPaid"]:checked')?.value;
    localStorage.setItem("donationDraft", JSON.stringify(formData));
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const newImages = [];
    
    Array.from(files).forEach((file) => {
      if (uploadedImages.length + newImages.length >= 5) {
        alert("Maximum 5 images allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload only image files");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({
          file,
          url: e.target.result,
          id: Date.now() + Math.random(),
        });
        if (newImages.length === files.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const titleErrorRef = useRef(null);
  const descriptionErrorRef = useRef(null);
  const conditionErrorRef = useRef(null);
  const locationErrorRef = useRef(null);

  const validateForm = () => {
    let isValid = true;

    [titleErrorRef, descriptionErrorRef, conditionErrorRef, locationErrorRef].forEach(ref => {
      if (ref.current) ref.current.classList.add("hidden");
    });

    const title = document.getElementById("itemTitle").value.trim();
    if (title.length < 5) {
      if (titleErrorRef.current) titleErrorRef.current.classList.remove("hidden");
      isValid = false;
    }

    const description = document.getElementById("description").value.trim();
    if (description.length < 20) {
      if (descriptionErrorRef.current) descriptionErrorRef.current.classList.remove("hidden");
      isValid = false;
    }

    const condition = document.querySelector('input[name="condition"]:checked');
    if (!condition) {
      if (conditionErrorRef.current) conditionErrorRef.current.classList.remove("hidden");
      isValid = false;
    }

    const location = document.getElementById("location").value;
    if (!location) {
      if (locationErrorRef.current) locationErrorRef.current.classList.remove("hidden");
      isValid = false;
    }

    return isValid;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const submitBtn = document.getElementById("submitBtn");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Posting...";
  submitBtn.disabled = true;

  try {
    const form = document.getElementById("donateForm");
    const formData = new FormData(form);
    
    const category = localStorage.getItem("selectedCategory") || "";
    const subcategory = localStorage.getItem("selectedSubcategory") || "";
    
    if (!category) {
      alert("Please select a category first!");
      return;
    }
    
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    
    const contactMethods = [];
    document.querySelectorAll('input[name="contactMethods"]:checked').forEach(cb => {
      contactMethods.push(cb.value);
    });
    contactMethods.forEach(method => formData.append("contactMethods[]", method));
    formData.append("userId", user.id); 


    uploadedImages.forEach((img) => formData.append("images", img.file));

    console.log(" Sending to:", `${BACKEND_URL}/api/donation/donate`);
    console.log(" FormData contents:", Object.fromEntries(formData));

const token = localStorage.getItem("accessToken");

const res = await fetch(`${BACKEND_URL}/api/donation/donate`, {
  method: "POST",
  body: formData,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});





    const data = await res.json();
    console.log(" Response:", data);
    
    if (res.ok) {
      setShowSuccess(true);
      localStorage.removeItem("donationDraft");
      form.reset();
      setUploadedImages([]);
      setTimeout(() => setShowSuccess(false), 5000);
      alert(" Donation posted successfully!");
    } else {
      alert(" Error: " + (data.message || data.error));
    }
  } catch (err) {
    console.error(" Network Error:", err);
    alert(" Network error: " + err.message);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
};

  const handlePaidChange = (e) => {
    setIsPaid(e.target.value === "yes");
  };

const handlePreview = () => {
  const form = document.getElementById("donateForm");
  const formData = new FormData(form);

  const contactMethods = [];
  document.querySelectorAll('input[name="contactMethods"]:checked').forEach(cb => {
    contactMethods.push(cb.value);
  });

  const data = {
    itemTitle: formData.get("itemTitle"),
    description: formData.get("description"),
    condition: formData.get("condition"),
    location: formData.get("location"),
    availableUntil: formData.get("availableUntil"),
    urgentDonation: formData.get("urgentDonation") ? "Yes" : "No",
    isPaid: formData.get("isPaid"),
    price: formData.get("price"),
    contactMethods,
    images: uploadedImages.map(img => img.url),
  };

  setPreviewData(data);
  setShowPreview(true);
};


  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto mt-36 px-5">
        {}
        <div className="bg-primary text-primary-foreground p-8 rounded-t-xl text-center">
          <h1 className="text-4xl font-bold mb-2.5">Donate a Resource</h1>
          <p className="text-lg opacity-90">Share your unused items with fellow students who need them</p>
        </div>

        
        <form 
          className="bg-card p-10 rounded-b-xl shadow-lg border-2 border-primary border-t-0" 
          id="donateForm" 
          onSubmit={handleSubmit}
        >
          
          {showSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 animate-pulse">
              <strong>Success!</strong> Your resource has been posted successfully. 
              It will be reviewed and made available to other students soon.
            </div>
          )}

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
              <span></span> Basic Information
            </h3>
            
            <div className="mb-6">
              <label htmlFor="itemTitle" className="block text-sm font-medium mb-2 text-foreground">
                Item Title *
              </label>
              <input 
                type="text" 
                id="itemTitle" 
                name="itemTitle"
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent" 
                placeholder="e.g., Engineering Textbooks, Laptop, Study Table" 
                required 
                onBlur={saveDraft}
              />
              <div ref={titleErrorRef} className="error-message hidden mt-1 text-sm text-destructive" id="titleError">
                Please enter a descriptive title (min 5 characters)
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium mb-2 text-foreground">
                Description *
              </label>
              <textarea 
                id="description" 
                name="description"
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-y min-h-[120px]" 
                placeholder="Describe your item in detail. Include brand, model, age, reason for donating, any defects, etc."
                required 
                onBlur={saveDraft}
              />
              <div ref={descriptionErrorRef} className="error-message hidden mt-1 text-sm text-destructive" id="descriptionError">
                Please provide a detailed description (min 20 characters)
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
              <span>📷</span> Photos
            </h3>
            
            <div className="mb-6">
              <div 
                className="image-upload border-2 border-dashed border-input rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors bg-muted/50"
                onClick={handleImageUploadClick}
              >
                <div className="text-4xl mb-3">📷</div>
                <p className="text-lg font-medium mb-1">Click to upload photos or drag and drop</p>
                <p className="text-sm text-muted-foreground">Upload up to 5 photos (JPG, PNG, max 5MB each)</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </div>
              
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img 
                        src={img.url} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
              Item Condition
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: "excellent", value: "excellent", label: "Excellent", desc: "Like new, no wear" },
                { id: "good", value: "good", label: "Good", desc: "Minor wear, fully functional" },
                { id: "fair", value: "fair", label: "Fair", desc: "Noticeable wear, works well" },
                { id: "poor", value: "poor", label: "Poor", desc: "Heavy wear, may need repair" }
              ].map((option) => (
                <label key={option.id} className="condition-option flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                  <input 
                    type="radio" 
                    id={option.id} 
                    name="condition" 
                    value={option.value} 
                    className="mr-3 w-4 h-4 text-primary focus:ring-primary"
                    required
                    onChange={saveDraft}
                  />
                  <div>
                    <strong className="block text-foreground">{option.label}</strong>
                    <small className="text-muted-foreground">{option.desc}</small>
                  </div>
                </label>
              ))}
            </div>
            <div ref={conditionErrorRef} className="error-message hidden mt-2 text-sm text-destructive" id="conditionError">
              Please select the item condition
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
              Location & Availability
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2 text-foreground">
                  Pickup Location *
                </label>
                <select 
                  id="location" 
                  name="location" 
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                  onChange={saveDraft}
                >
                  <option value="">Select Location</option>
                  <option value="TKM Trust Hostel">TKM Trust Hostel</option>
                  <option value="TKM Annex Hostel">TKM Annex Hostel</option>
                  <option value="TKM LH">TKM LH</option>
                  <option value="TKM UGC">TKM UGC</option>
                  <option value="GH">GH</option>
                  <option value="INH">INH</option>
                  <option value="VIJAYA INN">Vijaya Inn</option>
                  <option value="other">Other (specify in notes)</option>
                </select>
                <div ref={locationErrorRef} className="error-message hidden mt-1 text-sm text-destructive" id="locationError">
                  Please select a pickup location
                </div>
              </div>

              <div>
                <label htmlFor="availableUntil" className="block text-sm font-medium mb-2 text-foreground">
                  Available Until
                </label>
                <input 
                  type="date" 
                  id="availableUntil" 
                  name="availableUntil"
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  onChange={saveDraft}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="urgentDonation" 
                  name="urgentDonation"
                  className="sr-only peer"
                  onChange={saveDraft}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <div>
                <strong className="block text-foreground">Urgent Donation</strong>
                <small className="text-muted-foreground">
                  Check this if you need to donate this item quickly (moving out, etc.)
                </small>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
              <span>📞</span> Contact Preferences
            </h3>
            
            <div className="space-y-3 mb-6">
              {[
                { id: "contactEmail", value: "email", label: "Email notifications", defaultChecked: true },
                { id: "contactPhone", value: "phone", label: "Phone/WhatsApp" },
                { id: "contactInPerson", value: "in-person", label: "Meet in person", defaultChecked: true }
              ].map((option) => (
                <label key={option.id} className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                  <input 
                    type="checkbox" 
                    id={option.id} 
                    name="contactMethods" 
                    value={option.value} 
                    defaultChecked={option.defaultChecked}
                    className="mr-3 w-4 h-4 text-primary focus:ring-primary"
                    onChange={saveDraft}
                  />
                  <span className="text-foreground">{option.label}</span>
                </label>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-foreground">Is the item paid?</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="isPaid" 
                    value="yes" 
                    className="mr-2 w-4 h-4 text-primary focus:ring-primary"
                    onChange={handlePaidChange}
                  />
                  <span className="text-foreground">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="isPaid" 
                    value="no" 
                    defaultChecked 
                    className="mr-2 w-4 h-4 text-primary focus:ring-primary"
                    onChange={handlePaidChange}
                  />
                  <span className="text-foreground">No</span>
                </label>
              </div>
            </div>

            {isPaid && (
              <div className="p-4 border border-border rounded-lg bg-muted">
                <label htmlFor="price" className="block text-sm font-medium mb-2 text-foreground">
                  Enter Price (₹):
                </label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  min="1"
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Enter amount"
                  onChange={saveDraft}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t border-border">
<button 
  type="button" 
  onClick={handlePreview}
  className="px-8 py-4 border-2 border-primary bg-card text-primary rounded-lg font-semibold transition-all hover:bg-secondary hover:-translate-y-0.5"
>
  Preview
</button>

            <button 
              type="submit" 
              id="submitBtn"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              Post Donation
            </button>
          </div>
        </form>
      </div>
{showPreview && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-xl relative overflow-y-auto max-h-[90vh]">
      <button 
        onClick={() => setShowPreview(false)} 
        className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
      >
        ×
      </button>
      <h2 className="text-2xl font-bold text-primary mb-4">Preview Your Donation</h2>

      <p><strong>Title:</strong> {previewData.itemTitle}</p>
      <p><strong>Description:</strong> {previewData.description}</p>
      <p><strong>Condition:</strong> {previewData.condition}</p>
      <p><strong>Location:</strong> {previewData.location}</p>
      <p><strong>Available Until:</strong> {previewData.availableUntil || "—"}</p>
      <p><strong>Urgent Donation:</strong> {previewData.urgentDonation}</p>
      <p><strong>Is Paid:</strong> {previewData.isPaid}</p>
      {previewData.isPaid === "yes" && (
        <p><strong>Price:</strong> ₹{previewData.price}</p>
      )}
      <p><strong>Contact Methods:</strong> {previewData.contactMethods?.join(", ")}</p>

      {previewData.images?.length > 0 && (
        <>
          <p className="mt-4 mb-2"><strong>Images:</strong></p>
          <div className="grid grid-cols-2 gap-3">
            {previewData.images.map((img, i) => (
              <img key={i} src={img} alt="preview" className="rounded-lg border border-gray-300" />
            ))}
          </div>
        </>
      )}
    </div>
  </div>
)}

      <Footer />
    </>
  );
}