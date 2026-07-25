import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useUiStore } from '../../store/ui';
import { addProduct } from '../../lib/seedData';
import type { Category } from '../../types/product';

const CATEGORIES: Category[] = ['T-Shirt', 'Pant', 'Dress', 'Jacket', 'Shoes', 'Bag'];

export default function AddProduct() {
  const navigate = useNavigate();
  const pushToast = useUiStore((s) => s.pushToast);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('0.00');
  const [cost, setCost] = useState('0.00');
  const [stock, setStock] = useState('0');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }

  function handleRemoveImage() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
  }

  function handleSubmit() {
    if (!name.trim()) {
      pushToast('Please enter a product name', 'error');
      return;
    }
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      pushToast('Please enter a valid price', 'error');
      return;
    }
    addProduct({
      name: name.trim(),
      category,
      price: priceNum,
      stock: Number.isNaN(stockNum) ? 0 : stockNum,
      image: imageUrl,
    });
    pushToast('Product added to catalog', 'success');
    navigate('/dashboard/products');
  }

  return (
    <div className="app-shell pb-10">
      <div className="flex items-center gap-3 px-5 pt-6 mb-5">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-warm-white dark:bg-dark-surface flex items-center justify-center shadow-softer">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-semibold flex-1">Add New Product</h1>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <label className="relative w-full aspect-[4/3] rounded-xl3 border-2 border-dashed border-brand-tan/40 bg-warm-white dark:bg-dark-surface flex flex-col items-center justify-center cursor-pointer overflow-hidden">
          <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleFile} />
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveImage();
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <ImagePlus size={28} className="text-text-muted mb-2" />
              <p className="text-sm font-medium">Upload Images</p>
              <p className="text-xs text-text-muted mt-0.5">PNG, JPG up to 5MB</p>
            </>
          )}
        </label>

        <div>
          <p className="text-sm font-medium mb-1.5">Product Name</p>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Linen Shirt - Sand" />
        </div>

        <div>
          <p className="text-sm font-medium mb-1.5">Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full rounded-2xl border border-brand-tan/30 bg-white dark:bg-dark-surface px-4 py-3.5 text-sm outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium mb-1.5">Price</p>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1.5">Cost</p>
            <Input value={cost} onChange={(e) => setCost(e.target.value)} inputMode="decimal" />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-1.5">Stock Quantity</p>
          <Input value={stock} onChange={(e) => setStock(e.target.value)} inputMode="numeric" />
        </div>

        <Button fullWidth onClick={handleSubmit} className="mt-2">
          Add Product
        </Button>
      </div>
    </div>
  );
}
