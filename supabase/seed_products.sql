-- ==============================================================================
-- AOUJ LUXURY FASHION - INITIAL PRODUCTS SEED
-- Run this in Supabase SQL Editor to populate sample products and images.
-- ==============================================================================

DO $$
DECLARE
    women_cat_id UUID;
    girls_cat_id UUID;
    family_cat_id UUID;
    prod_w1 UUID;
    prod_w2 UUID;
    prod_g1 UUID;
    prod_g2 UUID;
    prod_f1 UUID;
    prod_f2 UUID;
BEGIN
    -- Get Category IDs
    SELECT id INTO women_cat_id FROM public.categories WHERE slug = 'women' LIMIT 1;
    SELECT id INTO girls_cat_id FROM public.categories WHERE slug = 'girls' LIMIT 1;
    SELECT id INTO family_cat_id FROM public.categories WHERE slug = 'family' LIMIT 1;

    -- 1. Women: Embroidered Lawn Suit
    INSERT INTO public.products (
        sku, slug, name, subtitle, description, category_id,
        price, compare_at_price, stock, color_name, color_hex, fabric,
        is_new_arrival, is_best_seller, is_on_sale
    ) VALUES (
        'AOUJ-W-01', 'embroidered-lawn-suit', 'Embroidered Lawn Suit',
        '3 Piece Luxury Pret & Chiffon Dupatta',
        'Crafted from premium 100% combed organic lawn, adorned with delicate thread embroidery on the neckline, sleeves, and daman.',
        women_cat_id, 4990, 5490, 45, 'Obsidian Onyx', '#1A1510',
        'Pure Organic Lawn with Chiffon Dupatta', true, true, false
    )
    ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
    RETURNING id INTO prod_w1;

    -- Images for Women 1
    DELETE FROM public.product_images WHERE product_id = prod_w1;
    INSERT INTO public.product_images (product_id, url, display_order, is_primary) VALUES
    (prod_w1, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop', 0, true),
    (prod_w1, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop', 1, false);

    -- 2. Women: Printed Co-Ord Set
    INSERT INTO public.products (
        sku, slug, name, subtitle, description, category_id,
        price, compare_at_price, stock, color_name, color_hex, fabric,
        is_new_arrival, is_best_seller, is_on_sale
    ) VALUES (
        'AOUJ-W-02', 'printed-co-ord-set', 'Printed Co-Ord Set',
        '2 Piece Tunic & Wide-Leg Trousers',
        'Contemporary straight-silhouette tunic featuring minimalist botanical hand-block inspired motifs.',
        women_cat_id, 3990, 4200, 30, 'Cream Petal', '#F7F1E8',
        'Breathable Slub Cotton & Linen Blend', false, true, false
    )
    ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
    RETURNING id INTO prod_w2;

    -- Images for Women 2
    DELETE FROM public.product_images WHERE product_id = prod_w2;
    INSERT INTO public.product_images (product_id, url, display_order, is_primary) VALUES
    (prod_w2, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', 0, true),
    (prod_w2, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop', 1, false);

    -- 3. Girls: Embroidered Gharara Set
    INSERT INTO public.products (
        sku, slug, name, subtitle, description, category_id,
        price, compare_at_price, stock, color_name, color_hex, fabric,
        is_new_arrival, is_best_seller, is_on_sale
    ) VALUES (
        'AOUJ-G-01', 'girls-embroidered-gharara-set', 'Girls Embroidered Gharara Set',
        'Festive 3-Piece for Little Girls (New Born to 15Y)',
        'Traditional two-tiered flared gharara paired with a gold gota-trimmed short kurti and featherlight chiffon dupatta.',
        girls_cat_id, 4290, 4790, 25, 'Pastel Gold', '#907553',
        'Fine Chanderi Cotton with Mulmul Lining', true, true, false
    )
    ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
    RETURNING id INTO prod_g1;

    -- Images for Girls 1
    DELETE FROM public.product_images WHERE product_id = prod_g1;
    INSERT INTO public.product_images (product_id, url, display_order, is_primary) VALUES
    (prod_g1, 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=800&auto=format&fit=crop', 0, true),
    (prod_g1, 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop', 1, false);

    -- 4. Girls: Floral Festive Frock
    INSERT INTO public.products (
        sku, slug, name, subtitle, description, category_id,
        price, compare_at_price, stock, color_name, color_hex, fabric,
        is_new_arrival, is_best_seller, is_on_sale
    ) VALUES (
        'AOUJ-G-02', 'girls-floral-festive-frock', 'Girls Floral Festive Frock',
        'Breathable Festive Dress (Age 0 - 15 Years)',
        'Full-twirl gathered flared frock adorned with artisanal resham floral motifs, delicate puffed sleeves, and matching trousers.',
        girls_cat_id, 3490, 3890, 40, 'Warm Sand', '#DBCEBD',
        '100% Breathable Combed Cotton Voile', false, true, false
    )
    ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
    RETURNING id INTO prod_g2;

    -- Images for Girls 2
    DELETE FROM public.product_images WHERE product_id = prod_g2;
    INSERT INTO public.product_images (product_id, url, display_order, is_primary) VALUES
    (prod_g2, 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop', 0, true),
    (prod_g2, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop', 1, false);

    -- 5. Family: Mother & Daughter Matching Set
    INSERT INTO public.products (
        sku, slug, name, subtitle, description, category_id,
        price, compare_at_price, stock, color_name, color_hex, fabric,
        is_new_arrival, is_best_seller, is_on_sale
    ) VALUES (
        'AOUJ-F-01', 'mother-daughter-festive-set', 'Mother & Daughter Matching Festive Set',
        'Dual Sizes: Mother (S - XL) + Daughter (0 - 15Y)',
        'Harmoniously coordinated two-piece sets for mother and daughter. Tailored from matching handloom textured cotton silk.',
        family_cat_id, 8990, 9990, 20, 'Antique Champagne', '#907553',
        'Textured Cotton-Silk with Organza Inlays', true, true, false
    )
    ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
    RETURNING id INTO prod_f1;

    -- Images for Family 1
    DELETE FROM public.product_images WHERE product_id = prod_f1;
    INSERT INTO public.product_images (product_id, url, display_order, is_primary) VALUES
    (prod_f1, 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop', 0, true),
    (prod_f1, 'https://images.unsplash.com/photo-1609234656388-0ff363383899?q=80&w=800&auto=format&fit=crop', 1, false);

    -- 6. Family: Heirloom Eid Coordinates
    INSERT INTO public.products (
        sku, slug, name, subtitle, description, category_id,
        price, compare_at_price, stock, color_name, color_hex, fabric,
        is_new_arrival, is_best_seller, is_on_sale
    ) VALUES (
        'AOUJ-F-02', 'family-heirloom-eid-coordinates', 'Family Heirloom Eid Coordinates',
        'Generational Keepsake Ensembles',
        'Designed for unforgettable family memories. Exquisitely matched color palettes in ivory silk and golden sand.',
        family_cat_id, 9490, 10500, 15, 'Ivory Silk', '#F7F1E8',
        'Raw Silk Blend with Embroidered Organza Dupattas', true, false, false
    )
    ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price
    RETURNING id INTO prod_f2;

    -- Images for Family 2
    DELETE FROM public.product_images WHERE product_id = prod_f2;
    INSERT INTO public.product_images (product_id, url, display_order, is_primary) VALUES
    (prod_f2, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop', 0, true),
    (prod_f2, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop', 1, false);

    RAISE NOTICE 'AOUJ Products & Images successfully seeded!';
END $$;
