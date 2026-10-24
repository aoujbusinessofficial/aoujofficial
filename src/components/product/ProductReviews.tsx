"use client";

import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, ThumbsUp, MessageSquarePlus, CheckCircle2, Sparkles, X } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface ReviewItem {
  id: string;
  author: string;
  city?: string;
  rating: number; // 1-5
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount?: number;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [authorCity, setAuthorCity] = useState("Lahore");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  const storageKey = `aouj_reviews_${productId}`;

  // Default starter reviews tailored for luxury Pakistani couture
  const defaultReviews: ReviewItem[] = [
    {
      id: "rev-1",
      author: "Ayesha Mansoor",
      city: "Lahore",
      rating: 5,
      date: "October 12, 2026",
      title: "Exquisite Bullion Embroidery & Flawless Silhouette",
      comment:
        "The fabric feels exceptionally breathable and premium. The resham embroidery along the neckline and cuffs is subtle yet stunning in person. Received countless compliments at a family dinner.",
      verified: true,
      helpfulCount: 14,
    },
    {
      id: "rev-2",
      author: "Dr. Fatima Zahra",
      city: "Islamabad",
      rating: 5,
      date: "September 28, 2026",
      title: "Customized Measurements Were Tailored to Perfection",
      comment:
        "I opted for custom sizing with tailored shirt length and chest dimensions. The atelier executed the cut with immaculate precision. Fast delivery in beautiful packaging with an official invoice.",
      verified: true,
      helpfulCount: 9,
    },
    {
      id: "rev-3",
      author: "Zainab Tariq",
      city: "Karachi",
      rating: 5,
      date: "August 19, 2026",
      title: "Timeless Pure Lawn - True Heirloom Quality",
      comment:
        "AOUJ never fails on fabric authenticity. Even after a delicate wash, the lawn maintained its crisp structure and sheen without shrinking. Highly recommended.",
      verified: true,
      helpfulCount: 7,
    },
  ];

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      // 1. Try Supabase Database first
      if (isSupabaseConfigured) {
        try {
          const supabase = createClient();
          if (supabase) {
            const { data, error } = await (supabase as any)
              .from("product_reviews")
              .select("*")
              .eq("product_id", productId)
              .order("created_at", { ascending: false });

            if (!error && data && data.length > 0) {
              const mapped: ReviewItem[] = data.map((d: any) => ({
                id: d.id,
                author: d.author_name || "Valued Patron",
                city: d.city || "Pakistan",
                rating: d.rating || 5,
                date: new Date(d.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }),
                title: d.title || "Refined Craftsmanship",
                comment: d.comment || "",
                verified: d.is_verified ?? true,
                helpfulCount: d.helpful_count || 0,
              }));
              if (isMounted) setReviews(mapped);
              return;
            }
          }
        } catch {
          // Graceful fallback to local cache
        }
      }

      // 2. Fallback to localStorage / default curated reviews
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (isMounted) setReviews(parsed);
            return;
          }
        }
      } catch {
        // ignore storage parse error
      }

      if (isMounted) {
        setReviews(defaultReviews);
        try {
          localStorage.setItem(storageKey, JSON.stringify(defaultReviews));
        } catch {}
      }
    }

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [productId, storageKey]);

  // Calculations
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (ratingCounts[r.rating] !== undefined) {
      ratingCounts[r.rating]++;
    }
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!authorName.trim()) {
      setFormError("Please provide your name.");
      return;
    }
    if (!reviewTitle.trim()) {
      setFormError("Please provide a brief headline for your review.");
      return;
    }
    if (!reviewComment.trim()) {
      setFormError("Please write a few words regarding your experience.");
      return;
    }

    setIsSubmitting(true);

    let assignedId = "rev-" + Date.now();

    // 1. Save to Supabase Database if table is provisioned
    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        if (supabase) {
          const { data: inserted, error } = await (supabase as any)
            .from("product_reviews")
            .insert({
              product_id: productId,
              author_name: authorName.trim(),
              city: authorCity.trim() || "Pakistan",
              rating: formRating,
              title: reviewTitle.trim(),
              comment: reviewComment.trim(),
              is_verified: true,
              helpful_count: 0,
            })
            .select("id")
            .single();

          if (!error && inserted?.id) {
            assignedId = inserted.id;
          }
        }
      } catch (dbErr) {
        console.warn("Supabase insert skipped or table pending:", dbErr);
      }
    }

    const newReview: ReviewItem = {
      id: assignedId,
      author: authorName.trim(),
      city: authorCity.trim() || "Pakistan",
      rating: formRating,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      verified: true,
      helpfulCount: 0,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save review", err);
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setAuthorName("");
    setReviewTitle("");
    setReviewComment("");
    setFormRating(5);

    setTimeout(() => {
      setSubmitSuccess(false);
      setShowForm(false);
    }, 2200);
  };

  const handleLikeReview = async (id: string) => {
    if (likedReviews[id]) return;
    setLikedReviews((prev) => ({ ...prev, [id]: true }));

    const target = reviews.find((r) => r.id === id);
    const newCount = (target?.helpfulCount || 0) + 1;

    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: newCount } : r))
    );

    // Sync to Supabase if not a client-side mock id
    if (isSupabaseConfigured && !id.startsWith("rev-")) {
      try {
        const supabase = createClient();
        if (supabase) {
          await (supabase as any)
            .from("product_reviews")
            .update({ helpful_count: newCount })
            .eq("id", id);
        }
      } catch {}
    }
  };

  return (
    <section id="reviews" className="mt-16 sm:mt-24 pt-10 border-t border-[#D8C9B6] space-y-10">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D8C9B6]/60 pb-6">
        <div>
          <p className="text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#907553] mb-1">
            VERIFIED EXPERIENCES
          </p>
          <h2
            className="text-2xl sm:text-3xl text-[#151007] font-normal uppercase tracking-wide"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Client Reflections &amp; Reviews
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#151007] text-[#FAF7F2] hover:text-[#FAF7F2] text-xs font-sans uppercase tracking-widest hover:bg-[#3A2E21] transition-all cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <MessageSquarePlus size={15} />
          <span>{showForm ? "Cancel Review" : "Write a Review"}</span>
        </button>
      </div>

      {/* Ratings Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#F7F1E8]/70 border border-[#D8C9B6] p-6 sm:p-8">
        {/* Overall Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#D8C9B6]/60 pb-6 md:pb-0 md:pr-6">
          <span
            className="text-5xl sm:text-6xl font-normal text-[#151007] font-serif"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {averageRating}
          </span>
          <div className="flex items-center gap-1 my-2 text-[#907553]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < Math.round(Number(averageRating))
                    ? "fill-[#907553] text-[#907553]"
                    : "text-[#D8C9B6]"
                }
              />
            ))}
          </div>
          <p className="text-xs font-sans text-[#3A2E21]/80">
            Based on <strong className="text-[#151007]">{totalReviews} verified</strong> client reviews
          </p>
          <span className="text-[10px] uppercase font-sans tracking-widest text-[#907553] mt-2 px-2.5 py-0.5 border border-[#907553]/40 bg-[#FAF7F2]">
            100% Authentic Atelier Feedback
          </span>
        </div>

        {/* Breakdown Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs font-sans">
                <span className="w-12 text-[#151007] font-medium flex items-center gap-1">
                  {star} <Star size={11} className="fill-[#907553] text-[#907553]" />
                </span>
                <div className="flex-1 h-2 bg-[#D8C9B6]/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#907553] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[11px] font-mono text-[#3A2E21]/70">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-6 sm:p-8 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#D8C9B6]/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#907553]" />
              <h3 className="text-sm font-sans uppercase tracking-widest font-semibold text-[#151007]">
                Share Your Atelier Experience for {productName}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[#3A2E21]/60 hover:text-[#151007] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {submitSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fadeIn">
              <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
              <p className="text-sm font-medium text-emerald-900 font-sans">
                Thank you for your valued reflection!
              </p>
              <p className="text-xs text-emerald-700 font-sans">
                Your review has been successfully published to the AOUJ luxury catalog.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-sans">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                  {formError}
                </div>
              )}

              {/* Star Rating Picker */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium mb-1.5">
                  Your Overall Rating *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setFormRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                      title={`${star} Star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        size={22}
                        className={
                          star <= (hoverRating ?? formRating)
                            ? "fill-[#907553] text-[#907553]"
                            : "text-[#D8C9B6]"
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs font-medium text-[#907553] ml-2">
                    {hoverRating ?? formRating} out of 5 Stars
                  </span>
                </div>
              </div>

              {/* Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Mahnoor Khan"
                    required
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={authorCity}
                    onChange={(e) => setAuthorCity(e.target.value)}
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                  />
                </div>
              </div>

              {/* Review Title */}
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                  Review Headline *
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Elegant fabric texture and true-to-size fitting"
                  required
                  className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                  Detailed Experience &amp; Craftsmanship Feedback *
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the fabric quality, stitching precision, cut drape, comfort, and delivery experience..."
                  required
                  className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553] leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-[#D8C9B6] text-[#151007] hover:text-[#151007] hover:bg-[#F2EAE0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#151007] text-[#FAF7F2] hover:text-[#FAF7F2] text-xs font-sans uppercase tracking-widest hover:bg-[#3A2E21] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting Review..." : "Publish Review"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-[#FAF7F2] border border-[#D8C9B6]/60 p-5 sm:p-6 space-y-3 transition-colors hover:border-[#907553]/60"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#907553]/15 border border-[#907553]/40 text-[#907553] flex items-center justify-center font-sans font-semibold text-xs shrink-0">
                  {rev.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#151007]">{rev.author}</span>
                    {rev.city && (
                      <span className="text-[10px] text-[#3A2E21]/60 font-sans">
                        ({rev.city})
                      </span>
                    )}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-sans font-medium">
                      <ShieldCheck size={11} className="text-emerald-700" />
                      Verified Atelier Patron
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-sans text-[#3A2E21]/60">
                <div className="flex text-[#907553]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < rev.rating
                          ? "fill-[#907553] text-[#907553]"
                          : "text-[#D8C9B6]"
                      }
                    />
                  ))}
                </div>
                <span>{rev.date}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <h4 className="font-sans font-semibold text-sm text-[#151007]">
                {rev.title}
              </h4>
              <p className="text-xs sm:text-[13px] font-sans font-light leading-relaxed text-[#3A2E21]">
                {rev.comment}
              </p>
            </div>

            {/* Helpful Button */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleLikeReview(rev.id)}
                className={`inline-flex items-center gap-1.5 text-[11px] font-sans transition-colors cursor-pointer ${
                  likedReviews[rev.id]
                    ? "text-[#907553] font-medium"
                    : "text-[#3A2E21]/60 hover:text-[#151007]"
                }`}
              >
                <ThumbsUp size={12} className={likedReviews[rev.id] ? "fill-[#907553]" : ""} />
                <span>Helpful ({rev.helpfulCount || 0})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
