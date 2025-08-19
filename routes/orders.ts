// server/routes/orders.ts
import { Router } from 'express';
import Product from '../models/Product';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const router = Router();

// Use a consistent invoices folder at project root (easier to serve statically)
const INVOICES_DIR = path.resolve(process.cwd(), 'invoices');
if (!fs.existsSync(INVOICES_DIR)) {
  fs.mkdirSync(INVOICES_DIR, { recursive: true });
}

/**
 * Helper to format currency
 */
const formatKsh = (value = 0) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(value);

/**
 * Generate a nicer PDF invoice and return absolute file path when done.
 */
const generateInvoice = (orderData: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const filePath = path.join(INVOICES_DIR, `invoice-${Date.now()}.pdf`);
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header - optionally put a logo if available (uncomment and set path)
      // const logoPath = path.resolve(process.cwd(), 'public', 'img', 'logo.png');
      // if (fs.existsSync(logoPath)) doc.image(logoPath, 50, 45, { width: 100 });

      // Company info (left)
      doc.fontSize(20).font('Helvetica-Bold').text('Electro World', 50, 50);
      doc.fontSize(10).font('Helvetica').text('Electro World Ltd', 50, 75);
      doc.text('Email: electroworldke@gmail.com');
      doc.text('Phone: +254706234072');
      doc.moveDown();

      // Invoice meta (right)
      const invoiceNumber = `INV-${Date.now()}`;
      const invoiceDate = new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' });

      doc.fontSize(12);
      doc.text(`Invoice: ${invoiceNumber}`, 400, 50, { align: 'right' });
      doc.text(`Date: ${invoiceDate}`, { align: 'right' });
      doc.moveDown(2);

      // Bill to
      doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', 50);
      doc.fontSize(10).font('Helvetica').text(orderData.name || '-');
      doc.text(orderData.email || '-');
      doc.text(orderData.phone || '-');
      doc.text(orderData.location || '-');
      doc.moveDown();

      // Draw items table header
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.font('Helvetica-Bold');
      doc.text('Qty', 50, doc.y + 6, { width: 50 });
      doc.text('Description', 100, doc.y, { width: 300 });
      doc.text('Unit', 400, doc.y, { width: 80, align: 'right' });
      doc.text('Total', 480, doc.y, { width: 80, align: 'right' });
      doc.moveDown(1);
      doc.font('Helvetica');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      // Items rows
      let y = doc.y + 8;
      let subtotal = 0;
      (orderData.items || []).forEach((item: any) => {
        const qty = item.quantity || 1;
        const unit = item.price || 0;
        const lineTotal = qty * unit;
        subtotal += lineTotal;

        // Ensure new page if overflow
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        doc.text(String(qty), 50, y);
        doc.text(String(item.name || 'Item'), 100, y, { width: 300 });
        doc.text(formatKsh(unit), 400, y, { width: 80, align: 'right' });
        doc.text(formatKsh(lineTotal), 480, y, { width: 80, align: 'right' });

        y += 20;
      });

      // Totals area
      doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
      doc.font('Helvetica-Bold');
      doc.text('Subtotal', 400, y + 20, { width: 80, align: 'right' });
      doc.text(formatKsh(subtotal), 480, y + 20, { width: 80, align: 'right' });

      doc.font('Helvetica-Bold');
      doc.text('Delivery', 400, y + 40, { width: 80, align: 'right' });
      doc.text(formatKsh(orderData.deliveryFee || 0), 480, y + 40, { width: 80, align: 'right' });

      doc.fontSize(14).text('Total', 400, y + 70, { width: 80, align: 'right' });
      doc.text(formatKsh(subtotal + (orderData.deliveryFee || 0)), 480, y + 70, {
        width: 80,
        align: 'right',
      });

      // Footer note
      doc.fontSize(10).font('Helvetica').text('Thank you for your order!', 50, 760, {
        align: 'center',
        width: 500,
      });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Send email with HTML body and PDF attachment.
 * Sends to both buyer and seller (buyer receives the invoice).
 */
const sendEmail = async (filePath: string, orderData: any) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const sellerEmail = process.env.SELLER_EMAIL;

  if (!user || !pass || !sellerEmail) {
    throw new Error('Email configuration (EMAIL_USER, EMAIL_PASS, SELLER_EMAIL) is missing.');
  }

  // NOTE: For Gmail + 2FA, create an App Password and use it as EMAIL_PASS.
  // For production, consider OAuth2 with nodemailer for Gmail or use a transactional provider (SendGrid, Mailgun).
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const invoiceFilename = path.basename(filePath);
  const publicUrlBase = process.env.SERVER_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
  const invoiceUrl = `${publicUrlBase}/invoices/${invoiceFilename}`;

  const htmlBody = `
  <div style="font-family: Arial,Helvetica,sans-serif; color: #222;">
    <h2 style="margin-bottom:0.2rem">Electro World — Invoice</h2>
    <p style="margin-top:0.2rem; color:#666">Invoice for your recent order. Invoice number: <strong>${invoiceFilename}</strong></p>

    <h3>Order Summary</h3>
    <table style="width:100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align:left; padding:6px; border-bottom:1px solid #eee">Item</th>
          <th style="text-align:right; padding:6px; border-bottom:1px solid #eee">Qty</th>
          <th style="text-align:right; padding:6px; border-bottom:1px solid #eee">Unit</th>
          <th style="text-align:right; padding:6px; border-bottom:1px solid #eee">Total</th>
        </tr>
      </thead>
      <tbody>
        ${(orderData.items || [])
          .map((i: any) => {
            const lineTotal = ((i.price || 0) * (i.quantity || 0)) | 0;
            return `<tr>
              <td style="padding:6px 0">${i.name}</td>
              <td style="text-align:right">${i.quantity}</td>
              <td style="text-align:right">${formatKsh(i.price)}</td>
              <td style="text-align:right">${formatKsh(lineTotal)}</td>
            </tr>`;
          })
          .join('')}
      </tbody>
    </table>

    <p style="margin-top:10px">
      <strong>Delivery:</strong> ${orderData.deliveryLocation} (${formatKsh(orderData.deliveryFee || 0)})<br/>
      <strong>Total:</strong> ${formatKsh(orderData.total || 0)}
    </p>

    <p>
      You can download the official PDF invoice here: <a href="${invoiceUrl}">Download Invoice</a>
    </p>

    <hr />
    <p style="color:#888; font-size:12px;">If you have any questions reply to this email or call +254706234072</p>
  </div>
  `;

  const toList = [orderData.email, sellerEmail].filter(Boolean).join(','); // buyer + seller

  const mailOptions = {
    from: user,
    to: toList,
    subject: `Electro World — Invoice for ${orderData.name}`,
    text: `Invoice attached for your recent order. Total: Ksh ${orderData.total}`,
    html: htmlBody,
    attachments: [
      {
        filename: invoiceFilename,
        path: filePath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);

  return { invoiceUrl, invoiceFilename };
};

router.post('/checkout', async (req, res) => {
  const { name, phone, email, location, cart, deliveryLocation } = req.body;

  if (!name || !phone || !email || !location || !cart || !deliveryLocation) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    // Lookup products
    const productIds = cart.map((item: any) => item.id);
    const products = await Product.find({ _id: { $in: productIds } }).exec();

    const productMap = new Map<string, any>();
    products.forEach((product: any) => productMap.set(product._id.toString(), product));

    const orderItems = cart
      .map((item: any) => {
        const product = productMap.get(item.id);
        if (!product) return null;
        const base = typeof product.toObject === 'function' ? product.toObject() : product;
        return { ...base, quantity: item.quantity };
      })
      .filter(Boolean);

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'No valid products in cart' });
    }

    const deliveryFee = deliveryLocation === 'Nairobi' ? 200 : 400;
    const subtotal = orderItems.reduce((sum: number, it: any) => sum + (it.price || 0) * (it.quantity || 0), 0);
    const total = subtotal + deliveryFee;

    const orderData = {
      name,
      phone,
      email,
      location,
      items: orderItems,
      deliveryLocation,
      deliveryFee,
      total,
    };

    // Generate PDF
    const filePath = await generateInvoice(orderData);

    // Send email (buyer + seller), and get public invoice URL
    const { invoiceUrl, invoiceFilename } = await sendEmail(filePath, orderData);

    // Optionally delete the PDF after sending (set env CLEAN_INVOICE_FILES to 'true' to remove)
    if (process.env.CLEAN_INVOICE_FILES === 'true') {
      // delay short time to avoid race if hosting static files — or remove immediately if not serving
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete invoice file:', err);
      });
    }

    const sellerPhone = process.env.SELLER_PHONE;
    if (!sellerPhone) {
      return res.status(500).json({ message: 'Seller WhatsApp number not configured.' });
    }

    const message = encodeURIComponent(
      `*New Order!*%0A%0AName: ${name}%0APhone: ${phone}%0AEmail: ${email}%0ALocation: ${location}%0ADelivery: ${deliveryLocation} (Ksh ${deliveryFee})%0ATotal: Ksh ${total}%0A%0AItems:%0A${orderItems
        .map((i: any) => `${i.name} x ${i.quantity}`)
        .join('%0A')}`
    );

    const whatsappUrl = `https://wa.me/${sellerPhone.replace('+', '')}?text=${message}`;

    res.json({
      success: true,
      whatsappUrl,
      invoiceUrl, // absolute URL
      invoiceFilename,
    });
  } catch (err: any) {
    console.error('Order processing error:', err);
    res.status(500).json({ message: 'Failed to process order', error: err.message });
  }
});

export default router;
