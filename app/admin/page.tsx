'use client'

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "./admin.css";

const STORAGE_KEYS = {
  items: "rental_items",
  customers: "rental_customers",
  rentals: "rental_records",
};

// Secret entry key
const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY;

// Seed data
const INITIAL_ITEMS = [
  {
    name: 'Manual Tent',
    category: 'Tents',
    image_url: '/images/products/tent.jpeg',
    availability: 'available',
    variants: [
      { label: '3-Person', price: 500 },
      { label: '4-Person', price: 600 },
      { label: '6-Person', price: 750 },
      { label: '8-Person', price: 900 },
    ],
    priceFrom: 500,
    priceLabel: 'from LKR 500',
    tag: 'Popular',
    waMessage: "Hi! I'd like to rent a Manual Tent. Could you share availability for my dates?",
    quantity: 12,
    pricePerDay: 500
  },
  {
    name: 'Windproof Gas Stove',
    category: 'Cooking',
    image_url: '/images/products/gas-stove.jpeg',
    availability: 'available',
    price: 250,
    waMessage: "Hi! I'd like to rent a Windproof Gas Stove (LKR 250/day). Is it available?",
    quantity: 8,
    pricePerDay: 250
  },
  {
    name: 'Cooking Set',
    category: 'Cooking',
    image_url: '/images/products/cooking-set.jpeg',
    availability: 'available',
    price: 300,
    waMessage: "Hi! I'd like to rent a Cooking Set (LKR 300/day). Is it available?",
    quantity: 10,
    pricePerDay: 300
  },
  {
    name: 'Hammock',
    category: 'Accessories',
    image_url: '/images/products/hammock.jpeg',
    availability: 'available',
    price: 200,
    waMessage: "Hi! I'd like to rent a Hammock (LKR 200/day). Is it available?",
    quantity: 15,
    pricePerDay: 200
  },
  {
    name: 'Anti Leech Socks',
    category: 'Accessories',
    image_url: '/images/products/anti-leech-socks.jpeg',
    availability: 'available',
    price: 250,
    waMessage: "Hi! I'd like to rent Anti Leech Socks (LKR 250/day). Is it available?",
    quantity: 30,
    pricePerDay: 250
  },
  {
    name: 'Water Bag 3L',
    category: 'Accessories',
    image_url: '/images/products/water-bag.jpeg',
    availability: 'available',
    price: 300,
    waMessage: "Hi! I'd like to rent a Water Bag 3L (LKR 300/day). Is it available?",
    quantity: 20,
    pricePerDay: 300
  },
];

const CATEGORIES = ["Tents", "Cooking", "Accessories", "Other"];

// --- UI Components ---
const Avatar = ({ name, size = 36, bg = "#52796F", color = "#F8F5F0" }: any) => {
  const initials = name?.split(" ").map((w: any) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: size * 0.38, flexShrink: 0 }}>
      {initials}
    </div>
  );
};

const Badge = ({ label, color = "#52796F" }: any) => (
  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 24, background: color + "22", color, fontSize: 11, fontWeight: 700, padding: "0 10px", borderRadius: 100, whiteSpace: "nowrap", textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</span>
);

const Input = ({ label, ...props }: any) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
    <input className="admin-input" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #EDE8E0", fontSize: 14, background: "#fff", color: "#1A1A18", boxSizing: "border-box", outline: "none", transition: 'all 0.2s' }} {...props} />
  </div>
);

const Select = ({ label, children, ...props }: any) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
    <select style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #EDE8E0", fontSize: 14, background: "#fff", color: "#1A1A18", boxSizing: "border-box", outline: 'none' }} {...props}>{children}</select>
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
    <textarea style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #EDE8E0", fontSize: 14, background: "#fff", color: "#1A1A18", boxSizing: "border-box", minHeight: 80, resize: "vertical", outline: 'none' }} {...props} />
  </div>
);

