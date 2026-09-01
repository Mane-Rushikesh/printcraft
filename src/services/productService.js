const API_URL = "https://printcraft-backend.onrender.com/api";

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return await response.json();
  } catch (error) {
    console.error("Product API Error:", error);
    throw error;
  }
};