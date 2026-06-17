"use client";

import { useState } from "react";
import { Product } from "@/lib/types";

interface Props {
  initialProducts: Product[];
}

const CATEGORIES = [
  { value: "rice",     label: "🌾 Rice & Grains" },
  { value: "dairy",    label: "🥛 Dairy" },
  { value: "bakery",   label: "🍞 Bakery" },
  { value: "personal", label: "🧴 Personal Care" },
  { value: "home",     label: "🏠 Home" },
  { value: "other",    label: "📦 Other" },
];

const inputCls =
  "px-3 py-2.5 rounded-lg text-white placeholder-white/25 text-sm outline-none transition-colors";
const inputStyle = {
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(255,255,255,.08)",
};
const selectStyle = {
  background: "#111318",
  border: "1px solid rgba(255,255,255,.08)",
};

export default function AdminProductsClient({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [saving,   setSaving]   = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [adding,   setAdding]   = useState(false);
  const [addForm,  setAddForm]  = useState({
    name: "", price: "", qty: "", image: "", category: "other",
  });
  const [editMap, setEditMap] = useState<Record<number, Partial<Product>>>({});

  const inStock    = products.filter((p) => p.stock).length;
  const outOfStock = products.filter((p) => !p.stock).length;

  function getEdit(id: number): Partial<Product> {
    return editMap[id] ?? {};
  }
  function setEdit(id: number, patch: Partial<Product>) {
    setEditMap((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }
  function getVal<K extends keyof Product>(p: Product, key: K): Product[K] {
    const edit = getEdit(p.id);
    return key in edit ? (edit[key] as Product[K]) : p[key];
  }

  async function saveProduct(p: Product) {
    setSaving(p.id);
    const edit = getEdit(p.id);
    const qty  = Number(edit.qty ?? p.qty);
    const payload = {
      id:       p.id,
      name:     edit.name     ?? p.name,
      price:    Number(edit.price ?? p.price),
      qty,
      stock:    qty > 0,
      image:    edit.image    ?? p.image,
      category: edit.category ?? p.category,
    };
    try {
      const res  = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { alert(json.error || "Failed to save."); return; }
      setProducts((prev) => prev.map((x) => (x.id === p.id ? json.product : x)));
      setEditMap((prev) => { const n = { ...prev }; delete n[p.id]; return n; });
    } catch {
      alert("Network error — could not save product.");
    } finally {
      setSaving(null);
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      const res  = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) { alert(json.error || "Failed to delete."); return; }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Network error — could not delete product.");
    } finally {
      setDeleting(null);
    }
  }

  async function addProduct() {
    if (!addForm.name.trim())                           { alert("Enter a product name.");   return; }
    if (!addForm.price || isNaN(Number(addForm.price))) { alert("Enter a valid price.");    return; }
    if (!addForm.qty   || isNaN(Number(addForm.qty)))   { alert("Enter a valid quantity."); return; }

    setAdding(true);
    try {
      const payload = {
        name:     addForm.name.trim(),
        price:    Number(addForm.price),
        qty:      Number(addForm.qty),
        image:    addForm.image.trim() || "https://cdn-icons-png.flaticon.com/512/2674/2674486.png",
        category: addForm.category,
      };
      const res  = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { alert(json.error || "Failed to add product."); return; }
      setProducts((prev) => [...prev, json.product]);
      setAddForm({ name: "", price: "", qty: "", image: "", category: "other" });
    } catch {
      alert("Network error — could not add product.");
    } finally {
      setAdding(false);
    }
  }

  const cardStyle = {
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.07)",
  };

  return (
    <div className="space-y-6">

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: "📦", num: products.length, label: "Total Products" },
          { icon: "✅", num: inStock,          label: "In Stock" },
          { icon: "❌", num: outOfStock,       label: "Out of Stock" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5 flex items-center gap-4" style={cardStyle}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <div className="text-2xl font-bold text-white">{s.num}</div>
              <div className="text-sm" style={{ color: "rgba(255,255,255,.4)" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add Product ── */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="text-base font-semibold text-white mb-4">Add New Product</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={addForm.name}
            onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Product name *"
            className={`${inputCls} col-span-2 sm:col-span-1`}
            style={inputStyle}
          />
          <input
            type="number"
            value={addForm.price}
            onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="Price (₹) *"
            min="0"
            className={inputCls}
            style={inputStyle}
          />
          <input
            type="number"
            value={addForm.qty}
            onChange={(e) => setAddForm((f) => ({ ...f, qty: e.target.value }))}
            placeholder="Stock qty *"
            min="0"
            className={inputCls}
            style={inputStyle}
          />
          <input
            type="text"
            value={addForm.image}
            onChange={(e) => setAddForm((f) => ({ ...f, image: e.target.value }))}
            placeholder="Image URL (optional)"
            className={`${inputCls} col-span-2`}
            style={inputStyle}
          />
          <select
            value={addForm.category}
            onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}
            className="px-3 py-2.5 rounded-lg text-white text-sm outline-none"
            style={selectStyle}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <button
            onClick={addProduct}
            disabled={adding}
            className="col-span-2 sm:col-span-1 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 active:scale-[.98]"
            style={{ background: "#1a3c34" }}
          >
            {adding ? "Adding…" : "+ Add Product"}
          </button>
        </div>
      </div>

      {/* ── Product List ── */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="text-base font-semibold text-white mb-4">Manage Products</h2>
        <div className="space-y-3">
          {products.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: "rgba(255,255,255,.25)" }}>
              No products yet. Add one above.
            </p>
          )}
          {products.map((p) => {
            const name     = getVal(p, "name")     as string;
            const price    = getVal(p, "price")    as number;
            const qty      = getVal(p, "qty")      as number;
            const image    = getVal(p, "image")    as string;
            const category = getVal(p, "category") as string;
            const inStock  = Number(qty) > 0;

            return (
              <div
                key={p.id}
                className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-3 items-center rounded-xl p-4"
                style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)" }}
              >
                {/* Thumb + status */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={name}
                    className="w-14 h-14 object-contain rounded-xl p-1"
                    style={{ background: "rgba(255,255,255,.06)" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://cdn-icons-png.flaticon.com/512/2674/2674486.png";
                    }}
                  />
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={
                      inStock
                        ? { background: "rgba(34,197,94,.15)", color: "#4ade80" }
                        : { background: "rgba(239,68,68,.12)",  color: "rgba(239,68,68,.8)" }
                    }
                  >
                    {inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Editable fields */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setEdit(p.id, { name: e.target.value })}
                    className={`${inputCls} col-span-2 sm:col-span-1`}
                    style={inputStyle}
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setEdit(p.id, { price: Number(e.target.value) })}
                    className={inputCls}
                    style={inputStyle}
                    min="0"
                    placeholder="Price (₹)"
                    title="Price (₹)"
                  />
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setEdit(p.id, { qty: Number(e.target.value) })}
                    className={inputCls}
                    style={inputStyle}
                    min="0"
                    placeholder="Qty"
                    title="Stock qty"
                  />
                  <select
                    value={category}
                    onChange={(e) => setEdit(p.id, { category: e.target.value })}
                    className="px-2 py-2 rounded-lg text-white text-xs outline-none"
                    style={selectStyle}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => saveProduct(p)}
                    disabled={saving === p.id}
                    className="text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 active:scale-[.98]"
                    style={{ background: "#1a3c34" }}
                  >
                    {saving === p.id ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    disabled={deleting === p.id}
                    className="text-sm px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                    style={{ background: "rgba(239,68,68,.12)", color: "rgba(239,68,68,.8)" }}
                    aria-label={`Delete ${p.name}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
