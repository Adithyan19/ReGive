import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuth } from "@/hooks/useAuth";
import MyProducts from "@/pages/MyProducts";

export default function UserProfile() {
  const { user, setUser, fetchWithAuth } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Initialize form when user loads
  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name, email: user.email, phone: user.phone, address: user.address });
    }
  }, [user]);

  // Fetch user's products
  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user) return;

      try {
        const response = await fetchWithAuth("/api/item/my-items");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.items); // store in same state
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchUserItems();
  }, [user]);

  // Handle form changes
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Save user details
  const handleSave = async () => {
    try {
      const response = await fetchWithAuth("/api/user/user-profile", {
        method: "PUT", // MUST match backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // backend must return updated user JSON
        setEditing(false);
        alert("Profile updated successfully");
      } else {
        const err = await response.json();
        console.error(err);
        alert(err.message || "Failed to update user");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  if (!user) return <p className="text-center py-20">Loading user info...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-1 pt-20 transition-all duration-300 px-4 md:px-20">
        <h1 className="text-3xl font-bold text-center text-primary py-10">
          User Profile
        </h1>

        {/* User Details */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">User Details</h2>

          {editing ? (
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Name"
              />
              <input
                type="text"
                name="phone"
                value={editForm.phone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Phone"
              />
              <input
                type="text"
                name="address"
                value={editForm.address}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Address"
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-primary text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Address:</strong> {user.address}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="mt-4 bg-primary text-white px-4 py-2 rounded"
              >
                Edit Details
              </button>
            </div>
          )}
        </section>

        {/* User Products */}
        <MyProducts products={products} setProducts={setProducts} />
      </main>
      <Footer />
    </div>
  );
}
