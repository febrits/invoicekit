import { v4 as uuidv4 } from 'uuid';
import type { Invoice } from '../types/invoice';

export function createSampleInvoice(): Invoice {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 30);

  return {
    id: uuidv4(),
    invoiceNumber: 'INV-001',
    date: today.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    senderName: 'Your Company',
    senderEmail: 'hello@yourcompany.com',
    senderAddress: '123 Business St\nCity, State 12345\nCountry',
    clientName: 'Client Company',
    clientEmail: 'contact@client.com',
    clientAddress: '456 Client Ave\nCity, State 67890\nCountry',
    lineItems: [
      { id: uuidv4(), description: 'Web Design & Development', quantity: 1, rate: 2500 },
      { id: uuidv4(), description: 'UI/UX Design', quantity: 20, rate: 75 },
      { id: uuidv4(), description: 'SEO Optimization', quantity: 1, rate: 500 },
    ],
    taxRate: 10,
    notes: 'Thank you for your business! Payment is due within 30 days.\nBank: Example Bank\nAccount: 1234567890',
    status: 'unpaid',
    createdAt: new Date().toISOString(),
  };
}

export function createEmptyInvoice(): Invoice {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 30);

  return {
    id: uuidv4(),
    invoiceNumber: `INV-${String(Date.now()).slice(-3)}`,
    date: today.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    senderName: '',
    senderEmail: '',
    senderAddress: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    lineItems: [{ id: uuidv4(), description: '', quantity: 1, rate: 0 }],
    taxRate: 0,
    notes: '',
    status: 'unpaid',
    createdAt: new Date().toISOString(),
  };
}
