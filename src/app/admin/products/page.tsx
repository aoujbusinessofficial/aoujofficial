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
  Upload,
  ArrowLeft,
  ArrowRight,
  Star,
  Image as ImageIcon,
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
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("Pure Combed Organic Lawn");
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [saleDiscountPercent, setSaleDiscountPercent] = useState<number>(0);
  const [sizeInventory, setSizeInventory] = useState<Record<string, number>>({});
  
  // Image Upload State (Up to 7 images)
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);

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

  const getAvailableSizesForCategory = (cat: string) => {
    if (cat === "women") {
      return ["Small (S)", "Medium (M)", "Large (L)", "Extra Large (XL)", "Customized Size"];
    } else if (cat === "girls") {
      return [
        "New Born (0-3 Months)",
        "3-6 Months",
        "6-12 Months",
        "1 Year",
        "2-3 Years",
        "3-4 Years",
        "4-5 Years",
        "5-6 Years",
        "7-8 Years",
        "9-10 Years",
        "11-12 Years",
        "Extra Large (Teen XL)",
        "Customized Size",
      ];
    } else {
      return [
        "Mother Small + Daughter 2-3Y",
        "Mother Medium + Daughter 4-5Y",
        "Mother Large + Daughter 7-8Y",
        "Customized Family Sizing",
      ];
    }
  };

  const resetForm = () => {
    setSku("");
    setSlug("");
    setName("");
    setSubtitle("");
    setDescription("");
    setCategorySlug("women");
    setPrice(4990);
    setCompareAtPrice(5490);
    setStock(30);
    setFabric("Pure Combed Organic Lawn");
    setIsNewArrival(true);
    setIsBestSeller(false);
    setIsOnSale(false);
    setSaleDiscountPercent(0);
    setSizeInventory({
      "Small (S)": 5,
      "Medium (M)": 10,
      "Large (L)": 10,
      "Extra Large (XL)": 5,
      "Customized Size": 99,
    });
    setImages([]);
    setNewImageUrl("");
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
    setDescription(p.description || "");
    const cat = p.categorySlug || p.category || "women";
    setCategorySlug(cat);
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice || 0);
    setStock(typeof p.stock === "number" ? p.stock : 20);
    setFabric(p.fabric || "");
    setIsNewArrival(Boolean(p.isNewArrival));
    setIsBestSeller(Boolean(p.isBestSeller));
    setIsOnSale(Boolean(p.isOnSale));
    setSaleDiscountPercent(p.saleDiscountPercent || p.sale_discount_percent || 0);
    
    // Load size inventory or seed default
    const existingInv = p.sizeInventory || p.size_inventory;
    if (existingInv && Object.keys(existingInv).length > 0) {
      setSizeInventory(existingInv);
    } else {
      const defaultSizes = getAvailableSizesForCategory(cat);
      const seeded: Record<string, number> = {};
      defaultSizes.forEach((s) => {
        seeded[s] = Math.max(1, Math.floor((p.stock || 20) / defaultSizes.length));
      });
      setSizeInventory(seeded);
    }

    setImages(p.images && p.images.length > 0 ? [...p.images].slice(0, 7) : []);
    setNewImageUrl("");
    setShowAddModal(true);
  };

  const handleImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 7) {
      setFormError("A maximum of 7 images can be uploaded per product.");
      return;
    }

    setIsUploadingImages(true);
    setFormError("");

    const fileList = Array.from(files).slice(0, 7 - images.length);
    const newImageUrls: string[] = [];

    for (const file of fileList) {
      if (!file.type.startsWith("image/")) continue;
      
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        newImageUrls.push(dataUrl);
      } catch (err) {
        console.error("Error reading file:", err);
      }
    }

    setImages((prev) => [...prev, ...newImageUrls].slice(0, 7));
    setIsUploadingImages(false);
    // Reset file input
    e.target.value = "";
  };

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    if (images.length >= 7) {
      setFormError("Maximum of 7 images reached.");
      return;
    }

    setImages((prev) => [...prev, newImageUrl.trim()].slice(0, 7));
    setNewImageUrl("");
    setFormError("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMakeCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
  };

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!sku.trim() || !name.trim() || !price) {
      setFormError("SKU, Product Name, and Price are mandatory.");
      return;
    }

    if (images.length === 0) {
      setFormError("Please upload or provide at least 1 product image (max 7).");
      return;
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
      description: description.trim(),
      fabric,
      isNewArrival,
      isBestSeller,
      isOnSale,
      saleDiscountPercent: Number(saleDiscountPercent) || 0,
      sizeInventory,
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
      saleDiscountPercent: product.saleDiscountPercent || 0,
      sizeInventory: product.sizeInventory || {},
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
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#151007] text-[#FAF7F2] hover:text-[#FAF7F2] text-xs font-sans uppercase tracking-widest hover:bg-[#3A2E21] transition-all cursor-pointer shadow-sm"
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
                      {p.saleDiscountPercent && p.saleDiscountPercent > 0 ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-[#151007]">
                              {formatPrice(Math.round(p.price * (1 - p.saleDiscountPercent / 100)))}
                            </p>
                            <span className="px-1 py-0.2 text-[9px] font-bold bg-red-100 text-red-800 border border-red-200">
                              {p.saleDiscountPercent}% OFF
                            </span>
                          </div>
                          <p className="text-[10px] text-[#3A2E21]/60 line-through">
                            {formatPrice(p.price)}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-[#151007]">{formatPrice(p.price)}</p>
                          {p.compareAtPrice && (
                            <p className="text-[10px] text-[#3A2E21]/60 line-through">
                              {formatPrice(p.compareAtPrice)}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block font-semibold ${
                            p.stock <= 0
                              ? "text-red-700 bg-red-50 px-1.5 py-0.5 border border-red-200 text-[10px] uppercase tracking-wider"
                              : p.stock < 10
                              ? "text-amber-800"
                              : "text-[#151007]"
                          }`}
                        >
                          {p.stock <= 0 ? "Out of Stock" : `${p.stock} units`}
                        </span>

                        {p.sizeInventory && Object.keys(p.sizeInventory).length > 0 && (
                          <div className="text-[9px] max-w-[140px] leading-tight">
                            {Object.entries(p.sizeInventory).some(([_, qty]) => Number(qty) <= 0) ? (
                              <span className="text-red-700 font-medium">
                                Some sizes OOS (
                                {
                                  Object.entries(p.sizeInventory)
                                    .filter(([_, qty]) => Number(qty) <= 0)
                                    .map(([sz]) => sz.split(" ")[0])
                                    .join(", ")
                                }
                                )
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium">All sizes in stock</span>
                            )}
                          </div>
                        )}
                      </div>
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
                    onChange={(e) => {
                      const newCat = e.target.value as "women" | "girls" | "family";
                      setCategorySlug(newCat);
                      const available = getAvailableSizesForCategory(newCat);
                      setSizeInventory((prev) => {
                        const updated: Record<string, number> = { ...prev };
                        available.forEach((s) => {
                          if (updated[s] === undefined) {
                            updated[s] = 5;
                          }
                        });
                        return updated;
                      });
                    }}
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
                    Total Stock Quantity (Auto-Calculated)
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 focus:outline-none focus:border-[#907553]"
                  />
                </div>
              </div>

              {/* Size-Wise Inventory & Stock Management */}
              <div className="space-y-3 pt-2 border-t border-[#D8C9B6]/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-semibold">
                      Size-Wise Stock Quantity &amp; Availability
                    </label>
                    <p className="text-[11px] text-[#3A2E21]/70">
                      Specify stock per size. Setting quantity to 0 will mark that size as &quot;OUT OF STOCK&quot; on the website.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const available = getAvailableSizesForCategory(categorySlug);
                        const updated = { ...sizeInventory };
                        available.forEach((s) => {
                          updated[s] = 10;
                        });
                        setSizeInventory(updated);
                        setStock(available.length * 10);
                      }}
                      className="text-[10px] uppercase font-sans font-medium px-2 py-1 bg-[#F2EAE0] border border-[#D8C9B6] text-[#907553] hover:border-[#907553] cursor-pointer"
                    >
                      Set 10 Each
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const available = getAvailableSizesForCategory(categorySlug);
                        const updated = { ...sizeInventory };
                        available.forEach((s) => {
                          updated[s] = 0;
                        });
                        setSizeInventory(updated);
                        setStock(0);
                      }}
                      className="text-[10px] uppercase font-sans font-medium px-2 py-1 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 cursor-pointer"
                    >
                      Mark All OOS (0)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F7F1E8] p-3 border border-[#D8C9B6] max-h-56 overflow-y-auto">
                  {getAvailableSizesForCategory(categorySlug).map((sz) => {
                    const currentQty = sizeInventory[sz] ?? 5;
                    const isOos = currentQty <= 0;
                    return (
                      <div
                        key={sz}
                        className={`flex items-center justify-between p-2 border transition-colors ${
                          isOos
                            ? "bg-red-50/70 border-red-300"
                            : "bg-[#FAF7F2] border-[#D8C9B6]"
                        }`}
                      >
                        <div className="flex-1 mr-2 min-w-0">
                          <p className="text-xs font-sans font-medium text-[#151007] truncate">
                            {sz}
                          </p>
                          <span
                            className={`text-[9px] font-sans font-semibold uppercase tracking-wider ${
                              isOos ? "text-red-700 font-bold" : "text-emerald-700"
                            }`}
                          >
                            {isOos ? "● OUT OF STOCK (0)" : `● In Stock: ${currentQty}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <input
                            type="number"
                            min="0"
                            value={currentQty}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              const updated = { ...sizeInventory, [sz]: val };
                              setSizeInventory(updated);
                              const total = Object.values(updated).reduce((acc, c) => acc + (c || 0), 0);
                              setStock(total);
                            }}
                            className="w-16 bg-[#FAF7F2] border border-[#D8C9B6] p-1 text-xs text-center font-mono focus:outline-none focus:border-[#907553]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const nextVal = isOos ? 5 : 0;
                              const updated = { ...sizeInventory, [sz]: nextVal };
                              setSizeInventory(updated);
                              const total = Object.values(updated).reduce((acc, c) => acc + (c || 0), 0);
                              setStock(total);
                            }}
                            className={`text-[9px] px-1.5 py-1 border font-sans uppercase tracking-wider cursor-pointer ${
                              isOos
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                                : "bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                            }`}
                          >
                            {isOos ? "+ Stock" : "Make 0"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                  Product Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed description of the outfit, embroidery craftsmanship, fabric feel, styling recommendations, and wash care..."
                  className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 text-xs font-sans text-[#151007] placeholder-[#3A2E21]/50 focus:outline-none focus:border-[#907553] leading-relaxed"
                />
              </div>

              {/* Product Images Manager (Up to 7 Images) */}
              <div className="space-y-3 pt-2 border-t border-[#D8C9B6]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-semibold">
                      Product Images (Max 7 Photos) *
                    </label>
                    <p className="text-[11px] text-[#3A2E21]/70">
                      First image is the primary cover. Upload up to 7 photos showcasing fabric, cuts, &amp; details.
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 border ${
                    images.length > 0
                      ? "bg-[#F7F1E8] text-[#907553] border-[#907553]"
                      : "bg-red-50 text-red-700 border-red-300"
                  }`}>
                    {images.length} / 7 Uploaded
                  </span>
                </div>

                {/* Upload & Add URL Controls */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-sans font-medium uppercase tracking-wider transition-all cursor-pointer border ${
                    images.length >= 7
                      ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                      : "bg-[#151007] text-[#FAF7F2] border-[#151007] hover:bg-[#907553]"
                  }`}>
                    <Upload size={14} />
                    <span>{isUploadingImages ? "Processing..." : "Upload Photos"}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={images.length >= 7 || isUploadingImages}
                      onChange={handleImageFiles}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      disabled={images.length >= 7}
                      className="flex-1 bg-[#FAF7F2] border border-[#D8C9B6] px-3 py-1.5 text-xs font-sans focus:outline-none focus:border-[#907553]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      disabled={!newImageUrl.trim() || images.length >= 7}
                      className="px-3 py-1.5 text-xs font-sans bg-[#F7F1E8] border border-[#D8C9B6] text-[#151007] hover:bg-[#D8C9B6] disabled:opacity-50 cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Thumbnails Grid (Up to 7 slots) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`group relative aspect-[3/4] bg-[#F2EAE0] border overflow-hidden transition-all ${
                        idx === 0
                          ? "border-[#907553] ring-1 ring-[#907553]"
                          : "border-[#D8C9B6] hover:border-[#907553]"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Product Photo ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />

                      {/* Primary Cover Badge */}
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 bg-[#907553] text-[#FAF7F2] text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 shadow-sm">
                          Cover
                        </div>
                      )}

                      {/* Action Overlays */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1 text-white">
                        <div className="flex justify-between items-center">
                          {idx !== 0 ? (
                            <button
                              type="button"
                              onClick={() => handleMakeCover(idx)}
                              title="Make Cover Image"
                              className="p-1 hover:text-[#D8C9B6] bg-black/40 rounded cursor-pointer"
                            >
                              <Star size={12} />
                            </button>
                          ) : (
                            <span />
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Remove Photo"
                            className="p-1 text-red-300 hover:text-red-100 bg-black/40 rounded cursor-pointer ml-auto"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center text-[10px] bg-black/40 px-1 py-0.5 rounded">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, -1)}
                            className="p-0.5 disabled:opacity-30 hover:text-[#D8C9B6] cursor-pointer"
                            title="Move Left"
                          >
                            <ArrowLeft size={11} />
                          </button>
                          <span className="text-[9px] font-mono">{idx + 1}/7</span>
                          <button
                            type="button"
                            disabled={idx === images.length - 1}
                            onClick={() => handleMoveImage(idx, 1)}
                            className="p-0.5 disabled:opacity-30 hover:text-[#D8C9B6] cursor-pointer"
                            title="Move Right"
                          >
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty Slots Fillers */}
                  {Array.from({ length: Math.max(0, 7 - images.length) }).map((_, emptyIdx) => (
                    <div
                      key={`empty-${emptyIdx}`}
                      className="aspect-[3/4] border border-dashed border-[#D8C9B6] bg-[#FAF7F2]/40 flex flex-col items-center justify-center p-2 text-center text-[#3A2E21]/40"
                    >
                      <ImageIcon size={18} className="opacity-40 mb-1" />
                      <span className="text-[10px] font-sans">
                        Slot {images.length + emptyIdx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sale & Custom Discount Percentage */}
              <div className="space-y-3 p-3.5 bg-[#F7F1E8] border border-[#D8C9B6]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isOnSale}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIsOnSale(checked);
                          if (!checked) setSaleDiscountPercent(0);
                          else if (saleDiscountPercent === 0) setSaleDiscountPercent(20);
                        }}
                        className="accent-[#907553] w-4 h-4"
                      />
                      <span className="font-semibold text-xs uppercase tracking-wider text-red-800">
                        Enable Sale / Discount On This Product
                      </span>
                    </label>
                  </div>
                  {saleDiscountPercent > 0 && (
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-red-100 text-red-800 border border-red-300">
                      {saleDiscountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#D8C9B6]/60">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-[#3A2E21] font-medium">
                      Custom Discount Percentage (% OFF)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={saleDiscountPercent}
                        onChange={(e) => {
                          const val = Math.min(99, Math.max(0, parseInt(e.target.value) || 0));
                          setSaleDiscountPercent(val);
                          setIsOnSale(val > 0);
                        }}
                        placeholder="e.g. 30 or 50"
                        className="w-24 bg-[#FAF7F2] border border-[#D8C9B6] p-1.5 text-xs text-center font-bold focus:outline-none focus:border-[#907553]"
                      />
                      <span className="text-xs font-sans text-[#3A2E21] font-semibold">% OFF</span>

                      <div className="flex items-center gap-1 ml-auto">
                        {[15, 25, 30, 50].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => {
                              setSaleDiscountPercent(pct);
                              setIsOnSale(true);
                            }}
                            className={`px-2 py-1 text-[10px] font-sans border cursor-pointer ${
                              saleDiscountPercent === pct
                                ? "bg-[#907553] text-[#FAF7F2] border-[#907553] font-bold"
                                : "bg-[#FAF7F2] text-[#3A2E21] border-[#D8C9B6] hover:border-[#907553]"
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center text-xs font-sans p-2.5 bg-[#FAF7F2] border border-[#D8C9B6]">
                    {price > 0 && saleDiscountPercent > 0 ? (
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-[#3A2E21]/70 uppercase tracking-wider">
                          Live Price on Client Website:
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-[#151007]">
                            Rs. {Math.round(price * (1 - saleDiscountPercent / 100)).toLocaleString()}
                          </span>
                          <span className="text-xs line-through text-[#3A2E21]/60">
                            Rs. {price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[#3A2E21]/70 text-[11px]">
                        Regular Price: <strong className="text-[#151007]">Rs. {(price || 0).toLocaleString()}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Other Badges */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F7F1E8] border border-[#D8C9B6]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="accent-[#151007]"
                  />
                  <span>New Arrival Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="accent-[#151007]"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#D8C9B6] text-[#151007] hover:text-[#151007] hover:bg-[#F2EAE0] transition-colors cursor-pointer"
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
                className="px-4 py-2 border border-[#D8C9B6] text-xs font-sans text-[#151007] hover:text-[#151007] hover:bg-[#F2EAE0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-700 text-white hover:text-white text-xs font-sans uppercase tracking-wider hover:bg-red-800 transition-colors cursor-pointer"
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
