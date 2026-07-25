import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Chip } from '../../components/ui/Card';

const BRANDS = ['All', 'Élan Studio', 'Nordwood', 'Marlowe & Co', 'Terra Atelier'];
const GENDERS = ['All', 'Men', 'Women', 'Unisex'];
const SORTS = ['Most Recent', 'Popular', 'Price: Low to High'];

export default function FilterSheet() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState('All');
  const [gender, setGender] = useState('All');
  const [sort, setSort] = useState('Popular');
  const [price, setPrice] = useState(75);
  const [rating, setRating] = useState(4);

  return (
    <div className="app-shell px-6 pt-6 pb-8 flex flex-col min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={18} /> Filter
        </button>
        <button
          onClick={() => {
            setBrand('All');
            setGender('All');
            setSort('Popular');
            setPrice(75);
            setRating(1);
          }}
          className="text-sm text-brand-accent font-medium"
        >
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <p className="font-display font-semibold mb-3">Brands</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {BRANDS.map((b) => (
            <Chip key={b} active={brand === b} onClick={() => setBrand(b)}>
              {b}
            </Chip>
          ))}
        </div>

        <p className="font-display font-semibold mb-3">Gender</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {GENDERS.map((g) => (
            <Chip key={g} active={gender === g} onClick={() => setGender(g)}>
              {g}
            </Chip>
          ))}
        </div>

        <p className="font-display font-semibold mb-3">Sort by</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {SORTS.map((s) => (
            <Chip key={s} active={sort === s} onClick={() => setSort(s)}>
              {s}
            </Chip>
          ))}
        </div>

        <div className="flex items-center justify-between mb-2">
          <p className="font-display font-semibold">Pricing Range</p>
          <span className="text-sm text-brand-accent font-semibold tabular">${price}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-brand-accent mb-6"
        />

        <p className="font-display font-semibold mb-3">Reviews</p>
        <div className="flex flex-col gap-2 mb-4">
          {[4, 3, 2, 1].map((r) => (
            <button key={r} onClick={() => setRating(r)} className="flex items-center gap-2 text-sm">
              <span className={rating === r ? 'text-star' : 'text-brand-tan/50'}>{'★'.repeat(5)}</span>
              <span className="text-text-muted">{r} & above</span>
            </button>
          ))}
        </div>
      </div>

      <Button fullWidth onClick={() => navigate(-1)}>
        Apply Filter
      </Button>
    </div>
  );
}
