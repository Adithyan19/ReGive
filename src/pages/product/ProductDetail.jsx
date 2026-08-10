import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function ProductDetail() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(state?.product || null);

  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/items/${id}`);
          if (!res.ok) throw new Error('Failed to load product');
          const data = await res.json();
          setProduct(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchProduct();
    }
  }, [id, product]);

  if (!product) return <p className="text-center mt-20">Loading product...</p>;



  const handleReport = async (itemId, userId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, userId }),
    });
    if (!res.ok) throw new Error("Failed to report");
    alert("Item and user reported successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to report. Try again.");
  }
};

const handleConfirmOrder = async (itemId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/item/${itemId}/claim`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to claim item");

    alert("Order confirmed! Item status updated.");

    setProduct((prev) => ({ ...prev, status: "claimed" }));
  } catch (err) {
    console.error(err);
    alert("Failed to confirm order. Try again.");
  }
};



  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
<p className="text-gray-500">{product.categoryId?.name || 'Uncategorized'}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {product.imageURL?.length > 0 ? (
                product.imageURL.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i}`}
                    className="rounded-xl w-full h-56 object-cover"
                    onError={(e) =>
                      (e.target.src = 'https://via.placeholder.com/400x300?text=No+Image')
                    }
                  />
                ))
              ) : (
                <img
                  src="https://via.placeholder.com/400x300?text=No+Image"
                  alt="No image"
                  className="rounded-xl w-full h-56 object-cover"
                />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-gray-700 text-lg">{product.description}</p>
                            <p>
  <strong>Donor:</strong> {product.donorId?.displayName || 'Unknown'}
</p>
              <p>
                <strong>Condition:</strong> {product.condition}
              </p>

              <p>
  <strong>Available Until:</strong> {new Date(product.available_until).toISOString().split("T")[0]}
</p>

              <p>
                <strong>Pickup Location:</strong> {product.pickup}
              </p>


<div>
  <strong>Contact:</strong>{" "}
  {product.preferences?.map((pref) => {
    if (pref === "email") return product.donorId?.email;
    if (pref === "phone") return product.donorId?.phone;
    if (pref === "in-person") return `${product.donorId?.email}, ${product.donorId?.phone}`;
    return null;
  }).filter(Boolean).join(", ")}
</div>


              {product.isPaid ? (
                <p className="text-xl font-semibold text-gray-900">₹{product.price}</p>
              ) : (
                <p className="text-xl font-semibold text-green-800">Free</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>




<div className="flex justify-center gap-6 mt-6">
  <Button
    className="bg-amber-700 hover:bg-amber-800 text-white text-lg px-6 py-3 rounded-xl shadow-lg"
    onClick={() => handleReport(product._id, product.donorId?._id)}
  >
    Report
  </Button>

  <Button
    className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-6 py-3 rounded-xl shadow-lg"
    onClick={() => handleConfirmOrder(product._id)}
  >
    Confirm Order
  </Button>
</div>






    </div>
    
  );
}
