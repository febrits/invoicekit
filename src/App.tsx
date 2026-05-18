import { useState } from 'react';
import { Plus, ArrowLeft, Printer } from 'lucide-react';
import type { Invoice } from './types/invoice';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createSampleInvoice } from './utils/sampleData';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import InvoiceList from './components/InvoiceList';

type Page = 'list' | 'create' | 'edit' | 'view';

function App() {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoicekit-invoices', [createSampleInvoice()]);
  const [page, setPage] = useState<Page>('list');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = () => {
    setSelectedInvoice(null);
    setPage('create');
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPage('edit');
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPage('view');
  };

  const handleSave = (invoice: Invoice) => {
    if (page === 'edit' && selectedInvoice) {
      setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? invoice : inv));
    } else {
      setInvoices(prev => [invoice, ...prev]);
    }
    setPage('list');
    setSelectedInvoice(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === id ? { ...inv, status: inv.status === 'paid' ? 'unpaid' : 'paid' } : inv
      )
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = () => {
    setPage('list');
    setSelectedInvoice(null);
  };

  const filteredInvoices = invoices.filter(inv => {
    const q = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.clientName.toLowerCase().includes(q) ||
      inv.senderName.toLowerCase().includes(q)
    );
  });

  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, inv) => {
      const sub = inv.lineItems.reduce((s, li) => s + li.quantity * li.rate, 0);
      return sum + sub * (1 + inv.taxRate / 100);
    }, 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'unpaid')
    .reduce((sum, inv) => {
      const sub = inv.lineItems.reduce((s, li) => s + li.quantity * li.rate, 0);
      return sum + sub * (1 + inv.taxRate / 100);
    }, 0);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top bar - hidden on print */}
      <header className="no-print sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {page !== 'list' && (
              <button
                onClick={handleCancel}
                className="p-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-bg-card"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-xl font-bold text-text-primary">
              <span className="text-accent">Invoice</span>Kit
            </h1>
          </div>
          {page === 'list' && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Invoice</span>
            </button>
          )}
          {page === 'view' && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors"
            >
              <Printer size={18} />
              <span className="hidden sm:inline">Print</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {page === 'list' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-bg-card border border-border rounded-xl p-4">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Total Invoices</p>
                <p className="text-2xl font-bold text-text-primary">{invoices.length}</p>
              </div>
              <div className="bg-bg-card border border-border rounded-xl p-4">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Paid</p>
                <p className="text-2xl font-bold text-success">{invoices.filter(i => i.status === 'paid').length}</p>
              </div>
              <div className="bg-bg-card border border-border rounded-xl p-4">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Revenue</p>
                <p className="text-2xl font-bold text-accent">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="bg-bg-card border border-border rounded-xl p-4">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Pending</p>
                <p className="text-2xl font-bold text-warning">{formatCurrency(pendingAmount)}</p>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
              />
            </div>

            {/* Invoice List */}
            <InvoiceList
              invoices={filteredInvoices}
              onView={handleView}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          </>
        )}

        {page === 'create' && (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">New Invoice</h2>
            <InvoiceForm onSave={handleSave} onCancel={handleCancel} />
          </div>
        )}

        {page === 'edit' && selectedInvoice && (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Edit Invoice</h2>
            <InvoiceForm invoice={selectedInvoice} onSave={handleSave} onCancel={handleCancel} />
          </div>
        )}

        {page === 'view' && selectedInvoice && (
          <div>
            <div className="no-print flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Invoice Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(selectedInvoice)}
                  className="px-4 py-2 border border-border text-text-secondary hover:text-text-primary rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors"
                >
                  <Printer size={18} /> Print
                </button>
              </div>
            </div>
            <InvoicePreview invoice={selectedInvoice} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
