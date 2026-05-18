import type { Invoice } from '../types/invoice';
import { calculateSubtotal, calculateTax, calculateTotal, formatCurrency } from '../utils/calculations';
import { format, parseISO } from 'date-fns';
import { Eye, Trash2, CheckCircle, XCircle, FileText } from 'lucide-react';

interface Props {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function InvoiceList({ invoices, onView, onDelete, onToggleStatus }: Props) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-20">
        <FileText size={48} className="mx-auto text-text-muted mb-4" />
        <h3 className="text-xl font-semibold text-text-secondary mb-2">No invoices yet</h3>
        <p className="text-text-muted">Create your first invoice to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map(invoice => {
        const subtotal = calculateSubtotal(invoice.lineItems);
        const tax = calculateTax(subtotal, invoice.taxRate);
        const total = calculateTotal(subtotal, tax);

        return (
          <div
            key={invoice.id}
            className="bg-bg-card border border-border rounded-xl p-4 hover:border-border-focus transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-sm text-accent font-medium">{invoice.invoiceNumber}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    invoice.status === 'paid'
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {invoice.status === 'paid' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {invoice.status === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <p className="text-text-primary font-medium truncate">{invoice.clientName || 'No client'}</p>
                <p className="text-text-muted text-sm">
                  Due {format(parseISO(invoice.dueDate), 'MMM dd, yyyy')} · {invoice.lineItems.length} item{invoice.lineItems.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-text-primary">{formatCurrency(total)}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onView(invoice)}
                    className="p-2 text-text-muted hover:text-accent transition-colors rounded-lg hover:bg-accent/10"
                    title="View / Print"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onToggleStatus(invoice.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      invoice.status === 'paid'
                        ? 'text-warning hover:text-warning hover:bg-warning/10'
                        : 'text-success hover:text-success hover:bg-success/10'
                    }`}
                    title={invoice.status === 'paid' ? 'Mark as unpaid' : 'Mark as paid'}
                  >
                    {invoice.status === 'paid' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                  </button>
                  <button
                    onClick={() => onDelete(invoice.id)}
                    className="p-2 text-text-muted hover:text-danger transition-colors rounded-lg hover:bg-danger/10"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
