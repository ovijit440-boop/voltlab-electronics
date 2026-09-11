'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { dbAdapter } from '@/lib/store/db-adapter';
import { formatPrice } from '@/lib/utils';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Building2,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Smartphone,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, coupon, clearCart } = useCart();
  const { user } = useAuth();

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    streetAddress: '',
    apartment: '',
    city: 'Dhaka',
    state: 'Dhaka Division',
    postalCode: '',
    country: 'Bangladesh',
    orderNotes: '',
    bKashTrxId: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'online_card' | 'bank_transfer'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.full_name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Shipping Calculations (Inside Dhaka: ৳60 or Free over ৳2000, Outside Dhaka: ৳120)
  const shippingCost = shippingMethod === 'express' ? 120.0 : subtotal >= 2000.0 ? 0.0 : 60.0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.streetAddress.trim()) errors.streetAddress = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        id: `item-${Date.now()}-${Math.random()}`,
        product_id: item.product.id,
        title: item.product.title,
        sku: item.product.sku,
        variant_name: item.selected_variant?.name,
        price: item.product.discount_price ?? item.product.price,
        quantity: item.quantity,
        total: (item.product.discount_price ?? item.product.price) * item.quantity,
        image_url: item.product.main_image,
      }));

      const createdOrder = await dbAdapter.createOrder({
        customer_id: user?.id,
        customer_name: formData.fullName.trim(),
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        shipping_address: {
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          street_address: formData.streetAddress.trim(),
          apartment: formData.apartment.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postal_code: formData.postalCode.trim(),
          country: formData.country,
        },
        items: orderItems,
        subtotal,
        shipping_cost: shippingCost,
        discount_amount: discountAmount,
        total: grandTotal,
        coupon_code: coupon?.code,
        status: 'confirmed',
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
        payment_method: paymentMethod,
        shipping_carrier: 'Servicing World Priority Courier',
        tracking_number: `SW-${Math.floor(10000000 + Math.random() * 90000000)}`,
        notes: formData.orderNotes.trim(),
      });

      clearCart();
      router.push(`/order-success/${createdOrder.order_number}`);
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Unable to process order. Please check connection.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
          <div className="text-center space-y-4 max-w-sm">
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your cart is empty</h2>
            <p className="text-xs text-slate-500">Please select hardware products before checking out.</p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Browse Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950/40 py-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Secure Hardware Checkout
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Zero spam. End-to-end encrypted dispatch.
              </p>
            </div>
            <Link
              href="/cart"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Cart
            </Link>
          </div>

          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Details & Payment */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Contact Info */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. David Kim"
                      className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2.5 text-slate-900 dark:text-white ${
                        formErrors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.fullName && <p className="text-[11px] text-red-500 mt-1">{formErrors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address (for order tracking) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="david@example.com"
                      className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2.5 text-slate-900 dark:text-white ${
                        formErrors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.email && <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number (for courier dispatch SMS) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 019-2834"
                      className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2.5 text-slate-900 dark:text-white ${
                        formErrors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.phone && <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  Shipping Address
                </h2>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      placeholder="123 Silicon Blvd, Suite 400"
                      className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2.5 text-slate-900 dark:text-white ${
                        formErrors.streetAddress ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.streetAddress && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.streetAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="San Francisco"
                        className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2.5 text-slate-900 dark:text-white ${
                          formErrors.city ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      />
                      {formErrors.city && <p className="text-[11px] text-red-500 mt-1">{formErrors.city}</p>}
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="California"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="94107"
                        className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2.5 text-slate-900 dark:text-white ${
                          formErrors.postalCode ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      />
                      {formErrors.postalCode && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white"
                    >
                      <option value="Bangladesh">Bangladesh (বাংলাদেশ)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Shipping Method */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    3
                  </span>
                  ডেলিভারি এরিয়া ও স্পিড (Shipping Zone)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                      shippingMethod === 'standard'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Inside Dhaka (ঢাকা সিটি)</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">১-২ কার্যদিবসের মধ্যে হোম ডেলিভারি</p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {subtotal >= 2000 ? 'FREE' : '৳৬০'}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                      shippingMethod === 'express'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Outside Dhaka (সারাদেশে)</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">২-৩ কার্যদিবসের মধ্যে কুরিয়ার ডেলিভারি</p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">৳১২০</span>
                  </label>
                </div>
              </div>

              {/* 4. Modular Payment Selector */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    4
                  </span>
                  পেমেন্ট পদ্ধতি (Payment Method)
                </h2>

                <div className="space-y-3">
                  {/* Option 1: Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Banknote className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            ক্যাশ অন ডেলিভারি (Cash on Delivery)
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 font-bold">জনপ্রিয়</span>
                          </p>
                          <p className="text-[11px] text-slate-500">পণ্য হাতে পেয়ে ডেলিভারি ম্যানের কাছে টাকা পরিশোধ করুন</p>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                        {paymentMethod === 'cod' && (
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Option 2: bKash / Nagad / Rocket */}
                  <label
                    onClick={() => setPaymentMethod('bkash')}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-600 bg-pink-50/40 dark:bg-pink-950/30'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-5 h-5 text-pink-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            বিকাশ / নগদ / রকেট (Mobile Banking)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            bKash, Nagad অথবা Rocket দিয়ে সরাসরি পেমেন্ট করুন
                          </p>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-pink-600 flex items-center justify-center">
                        {paymentMethod === 'bkash' && (
                          <div className="w-2 h-2 rounded-full bg-pink-600" />
                        )}
                      </div>
                    </div>

                    {paymentMethod === 'bkash' && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                        <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-700 dark:text-pink-300">
                          <p className="font-bold">আমাদের বিকাশ / নগদ মার্চেন্ট/পার্সোনাল নাম্বার:</p>
                          <p className="font-mono text-sm font-black mt-0.5">01700-000000 (Send Money / Payment)</p>
                          <p className="text-[11px] mt-1 text-slate-500 dark:text-slate-400">
                            টাকা পাঠানোর পর প্রাপ্ত TrxID বা বিকাশ নম্বর নিচে দিন:
                          </p>
                        </div>
                        <input
                          type="text"
                          name="bKashTrxId"
                          value={formData.bKashTrxId || ''}
                          onChange={handleInputChange}
                          placeholder="Transaction ID / TrxID (e.g. BL92A87X)"
                          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-white uppercase font-mono"
                        />
                      </div>
                    )}
                  </label>

                  {/* Option 3: Credit Card / Online Gateway */}
                  <label
                    onClick={() => setPaymentMethod('online_card')}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'online_card'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            ভিসা / মাস্টারকার্ড / অনলাইন পেমেন্ট (Debit/Credit Card)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            SSLCommerz / Shurjopay গেটওয়ে (Visa, MasterCard, NexusPay)
                          </p>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                        {paymentMethod === 'online_card' && (
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                    </div>
                    {paymentMethod === 'online_card' && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          placeholder="Card Number (Demo Sandbox Mode)"
                          defaultValue="•••• •••• •••• 4242"
                          className="col-span-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="MM/YY"
                          defaultValue="12/28"
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          defaultValue="789"
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-white"
                        />
                      </div>
                    )}
                  </label>

                  {/* Option 4: Bank Transfer */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            ব্যাংক ট্রান্সফার (Direct Bank Wire)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Dutch-Bangla Bank / City Bank / BRAC Bank
                          </p>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                        {paymentMethod === 'bank_transfer' && (
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Order Instructions / Packaging Notes (Optional)
                </label>
                <textarea
                  name="orderNotes"
                  rows={2}
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  placeholder="e.g. Please test 140W USB-PD port before shipping, or gate code #1234"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Right 5 Columns: Sticky Order Review */}
            <div className="lg:col-span-5 space-y-6 sticky top-28">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Order Review ({items.length} items)
                </h2>

                {/* Mini Item List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1 space-y-2">
                  {items.map((item) => {
                    const price = item.product.discount_price ?? item.product.price;
                    return (
                      <div key={item.product.id} className="pt-2 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 p-1">
                          <Image
                            src={item.product.main_image}
                            alt={item.product.title}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {item.product.title}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Qty: {item.quantity} × {formatPrice(price)}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Breakdown */}
                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Coupon ({coupon?.code})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Method</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span>Total Due</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all disabled:opacity-50 active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  {isSubmitting ? 'Processing Order...' : `Place Order — ${formatPrice(grandTotal)}`}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Your payment and customer info are 100% secure.</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
