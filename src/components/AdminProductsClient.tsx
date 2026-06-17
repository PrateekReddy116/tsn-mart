"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { Package, CheckCircle, XCircle, Trash2, Plus } from "lucide-react";

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
  "px-3 py-2.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text3)] text-sm outline-none focus:border-[var(--brand)] transition-colors";

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

  return (
    <div className="space-y-6">

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-blue-500/20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4">
              <Package size={24} className="text-white" />
            </div>
            <div className="text-4xl font-black mb-1">{products.length}</div>
            <div className="text-blue-100 font-medium">Total Products</div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
            <Package size={140} strokeWidth={1} />
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="text-4xl font-black mb-1">{inStock}</div>
            <div className="text-emerald-100 font-medium">In Stock</div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
            <CheckCircle size={140} strokeWidth={1} />
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-gradient-to-br from-rose-500 to-orange-600 shadow-lg shadow-rose-500/20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4">
              <XCircle size={24} className="text-white" />
            </div>
            <div className="text-4xl font-black mb-1">{outOfStock}</div>
            <div className="text-rose-100 font-medium">Out of Stock</div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
            <XCircle size={140} strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* ── Add Product ── */}
      <div className="rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <input
            type="text"
            value={addForm.name}
            onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Product name *"
            className={`${inputCls} sm:col-span-2 lg:col-span-1`}
          />
          <input
            type="number"
            value={addForm.price}
            onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="Price (₹) *"
            min="0"
            className={inputCls}
          />
          <input
            type="number"
            value={addForm.qty}
            onChange={(e) => setAddForm((f) => ({ ...f, qty: e.target.value }))}
            placeholder="Stock qty *"
            min="0"
            className={inputCls}
          />
          <input
            type="text"
            value={addForm.image}
            onChange={(e) => setAddForm((f) => ({ ...f, image: e.target.value }))}
            placeholder="Image URL"
            className={`${inputCls} sm:col-span-2 lg:col-span-1`}
          />
          <select
            value={addForm.category}
            onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}
            className={`${inputCls} cursor-pointer`}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <button
            onClick={addProduct}
            disabled={adding}
            className="w-full text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 active:scale-[.98] bg-[var(--brand)] hover:bg-[var(--brand2)]"
          >
            {adding ? "Adding…" : "+ Add Product"}
          </button>
        </div>
      </div>

      {/* ── Product List ── */}
      <div className="rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">Manage Products</h2>
        <div className="space-y-3">
          {products.length === 0 && (
            <p className="text-sm text-center py-8 text-[var(--text3)]">
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
                className="flex flex-col xl:flex-row gap-4 items-start xl:items-center rounded-xl p-4 bg-[var(--surface2)] border border-[var(--border)]"
              >
                {/* Thumb + status */}
                <div className="flex items-center gap-3 shrink-0 w-full xl:w-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={name}
                    className="w-14 h-14 object-cover rounded-xl p-1 bg-white"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://cdn-icons-png.flaticon.com/512/2674/2674486.png";
                    }}
                  />
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      inStock
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Editable fields */}
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setEdit(p.id, { name: e.target.value })}
                    className={inputCls}
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setEdit(p.id, { price: Number(e.target.value) })}
                    className={inputCls}
                    min="0"
                    placeholder="Price (₹)"
                    title="Price (₹)"
                  />
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setEdit(p.id, { qty: Number(e.target.value) })}
                    className={inputCls}
                    min="0"
                    placeholder="Qty"
                    title="Stock qty"
                  />
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setEdit(p.id, { image: e.target.value })}
                    className={inputCls}
                    placeholder="Image URL"
                  />
                  <select
                    value={category}
                    onChange={(e) => setEdit(p.id, { category: e.target.value })}
                    className={`${inputCls} cursor-pointer`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex w-full xl:w-auto gap-2 shrink-0">
                  <button
                    onClick={() => saveProduct(p)}
                    disabled={saving === p.id}
                    className="flex-1 xl:flex-none text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 active:scale-[.98] bg-[var(--brand)] hover:bg-[var(--brand2)]"
                  >
                    {saving === p.id ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    disabled={deleting === p.id}
                    className="flex-1 xl:flex-none flex items-center justify-center gap-1.5 text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
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
