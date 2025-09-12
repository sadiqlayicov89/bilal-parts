import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { X, Printer, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { calculateCartTotals, formatPrice } from '../utils/priceUtils';
import { useToast } from '../hooks/use-toast';
import SupabaseService from '../services/supabaseService';

const InvoiceModal = ({ isOpen, onClose, orderData, cartItems, invoiceNumber: propInvoiceNumber }) => {
  const invoiceRef = useRef(null);
  const invoiceNumber = propInvoiceNumber || `BP${Date.now().toString().slice(-10)}`;
  const currentDate = new Date().toLocaleDateString('ru-RU');
  const { userDiscount, user } = useAuth();
  const { clearCart } = useCart();
  const { toast } = useToast();
  
  // Get user metadata
  const userMeta = user?.user_metadata || {};

  // Calculate totals with user discount
  const getInvoiceTotals = () => {
    if (!cartItems || cartItems.length === 0) {
      return {
        subtotal: 0,
        discountAmount: 0,
        discountPercentage: 0,
        total: 0,
        totalVAT: 0,
        totalBasePrice: 0
      };
    }
    
    const orderItems = cartItems.map(item => ({
      price: item.product ? item.product.price : item.price,
      quantity: item.quantity
    }));
    
    const totals = calculateCartTotals(orderItems, userDiscount);
    
    return {
      ...totals,
      totalVAT: totals.total - (totals.total / 1.20),
      totalBasePrice: totals.total / 1.20
    };
  };

  const invoiceTotals = getInvoiceTotals();

  const validUntil = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString('ru-RU');
  })();

  const handleConfirmOrder = async () => {
    try {
      // Create order data for Supabase
      const orderDataForSupabase = {
        order_number: invoiceNumber, // Use order_number instead of id
        user_id: user?.id,
        user_email: user?.email,
        user_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Admin User',
        company: orderData?.company || 'N/A',
        inn: orderData?.inn || 'N/A',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        subtotal: invoiceTotals.subtotal,
        discount_amount: invoiceTotals.discountAmount,
        discount_percentage: invoiceTotals.discountPercentage,
        total: invoiceTotals.total,
        total_amount: invoiceTotals.total, // Add total_amount field
        shipping_address: orderData?.address || 'г. Москва, ул. Примерная, д. 123',
        payment_method: 'Bank Transfer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Create order items data for Supabase
      const orderItemsData = cartItems.map(item => ({
        order_id: invoiceNumber,
        product_id: item.product?.id || null,
        quantity: item.quantity,
        price: item.product ? item.product.price : item.price,
        total: (item.product ? item.product.price : item.price) * item.quantity
        // Removed: name, sku, catalog_number - these columns don't exist in order_items table
      }));

      console.log('Creating order in Supabase:', orderDataForSupabase);
      console.log('Creating order items in Supabase:', orderItemsData);

      // Save order to Supabase
      const createdOrder = await SupabaseService.createOrder(orderDataForSupabase, orderItemsData);
      console.log('Order created in Supabase:', createdOrder);

      // Create notification in Supabase
      const notificationData = {
        user_id: user?.id,
        type: 'new_order',
        title: 'Yeni Sifariş Təsdiqləndi',
        message: `${user?.first_name || 'Admin'} ${user?.last_name || 'User'} tərəfindən sifariş təsdiqləndi`,
        is_read: false,
        data: {
          order_number: invoiceNumber,
          order_total: invoiceTotals.total,
          customer_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || 'N/A',
          discount: invoiceTotals.discountPercentage > 0 ? `${invoiceTotals.discountPercentage}%` : null
        }
      };

      console.log('Creating notification in Supabase:', notificationData);
      await SupabaseService.createNotification(notificationData);

      // Dispatch events for real-time updates
      window.dispatchEvent(new CustomEvent('newAdminNotification', { detail: notificationData }));
      window.dispatchEvent(new CustomEvent('orderConfirmed', { detail: createdOrder }));

      // Clear cart after order confirmation
      await clearCart();

      // Show success message
      toast({
        title: 'Sifariş Təsdiqləndi',
        description: `Sifariş #${invoiceNumber} uğurla təsdiqləndi və Supabase-ə yazıldı. Səbət təmizləndi.`,
        variant: 'default'
      });

      // Close modal
      onClose();

    } catch (error) {
      console.error('Error creating order in Supabase:', error);
      
      // Show error message instead of fallback
      toast({
        title: 'Sifariş Xətası',
        description: `Sifariş yaradıla bilmədi: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Пожалуйста, разрешите всплывающие окна для печати');
      return;
    }

    const vatRate = 20; // 20% VAT included in price
    const totalAmountAll = Number(invoiceTotals.total || 0);
    const vatIncludedTotalAll = Number(((totalAmountAll * vatRate) / (100 + vatRate)).toFixed(2));
    const totalWithoutVatAll = Number((totalAmountAll - vatIncludedTotalAll).toFixed(2));

    const classicHTML = `<!DOCTYPE html><html><head><meta charset="utf-8" />
      <title>Счет на оплату ${invoiceNumber}</title>
          <style>
        @page { size: A4; margin: 1.5cm; }
        * { box-sizing: border-box; }
        body { font-family: 'Times New Roman', serif; font-size: 12px; color: #000; }
        .note { font-size: 10px; text-align: center; margin-bottom: 6px; }
        .sample { font-size: 10px; text-align: center; margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; }
        .bank td { border: 1px solid #000; padding: 4px 6px; }
        .bank .left { width: 60%; }
        .bank .right { width: 40%; }
        .title { font-weight: bold; font-size: 16px; margin: 12px 0 8px 0; }
        .bold { font-weight: bold; }
        .items th, .items td { border: 1px solid #000; padding: 6px; }
        .items th { background: #f0f0f0; text-align: center; }
        .flex { display: flex; justify-content: space-between; }
        .sign { display: flex; justify-content: space-between; margin-top: 24px; }
        .line { display: inline-block; width: 220px; height: 14px; border-bottom: 1px solid #000; }
        .footer { font-size: 10px; text-align: center; margin-top: 10px; }
        img { max-height: 146px !important; max-width: 257px !important; width: auto !important; }
      </style></head><body>
        <div class="note">Внимание! Оплата данного счета означает согласие с условиями поставки товара. Уведомление об оплате обязательно, в противном случае не гарантируется наличие товара на складе. Товар отпускается по факту прихода денег на р/с Поставщика, самовывозом, при наличии доверенности и паспорта.</div>
        <div class="sample">Образец заполнения платежного поручения</div>
        <table class="bank">
          <tr>
            <td class="left">
              <div class="bold" style="font-size:10px">Банк получателя</div>
              <div>T-BANK</div>
              <div style="font-size:10px">ИНН 7707083893 КПП 770701001</div>
              <div style="font-size:10px">Получатель</div>
              <div>ООО "Bilal-parts"</div>
            </td>
            <td class="right">
              <div class="flex"><span style="font-size:10px">БИК</span><span>044525225</span></div>
              <div class="flex"><span style="font-size:10px">Сч. №</span><span>30101810200000000225</span></div>
              <div class="flex"><span style="font-size:10px">КПП</span><span>770701001</span></div>
              <div class="flex"><span style="font-size:10px">Сч. №</span><span>40702810123456789012</span></div>
            </td>
          </tr>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center; margin: 12px 0 8px 0;">
          <div style="font-weight: bold; font-size: 16px;">Счет на оплату № ${invoiceNumber} от ${currentDate}</div>
          <div style="font-size: 10px; text-align: right;">
            <div>Валюта: RUB</div>
            <div style="margin-top: 4px;">
              <img 
                src="/Логотип основной-1.png" 
                alt="Bilal Parts Logo" 
                style={{ 
                  height: '146px', 
                  width: 'auto',
                  maxWidth: '257px'
                }} 
              />
            </div>
          </div>
        </div>

        <table style="margin-bottom:8px;">
          <tr>
            <td style="width:110px" class="bold">Поставщик:</td>
            <td>ИНН 7707083893, КПП 770701001, ООО "Bilal-parts", г. Москва, ул. Примерная, д. 123</td>
                 </tr>
          <tr>
            <td class="bold">Покупатель:</td>
            <td>${(userMeta.first_name || user?.first_name || '')} ${(userMeta.last_name || user?.last_name || '')}, ${(orderData?.company || userMeta.company_name || 'N/A')}, ИНН ${(orderData?.inn || userMeta.vat_number || 'N/A')}, ${(orderData?.address || userMeta.address || userMeta.city || 'г. Москва, ул. Примерная, д. 123')}</td>
                 </tr>
             </table>

        <div style="font-size:10px">Действителен до ${validUntil}</div>

        <table class="items" style="margin-top:8px;">
              <thead>
                <tr>
              <th style="width:30px;">№</th>
              <th>Товар</th>
              <th style="width:90px;">Код</th>
              <th style="width:60px;">Кол-во</th>
              <th style="width:50px;">Ед.</th>
              <th style="width:80px;">Цена</th>
              <th style="width:90px;">в т.ч. НДС</th>
              <th style="width:90px;">Всего</th>
                </tr>
              </thead>
              <tbody>
            ${(cartItems || []).map((item, idx) => {
              const originalPrice = item.product ? item.product.price : item.price;
              const discountAmount = userDiscount > 0 ? (originalPrice * userDiscount) / 100 : 0;
              const discountedPrice = originalPrice - discountAmount;
              const itemTotal = discountedPrice * item.quantity;
              const itemVat = Number(((itemTotal * vatRate) / (100 + vatRate)).toFixed(2));
              return `<tr>
                <td style="text-align:center;">${idx + 1}</td>
                <td>${item.product ? item.product.name : item.name}</td>
                <td>${item.product?.catalogNumber || ''}</td>
                <td style="text-align:center;">${item.quantity}</td>
                <td style="text-align:center;">шт</td>
                <td style="text-align:right;">${discountedPrice.toFixed(2)}</td>
                <td style="text-align:right;">${itemVat.toFixed(2)}</td>
                <td style="text-align:right;">${itemTotal.toFixed(2)}</td>
              </tr>`;
            }).join('')}
              </tbody>
            </table>

        <div style="margin-top:8px; text-align:right;">
          ${invoiceTotals.discountPercentage > 0 ? `
            <div style="font-size:12px; color:#666;">Сумма без скидки: ${invoiceTotals.subtotal.toFixed(2)} RUB</div>
            <div style="font-size:12px; color:#dc2626;">Скидка (${invoiceTotals.discountPercentage}%): -${invoiceTotals.discountAmount.toFixed(2)} RUB</div>
            <div style="font-size:12px; margin-bottom:4px;">Сумма со скидкой: ${invoiceTotals.total.toFixed(2)} RUB</div>
          ` : ''}
          <div>Итого НДС: <strong>${vatIncludedTotalAll.toFixed(2)}</strong></div>
          <div>Итого без НДС: <strong>${totalWithoutVatAll.toFixed(2)}</strong></div>
          <div style="font-size:14px; margin-top:6px;">Итого к оплате: <strong>${totalAmountAll.toFixed(2)} RUB</strong></div>
        </div>

        <div class="sign">
          <div>Руководитель <span class="line"></span></div>
          <div>Бухгалтер <span class="line"></span></div>
            </div>

        <div class="footer">Внимание! Товар в поврежденной, грязной упаковке или без упаковки возврату не подлежит!</div>
      </body></html>`;

    printWindow.document.write(classicHTML);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); printWindow.close(); };
  };

  const downloadPdf = async () => {
    try {
      const element = invoiceRef.current;
      if (!element) return;
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`invoice_${invoiceNumber}.pdf`);
    } catch (e) {
      alert('Не удалось сохранить PDF');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto [&>button]:!hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-600 rounded mr-2"></div>
              <span>Счет на оплату</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center"
              >
                <Printer className="w-4 h-4 mr-2" />
                Печать
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPdf}
                className="flex items-center"
              >
                <Printer className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmOrder}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div ref={invoiceRef} className="invoice-content bg-white p-6">
          <style dangerouslySetInnerHTML={{
            __html: `
              @media print {
                .invoice-logo {
                  height: 146px !important;
                  max-width: 257px !important;
                  width: auto !important;
                }
                img {
                  max-height: 146px !important;
                  max-width: 257px !important;
                }
              }
            `
          }} />
          <div style={{ fontSize: 10, textAlign: 'center', marginBottom: 6 }}>
            Внимание! Оплата данного счета означает согласие с условиями поставки товара. Уведомление об оплате обязательно, в противном случае не гарантируется наличие товара на складе. Товар отпускается по факту прихода денег на р/с Поставщика, самовывозом, при наличии доверенности и паспорта.
          </div>
          <div style={{ fontSize: 10, textAlign: 'center', marginBottom: 6 }}>Образец заполнения платежного поручения</div>

          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '4px 6px', width: '60%' }}>
                  <div style={{ fontSize: 10 }}>Банк получателя</div>
                  <div>T-BANK</div>
                  <div style={{ fontSize: 10 }}>ИНН 7707083893 КПП 770701001</div>
                  <div style={{ fontSize: 10 }}>Получатель</div>
                  <div>ООО "Bilal-parts"</div>
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 6px', width: '40%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10 }}>БИК</span><span>044525225</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10 }}>Сч. №</span><span>30101810200000000225</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10 }}>КПП</span><span>770701001</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 10 }}>Сч. №</span><span>40702810123456789012</span></div>
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0 8px 0' }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Счет на оплату № {invoiceNumber} от {currentDate}</div>
            <div style={{ fontSize: 10, textAlign: 'right' }}>
              <div>Валюта: RUB</div>
              <div style={{ marginTop: 4 }}>
                <img 
                  src="/Логотип основной-1.png" 
                  alt="Bilal Parts Logo" 
                  className="invoice-logo"
                  style={{ 
                    height: '98px', 
                    width: 'auto',
                    maxWidth: '238px'
                  }} 
                />
              </div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
            <tbody>
              <tr>
                <td style={{ width: 110, fontWeight: 700, padding: '2px 0' }}>Поставщик:</td>
                <td>ИНН 7707083893, КПП 770701001, ООО "Bilal-parts", г. Москва, ул. Примерная, д. 123</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, padding: '2px 0' }}>Покупатель:</td>
                <td>{userMeta.first_name || user?.first_name || ''} {userMeta.last_name || user?.last_name || ''}, {orderData?.company || userMeta.company_name || 'N/A'}, ИНН {orderData?.inn || userMeta.vat_number || 'N/A'}, {orderData?.address || userMeta.address || userMeta.city || 'г. Москва, ул. Примерная, д. 123'}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ fontSize: 10 }}>Действителен до {validUntil}</div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #000', background: '#f0f0f0', padding: 6, width: 30 }}>№</th>
                <th style={{ border: '1px solid #000', background: '#f0f0f0', padding: 6 }}>Товар</th>
                <th style={{ border: '1px solid #000', background: '#f0f0f0', padding: 6, width: 90 }}>Код</th>
                <th style={{ border: '1px solid #000', background: '#f0f0f0', padding: 6, width: 60 }}>Кол-во</th>
                <th style={{ border: '1px solid #000', background: '#f0f0f0', padding: 6, width: 50 }}>Ед.</th>
                <th style={{ border: '1px solid #000', background: '#f0f0f0', padding: 6, width: 80 }}>Цена</th>
                <th style={{ border: '1px solid #000', background: '#f0f0f0', padding: 6, width: 90 }}>в т.ч. НДС</th>
                <th style={{ border: '1px solid #000', background: '#f0f0f0', padding: 6, width: 90 }}>Всего</th>
              </tr>
            </thead>
            <tbody>
              {(cartItems || []).map((item, index) => {
                const originalPrice = item.product ? item.product.price : item.price;
                const discountAmount = userDiscount > 0 ? (originalPrice * userDiscount) / 100 : 0;
                const discountedPrice = originalPrice - discountAmount;
                const itemTotal = discountedPrice * item.quantity;
                const itemVat = Number(((itemTotal * 20) / (100 + 20)).toFixed(2));
                
                return (
                  <tr key={item.product?.id || index}>
                    <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ border: '1px solid #000', padding: 6 }}>
                      {item.product ? item.product.name : item.name}
                    </td>
                    <td style={{ border: '1px solid #000', padding: 6 }}>{item.product?.catalogNumber || ''}</td>
                    <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center' }}>шт</td>
                    <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>
                      {discountedPrice.toFixed(2)}
                    </td>
                    <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>{itemVat.toFixed(2)}</td>
                    <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>{itemTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: 8, textAlign: 'right' }}>
            {/* Show discount info if applicable */}
            {invoiceTotals.discountPercentage > 0 && (
              <>
                <div style={{ fontSize: 12, color: '#666' }}>Сумма без скидки: {invoiceTotals.subtotal.toFixed(2)} RUB</div>
                <div style={{ fontSize: 12, color: '#dc2626' }}>Скидка ({invoiceTotals.discountPercentage}%): -{invoiceTotals.discountAmount.toFixed(2)} RUB</div>
                <div style={{ fontSize: 12, marginBottom: 4 }}>Сумма со скидкой: {invoiceTotals.total.toFixed(2)} RUB</div>
              </>
            )}
            <div>Итого НДС: <strong>{invoiceTotals.totalVAT.toFixed(2)}</strong></div>
            <div>Итого без НДС: <strong>{invoiceTotals.totalBasePrice.toFixed(2)}</strong></div>
            <div style={{ fontSize: 14, marginTop: 6 }}>Итого к оплате: <strong>{invoiceTotals.total.toFixed(2)} RUB</strong></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <div>Руководитель <span style={{ display: 'inline-block', width: 220, height: 14, borderBottom: '1px solid #000' }}></span></div>
            <div>Бухгалтер <span style={{ display: 'inline-block', width: 220, height: 14, borderBottom: '1px solid #000' }}></span></div>
          </div>

          <div style={{ fontSize: 10, textAlign: 'center', marginTop: 10 }}>Внимание! Товар в поврежденной, грязной упаковке или без упаковки возврату не подлежит!</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;