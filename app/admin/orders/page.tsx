'use client';

import React, { useState, useEffect } from 'react';
import { dbAdapter } from '@/lib/store/db-adapter';
import { Order, OrderStatus, PaymentStatus } from '@/types/ecommerce';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Truck,
  Clock,
  X,
  FileText,
  CreditCard,
  MapPin,
  Save,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Edit details inside modal
  const [editStatus, setEditStatus] = useState<OrderStatus>('pending');
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>('pending');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');
  const [editCarrier, setEditCarrier] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const list = await dbAdapter.getOrders();
    setOrders(list);
  };

  const handleOpenDetails = (order: Order) => {
    setActiveOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.payment_status);
    setEditTrackingNumber(order.tracking_number || '');
    setEditCarrier(order.shipping_carrier || 'Servicing World Priority Courier');
    setEditAdminNotes(order.admin_notes || '');
  };

  const handleSaveOrderUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    await dbAdapter.updateOrderStatus(activeOrder.id, editStatus, editAdminNotes, editTrackingNumber);
    await dbAdapter.updatePaymentStatus(activeOrder.id, editPaymentStatus);

    setActiveOrder(null);
    await loadOrders();
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Fulfillment & Logistics
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Customer Hardware Orders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time testing, print invoices, and update courier tracking codes
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl pl-9 pr-3 py-2.5"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white capitalize"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing (Lab Test)</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-4">Order Number</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Order Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-slate-500">
                    No orders matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">
                      #{ord.order_number}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-white">{ord.customer_name}</p>
                        <p className="text-[11px] text-slate-400">{ord.customer_email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{formatDate(ord.created_at)}</td>
                    <td className="p-4 font-bold text-white">{formatPrice(ord.total)}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-900 capitalize">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          ord.payment_status === 'paid'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                            : 'bg-amber-950 text-amber-400 border border-amber-900'
                        }`}
                      >
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenDetails(ord)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Update Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                  Order #{activeOrder.order_number}
                </h2>
                <p className="text-xs text-slate-400">Placed on {formatDate(activeOrder.created_at)}</p>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Items</h3>
              <div className="divide-y divide-slate-800 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {activeOrder.items.map((it) => (
                  <div key={it.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{it.title}</p>
                      <p className="text-[11px] text-slate-400">
                        Qty: {it.quantity} × {formatPrice(it.price)} • SKU: {it.sku}
                      </p>
                    </div>
                    <span className="font-bold text-white">{formatPrice(it.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> Shipping Destination
                </p>
                <p className="text-slate-300">{activeOrder.shipping_address.full_name}</p>
                <p className="text-slate-400">{activeOrder.shipping_address.street_address}</p>
                <p className="text-slate-400">
                  {activeOrder.shipping_address.city}, {activeOrder.shipping_address.postal_code}
                </p>
                <p className="text-slate-400">Phone: {activeOrder.shipping_address.phone}</p>
              </div>

              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Payment & Total
                </p>
                <p className="text-slate-300">Method: {activeOrder.payment_method}</p>
                <p className="text-slate-400">Subtotal: {formatPrice(activeOrder.subtotal)}</p>
                <p className="text-slate-400">Shipping: {formatPrice(activeOrder.shipping_cost)}</p>
                <p className="text-sm font-bold text-white pt-1">Total: {formatPrice(activeOrder.total)}</p>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleSaveOrderUpdate} className="space-y-4 text-xs pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Update Status & Tracking
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Order Lifecycle Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white capitalize font-semibold"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing (Benchmarking)</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white capitalize font-semibold"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={editTrackingNumber}
                    onChange={(e) => setEditTrackingNumber(e.target.value)}
                    placeholder="e.g. SW-73920194"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Shipping Carrier
                  </label>
                  <input
                    type="text"
                    value={editCarrier}
                    onChange={(e) => setEditCarrier(e.target.value)}
                    placeholder="e.g. Servicing World Priority Courier"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">
                    Internal Lab / Admin Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="e.g. Benchmarked 140W port, verified 28V 5A PD 3.1 profile on load tester."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveOrder(null)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-slate-300 font-bold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
