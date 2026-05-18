import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Invoice, LineItem } from '../types/invoice';
import { createEmptyInvoice } from '../utils/sampleData';
import { calculateSubtotal, calculateTax, calculateTotal, formatCurrency } from '../utils/calculations';

interface Props {
  invoice?: Invoice;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

export default function InvoiceForm({ invoice, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Invoice>(
    invoice || createEmptyInvoice()
  );

  const subtotal = calculateSubtotal(form.lineItems);
  const tax = calculateTax(subtotal, form.taxRate);
  const total = calculateTotal(subtotal, tax);

  const updateField = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setForm(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addLineItem = () => {
    setForm(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: uuidv4(), description: '', quantity: 1, rate: 0 }],
    }));
  };

  const removeLineItem = (id: string) => {
    if (form.lineItems.length <= 1) return;
    setForm(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const inputClass = "w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors";
  const labelClass = "block text-sm font-medium text-text-secondary mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Invoice Number</label>
          <input
            type="text"
            value={form.invoiceNumber}
            onChange={e => updateField('invoiceNumber', e.target.value)}
            className={inputClass}
            placeholder="INV-001"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => updateField('date', e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={e => updateField('dueDate', e.target.value)}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Sender & Client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">From (Sender)</h3>
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={form.senderName}
              onChange={e => updateField('senderName', e.target.value)}
              className={inputClass}
              placeholder="Your name / company"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={form.senderEmail}
              onChange={e => updateField('senderEmail', e.target.value)}
              className={inputClass}
              placeholder="you@email.com"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <textarea
              value={form.senderAddress}
              onChange={e => updateField('senderAddress', e.target.value)}
              className={inputClass}
              rows={3}
              placeholder="Street, City, State, Country"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">Bill To (Client)</h3>
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={form.clientName}
              onChange={e => updateField('clientName', e.target.value)}
              className={inputClass}
              placeholder="Client name / company"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={form.clientEmail}
              onChange={e => updateField('clientEmail', e.target.value)}
              className={inputClass}
              placeholder="client@email.com"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <textarea
              value={form.clientAddress}
              onChange={e => updateField('clientAddress', e.target.value)}
              className={inputClass}
              rows={3}
              placeholder="Street, City, State, Country"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2 mb-4">Line Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-text-secondary text-sm">
                <th className="pb-2 pr-2 w-1/2">Description</th>
                <th className="pb-2 pr-2 w-24">Qty</th>
                <th className="pb-2 pr-2 w-32">Rate</th>
                <th className="pb-2 pr-2 w-32 text-right">Amount</th>
                <th className="pb-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {form.lineItems.map(item => (
                <tr key={item.id}>
                  <td className="pr-2 pb-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                      className={inputClass}
                      placeholder="Item description"
                    />
                  </td>
                  <td className="pr-2 pb-2">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity}
                      onChange={e => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className={inputClass}
                    />
                  </td>
                  <td className="pr-2 pb-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={e => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className={inputClass}
                    />
                  </td>
                  <td className="pr-2 pb-2 text-right text-text-primary py-2">
                    {formatCurrency(item.quantity * item.rate)}
                  </td>
                  <td className="pb-2">
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      className="p-2 text-text-muted hover:text-danger transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addLineItem}
          className="mt-2 flex items-center gap-2 text-accent hover:text-accent-hover transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Add Line Item
        </button>
      </div>

      {/* Tax & Totals */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <label className={labelClass}>Notes / Payment Terms</label>
          <textarea
            value={form.notes}
            onChange={e => updateField('notes', e.target.value)}
            className={inputClass}
            rows={4}
            placeholder="Thank you for your business..."
          />
        </div>
        <div className="w-full md:w-72 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Subtotal</span>
            <span className="text-text-primary">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-text-secondary">Tax</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.taxRate}
                onChange={e => updateField('taxRate', parseFloat(e.target.value) || 0)}
                className="w-16 bg-bg-input border border-border rounded px-2 py-1 text-text-primary text-right text-sm focus:outline-none focus:border-border-focus"
              />
              <span className="text-text-muted text-sm">%</span>
              <span className="text-text-primary ml-2">{formatCurrency(tax)}</span>
            </div>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="text-lg font-semibold text-text-primary">Total</span>
            <span className="text-lg font-bold text-accent">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
        >
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </button>
      </div>
    </form>
  );
}
