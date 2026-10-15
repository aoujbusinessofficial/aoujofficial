"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  fetchAllAdminProducts,
  createOrUpdateProduct,
  deleteProduct,
  AdminProductInput,
} from "@/services/adminService";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Tag,
  Sparkles,
  AlertTriangle,
  X,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const formatPrice = (amount: number) =>
  `PKR ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [sku, setSku] = useState("");
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categorySlug, setCategorySlug] = useState<"women" | "girls" | "family">("women");
  const [price, setPrice] = useState<number>(4990);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(5490);
  const [stock, setStock] = useState<number>(30);
  const [colorName, setColorName] = useState("Ivory Silk");
  const [colorHex, setColorHex] = useState("#F7F1E8");
  const [fabric, setFabric] = useState("Pure Combed Organic Lawn");
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await fetchAllAdminProducts();
    setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
    if (searchParams.get("action") === "add") {
      setShowAddModal(true);
    }
  }, [searchParams]);

  const resetForm = () => {
    setSku("");
    setSlug("");
    setName("");
    setSubtitle("");
    setCategorySlug("women");
    setPrice(4990);
    setCompareAtPrice(5490);
    setStock(30);
    setColorName("Ivory Silk");
    setColorHex("#F7F1E8");
    setFabric("Pure Combed Organic Lawn");
    setIsNewArrival(true);
    setIsBestSeller(false);
    setIsOnSale(false);
    setImageUrl1("");
    setImageUrl2("");
    setEditingProduct(null);
    setFormError("");
    setFormSuccess("");
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setSku(p.sku);
    setSlug(p.slug || p.id);
    setName(p.name);
    setSubtitle(p.subtitle || "");
    setCategorySlug(p.categorySlug || "women");
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice || 0);
    setStock(p.stock || 20);
    setColorName(p.colorName || "Ivory");
    setColorHex(p.colorHex || "#F7F1E8");
    setFabric(p.fabric || "");
    setIsNewArrival(Boolean(p.isNewArrival));
    setIsBestSeller(Boolean(p.isBestSeller));
    setIsOnSale(Boolean(p.isOnSale));
    setImageUrl1(p.images?.[0] || "");
    setImageUrl2(p.images?.[1] || "");
    setShowAddModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!sku.trim() || !name.trim() || !price) {
      setFormError("SKU, Product Name, and Price are mandatory.");
      return;
    }

    const images: string[] = [];
    if (imageUrl1.trim()) images.push(imageUrl1.trim());
    if (imageUrl2.trim()) images.push(imageUrl2.trim());

    if (images.length === 0) {
      images.push(
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
      );
    }

    setIsSaving(true);
    const result = await createOrUpdateProduct({
      id: editingProduct?.id,
      sku: sku.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: name.trim(),
      subtitle: subtitle.trim(),
      categorySlug,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      colorName,
      colorHex,
      fabric,
      isNewArrival,
      isBestSeller,
      isOnSale,
      images,
    });

    setIsSaving(false);

    if (result.success) {
      setFormSuccess(
        editingProduct ? "Product updated successfully!" : "Product added to catalog successfully!"
      );
      await loadProducts();
      setTimeout(() => {
        setShowAddModal(false);
        resetForm();
      }, 1000);
    } else {
      setFormError(result.error || "Failed to save product in database.");
    }
  };

  const handleToggleSale = async (product: any) => {
    const newSale = !product.isOnSale;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isOnSale: newSale } : p))
    );

    await createOrUpdateProduct({
      id: product.id,
      sku: product.sku,
      slug: product.slug || product.id,
      name: product.name,
      categorySlug: product.categorySlug,
      price: product.price,
      stock: product.stock,
      isOnSale: newSale,
      images: product.images || [],
    });
  };

  const handleDelete = async (productId: string) => {
    const ok = await deleteProduct(productId);
    if (ok) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setDeleteConfirmId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === "ALL" ||
      p.categorySlug?.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.fabric?.toLowerCase().includes(q);

    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8C9B6] pb-5">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#907553] font-semibold mb-1">
            CATALOG &amp; MERCHANDISING
          </p>
          <h1
            className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase tracking-wide"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Product Management
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#151007] text-[#FAF7F2] text-xs font-sans uppercase tracking-widest hover:bg-[#3A2E21] transition-all cursor-pointer shadow-sm"
        >
          <Plus size={15} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF7F2] border border-[#D8C9B6] p-4">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          {[
            { id: "ALL", label: "All Items" },
            { id: "women", label: "Women" },
            { id: "girls", label: "Girls" },
            { id: "family", label: "Family" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? "bg-[#151007] text-[#FAF7F2] border-[#151007]"
                  : "bg-[#F7F1E8] text-[#3A2E21] border-[#D8C9B6] hover:border-[#907553]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-3 text-[#3A2E21]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, SKU, fabric..."
            className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2 pl-9 pr-3 text-xs font-sans text-[#151007] focus:outline-none focus:border-[#907553]"
          />
        </div>
      </div>

      {/* Products Grid / Table */}
      <div className="bg-[#FAF7F2] border border-[#D8C9B6] overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs font-sans text-[#3A2E21]/70">
            Loading products from database...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Package size={32} className="mx-auto text-[#907553]" strokeWidth={1.5} />
            <p className="text-sm font-sans font-medium text-[#151007]">No Products Found</p>
            <p className="text-xs font-sans text-[#3A2E21]/70">
              Click &quot;Add New Product&quot; to publish your first design.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F7F1E8] border-b border-[#D8C9B6] text-[10px] uppercase tracking-wider text-[#3A2E21]">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Sale Mode (Admin Toggle)</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C9B6]/40">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F2EAE0]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 bg-[#D8C9B6] border border-[#D8C9B6] shrink-0 overflow-hidden">
                          {p.images?.[0] ? (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-[#3A2E21]">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#151007] text-[13px]">{p.name}</p>
                          <p className="text-[10px] font-mono text-[#907553]">{p.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 uppercase text-[11px] font-medium text-[#3A2E21]">
                      {p.categorySlug}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#151007]">{formatPrice(p.price)}</p>
                      {p.compareAtPrice && (
                        <p className="text-[10px] text-[#3A2E21]/60 line-through">
                          {formatPrice(p.compareAtPrice)}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`font-medium ${
                          p.stock < 10 ? "text-amber-800" : "text-[#151007]"
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleSale(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                          p.isOnSale
                            ? "bg-red-50 text-red-700 border-red-300"
                            : "bg-[#F7F1E8] text-[#3A2E21]/70 border-[#D8C9B6]"
                        }`}
                        title="Click to toggle sale on/off"
                      >
                        <Tag size={11} />
                        <span>{p.isOnSale ? "ON SALE" : "REGULAR"}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {p.isNewArrival && (
                          <span className="px-1.5 py-0.5 bg-[#FAF7F2] border border-[#D8C9B6] text-[9px] uppercase tracking-wider font-medium text-[#151007]">
                            NEW
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="px-1.5 py-0.5 bg-[#907553]/15 text-[#907553] text-[9px] uppercase tracking-wider font-medium">
                            BEST
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-[#151007] hover:text-[#907553] hover:bg-[#FAF7F2] border border-[#D8C9B6] cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF7F2] max-w-2xl w-full p-6 sm:p-8 border border-[#D8C9B6] shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#D8C9B6] pb-4">
              <div>
                <p className="text-[10px] uppercase font-sans tracking-widest text-[#907553]">
                  ATELIER MERCHANDISE
                </p>
                <h3
                  className="text-2xl font-serif text-[#151007]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {editingProduct ? `Edit ${editingProduct.name}` : "Create New Product"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-1.5 text-[#3A2E21] hover:text-[#151007] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-sans">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Embroidered Organza Suit"
                    required
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 focus:outline-none focus:border-[#907553]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. AOUJ-W-05"
                    required
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 focus:outline-none focus:border-[#907553]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                    Category *
                  </label>
                  <select
                    value={categorySlug}
                    onChange={(e) =>
                      setCategorySlug(e.target.value as "women" | "girls" | "family")
                    }
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 focus:outline-none focus:border-[#907553]"
                  >
                    <option value="women">Women Collection</option>
                    <option value="girls">Girls Collection</option>
                    <option value="family">Family Collection</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 focus:outline-none focus:border-[#907553]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                    Original / Compare Price
                  </label>
                  <input
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 focus:outline-none focus:border-[#907553]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                    Fabric Type
                  </label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. Pure Organic Combed Lawn"
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 focus:outline-none focus:border-[#907553]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 focus:outline-none focus:border-[#907553]"
                  />
                </div>
              </div>

              {/* Image URLs */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                  Product Image URLs
                </label>
                <input
                  type="url"
                  value={imageUrl1}
                  onChange={(e) => setImageUrl1(e.target.value)}
                  placeholder="Primary Photo URL (e.g. https://images.unsplash.com/...)"
                  className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 focus:outline-none focus:border-[#907553]"
                />
                <input
                  type="url"
                  value={imageUrl2}
                  onChange={(e) => setImageUrl2(e.target.value)}
                  placeholder="Secondary Photo URL (Optional)"
                  className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 focus:outline-none focus:border-[#907553]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-[#F7F1E8] border border-[#D8C9B6]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="accent-[#151007]"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="accent-[#151007]"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOnSale}
                    onChange={(e) => setIsOnSale(e.target.checked)}
                    className="accent-[#907553]"
                  />
                  <span className="font-semibold text-red-800">On Sale</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#D8C9B6] hover:bg-[#F2EAE0]"
                >
                  Cancel
                </button>
                <Button variant="primary" size="sm" type="submit" disabled={isSaving}>
                  {isSaving ? "SAVING TO DATABASE..." : "SAVE PRODUCT"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] max-w-sm w-full p-6 border border-red-300 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 mx-auto flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-lg font-serif font-medium text-[#151007]">
                Delete Product?
              </h4>
              <p className="text-xs font-sans text-[#3A2E21]/80">
                This item will be permanently removed from the storefront catalog and Supabase database.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-[#D8C9B6] text-xs font-sans hover:bg-[#F2EAE0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-700 text-white text-xs font-sans uppercase tracking-wider hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
