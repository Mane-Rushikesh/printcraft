import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

import { categories } from "../data/products";
import { getProducts } from "../services/productService";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div id="home">
      <Hero />

      {/* Categories */}

      <section className="section" id="categories">

        <div className="section-heading">

          <div>
            <span>EXPLORE</span>

            <h2>
              What can we print?
            </h2>
          </div>

          <p>
            Professional printing solutions for
            personal and business needs.
          </p>

        </div>

        <div className="category-grid">

          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}

        </div>

      </section>

      {/* Products */}

      <section className="section products-section" id="products">

        <div className="section-heading">

          <div>
            <span>OUR COLLECTION</span>

            <h2>
              Popular Products
            </h2>
          </div>

          <p>
            Quality materials, professional finishing
            and reliable printing.
          </p>

        </div>

       <div className="product-grid">

  {loading ? (
    <p>Loading products...</p>
  ) : products.length === 0 ? (
    <p>No products found.</p>
  ) : (
    products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
      />
    ))
  )}

</div>

      </section>

      {/* About */}

      <section className="about-section" id="about">

        <div>

          <span>WHY PRINTCRAFT?</span>

          <h2>
            Printing that makes
            <br />
            an impression.
          </h2>

          <p>
            We combine quality materials, modern
            printing technology and attention to detail
            to deliver products that represent your
            brand and special moments perfectly.
          </p>

          <a href="#products" className="primary-btn">
            Start Shopping →
          </a>

        </div>

        <div className="about-box">

          <div>
            <strong>01</strong>
            <h3>Premium Quality</h3>
            <p>
              High-quality materials and professional
              finishing.
            </p>
          </div>

          <div>
            <strong>02</strong>
            <h3>Fast Delivery</h3>
            <p>
              Reliable processing and delivery across India.
            </p>
          </div>

          <div>
            <strong>03</strong>
            <h3>Custom Designs</h3>
            <p>
              Create products that match your exact needs.
            </p>
          </div>

        </div>

      </section>

      <Footer />
    </div>
    
  );
}

export default Home;