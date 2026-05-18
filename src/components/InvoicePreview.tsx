import type { Invoice } from '../types/invoice';
import { calculateSubtotal, calculateTax, calculateTotal, formatCurrency } from '../utils/calculations';
import { format, parseISO } from 'date-fns';

interface Props {
  invoice: Invoice;
}

export default function InvoicePreview({ invoice }: Props) {
  const subtotal = calculateSubtotal(invoice.lineItems);
  const tax = calculateTax(subtotal, invoice.taxRate);
  const total = calculateTotal(subtotal, tax);

  return (
    <div className="bg-white text-gray-900 rounded-xl p-8 shadow-2xl max-w-4xl mx-auto print:shadow-none print:rounded-none print:p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">INVOICE</h1>
          <p className="text-gray-500 text-sm">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg">{invoice.senderName || 'Your Company'}</p>
          <p className="text-gray-500 text-sm whitespace-pre-line">{invoice.senderAddress}</p>
          <p className="text-gray-500 text-sm">{invoice.senderEmail}</p>
        </div>
      </div>

      {/* Dates & Client */}
      <div className="flex justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Bill To</p>
          <p className="font-semibold">{invoice.clientName || 'Client'}</p>
          <p className="text-gray-500 text-sm whitespace-pre-line">{invoice.clientAddress}</p>
          <p className="text-gray-500 text-sm">{invoice.clientEmail}</p>
        </div>
        <div className="text-right space-y-1">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date: </span>
            <span className="text-sm">{format(parseISO(invoice.date), 'MMM dd, yyyy')}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Due: </span>
            <span className="text-sm">{format(parseISO(invoice.dueDate), 'MMM dd, yyyy')}</span>
          </div>
          <div className="mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              invoice.status === 'paid'
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {invoice.status === 'paid' ? 'PAID' : 'UNPAID'}
            </span>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
            <th className="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">Qty</th>
            <th className="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">Rate</th>
            <th className="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map(item => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-3 text-sm">{item.description || '—'}</td>
              <td className="py-3 text-sm text-right">{item.quantity}</td>
              <td className="py-3 text-sm text-right">{formatCurrency(item.rate)}</td>
              <td className="py-3 text-sm text-right font-medium">{formatCurrency(item.quantity * item.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          )}
          <div className="border-t-2 border-gray-900 pt-2 flex justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-indigo-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
          <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}