const Btn = ({ children, variant = "primary", onClick, style = {}, disabled, type = "button" }: any) => {
  const styles: any = {
    primary: { background: "#2BCF5B", color: "#F8F5F0", border: "none" },
    secondary: { background: "#F8F5F0", color: "#217536", border: "1px solid #EDE8E0" },
    danger: { background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" },
    success: { background: "#25D366", color: "#fff", border: "none" },
    ghost: { background: "transparent", color: "#6b7280", border: "1px solid #EDE8E0" },
  };
  return (
    <button className="btn-premium" type={type} onClick={onClick} disabled={disabled} style={{ padding: "10px 20px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 6, transition: 'all 0.2s', ...styles[variant], ...style }}>
      {children}
    </button>
  );
};

const Modal = ({ title, onClose, children, width = 560 }: any) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(14,20,16,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16, backdropFilter: 'blur(4px)' }}>
    <div style={{ background: "#F8F5F0", borderRadius: 24, width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.25)", border: '1px solid rgba(27,67,50,0.1)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #EDE8E0", position: 'sticky', top: 0, background: '#F8F5F0', zIndex: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#217536", textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{title}</h3>
        <button onClick={onClose} style={{ background: "#EDE8E0", border: "none", width: 32, height: 32, borderRadius: 10, cursor: "pointer", fontSize: 16, color: "#217536", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      </div>
      <div style={{ padding: "24px" }}>{children}</div>
    </div>
  </div>
);

const emptyItem = { name: "", category: "Tents", quantity: 0, pricePerDay: 0, image_url: null, description: "", variants: [] };
const emptyCustomer = { name: "", phone: "", email: "", address: "", nic: "" };

function AdminPanelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const [items, setItems] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [tab, setTab] = useState("dashboard");
  const [modal, setModal] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [customerSearch, setCustomerSearch] = useState("");
  const [rentalCustSearch, setRentalCustSearch] = useState("");
  const [showCustDropdown, setShowCustDropdown] = useState(false);

  const emptyReview = { name: "", loc: "", rating: 5, text: "" };
  const [reviewForm, setReviewForm] = useState<any>(emptyReview);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [reviewSearch, setReviewSearch] = useState("");

  const emptyBundle = { name: "", description: "", price_label: "", items: [""], has_image: false, sort_order: 0 };
  const [bundleForm, setBundleForm] = useState<any>(emptyBundle);
  const [editBundleId, setEditBundleId] = useState<string | null>(null);

  // Bookings & Availability state
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [availCheckDate, setAvailCheckDate] = useState("");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hasSecretKey = searchParams.get("key") === ADMIN_SECRET_KEY;

  // Form states
  const [itemForm, setItemForm] = useState<any>(emptyItem);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Please upload an image under 5MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `items/${Date.now()}_${safeName}`;
      
      console.log("Uploading to path:", fileName);

      const { data, error } = await supabase.storage
        .from('equipment')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('equipment')
        .getPublicUrl(fileName);
      
      setItemForm((f: any) => ({ ...f, image_url: publicUrl }));
      console.log("Upload successful. Public URL:", publicUrl);
    } catch (err: any) {
      console.error("Supabase Storage Error:", err);
      alert(`Upload failed: ${err.message || "Unknown error"}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVariantImageUpload = async (e: any, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Please upload an image under 5MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `items/${Date.now()}_variant_${safeName}`;

      const { data, error } = await supabase.storage
        .from('equipment')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('equipment')
        .getPublicUrl(fileName);
      
      const arr = [...(itemForm.variants || [])];
      arr[index].image_url = publicUrl;
      setItemForm((f: any) => ({ ...f, variants: arr }));
    } catch (err: any) {
      console.error("Supabase Storage Error:", err);
      alert(`Upload failed: ${err.message || "Unknown error"}`);
    } finally {
      setUploadingImage(false);
    }
  };
  
  const [custForm, setCustForm] = useState<any>(emptyCustomer);
  const [editCustId, setEditCustId] = useState<string | null>(null);

  const [rentalForm, setRentalForm] = useState<any>({ customerId: "", rentDate: "", returnDate: "", notes: "", items: [], advancePaid: 0 });
  const [rentalItemSel, setRentalItemSel] = useState<any>({ itemId: "", qty: 1 });

  const [viewRental, setViewRental] = useState<any>(null);
  const [qtyModal, setQtyModal] = useState<any>(null);
  const [qtyDelta, setQtyDelta] = useState(0);

  // Late return modal states
  const [returnConfirmRental, setReturnConfirmRental] = useState<any>(null);
  const [returnLateDays, setReturnLateDays] = useState<number>(0);
  const [returnLateFee, setReturnLateFee] = useState<number>(0);
  const [returnDateInput, setReturnDateInput] = useState<string>("");

  // Helper calculations for Late Delays and Fees
  const getDailyRate = (r: any) => {
    if (!r || !r.items) return 0;
    return r.items.reduce((s: number, x: any) => s + x.qty * x.pricePerDay, 0);
  };

  const getLateDays = (r: any) => {
    if (!r) return 0;
    if (r.status === 'returned') return r.late_days || r.lateDays || 0;
    const todayStr = new Date().toISOString().split('T')[0];
    if (r.returnDate && r.returnDate < todayStr) {
      const due = new Date(r.returnDate);
      const cur = new Date(todayStr);
      const diffTime = cur.getTime() - due.getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    return 0;
  };

  const getLateFee = (r: any) => {
    if (!r) return 0;
    if (r.status === 'returned') return r.late_fee || r.lateFee || 0;
    return getLateDays(r) * getDailyRate(r);
  };

  const handleReturnDateChange = (newDateStr: string) => {
    setReturnDateInput(newDateStr);
    if (returnConfirmRental && newDateStr >= returnConfirmRental.returnDate) {
      const due = new Date(returnConfirmRental.returnDate);
      const cur = new Date(newDateStr);
      const diffTime = cur.getTime() - due.getTime();
      const calculatedDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setReturnLateDays(calculatedDays);
      setReturnLateFee(calculatedDays * getDailyRate(returnConfirmRental));
    } else {
      setReturnLateDays(0);
      setReturnLateFee(0);
    }
  };

  const confirmReturn = async () => {
    if (!returnConfirmRental) return;

    try {
      const { error } = await supabase.from('rental_records').update({
        status: "returned",
        late_days: returnLateDays,
        late_fee: returnLateFee,
      }).eq('id', returnConfirmRental.id);

      if (error) throw error;

      if (returnConfirmRental.items) {
        for (const ri of returnConfirmRental.items) {
          const invItem = items.find(i => i.id === ri.itemId);
          if (invItem) {
            await supabase.from('rental_items').update({ quantity: invItem.quantity + ri.qty }).eq('id', ri.itemId);
          }
        }
      }
      setReturnConfirmRental(null);
    } catch (e: any) {
      console.error(e);
      alert("Error confirming return: " + e.message);
    }
  };

  // --- Auth & Data Sync ---
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch data if user is logged in OR has secret key access
    if (!user && !hasSecretKey) return;

    const fetchData = async () => {
      const { data: itemsData } = await supabase.from('rental_items').select('*').order('name');
      const { data: customersData } = await supabase.from('rental_customers').select('*').order('name');
      const { data: rentalsData } = await supabase.from('rental_records').select('*').order('id', { ascending: false });
      const { data: reviewsData } = await supabase.from('rental_reviews').select('*').order('created_at', { ascending: false });
      
      if (itemsData) setItems(itemsData);
      if (customersData) setCustomers(customersData);
      if (rentalsData) setRentals(rentalsData);
      if (reviewsData) setReviews(reviewsData);
      const { data: bundlesData } = await supabase.from('rental_bundles').select('*').order('sort_order');
      if (bundlesData) setBundles(bundlesData);
      setDataLoaded(true);
    };

    fetchData();

    const itemsSub = supabase.channel('items_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'rental_items' }, fetchData).subscribe();
    const customersSub = supabase.channel('customers_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'rental_customers' }, fetchData).subscribe();
    const rentalsSub = supabase.channel('rentals_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'rental_records' }, fetchData).subscribe();
    const reviewsSub = supabase.channel('reviews_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'rental_reviews' }, fetchData).subscribe();
    const bundlesSub = supabase.channel('bundles_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'rental_bundles' }, fetchData).subscribe();

    return () => {
      itemsSub.unsubscribe();
      customersSub.unsubscribe();
      rentalsSub.unsubscribe();
      reviewsSub.unsubscribe();
      bundlesSub.unsubscribe();
    };
  }, [user, hasSecretKey]);

  // --- Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPass,
    });
    if (error) setLoginError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const openQtyModal = (item: any) => {
    setQtyModal(item);
    setQtyDelta(0);
  };

  const saveItem = async () => {
    if (!itemForm.name) return alert("Item name is required");
    if (uploadingImage) return alert("Please wait for image upload to complete");
    
    setIsSaving(true);
    try {
      const { id, ...dataToSave } = itemForm;
      if (editItemId) {
        await supabase.from('rental_items').update(dataToSave).eq('id', editItemId);
      } else {
        await supabase.from('rental_items').insert(dataToSave);
      }
      setModal(null);
      setItemForm(emptyItem);
      setEditItemId(null);
    } catch (e) { 
      console.error(e);
      alert("Error saving item. Check console for details."); 
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (confirm("Delete this item?")) await supabase.from('rental_items').delete().eq('id', id);
  };

  const applyQty = async () => {
    const newQty = Math.max(0, qtyModal.quantity + qtyDelta);
    try {
      await supabase.from('rental_items').update({ quantity: newQty }).eq('id', qtyModal.id);
      setQtyModal(null);
    } catch (e) { alert("Error updating stock"); }
  };

  const saveCust = async () => {
    if (!custForm.name || !custForm.phone) return alert("Name and phone are required");
    try {
      const { id, ...dataToSave } = custForm;
      if (editCustId) {
        await supabase.from('rental_customers').update(dataToSave).eq('id', editCustId);
      } else {
        await supabase.from('rental_customers').insert(dataToSave);
      }
      setModal(null);
      setCustForm(emptyCustomer);
      setEditCustId(null);
    } catch (e) { alert("Error saving customer"); }
  };

  const deleteCust = async (id: string) => {
    if (confirm("Delete this customer?")) await supabase.from('rental_customers').delete().eq('id', id);
  };

  const saveRental = async () => {
    if (!rentalForm.customerId || !rentalForm.rentDate || !rentalForm.returnDate || !rentalForm.items.length) return alert("Fill all required fields");
    
    // Validate stock first
    for (const ri of rentalForm.items) {
      const invItem = items.find(i => i.id === ri.itemId);
      if (!invItem || invItem.quantity < ri.qty) {
        return alert(`Insufficient stock for ${ri.itemName}. Available: ${invItem?.quantity || 0}`);
      }
    }

    const cust = customers.find(c => c.id === rentalForm.customerId);
    const days = Math.max(1, Math.ceil((new Date(rentalForm.returnDate).getTime() - new Date(rentalForm.rentDate).getTime()) / 86400000));
    const total = rentalForm.items.reduce((s: number, x: any) => s + x.qty * x.pricePerDay * days, 0);
    
    const record = { 
      customerId: rentalForm.customerId, 
      customerName: cust.name, 
      customerPhone: cust.phone, 
      items: rentalForm.items, 
      rentDate: rentalForm.rentDate, 
      returnDate: rentalForm.returnDate, 
      days, 
      totalAmount: total, 
      status: "active", 
      notes: rentalForm.notes,
      advancepaid: Number(rentalForm.advancePaid || 0)
    };
    
    try {
      const { data, error } = await supabase.from('rental_records').insert(record).select();
      if (error) throw error;

      // Decrease stock
      for (const ri of rentalForm.items) {
        const invItem = items.find(i => i.id === ri.itemId);
        if (invItem) {
          await supabase.from('rental_items').update({ quantity: Math.max(0, invItem.quantity - ri.qty) }).eq('id', ri.itemId);
        }
      }
      setModal(null);
      setRentalForm({ customerId: "", rentDate: "", returnDate: "", notes: "", items: [] });
    } catch (e: any) { 
      console.error(e);
      alert("Error saving rental: " + e.message); 
    }
  };

  const markReturned = async (id: string) => {
    const rental = rentals.find(r => r.id === id);
    if (!rental || rental.status === "returned") return;

    try {
      const { error } = await supabase.from('rental_records').update({ status: "returned" }).eq('id', id);
      if (error) throw error;

      if (rental.items) {
        for (const ri of rental.items) {
          const invItem = items.find(i => i.id === ri.itemId);
          if (invItem) {
            await supabase.from('rental_items').update({ quantity: invItem.quantity + ri.qty }).eq('id', ri.itemId);
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      alert("Error marking as returned: " + e.message);
    }
  };

  const deleteRental = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rental record? This cannot be undone.")) return;
    
    const rental = rentals.find(r => r.id === id);
    if (!rental) return;

    try {
      // If the rental was active, we should restore the stock before deleting
      if (rental.status === "active" && rental.items) {
        for (const ri of rental.items) {
          const invItem = items.find(i => i.id === ri.itemId);
          if (invItem) {
            await supabase.from('rental_items').update({ quantity: invItem.quantity + ri.qty }).eq('id', ri.itemId);
          }
        }
      }
      
      const { error } = await supabase.from('rental_records').delete().eq('id', id);
      if (error) throw error;
    } catch (e: any) {
      console.error(e);
      alert("Error deleting rental: " + e.message);
    }
  };

  const saveReview = async () => {
    if (!reviewForm.name || !reviewForm.text) return alert("Name and Review text are required");
    
    setIsSavingReview(true);
    try {
      const { error } = await supabase.from('rental_reviews').insert({
        name: reviewForm.name,
        loc: reviewForm.loc || 'Panadura',
        rating: reviewForm.rating,
        text: reviewForm.text
      });
      if (error) throw error;
      setModal(null);
      setReviewForm(emptyReview);
    } catch (e) {
      console.error(e);
      alert("Error saving review");
    } finally {
      setIsSavingReview(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (confirm("Delete this review?")) {
      try {
        const { error } = await supabase.from('rental_reviews').delete().eq('id', id);
        if (error) throw error;
      } catch (e) {
        console.error(e);
        alert("Error deleting review");
      }
    }
  };

  const saveBundle = async () => {
    if (!bundleForm.name) return alert("Bundle name is required");
    try {
      const { id, ...dataToSave } = bundleForm;
      dataToSave.items = dataToSave.items.filter((i: string) => i.trim() !== "");
      if (editBundleId) {
        await supabase.from('rental_bundles').update(dataToSave).eq('id', editBundleId);
      } else {
        await supabase.from('rental_bundles').insert(dataToSave);
      }
      setModal(null);
      setBundleForm(emptyBundle);
      setEditBundleId(null);
    } catch (e) { alert("Error saving bundle"); }
  };

  const deleteBundle = async (id: string) => {
    if (confirm("Delete this bundle?")) await supabase.from('rental_bundles').delete().eq('id', id);
  };

  // --- Render Auth States ---
  if (authLoading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#217536", fontSize: 15, background: '#F8F5F0', fontWeight: 600 }}>Authenticating...</div>;
  }

  // SECURITY: If not logged in and secret key is wrong, show nothing/404
  if (!user && !hasSecretKey) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F8F5F0", color: "#217536", textAlign: 'center', padding: 20 }}>
        <h1 style={{ fontSize: 72, margin: 0, opacity: 0.1 }}>404</h1>
        <p style={{ fontWeight: 600, marginTop: -10 }}>The requested page was not found.</p>
        <Btn variant="ghost" onClick={() => router.push("/")} style={{ marginTop: 20 }}>Return Home</Btn>
      </div>
    );
  }

  // If not logged in, show the login form
  if (!user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F8F5F0", padding: 20 }}>
        <div style={{ background: "#fff", padding: 40, borderRadius: 24, width: "100%", maxWidth: 400, boxShadow: "0 20px 40px rgba(0,0,0,0.05)", border: "1px solid #EDE8E0" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 100, height: 100, margin: "0 auto 16px", borderRadius: 24, overflow: 'hidden', border: '1px solid #EDE8E0', background: '#fff' }}>
              <img src="/images/updated logo.jpg" alt="Wild Trail Gear Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#217536", textTransform: 'uppercase', letterSpacing: '-0.03em' }}>Admin Login</h1>
            <p style={{ color: "#84A98C", fontSize: 13, fontWeight: 600, marginTop: 4 }}>Wild Trail Gear Management Console</p>
          </div>
          <form onSubmit={handleLogin}>
            <Input label="Email" type="email" required value={loginEmail} onChange={(e: any) => setLoginEmail(e.target.value)} placeholder="admin@example.com" />
            <Input label="Password" type="password" required value={loginPass} onChange={(e: any) => setLoginPass(e.target.value)} placeholder="••••••••" />
            {loginError && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, marginBottom: 16, border: "1px solid #fecaca" }}>{loginError}</div>}
            <Btn type="submit" style={{ width: "100%", height: 48, fontSize: 15 }}>Enter Management Console</Btn>
          </form>
        </div>
      </div>
    );
  }

  // With secret key access or user authentication, show the admin interface

  if (!dataLoaded) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#217536", fontSize: 15, background: '#F8F5F0', fontWeight: 600 }}>Syncing Trail Cloud...</div>;
  }

  // --- Dashboard Data ---
  // --- Dashboard Data ---
  const activeRentals = rentals.filter(r => r.status === "active").length;
  const today = new Date().toISOString().split('T')[0];
  const overdueCount = rentals.filter(r => r.status === "active" && r.returnDate < today).length;
  const totalRevenue = rentals.reduce((s, r) => s + r.totalAmount + (r.late_fee || r.lateFee || 0), 0);
  const lowStock = items.filter(i => i.quantity < 5).length;
  const sidebarW = 260;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif", background: "#F8F5F0" }}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Sidebar */}
      <aside style={{ 
        width: sidebarW, 
        background: "#074D1F", 
        flexShrink: 0, 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh", 
        position: isMobile ? "fixed" : "sticky", 
        top: 0, 
        height: "100vh",
        left: isMobile && !isSidebarOpen ? -sidebarW : 0,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 101,
        boxShadow: isMobile ? '10px 0 30px rgba(0,0,0,0.2)' : 'none'
      }}>
        <div style={{ padding: "32px 24px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", overflow: 'hidden' }}>
              <img src="/images/updated logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#F8F5F0", lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>WILD TRAIL</div>
              <div style={{ fontSize: 11, color: "#84A98C", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Management</div>
            </div>
            {isMobile && (
              <button 
                onClick={() => setIsSidebarOpen(false)}
                style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: 8, borderRadius: 8, cursor: 'pointer' }}
              >✕</button>
            )}
          </div>
        </div>
        <nav style={{ flex: 1, padding: "0 16px" }}>
          {[
            { id: "dashboard", icon: "◈", label: "Dashboard" },
            { id: "items", icon: "⊞", label: "Inventory" },
            { id: "packages", icon: "▣", label: "Packages" },
            { id: "rentals", icon: "⊟", label: "Rentals" },
            { id: "bookings", icon: "◉", label: "Bookings" },
            { id: "availability", icon: "◎", label: "Availability" },
            { id: "customers", icon: "⊡", label: "Customers" },
            { id: "billing", icon: "⊠", label: "Financials" },
            { id: "reviews", icon: "★", label: "Reviews" },
          ].map(n => (
            <button 
              key={n.id} 
              onClick={() => { setTab(n.id); if (isMobile) setIsSidebarOpen(false); }} 
              className={`sidebar-link ${tab === n.id ? 'active' : ''}`}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", marginBottom: 4, background: tab === n.id ? "#FFFFFF" : "transparent", color: tab === n.id ? "#074D1F" : "#A8B5AB", fontSize: 14, fontWeight: tab === n.id ? 800 : 500, textAlign: "left", transition: "all 0.2s" }}
            >
              <span style={{ fontSize: 18, lineHeight: 1, opacity: tab === n.id ? 1 : 0.6 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(248,245,240,0.08)" }}>
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
             <Avatar name={user?.email || "Admin"} size={28} bg="#217536" />
             <div style={{ fontSize: 12, color: '#F8F5F0', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || "Admin Access"}</div>
          </div>
          {user && (
            <button onClick={handleLogout} style={{ width: '100%', padding: '10px', borderRadius: 12, background: '#FFFFFF', color: '#dc2626', border: 'none', fontSize: 11, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.2s' }}>LOGOUT</button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header className="glass-header" style={{ 
          background: "#fff", 
          borderBottom: "1px solid #EDE8E0", 
          padding: isMobile ? "0 16px" : "0 32px", 
          height: isMobile ? 64 : 72, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          position: "sticky", 
          top: 0, 
          zIndex: 10 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', padding: 0, color: '#217536' }}
              >☰</button>
            )}
            <h1 className="playfair" style={{ margin: 0, fontSize: isMobile ? 16 : 20, fontWeight: 900, color: "#217536", textTransform: 'uppercase', letterSpacing: '-0.03em' }}>{tab.toUpperCase()}</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {tab === "items" && <Btn onClick={() => { setItemForm(emptyItem); setEditItemId(null); setModal("item"); }} style={{ padding: isMobile ? "8px 12px" : "10px 20px" }}>{isMobile ? "+ Add" : "+ New Item"}</Btn>}
            {tab === "customers" && <Btn onClick={() => { setCustForm(emptyCustomer); setEditCustId(null); setModal("customer"); }} style={{ padding: isMobile ? "8px 12px" : "10px 20px" }}>{isMobile ? "+ Add" : "+ New Customer"}</Btn>}
            {tab === "rentals" && <Btn onClick={() => { setRentalForm({ customerId: "", rentDate: "", returnDate: "", notes: "", items: [] }); setRentalCustSearch(""); setShowCustDropdown(false); setModal("rental"); }} style={{ padding: isMobile ? "8px 12px" : "10px 20px" }}>{isMobile ? "+ Add" : "+ New Rental"}</Btn>}
            {tab === "reviews" && <Btn onClick={() => { setReviewForm(emptyReview); setModal("review"); }} style={{ padding: isMobile ? "8px 12px" : "10px 20px" }}>{isMobile ? "+ Add" : "+ New Review"}</Btn>}
            {tab === "packages" && <Btn onClick={() => { setBundleForm(emptyBundle); setEditBundleId(null); setModal("bundle"); }} style={{ padding: isMobile ? "8px 12px" : "10px 20px" }}>{isMobile ? "+ Add" : "+ New Package"}</Btn>}
          </div>
        </header>

        <div style={{ padding: isMobile ? 16 : 32, flex: 1 }}>
          {/* Dashboard */}
          {tab === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(220px, 1fr))", gap: isMobile ? 12 : 20, marginBottom: 32 }}>
                {[
                  { label: "Inventory", value: items.length, color: "#217536" },
                  { label: "Active", value: activeRentals, color: "#52796F" },
                  { label: "Overdue", value: overdueCount, color: "#dc2626" },
                  { label: "Revenue", value: `LKR ${totalRevenue.toLocaleString()}`, color: "#C8651A" },
                ].map(s => (
                  <div key={s.label} className="admin-card" style={{ background: "#fff", borderRadius: 20, padding: isMobile ? "16px" : "24px", border: s.label === "Overdue" && overdueCount > 0 ? "1.5px solid #fecaca" : "1px solid #EDE8E0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", position: 'relative', overflow: 'hidden' }}>
                    {s.label === "Overdue" && overdueCount > 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#dc2626' }} />}
                    <div style={{ fontSize: 10, fontWeight: 700, color: s.label === "Overdue" && overdueCount > 0 ? "#dc2626" : "#84A98C", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</div>
                    <div className="playfair" style={{ fontSize: isMobile ? 18 : 28, fontWeight: 900, color: s.color, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
                <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #EDE8E0", overflow: "hidden" }}>
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid #EDE8E0", fontWeight: 900, fontSize: 15, color: "#217536" }}>RECENT RENTALS</div>
                  {rentals.slice(0, 5).map(r => (
                    <div key={r.id} style={{ padding: "16px 24px", borderBottom: "1px solid #F8F5F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><div style={{ fontWeight: 700 }}>{r.customerName}</div><div style={{ fontSize: 11, color: "#84A98C" }}>{r.rentDate}</div></div>
                      <Badge label={r.status} color={r.status === "active" ? "#217536" : "#25D366"} />
                    </div>
                  ))}
                  {rentals.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: '#84A98C' }}>No rentals found.</div>}
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          {tab === "items" && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: isMobile ? 12 : 20 }}>
              {items.map(item => (
                <div key={item.id} style={{ background: "#fff", borderRadius: 24, border: "1px solid #EDE8E0", overflow: "hidden", display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: isMobile ? 120 : 160, background: item.image_url ? `url("${item.image_url}") center/cover` : "#EDE8E0", position: 'relative' }}>
                    <div style={{ position: "absolute", top: 8, right: 8 }}><Badge label={item.category} color="#217536" /></div>
                  </div>
                  <div style={{ padding: isMobile ? 12 : 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 900, fontSize: isMobile ? 14 : 16, color: "#217536", marginBottom: 6, lineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }}>{item.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", background: '#F8F5F0', padding: isMobile ? 8 : 12, borderRadius: 12, marginBottom: 12 }}>
                      <div><div style={{ fontSize: 8, fontWeight: 800 }}>STOCK</div><div style={{ fontSize: isMobile ? 14 : 18, fontWeight: 900 }}>{item.quantity}</div></div>
                      <div style={{ textAlign: 'right' }}><div style={{ fontSize: 8, fontWeight: 800 }}>PRICE</div><div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 900 }}>LKR {item.pricePerDay}</div></div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 'auto' }}>
                      <Btn onClick={() => openQtyModal(item)} style={{ flex: 1, fontSize: 10, padding: '6px 4px', justifyContent: 'center', background: '#2BCF5B', color: '#FFFFFF', border: 'none' }}>STOCK</Btn>
                      <Btn onClick={() => { setItemForm(item); setEditItemId(item.id); setModal("item"); }} style={{ flex: 1, fontSize: 10, padding: '6px 4px', justifyContent: 'center', background: '#2BCF5B', color: '#FFFFFF', border: 'none' }}>EDIT</Btn>
                      {!isMobile && <Btn variant="danger" onClick={() => deleteItem(item.id)} style={{ padding: '6px 10px' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg></Btn>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "rentals" && (
            <div className="flex flex-col gap-6">
              {/* STATS GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)', gap: 16 }}>
                <div style={{ background: '#fff', border: '1px solid #e6ddd0', borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#7a9288', textTransform: 'uppercase', letterSpacing: 0.5 }}>Active</span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#edf8ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#3a8a4e" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                    </div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#1a2420', lineHeight: 1, marginTop: 8 }}>{activeRentals}</div>
                  <div style={{ fontSize: 12, color: '#7a9288', marginTop: 4 }}><b>Current</b> open rentals</div>
                </div>

                <div style={{ background: overdueCount > 0 ? '#fff1f0' : '#fff', border: overdueCount > 0 ? '1px solid #fecaca' : '1px solid #e6ddd0', borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: overdueCount > 0 ? '#dc2626' : '#7a9288', textTransform: 'uppercase', letterSpacing: 0.5 }}>Overdue</span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: overdueCount > 0 ? '#dc2626' : '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={overdueCount > 0 ? "#fff" : "#7a9288"} strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: overdueCount > 0 ? '#dc2626' : '#1a2420', lineHeight: 1, marginTop: 8 }}>{overdueCount}</div>
                  <div style={{ fontSize: 12, color: overdueCount > 0 ? '#c0392b' : '#7a9288', marginTop: 4 }}>Passed return date</div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e6ddd0', borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#7a9288', textTransform: 'uppercase', letterSpacing: 0.5 }}>Revenue</span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff8ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#b7650a" strokeWidth="2" style={{ width: 16, height: 16 }}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1a2420', lineHeight: 1, marginTop: 8 }}>{totalRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: '#7a9288', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>LKR · Total</div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e6ddd0', borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#7a9288', textTransform: 'uppercase', letterSpacing: 0.5 }}>Items Out</span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eef4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" strokeWidth="2" style={{ width: 16, height: 16 }}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8l-2 4h12l-2-4z"/></svg>
                    </div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#1a2420', lineHeight: 1, marginTop: 8 }}>
                    {rentals.filter(r => r.status === 'active').reduce((acc, r) => acc + r.items.reduce((sum: number, item: any) => sum + item.qty, 0), 0)}
                  </div>
                  <div style={{ fontSize: 12, color: '#7a9288', marginTop: 4 }}>Pieces rented</div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e6ddd0', borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#7a9288', textTransform: 'uppercase', letterSpacing: 0.5 }}>Completed</span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#e6fcf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#0ca678" strokeWidth="2" style={{ width: 16, height: 16 }}><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#1a2420', lineHeight: 1, marginTop: 8 }}>{rentals.filter(r => r.status === 'returned').length}</div>
                  <div style={{ fontSize: 12, color: '#7a9288', marginTop: 4 }}>Returned</div>
                </div>
              </div>

              {/* TABLE CARD */}
              <div style={{ background: '#fff', border: '1px solid #e6ddd0', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f2ede4' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#1a2420' }}>All Rentals</span>
                    <span style={{ fontSize: 12, fontWeight: 600, background: '#edf8ef', color: '#2d6b3c', padding: '4px 10px', borderRadius: 20 }}>{rentals.length} records</span>
                  </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 800 : 'auto' }}>
                    <thead>
                      <tr>
                        <th style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.9, color: '#7a9288', background: '#faf8f4', padding: '12px 24px', textAlign: 'left', borderBottom: '1px solid #f2ede4' }}>Customer</th>
                        <th style={{ minWidth: 220, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.9, color: '#7a9288', background: '#faf8f4', padding: '12px 24px', textAlign: 'left', borderBottom: '1px solid #f2ede4' }}>Gear</th>
                        <th style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.9, color: '#7a9288', background: '#faf8f4', padding: '12px 24px', textAlign: 'left', borderBottom: '1px solid #f2ede4' }}>Rent Date</th>
                        <th style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.9, color: '#7a9288', background: '#faf8f4', padding: '12px 24px', textAlign: 'left', borderBottom: '1px solid #f2ede4' }}>Due Date</th>
                        <th style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.9, color: '#7a9288', background: '#faf8f4', padding: '12px 24px', textAlign: 'center', borderBottom: '1px solid #f2ede4' }}>Days</th>
                        <th style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.9, color: '#7a9288', background: '#faf8f4', padding: '12px 24px', textAlign: 'center', borderBottom: '1px solid #f2ede4' }}>Late Delays</th>
                        <th style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.9, color: '#7a9288', background: '#faf8f4', padding: '12px 24px', textAlign: 'right', borderBottom: '1px solid #f2ede4' }}>Total</th>
                        <th style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.9, color: '#7a9288', background: '#faf8f4', padding: '12px 24px', textAlign: 'center', borderBottom: '1px solid #f2ede4' }}>Status</th>
                        <th style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.9, color: '#7a9288', background: '#faf8f4', padding: '12px 24px', textAlign: 'right', borderBottom: '1px solid #f2ede4' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rentals.map(r => {
                        const isLate = r.status === 'active' && r.returnDate < today;
                        return (
                        <tr key={r.id} style={{ borderBottom: '1px solid #f2ede4', transition: 'background 0.15s', background: isLate ? '#fff5f5' : 'transparent' }} className="hover:bg-[#faf8f4]">
                          <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                              <div style={{ width: 38, height: 38, borderRadius: '50%', background: isLate ? '#fee2e2' : '#edf8ef', border: isLate ? '1.5px solid #fecaca' : '1.5px solid #d4f0db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: isLate ? '#b91c1c' : '#255230', flexShrink: 0 }}>
                                {r.customerName.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: '#1a2420', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.customerName}</div>
                                <div style={{ fontSize: 12, color: '#7a9288', marginTop: 2 }}>#{r.id.toString().slice(-8)}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: 13, color: '#4a5e55', lineHeight: 1.6, whiteSpace: 'nowrap' }}>
                              {r.items.map((x: any, idx: number) => <div key={idx}>{x.itemName} <span style={{ color: '#7a9288', fontSize: 11 }}>x{x.qty}</span></div>)}
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a2420', whiteSpace: 'nowrap' }}>{r.rentDate}</div>
                          </td>
                          <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: isLate ? '#dc2626' : '#1a2420', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                              {r.returnDate}
                              {isLate && <span style={{ background: '#dc2626', color: '#fff', fontSize: 8, padding: '2px 6px', borderRadius: 4 }}>LATE</span>}
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px', verticalAlign: 'middle', textAlign: 'center' }}>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a2420' }}>{r.days}</div>
                          </td>
                          <td style={{ padding: '16px 24px', verticalAlign: 'middle', textAlign: 'center' }}>
                            {(() => {
                              const lDays = getLateDays(r);
                              const lFee = getLateFee(r);
                              if (lDays > 0) {
                                return (
                                  <div>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>
                                      {lDays} {lDays === 1 ? 'day' : 'days'}
                                    </span>
                                    {lFee > 0 && (
                                      <div style={{ fontSize: 11, color: '#7a9288', marginTop: 2 }}>
                                        LKR {lFee.toLocaleString()}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              return <span style={{ color: '#A8B5AB', fontSize: 14 }}>-</span>;
                            })()}
                          </td>
                          <td style={{ padding: '16px 24px', verticalAlign: 'middle', textAlign: 'right' }}>
                            <div style={{ fontSize: 11, color: '#7a9288', fontWeight: 600, marginBottom: 2 }}>LKR</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a2420' }}>
                              {(r.totalAmount + (r.late_fee || r.lateFee || 0)).toLocaleString()}
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px', verticalAlign: 'middle', textAlign: 'center' }}>
                            {r.status === 'active' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: isLate ? '#fee2e2' : '#edf8ef', color: isLate ? '#b91c1c' : '#255230' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: isLate ? '#dc2626' : '#3a8a4e' }}></span>{isLate ? 'Overdue' : 'Active'}
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#f0f4ff', color: '#3b5bdb' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4c6ef5' }}></span>Returned
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                              <button onClick={() => setViewRental(r)} style={{ padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#f2ede4', color: '#4a5e55', transition: 'opacity 0.15s' }} className="hover:opacity-80">Bill</button>
                              {r.status === 'active' && (
                                <button onClick={() => {
                                  const dailyRate = getDailyRate(r);
                                  const calculatedLateDays = getLateDays(r);
                                  const calculatedLateFee = calculatedLateDays * dailyRate;
                                  const todayStr = new Date().toISOString().split('T')[0];
                                  
                                  setReturnConfirmRental(r);
                                  setReturnDateInput(todayStr);
                                  setReturnLateDays(calculatedLateDays);
                                  setReturnLateFee(calculatedLateFee);
                                }} style={{ padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: isLate ? '#dc2626' : '#255230', color: '#fff', transition: 'opacity 0.15s' }} className="hover:opacity-80">Return</button>
                              )}
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Calendar */}
          {tab === "bookings" && (() => {
            // Build a set of booked date strings from active rentals
            const bookedDates = new Set<string>();
            rentals.filter(r => r.status === 'active').forEach(r => {
              const start = new Date(r.rentDate);
              const end = new Date(r.returnDate);
              for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                bookedDates.add(d.toISOString().split('T')[0]);
              }
            });

            const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
            const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
            const monthName = new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long' });
            const today = new Date().toISOString().split('T')[0];

            const calDays: (number | null)[] = [];
            for (let i = 0; i < firstDay; i++) calDays.push(null);
            for (let i = 1; i <= daysInMonth; i++) calDays.push(i);

            return (
              <div className="flex flex-col gap-6">
                <div style={{ background: '#fff', border: '1px solid #e6ddd0', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f2ede4' }}>
                    <button onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); } else setCalendarMonth(calendarMonth - 1); }} style={{ background: '#f2ede4', border: 'none', width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 18, color: '#4a5e55', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#1a2420' }}>{monthName} {calendarYear}</span>
                    <button onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); } else setCalendarMonth(calendarMonth + 1); }} style={{ background: '#f2ede4', border: 'none', width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 18, color: '#4a5e55', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                  </div>
                  <div style={{ padding: 24 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#7a9288', textTransform: 'uppercase', letterSpacing: 0.8, padding: '8px 0' }}>{d}</div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                      {calDays.map((day, idx) => {
                        if (day === null) return <div key={`empty-${idx}`} />;
                        const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isBooked = bookedDates.has(dateStr);
                        const isToday = dateStr === today;
                        return (
                          <div key={idx} style={{
                            textAlign: 'center',
                            padding: isMobile ? '12px 4px' : '18px 8px',
                            borderRadius: 10,
                            fontSize: isMobile ? 16 : 20,
                            fontWeight: isBooked || isToday ? 800 : 500,
                            background: isBooked ? '#dc2626' : isToday ? '#edf8ef' : 'transparent',
                            color: isBooked ? '#fff' : isToday ? '#255230' : '#1a2420',
                            border: isToday && !isBooked ? '2px solid #3a8a4e' : '2px solid transparent',
                            cursor: 'default',
                            position: 'relative',
                          }}>
                            {day}
                            {isBooked && <div style={{ position: 'absolute', bottom: isMobile ? 2 : 4, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: '#fecaca', fontWeight: 600 }}>BOOKED</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ padding: '16px 24px', borderTop: '1px solid #f2ede4', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 14, height: 14, borderRadius: 4, background: '#dc2626' }} /><span style={{ fontSize: 13, color: '#4a5e55', fontWeight: 500 }}>Booked / Active Rental</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 14, height: 14, borderRadius: 4, background: '#edf8ef', border: '2px solid #3a8a4e' }} /><span style={{ fontSize: 13, color: '#4a5e55', fontWeight: 500 }}>Today</span></div>
                  </div>
                </div>

                {/* Active bookings list */}
                <div style={{ background: '#fff', border: '1px solid #e6ddd0', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #f2ede4', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#1a2420' }}>Active Bookings</span>
                    <span style={{ fontSize: 12, fontWeight: 600, background: '#fff1f0', color: '#dc2626', padding: '4px 10px', borderRadius: 20 }}>{rentals.filter(r => r.status === 'active').length} active</span>
                  </div>
                  {rentals.filter(r => r.status === 'active').length === 0 && (
                    <div style={{ padding: 40, textAlign: 'center', color: '#7a9288', fontSize: 14 }}>No active bookings at the moment.</div>
                  )}
                  {rentals.filter(r => r.status === 'active').map(r => (
                    <div key={r.id} style={{ padding: '16px 24px', borderBottom: '1px solid #f2ede4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: '#1a2420' }}>{r.customerName}</div>
                        <div style={{ fontSize: 13, color: '#7a9288', marginTop: 2 }}>{r.items.map((x: any) => x.itemName).join(', ')}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#dc2626' }}>{r.rentDate} → {r.returnDate}</div>
                        <div style={{ fontSize: 12, color: '#7a9288', marginTop: 2 }}>{r.days} days</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Availability Checker */}
          {tab === "availability" && (() => {
            // Calculate which items are available on the selected date
            const getAvailableItems = () => {
              if (!availCheckDate) return items.map(i => ({ ...i, availableQty: i.quantity }));
              const checkDate = new Date(availCheckDate);
              
              // Derive Total Stock (Shop Stock + Currently Out)
              const totalStockMap: Record<string, number> = {};
              items.forEach(i => totalStockMap[i.id] = i.quantity);
              rentals.filter(r => r.status === 'active').forEach(r => {
                r.items.forEach((ri: any) => {
                  totalStockMap[ri.itemId] = (totalStockMap[ri.itemId] || 0) + ri.qty;
                });
              });

              // Calculate Rented Quantity on the specific check date
              const rentedQtyMap: Record<string, number> = {};
              rentals.filter(r => r.status === 'active').forEach(r => {
                const start = new Date(r.rentDate);
                const end = new Date(r.returnDate);
                // Simple date comparison (ignoring time)
                const startStr = start.toISOString().split('T')[0];
                const endStr = end.toISOString().split('T')[0];
                const checkStr = checkDate.toISOString().split('T')[0];

                if (checkStr >= startStr && checkStr <= endStr) {
                  r.items.forEach((ri: any) => {
                    rentedQtyMap[ri.itemId] = (rentedQtyMap[ri.itemId] || 0) + ri.qty;
                  });
                }
              });

              return items.map(i => {
                const total = totalStockMap[i.id] || 0;
                const rented = rentedQtyMap[i.id] || 0;
                return {
                  ...i,
                  rentedQty: rented,
                  availableQty: total - rented,
                };
              });
            };
            const availItems = getAvailableItems();

            return (
              <div className="flex flex-col gap-6">
                <div style={{ background: '#fff', border: '1px solid #e6ddd0', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'flex-end', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#7a9288', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>Check Date</label>
                    <input type="date" value={availCheckDate} onChange={(e) => setAvailCheckDate(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e6ddd0', fontSize: 15, color: '#1a2420', background: '#faf8f4', outline: 'none', fontFamily: 'Outfit, Inter, sans-serif' }} />
                  </div>
                  {availCheckDate && (
                    <button onClick={() => setAvailCheckDate('')} style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid #e6ddd0', background: '#fff', color: '#4a5e55', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Clear</button>
                  )}
                </div>

                {availCheckDate && (
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#7a9288', padding: '0 4px' }}>Showing availability for <b style={{ color: '#1a2420' }}>{availCheckDate}</b></div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                  {availItems.map(item => {
                    const isAvail = item.availableQty > 0;
                    return (
                      <div key={item.id} style={{ background: '#fff', border: `1px solid ${isAvail ? '#e6ddd0' : '#fecaca'}`, borderRadius: 16, overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: 80, height: 80, background: item.image_url ? `url("${item.image_url}") center/cover` : '#f2ede4', flexShrink: 0, borderRight: '1px solid #f2ede4' }} />
                        <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 600, color: '#1a2420' }}>{item.name}</div>
                              <div style={{ fontSize: 12, color: '#7a9288', marginTop: 2 }}>LKR {item.pricePerDay}/day</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              {isAvail ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#edf8ef', color: '#255230' }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3a8a4e' }}></span>{item.availableQty} available
                                </span>
                              ) : (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#fff1f0', color: '#dc2626' }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626' }}></span>Unavailable
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!availCheckDate && (
                  <div style={{ background: '#faf8f4', border: '1px solid #e6ddd0', borderRadius: 16, padding: 40, textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1a2420', marginBottom: 4 }}>Select a date above</div>
                    <div style={{ fontSize: 14, color: '#7a9288' }}>Pick a date to see which gear is available for rental.</div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Customers */}
          {tab === "customers" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: "#fff", borderRadius: 16, padding: "12px 16px", border: "1px solid #EDE8E0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8B5AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search customers by name, phone, or email..." 
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, color: '#217536', background: 'transparent' }}
                />
              </div>
              <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #EDE8E0", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 500 : 'auto' }}>
                  <thead><tr style={{ background: "#F8F5F0" }}>{["NAME", "PHONE", "EMAIL", "NIC", "ADDRESS", "ACTIONS"].map(h => <th key={h} style={{ padding: 16, textAlign: 'left', fontSize: 10, fontWeight: 800, color: "#84A98C" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {customers
                      .filter(c => 
                        c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
                        c.phone.includes(customerSearch) || 
                        (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase())) ||
                        (c.nic && c.nic.toLowerCase().includes(customerSearch.toLowerCase()))
                      )
                      .map(c => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #F8F5F0" }}>
                      <td style={{ padding: 16 }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={c.name} size={32} /><div style={{ fontWeight: 700, fontSize: 14, color: '#217536' }}>{c.name}</div></div></td>
                      <td style={{ padding: 16, fontSize: 14, color: '#4b5563' }}>{c.phone}</td>
                      <td style={{ padding: 16, fontSize: 14, color: '#4b5563' }}>{c.email || "-"}</td>
                      <td style={{ padding: 16, fontSize: 14, color: '#4b5563' }}>{c.nic || "-"}</td>
                      <td style={{ padding: 16, fontSize: 14, color: '#4b5563' }}>{c.address || "-"}</td>
                      <td style={{ padding: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Btn variant="secondary" onClick={() => { setCustForm(c); setEditCustId(c.id); setModal("customer"); }} style={{ fontSize: 11 }}>Edit</Btn>
                        <Btn variant="danger" onClick={() => deleteCust(c.id)} style={{ fontSize: 11 }}>Delete</Btn>
                      </td>
                    </tr>
                  ))}
                  {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch) || (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase())) || (c.nic && c.nic.toLowerCase().includes(customerSearch.toLowerCase()))).length === 0 && (
                    <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#84A98C' }}>No customers found matching "{customerSearch}"</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>
          )}

          {/* Financials */}
          {tab === "billing" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ background: 'linear-gradient(135deg, #217536 0%, #2D6A4F 100%)', borderRadius: 24, padding: 32, color: '#fff', boxShadow: '0 20px 40px rgba(27,67,50,0.15)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Total Realized Revenue</div>
                <div className="playfair" style={{ fontSize: 42, fontWeight: 900, marginBottom: 4 }}>LKR {totalRevenue.toLocaleString()}</div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>Accumulated from {rentals.length} transaction records</div>
              </div>

              <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #EDE8E0", overflow: "hidden", boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #F8F5F0', fontWeight: 900, fontSize: 15, color: '#217536', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  TRANSACTION HISTORY
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 500 : 'auto' }}>
                    <thead><tr style={{ background: "#F8F5F0" }}>{["INVOICE #", "CUSTOMER", "AMOUNT", "STATUS"].map(h => <th key={h} style={{ padding: 16, textAlign: 'left', fontSize: 10, fontWeight: 800, color: "#84A98C", letterSpacing: '0.05em' }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {rentals.map(r => (
                        <tr key={r.id} className="admin-table-row" style={{ borderBottom: "1px solid #F8F5F0" }}>
                          <td style={{ padding: 16, fontFamily: 'monospace', fontSize: 13, color: '#4b5563' }}>#{r.id.toString().slice(-8)}</td>
                          <td style={{ padding: 16, fontWeight: 700, fontSize: 14 }}>{r.customerName}</td>
                          <td style={{ padding: 16, fontWeight: 800, fontSize: 14, color: '#217536' }}>LKR {(r.totalAmount + (r.late_fee || r.lateFee || 0)).toLocaleString()}</td>
                          <td style={{ padding: 16 }}><Badge label={r.status} color={r.status === "active" ? "#217536" : "#25D366"} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Packages */}
          {tab === "packages" && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", gap: isMobile ? 12 : 20 }}>
              {bundles.map(b => (
                <div key={b.id} style={{ background: "#fff", borderRadius: 24, border: "1px solid #EDE8E0", overflow: "hidden" }}>
                  {b.has_image && (
                    <div className="relative h-40" style={{ height: 160, background: '#EDE8E0', position: 'relative' }}>
                      <img src="/images/camping-eg.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 8, left: 8, background: '#074D1F', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Featured</div>
                    </div>
                  )}
                  <div style={{ padding: isMobile ? 16 : 20 }}>
                    <div style={{ fontWeight: 900, fontSize: 18, color: '#217536', marginBottom: 4 }}>{b.name}</div>
                    <div style={{ fontSize: 13, color: '#52796F', fontWeight: 700, marginBottom: 8 }}>{b.price_label}</div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12, lineHeight: 1.5 }}>{b.description}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                      {(b.items || []).map((item: string, i: number) => (
                        <span key={i} style={{ background: '#F8F5F0', fontSize: 11, fontWeight: 700, color: '#217536', padding: '4px 10px', borderRadius: 100 }}>{item}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 10, color: '#84A98C', marginBottom: 12 }}>Order: {b.sort_order}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Btn variant="secondary" onClick={() => { setBundleForm({ ...b }); setEditBundleId(b.id); setModal("bundle"); }} style={{ fontSize: 11 }}>Edit</Btn>
                      <Btn variant="danger" onClick={() => deleteBundle(b.id)} style={{ fontSize: 11 }}>Delete</Btn>
                    </div>
                  </div>
                </div>
              ))}
              {bundles.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#84A98C', background: '#fff', borderRadius: 24, border: '1px solid #EDE8E0' }}>No packages yet. Click "+ New Package" to add one.</div>}
            </div>
          )}

          {/* Reviews Management */}
          {tab === "reviews" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: "#fff", borderRadius: 16, padding: "12px 16px", border: "1px solid #EDE8E0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8B5AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search reviews by customer name, location, or comment..." 
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, color: '#217536', background: 'transparent' }}
                />
              </div>

              <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #EDE8E0", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 600 : 'auto' }}>
                  <thead>
                    <tr style={{ background: "#F8F5F0" }}>
                      {["CUSTOMER", "LOCATION", "RATING", "REVIEW COMMENT", "DATE", "ACTIONS"].map(h => (
                        <th key={h} style={{ padding: 16, textAlign: 'left', fontSize: 10, fontWeight: 800, color: "#84A98C", letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reviews
                      .filter(r => 
                        r.name.toLowerCase().includes(reviewSearch.toLowerCase()) || 
                        (r.loc && r.loc.toLowerCase().includes(reviewSearch.toLowerCase())) ||
                        r.text.toLowerCase().includes(reviewSearch.toLowerCase())
                      )
                      .map(r => (
                        <tr key={r.id} style={{ borderBottom: "1px solid #F8F5F0" }}>
                          <td style={{ padding: 16 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#217536' }}>{r.name}</div>
                          </td>
                          <td style={{ padding: 16, fontSize: 14, color: '#4b5563' }}>{r.loc || "-"}</td>
                          <td style={{ padding: 16, fontSize: 14, color: '#E5A93B', fontWeight: 700 }}>
                            {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                          </td>
                          <td style={{ padding: 16, fontSize: 14, color: '#4b5563', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                            {r.text}
                          </td>
                          <td style={{ padding: 16, fontSize: 13, color: '#84A98C' }}>
                            {new Date(r.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: 16 }}>
                            <Btn variant="danger" onClick={() => deleteReview(r.id)} style={{ fontSize: 11 }}>Delete</Btn>
                          </td>
                        </tr>
                      ))}
                    {reviews.filter(r => 
                      r.name.toLowerCase().includes(reviewSearch.toLowerCase()) || 
                      (r.loc && r.loc.toLowerCase().includes(reviewSearch.toLowerCase())) ||
                      r.text.toLowerCase().includes(reviewSearch.toLowerCase())
                    ).length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#84A98C' }}>
                          No reviews found matching "{reviewSearch}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {modal === "item" && (
        <Modal title={editItemId ? "Edit Item" : "Add New Item"} onClose={() => { setModal(null); setEditItemId(null); setItemForm(emptyItem); }}>
          <Input label="Name" value={itemForm.name} onChange={(e: any) => setItemForm((f: any) => ({ ...f, name: e.target.value }))} />
          
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Item Photo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {itemForm.image_url && typeof itemForm.image_url === 'string' && (
                <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', border: '1px solid #EDE8E0', flexShrink: 0, background: '#f8f9fa' }}>
                  <img src={itemForm.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ width: '100%', fontSize: 13, padding: '8px 0', outline: 'none' }}
                  disabled={uploadingImage}
                />
                {uploadingImage && <div style={{ fontSize: 11, color: '#84A98C', marginTop: 4, fontWeight: 600 }}>Uploading to Trail Cloud...</div>}
              </div>
            </div>
          </div>

          <Select label="Category" value={itemForm.category} onChange={(e: any) => setItemForm((f: any) => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </Select>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Qty" type="number" value={itemForm.quantity} onChange={(e: any) => setItemForm((f: any) => ({ ...f, quantity: +e.target.value }))} />
            <Input label="LKR / Day" type="number" value={itemForm.pricePerDay} onChange={(e: any) => setItemForm((f: any) => ({ ...f, pricePerDay: +e.target.value }))} />
          </div>
          <Textarea label="Description" value={itemForm.description} onChange={(e: any) => setItemForm((f: any) => ({ ...f, description: e.target.value }))} />
          
          <div style={{ marginTop: 20, marginBottom: 20, padding: 16, border: '1px solid #EDE8E0', borderRadius: 12, background: '#f8f9fa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Subcategories (Variants)</label>
              <Btn variant="secondary" onClick={() => {
                const v = itemForm.variants || [];
                setItemForm({ ...itemForm, variants: [...v, { label: '', price: 0, quantity: 0, image_url: '' }] })
              }} style={{ padding: '6px 12px', fontSize: 11 }}>+ Add Subcategory</Btn>
            </div>
            {(itemForm.variants || []).map((v: any, i: number) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, marginBottom: 16, alignItems: 'end', paddingBottom: 16, borderBottom: i < ((itemForm.variants?.length || 0) - 1) ? '1px solid #EDE8E0' : 'none' }}>
                <Input label="Name" value={v.label} onChange={(e: any) => {
                  const arr = [...itemForm.variants];
                  arr[i].label = e.target.value;
                  setItemForm({ ...itemForm, variants: arr });
                }} />
                <Input label="Price/Day" type="number" value={v.price} onChange={(e: any) => {
                  const arr = [...itemForm.variants];
                  arr[i].price = +e.target.value;
                  setItemForm({ ...itemForm, variants: arr });
                }} />
                <Input label="Qty" type="number" value={v.quantity} onChange={(e: any) => {
                  const arr = [...itemForm.variants];
                  arr[i].quantity = +e.target.value;
                  setItemForm({ ...itemForm, variants: arr });
                }} />
                <Btn variant="danger" style={{ padding: '8px 12px', height: 42 }} onClick={() => {
                  const arr = [...itemForm.variants];
                  arr.splice(i, 1);
                  setItemForm({ ...itemForm, variants: arr });
                }}>✕</Btn>
                <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 4, textTransform: "uppercase" }}>Variant Photo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {v.image_url && (
                      <img src={v.image_url} alt="Variant" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #EDE8E0' }} />
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleVariantImageUpload(e, i)} style={{ fontSize: 12 }} disabled={uploadingImage} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Btn onClick={saveItem} disabled={uploadingImage || isSaving} style={{ width: '100%', marginTop: 10 }}>
            {uploadingImage ? "Uploading Image..." : isSaving ? "Saving to Cloud..." : editItemId ? "Update Equipment" : "Save Equipment"}
          </Btn>
        </Modal>
      )}

      {qtyModal && (
        <Modal title="Update Stock" onClose={() => setQtyModal(null)} width={350}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}><div style={{ fontSize: 36, fontWeight: 900 }}>{qtyModal.quantity}</div></div>
          <Input label="Adjustment (+/-)" type="number" value={qtyDelta} onChange={(e: any) => setQtyDelta(+e.target.value)} />
          <Btn onClick={applyQty} style={{ width: '100%' }}>Apply Stock Change</Btn>
        </Modal>
      )}

      {modal === "customer" && (
        <Modal title="Customer Profile" onClose={() => { setModal(null); setEditCustId(null); setCustForm(emptyCustomer); }}>
          <Input label="Name" value={custForm.name} onChange={(e: any) => setCustForm((f: any) => ({ ...f, name: e.target.value }))} />
          <Input label="Phone" value={custForm.phone} onChange={(e: any) => setCustForm((f: any) => ({ ...f, phone: e.target.value }))} />
          <Input label="Email" value={custForm.email} onChange={(e: any) => setCustForm((f: any) => ({ ...f, email: e.target.value }))} />
          <Input label="NIC" value={custForm.nic || ""} onChange={(e: any) => setCustForm((f: any) => ({ ...f, nic: e.target.value }))} />
          <Input label="Address" value={custForm.address || ""} onChange={(e: any) => setCustForm((f: any) => ({ ...f, address: e.target.value }))} />
          <Btn onClick={saveCust} style={{ width: '100%' }}>Save Profile</Btn>
        </Modal>
      )}

      {modal === "rental" && (
        <Modal title="New Rental" onClose={() => { setModal(null); setRentalCustSearch(""); setShowCustDropdown(false); }}>
          <div style={{ marginBottom: 14, position: 'relative' }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Customer</label>
            <input 
              type="text"
              placeholder="Search and select customer..."
              value={rentalCustSearch}
              onChange={(e) => {
                setRentalCustSearch(e.target.value);
                setShowCustDropdown(true);
                if (rentalForm.customerId) setRentalForm((f: any) => ({ ...f, customerId: "" }));
              }}
              onFocus={() => setShowCustDropdown(true)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #EDE8E0", fontSize: 14, background: "#fff", color: "#1A1A18", boxSizing: "border-box", outline: "none" }}
            />
            {showCustDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #EDE8E0', borderRadius: 10, marginTop: 4, maxHeight: 200, overflowY: 'auto', zIndex: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                {customers
                  .filter(c => c.name.toLowerCase().includes(rentalCustSearch.toLowerCase()))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => {
                        setRentalForm((f: any) => ({ ...f, customerId: c.id }));
                        setRentalCustSearch(c.name);
                        setShowCustDropdown(false);
                      }}
                      style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #F8F5F0', fontSize: 14, background: rentalForm.customerId === c.id ? '#EDE8E0' : 'transparent' }}
                      onMouseEnter={(e: any) => { if (rentalForm.customerId !== c.id) e.target.style.background = '#F8F5F0'; }}
                      onMouseLeave={(e: any) => { if (rentalForm.customerId !== c.id) e.target.style.background = 'transparent'; }}
                    >
                      {c.name} <span style={{ fontSize: 12, color: '#84A98C', marginLeft: 8 }}>{c.phone}</span>
                    </div>
                  ))}
                  {customers.filter(c => c.name.toLowerCase().includes(rentalCustSearch.toLowerCase())).length === 0 && (
                    <div style={{ padding: '10px 14px', fontSize: 13, color: '#6b7280' }}>No customers found</div>
                  )}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, flexDirection: isMobile ? 'column' : 'row' }}>
            <Input label="Start" type="date" value={rentalForm.rentDate} onChange={(e: any) => setRentalForm((f: any) => ({ ...f, rentDate: e.target.value }))} />
            <Input label="End" type="date" value={rentalForm.returnDate} onChange={(e: any) => setRentalForm((f: any) => ({ ...f, returnDate: e.target.value }))} />
          </div>
          <div style={{ background: '#f8fafc', padding: isMobile ? 12 : 15, borderRadius: 15, marginBottom: 15 }}>
            <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1 }}>
                <Select value={rentalItemSel.itemId} onChange={(e: any) => setRentalItemSel((s: any) => ({ ...s, itemId: e.target.value }))}>
                  <option value="">Select Gear</option>
                  {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </Select>
              </div>
              <Btn onClick={() => {
                const itm = items.find(i => i.id === rentalItemSel.itemId);
                if (itm) setRentalForm((f: any) => ({ ...f, items: [...f.items, { itemId: itm.id, itemName: itm.name, qty: 1, pricePerDay: itm.pricePerDay }] }));
              }} style={{ height: isMobile ? 42 : 44 }}>Add Gear</Btn>
            </div>
            <div style={{ marginTop: 10 }}>
              {rentalForm.items.map((x: any, idx: number) => (
                <div key={idx} style={{ marginTop: 5, fontSize: 13, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{x.itemName} <span style={{ color: '#84A98C' }}>×1</span></span>
                  <button onClick={() => setRentalForm((f: any) => ({ ...f, items: f.items.filter((_: any, i: number) => i !== idx) }))} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 12 }}>Remove</button>
                </div>
              ))}
            </div>
          </div>
          <Input label="Advance Paid (LKR)" type="number" value={rentalForm.advancePaid} onChange={(e: any) => setRentalForm((f: any) => ({ ...f, advancePaid: e.target.value }))} />
          <Btn onClick={saveRental} style={{ width: '100%', height: 48 }}>Initialize Rental</Btn>
        </Modal>
      )}

      {viewRental && (
        <Modal title="Invoice Summary" onClose={() => setViewRental(null)} width={600}>
          <div id="printable-bill" style={{ background: '#fff', padding: '40px', borderRadius: '16px', color: '#1A1A18', border: '1px solid #EDE8E0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, borderBottom: '2px solid #217536', paddingBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, color: '#217536', fontSize: 24, fontWeight: 900 }}>WILD TRAIL GEAR</h2>
                <p style={{ margin: '4px 0', fontSize: 12, color: '#84A98C', fontWeight: 700 }}>Adventure Gear Rentals • Panadura</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#217536' }}>INVOICE</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>#{viewRental.id.toString().slice(-8)}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 40, marginBottom: 40 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#84A98C', marginBottom: 8, textTransform: 'uppercase' }}>CUSTOMER</div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{viewRental.customerName}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{viewRental.customerPhone}</div>
              </div>
              <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#84A98C', marginBottom: 8, textTransform: 'uppercase' }}>RENTAL PERIOD</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{viewRental.rentDate} to {viewRental.returnDate}</div>
                <div style={{ fontSize: 13, color: '#217536', fontWeight: 800 }}>{viewRental.days} Total Days</div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 40, minWidth: isMobile ? 400 : 'auto' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #EDE8E0' }}>
                    <th style={{ textAlign: 'left', padding: '12px 0', fontSize: 11, color: '#84A98C' }}>ITEM</th>
                    <th style={{ textAlign: 'center', padding: '12px 0', fontSize: 11, color: '#84A98C' }}>QTY</th>
                    <th style={{ textAlign: 'right', padding: '12px 0', fontSize: 11, color: '#84A98C' }}>PER DAY</th>
                    <th style={{ textAlign: 'right', padding: '12px 0', fontSize: 11, color: '#84A98C' }}>SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {viewRental.items.map((item: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F8F5F0' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600 }}>{item.itemName}</td>
                      <td style={{ padding: '12px 0', textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right' }}>LKR {item.pricePerDay}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700 }}>LKR {(item.qty * item.pricePerDay * viewRental.days).toLocaleString()}</td>
                    </tr>
                  ))}
                  {(() => {
                    const lDays = getLateDays(viewRental);
                    const lFee = getLateFee(viewRental);
                    if (lDays > 0) {
                      return (
                        <tr style={{ borderBottom: '1px solid #F8F5F0' }}>
                          <td style={{ padding: '12px 0', fontWeight: 600, color: '#dc2626' }}>Late Return Fee ({lDays} {lDays === 1 ? 'day' : 'days'} late)</td>
                          <td style={{ padding: '12px 0', textAlign: 'center', color: '#dc2626' }}>-</td>
                          <td style={{ padding: '12px 0', textAlign: 'right', color: '#dc2626' }}>LKR {getDailyRate(viewRental).toLocaleString()} / day</td>
                          <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>LKR {lFee.toLocaleString()}</td>
                        </tr>
                      );
                    }
                    return null;
                  })()}
                </tbody>
              </table>
            </div>

            {(() => {
              const baseTotal = viewRental.totalAmount;
              const lDays = getLateDays(viewRental);
              const lFee = getLateFee(viewRental);
              const finalTotal = baseTotal + lFee;
              const balanceDue = finalTotal - (viewRental.advancepaid || 0);
              return (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: isMobile ? '100%' : '260px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F8F5F0' }}>
                      <span style={{ fontSize: 13, color: '#6b7280' }}>Base Rental</span>
                      <span style={{ fontWeight: 700 }}>LKR {baseTotal.toLocaleString()}</span>
                    </div>
                    {lDays > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F8F5F0', color: '#dc2626' }}>
                        <span style={{ fontSize: 13 }}>Late Fee ({lDays} {lDays === 1 ? 'day' : 'days'})</span>
                        <span style={{ fontWeight: 700 }}>LKR {lFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F8F5F0' }}>
                      <span style={{ fontSize: 13, color: '#6b7280' }}>Total Bill</span>
                      <span style={{ fontWeight: 700 }}>LKR {finalTotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#059669' }}>
                      <span style={{ fontSize: 13 }}>Advance Paid</span>
                      <span style={{ fontWeight: 700 }}>- LKR {(viewRental.advancepaid || 0).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #217536', marginTop: 8 }}>
                      <span style={{ fontWeight: 900, color: '#217536' }}>BALANCE DUE</span>
                      <span style={{ fontWeight: 900, color: '#217536', fontSize: 18 }}>LKR {balanceDue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div style={{ marginTop: 60, textAlign: 'center', borderTop: '1px dashed #EDE8E0', paddingTop: 20 }}>
              <p style={{ fontSize: 11, color: '#84A98C', margin: 0 }}>Thank you for choosing Wild Trail Gear! Please handle equipment with care.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, marginTop: 24 }}>
            <Btn onClick={async () => {
              const element = document.getElementById('printable-bill');
              if (element) {
                const canvas = await html2canvas(element, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`WTG-Invoice-${viewRental.id.toString().slice(-8)}.pdf`);
              }
            }} variant="primary" style={{ flex: 1 }}>Download PDF</Btn>
            <Btn onClick={() => {
              const printContent = document.getElementById('printable-bill');
              if (printContent) {
                const originalContent = document.body.innerHTML;
                document.body.innerHTML = printContent.innerHTML;
                window.print();
                window.location.reload();
              }
            }} variant="secondary" style={{ flex: 1 }}>Print Bill</Btn>
            <Btn onClick={() => setViewRental(null)} variant="ghost" style={{ flex: 1 }}>Close</Btn>
          </div>
        </Modal>
      )}

      {returnConfirmRental && (
        <Modal title="Complete Rental Return" onClose={() => setReturnConfirmRental(null)} width={450}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#faf8f4', border: '1px solid #e6ddd0', padding: 16, borderRadius: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7a9288', textTransform: 'uppercase', letterSpacing: 0.5 }}>Customer</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1a2420', marginTop: 4 }}>{returnConfirmRental.customerName}</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#7a9288', fontWeight: 600 }}>Rent Date</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2420' }}>{returnConfirmRental.rentDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#7a9288', fontWeight: 600 }}>Due Date</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2420' }}>{returnConfirmRental.returnDate}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
              <Input 
                label="Actual Return Date" 
                type="date" 
                value={returnDateInput} 
                onChange={(e: any) => handleReturnDateChange(e.target.value)} 
              />
              <Input 
                label="Late Days" 
                type="number" 
                value={returnLateDays} 
                onChange={(e: any) => {
                  const val = Math.max(0, parseInt(e.target.value) || 0);
                  setReturnLateDays(val);
                  setReturnLateFee(val * getDailyRate(returnConfirmRental));
                }} 
              />
            </div>

            <Input 
              label="Calculated Late Fee (LKR)" 
              type="number" 
              value={returnLateFee} 
              onChange={(e: any) => setReturnLateFee(Math.max(0, parseInt(e.target.value) || 0))} 
            />

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Btn onClick={confirmReturn} variant="primary" style={{ flex: 1, height: 44, justifyContent: 'center' }}>Confirm Return</Btn>
              <Btn onClick={() => setReturnConfirmRental(null)} variant="secondary" style={{ flex: 1, height: 44, justifyContent: 'center' }}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {modal === "bundle" && (
        <Modal title={editBundleId ? "Edit Package" : "Add New Package"} onClose={() => { setModal(null); setEditBundleId(null); setBundleForm(emptyBundle); }} width={520}>
          <Input label="Package Name" value={bundleForm.name} onChange={(e: any) => setBundleForm((f: any) => ({ ...f, name: e.target.value }))} placeholder="e.g. Weekend Warrior" />
          <Input label="Price Label" value={bundleForm.price_label} onChange={(e: any) => setBundleForm((f: any) => ({ ...f, price_label: e.target.value }))} placeholder="e.g. LKR 1,250" />
          <Textarea label="Description" value={bundleForm.description} onChange={(e: any) => setBundleForm((f: any) => ({ ...f, description: e.target.value }))} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Included Items</label>
            {(bundleForm.items || []).map((item: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input value={item} onChange={(e: any) => {
                  const arr = [...(bundleForm.items || [])];
                  arr[i] = e.target.value;
                  setBundleForm((f: any) => ({ ...f, items: arr }));
                }} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #EDE8E0", fontSize: 14, background: "#fff", color: "#1A1A18", outline: "none" }} placeholder="e.g. Manual Tent (3P)" />
                <Btn variant="danger" style={{ padding: '8px 12px' }} onClick={() => {
                  const arr = [...(bundleForm.items || [])];
                  arr.splice(i, 1);
                  setBundleForm((f: any) => ({ ...f, items: arr }));
                }}>✕</Btn>
              </div>
            ))}
            <Btn variant="secondary" onClick={() => setBundleForm((f: any) => ({ ...f, items: [...(f.items || []), ""] }))} style={{ padding: '6px 12px', fontSize: 11 }}>+ Add Item</Btn>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={bundleForm.has_image} onChange={(e: any) => setBundleForm((f: any) => ({ ...f, has_image: e.target.checked }))} style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Show featured image</span>
            </label>
          </div>
          <Input label="Sort Order" type="number" value={bundleForm.sort_order} onChange={(e: any) => setBundleForm((f: any) => ({ ...f, sort_order: +e.target.value }))} />
          <Btn onClick={saveBundle} style={{ width: '100%', marginTop: 10 }}>{editBundleId ? "Update Package" : "Save Package"}</Btn>
        </Modal>
      )}

      {modal === "review" && (
        <Modal title="Add Customer Review" onClose={() => setModal(null)}>
          <Input 
            label="Customer Name" 
            value={reviewForm.name} 
            onChange={(e: any) => setReviewForm((f: any) => ({ ...f, name: e.target.value }))} 
            placeholder="e.g. John Doe"
          />
          <Input 
            label="Location" 
            value={reviewForm.loc} 
            onChange={(e: any) => setReviewForm((f: any) => ({ ...f, loc: e.target.value }))} 
            placeholder="e.g. Colombo (optional)"
          />
          <Select 
            label="Rating" 
            value={reviewForm.rating} 
            onChange={(e: any) => setReviewForm((f: any) => ({ ...f, rating: +e.target.value }))}
          >
            {[5, 4, 3, 2, 1].map(stars => (
              <option key={stars} value={stars}>{stars} Stars</option>
            ))}
          </Select>
          <Textarea 
            label="Review text" 
            value={reviewForm.text} 
            onChange={(e: any) => setReviewForm((f: any) => ({ ...f, text: e.target.value }))} 
            placeholder="Enter customer feedback here..."
          />
          <Btn onClick={saveReview} disabled={isSavingReview} style={{ width: '100%', marginTop: 10 }}>
            {isSavingReview ? "Saving..." : "Save Review"}
          </Btn>
        </Modal>
      )}
    </div>
  );
}

export default function AdminPanel() {
  return (
    <Suspense fallback={<div>Loading Admin...</div>}>
      <AdminPanelContent />
    </Suspense>
  );
}
