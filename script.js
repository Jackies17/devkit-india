/* DevKit India Core Interactive Logic */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Navigation & Scroll Effects
  // ==========================================
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  // Change navbar background on scroll past 60px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.className = 'ti ti-x';
    } else {
      icon.className = 'ti ti-menu-2';
    }
  });

  // Close mobile menu when a link is clicked
  const navAnchors = navLinks.querySelectorAll('a');
  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'ti ti-menu-2';
    });
  });

  // ==========================================
  // 2. IntersectionObserver for Scroll Animations
  // ==========================================
  const animatedSections = document.querySelectorAll('.fade-in-up-scroll');
  const observerOptions = {
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerInstance.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  animatedSections.forEach(section => {
    observer.observe(section);
  });

  // ==========================================
  // 3. Tab Switching for Tool 1 (PDF/Resume)
  // ==========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active states
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      // Add active state to clicked button
      btn.classList.add('active');

      // Show matching panel
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // ==========================================
  // 4. Tool 1: PDF Merger Logic
  // ==========================================
  let selectedPdfFiles = [];
  const pdfDragZone = document.getElementById('pdf-drag-zone');
  const pdfFileInput = document.getElementById('pdf-file-input');
  const pdfFileList = document.getElementById('pdf-file-list');
  const btnMergePdf = document.getElementById('btn-merge-pdf');
  const btnClearPdf = document.getElementById('btn-clear-pdf');

  // Click on zone triggers file input
  pdfDragZone.addEventListener('click', () => pdfFileInput.click());

  // Handle file selections
  pdfFileInput.addEventListener('change', (e) => {
    handlePdfFiles(e.target.files);
  });

  // Drag over / leave effects
  ['dragenter', 'dragover'].forEach(eventName => {
    pdfDragZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      pdfDragZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    pdfDragZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      pdfDragZone.classList.remove('dragover');
    }, false);
  });

  // Handle drop
  pdfDragZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    handlePdfFiles(dt.files);
  });

  function handlePdfFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'application/pdf') {
        selectedPdfFiles.push(file);
      } else {
        alert(`${file.name} is not a PDF file.`);
      }
    }
    renderPdfFileList();
  }

  function renderPdfFileList() {
    pdfFileList.innerHTML = '';
    
    if (selectedPdfFiles.length === 0) {
      pdfDragZone.classList.remove('has-files');
      btnMergePdf.disabled = true;
      btnClearPdf.style.display = 'none';
      return;
    }

    pdfDragZone.classList.add('has-files');
    btnMergePdf.disabled = selectedPdfFiles.length < 2;
    btnClearPdf.style.display = 'inline-flex';

    selectedPdfFiles.forEach((file, index) => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      const li = document.createElement('li');
      li.className = 'pdf-file-item';
      li.innerHTML = `
        <div class="file-info">
          <i class="ti ti-file-type-pdf"></i>
          <span title="${file.name}">${file.name} (${sizeMB} MB)</span>
        </div>
        <div class="file-actions">
          <button class="btn-move-up" data-index="${index}" title="Move Up" ${index === 0 ? 'disabled style="opacity: 0.3;"' : ''}>
            <i class="ti ti-arrow-up"></i>
          </button>
          <button class="btn-move-down" data-index="${index}" title="Move Down" ${index === selectedPdfFiles.length - 1 ? 'disabled style="opacity: 0.3;"' : ''}>
            <i class="ti ti-arrow-down"></i>
          </button>
          <button class="btn-remove danger" data-index="${index}" title="Remove">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      `;
      pdfFileList.appendChild(li);
    });

    // Attach actions to file list items
    pdfFileList.querySelectorAll('.btn-move-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-index'));
        if (index > 0) {
          const temp = selectedPdfFiles[index];
          selectedPdfFiles[index] = selectedPdfFiles[index - 1];
          selectedPdfFiles[index - 1] = temp;
          renderPdfFileList();
        }
      });
    });

    pdfFileList.querySelectorAll('.btn-move-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-index'));
        if (index < selectedPdfFiles.length - 1) {
          const temp = selectedPdfFiles[index];
          selectedPdfFiles[index] = selectedPdfFiles[index + 1];
          selectedPdfFiles[index + 1] = temp;
          renderPdfFileList();
        }
      });
    });

    pdfFileList.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-index'));
        selectedPdfFiles.splice(index, 1);
        renderPdfFileList();
      });
    });
  }

  btnClearPdf.addEventListener('click', () => {
    selectedPdfFiles = [];
    pdfFileInput.value = '';
    renderPdfFileList();
  });

  // Client-side PDF Merging with PDF-Lib
  btnMergePdf.addEventListener('click', async () => {
    if (selectedPdfFiles.length < 2) return;
    
    btnMergePdf.disabled = true;
    const originalText = btnMergePdf.innerHTML;
    btnMergePdf.innerHTML = `<i class="ti ti-loader animate-spin"></i> Merging...`;

    try {
      // Check if PDFLib is loaded
      if (typeof PDFLib === 'undefined') {
        throw new Error('PDF-Lib script not loaded yet. Please check your internet connection.');
      }

      const mergedPdf = await PDFLib.PDFDocument.create();

      for (const file of selectedPdfFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      
      // Download file directly client-side
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'merged_devkit_india.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('PDFs successfully merged and downloaded!');
      
      // Reset after success
      selectedPdfFiles = [];
      pdfFileInput.value = '';
      renderPdfFileList();

    } catch (error) {
      console.error(error);
      alert('Error merging PDFs: ' + error.message);
    } finally {
      btnMergePdf.disabled = false;
      btnMergePdf.innerHTML = originalText;
    }
  });

  // ==========================================
  // 5. Tool 1: Resume Builder Logic
  // ==========================================
  const btnGenerateResume = document.getElementById('btn-generate-resume');

  btnGenerateResume.addEventListener('click', () => {
    const name = document.getElementById('res-name').value || 'John Doe';
    const title = document.getElementById('res-title').value || 'Professional Builder';
    const email = document.getElementById('res-email').value || 'john.doe@example.com';
    const phone = document.getElementById('res-phone').value || '+91 99999 99999';
    const location = document.getElementById('res-location').value || 'Bengaluru, India';
    const website = document.getElementById('res-website').value || 'github.com/johndoe';
    const summary = document.getElementById('res-summary').value || 'Experienced professional looking to build modern web solutions.';
    const experience = document.getElementById('res-experience').value || '';
    const education = document.getElementById('res-education').value || '';
    const skills = document.getElementById('res-skills').value || 'HTML, CSS, JavaScript';

    // Format experience lists
    let expHtml = '';
    if (experience.trim()) {
      const expItems = experience.split('\n\n');
      expItems.forEach(item => {
        const lines = item.split('\n');
        const header = lines[0] || '';
        const bodyLines = lines.slice(1);
        
        let headerParts = header.split('|').map(x => x.trim());
        let company = headerParts[0] || '';
        let role = headerParts[1] || '';
        let period = headerParts[2] || '';
        
        let bodyHtml = '';
        bodyLines.forEach(bl => {
          if (bl.trim()) {
            bodyHtml += `<li>${bl.replace(/^-\s*/, '')}</li>`;
          }
        });

        expHtml += `
          <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; color: #1A1D27; font-size: 14px;">
              <span>${role} at ${company}</span>
              <span style="color: #6C63FF; font-weight: 500;">${period}</span>
            </div>
            ${bodyHtml ? `<ul style="margin: 6px 0 0 16px; padding: 0; color: #4A4E69; font-size: 13px;">${bodyHtml}</ul>` : ''}
          </div>
        `;
      });
    } else {
      expHtml = `<p style="color: #8B8FA8; font-size: 13px;">No work experience provided.</p>`;
    }

    // Format education
    let eduHtml = '';
    if (education.trim()) {
      const eduItems = education.split('\n');
      eduItems.forEach(item => {
        let parts = item.split('|').map(x => x.trim());
        let degree = parts[0] || '';
        let school = parts[1] || '';
        let year = parts[2] || '';
        eduHtml += `
          <div style="margin-bottom: 12px; font-size: 13px; color: #4A4E69;">
            <div style="font-weight: 700; color: #1A1D27;">${degree}</div>
            <div>${school} ${year ? `· ${year}` : ''}</div>
          </div>
        `;
      });
    } else {
      eduHtml = `<p style="color: #8B8FA8; font-size: 13px;">No education details provided.</p>`;
    }

    // Skills pill tags
    const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);
    let skillsHtml = '';
    skillsList.forEach(s => {
      skillsHtml += `<span style="background-color: #F1F2F6; color: #1A1D27; font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-right: 6px; margin-bottom: 6px; border: 1px solid #E1E3EA;">${s}</span>`;
    });

    // Build the Resume container
    const resumeContainer = document.createElement('div');
    resumeContainer.style.width = '210mm';
    resumeContainer.style.minHeight = '297mm';
    resumeContainer.style.padding = '20mm';
    resumeContainer.style.backgroundColor = '#FFFFFF';
    resumeContainer.style.color = '#1A1D27';
    resumeContainer.style.fontFamily = "'Inter', sans-serif";
    resumeContainer.style.boxSizing = 'border-box';
    resumeContainer.style.lineHeight = '1.5';

    resumeContainer.innerHTML = `
      <!-- Header -->
      <div style="border-bottom: 2px solid #FF9933; padding-bottom: 16px; margin-bottom: 20px;">
        <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: 28px; margin: 0; color: #1A1D27; font-weight: 700; letter-spacing: -0.02em;">${name}</h1>
        <div style="font-size: 16px; color: #6C63FF; font-weight: 600; margin-top: 4px;">${title}</div>
        
        <div style="display: flex; flex-wrap: wrap; gap: 4px 16px; margin-top: 10px; font-size: 12px; color: #4A4E69;">
          <span><i class="ti ti-mail"></i> ${email}</span>
          <span><i class="ti ti-phone"></i> ${phone}</span>
          <span><i class="ti ti-map-pin"></i> ${location}</span>
          ${website ? `<span><i class="ti ti-world"></i> ${website}</span>` : ''}
        </div>
      </div>

      <!-- Professional Summary -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #6C63FF; border-bottom: 1px solid #E1E3EA; padding-bottom: 4px; margin-top: 0; margin-bottom: 8px;">Professional Profile</h2>
        <p style="font-size: 13px; color: #4A4E69; margin: 0;">${summary}</p>
      </div>

      <!-- Work Experience -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #6C63FF; border-bottom: 1px solid #E1E3EA; padding-bottom: 4px; margin-top: 0; margin-bottom: 12px;">Experience</h2>
        ${expHtml}
      </div>

      <!-- Education & Skills Side-by-Side / Columns -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <div>
          <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #6C63FF; border-bottom: 1px solid #E1E3EA; padding-bottom: 4px; margin-top: 0; margin-bottom: 12px;">Education</h2>
          ${eduHtml}
        </div>
        <div>
          <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #6C63FF; border-bottom: 1px solid #E1E3EA; padding-bottom: 4px; margin-top: 0; margin-bottom: 12px;">Core Skills</h2>
          <div style="display: flex; flex-wrap: wrap; margin-top: 6px;">
            ${skillsHtml}
          </div>
        </div>
      </div>
    `;

    // Export PDF using html2pdf.js
    if (typeof html2pdf === 'undefined') {
      alert('html2pdf library is not loaded. Please try again in a moment.');
      return;
    }

    const options = {
      margin: 0,
      filename: `${name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2.5, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(resumeContainer).set(options).save().catch(err => {
      console.error(err);
      alert('Failed to export PDF: ' + err.message);
    });
  });

  // ==========================================
  // 6. Tool 2: GST Invoice Calculator Logic
  // ==========================================
  const gstItemsContainer = document.getElementById('gst-items-container');
  const btnGstAddItem = document.getElementById('btn-gst-add-item');
  const btnTaxIntra = document.getElementById('btn-tax-intra');
  const btnTaxInter = document.getElementById('btn-tax-inter');
  const receiptSubtotal = document.getElementById('gst-receipt-subtotal');
  const receiptCgst = document.getElementById('gst-receipt-cgst');
  const receiptSgst = document.getElementById('gst-receipt-sgst');
  const receiptIgst = document.getElementById('gst-receipt-igst');
  const receiptTotal = document.getElementById('gst-receipt-total');
  const btnDownloadInvoice = document.getElementById('btn-download-invoice');

  const rowCgst = document.getElementById('row-cgst');
  const rowSgst = document.getElementById('row-sgst');
  const rowIgst = document.getElementById('row-igst');

  let taxStructure = 'intra'; // 'intra' (CGST/SGST) or 'inter' (IGST)

  // Default item lists
  const defaultItems = [
    { desc: 'Web Development Services', price: 50000, qty: 1, rate: 18 }
  ];

  // Initialize line items
  defaultItems.forEach(item => addGSTItemRow(item.desc, item.price, item.qty, item.rate));
  calculateGST();

  // Add Item Click
  btnGstAddItem.addEventListener('click', () => {
    addGSTItemRow('', 0, 1, 18);
  });

  // Add Item Row rendering
  function addGSTItemRow(desc = '', price = 0, qty = 1, rate = 18) {
    const row = document.createElement('div');
    row.className = 'gst-item-row';
    row.innerHTML = `
      <input type="text" class="input-field item-desc" placeholder="Item/Service Description" value="${desc}">
      <input type="number" class="input-field item-price" placeholder="Rate" min="0" value="${price}">
      <input type="number" class="input-field item-qty" placeholder="Qty" min="1" value="${qty}">
      <select class="select-field item-rate">
        <option value="0" ${rate === 0 ? 'selected' : ''}>0%</option>
        <option value="5" ${rate === 5 ? 'selected' : ''}>5%</option>
        <option value="12" ${rate === 12 ? 'selected' : ''}>12%</option>
        <option value="18" ${rate === 18 ? 'selected' : ''}>18%</option>
        <option value="28" ${rate === 28 ? 'selected' : ''}>28%</option>
      </select>
      <button class="btn-icon danger btn-item-remove" title="Remove Item">
        <i class="ti ti-trash"></i>
      </button>
    `;
    gstItemsContainer.appendChild(row);

    // Event listeners on new row inputs for automatic calculation
    row.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', calculateGST);
    });

    row.querySelector('.btn-item-remove').addEventListener('click', () => {
      // Ensure we have at least 1 item
      if (gstItemsContainer.querySelectorAll('.gst-item-row').length > 1) {
        row.remove();
        calculateGST();
      } else {
        alert('You must have at least one line item in the invoice.');
      }
    });
  }

  // Tax split toggles
  btnTaxIntra.addEventListener('click', () => {
    taxStructure = 'intra';
    btnTaxIntra.classList.add('active');
    btnTaxInter.classList.remove('active');
    rowCgst.style.display = 'flex';
    rowSgst.style.display = 'flex';
    rowIgst.style.display = 'none';
    calculateGST();
  });

  btnTaxInter.addEventListener('click', () => {
    taxStructure = 'inter';
    btnTaxInter.classList.add('active');
    btnTaxIntra.classList.remove('active');
    rowCgst.style.display = 'none';
    rowSgst.style.display = 'none';
    rowIgst.style.display = 'flex';
    calculateGST();
  });

  // Calculate GST
  function calculateGST() {
    let subtotal = 0;
    let totalTax = 0;

    const rows = gstItemsContainer.querySelectorAll('.gst-item-row');
    rows.forEach(row => {
      const price = parseFloat(row.querySelector('.item-price').value) || 0;
      const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
      const rate = parseFloat(row.querySelector('.item-rate').value) || 0;

      const itemTotal = price * qty;
      const itemTax = itemTotal * (rate / 100);

      subtotal += itemTotal;
      totalTax += itemTax;
    });

    const total = subtotal + totalTax;

    // Currency Formatter
    const inrFormatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });

    receiptSubtotal.textContent = inrFormatter.format(subtotal);

    if (taxStructure === 'intra') {
      const splitTax = totalTax / 2;
      receiptCgst.textContent = inrFormatter.format(splitTax);
      receiptSgst.textContent = inrFormatter.format(splitTax);
      receiptIgst.textContent = inrFormatter.format(0);
    } else {
      receiptCgst.textContent = inrFormatter.format(0);
      receiptSgst.textContent = inrFormatter.format(0);
      receiptIgst.textContent = inrFormatter.format(totalTax);
    }

    receiptTotal.textContent = inrFormatter.format(total);
  }

  // Invoice PDF download handler
  btnDownloadInvoice.addEventListener('click', () => {
    const sellerName = document.getElementById('gst-seller-name').value || 'Freelancer';
    const sellerGst = document.getElementById('gst-seller-gst').value || 'None';
    const buyerName = document.getElementById('gst-buyer-name').value || 'Client';
    const buyerGst = document.getElementById('gst-buyer-gst').value || 'None';

    const inrFormatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });

    // Populate item lines HTML
    let tableRowsHtml = '';
    let subtotal = 0;
    let totalTax = 0;

    const rows = gstItemsContainer.querySelectorAll('.gst-item-row');
    rows.forEach((row, i) => {
      const desc = row.querySelector('.item-desc').value || `Item ${i+1}`;
      const price = parseFloat(row.querySelector('.item-price').value) || 0;
      const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
      const rate = parseFloat(row.querySelector('.item-rate').value) || 0;

      const totalItemValue = price * qty;
      const taxValue = totalItemValue * (rate / 100);

      subtotal += totalItemValue;
      totalTax += taxValue;

      tableRowsHtml += `
        <tr style="border-bottom: 1px solid #E1E3EA;">
          <td style="padding: 10px; font-size: 12px; color: #1A1D27;">${desc}</td>
          <td style="padding: 10px; font-size: 12px; color: #1A1D27; text-align: right;">${inrFormatter.format(price)}</td>
          <td style="padding: 10px; font-size: 12px; color: #1A1D27; text-align: center;">${qty}</td>
          <td style="padding: 10px; font-size: 12px; color: #1A1D27; text-align: center;">${rate}%</td>
          <td style="padding: 10px; font-size: 12px; color: #1A1D27; text-align: right; font-weight: 600;">${inrFormatter.format(totalItemValue)}</td>
        </tr>
      `;
    });

    const invoiceTotal = subtotal + totalTax;

    let taxBreakdownHtml = '';
    if (taxStructure === 'intra') {
      const halfTax = totalTax / 2;
      taxBreakdownHtml = `
        <tr style="font-size: 13px;">
          <td style="padding: 6px 0; color: #4A4E69;">CGST (Central Tax)</td>
          <td style="padding: 6px 0; text-align: right; color: #1A1D27; font-weight: 600;">${inrFormatter.format(halfTax)}</td>
        </tr>
        <tr style="font-size: 13px; border-bottom: 1px solid #E1E3EA;">
          <td style="padding: 6px 0; color: #4A4E69;">SGST (State Tax)</td>
          <td style="padding: 6px 0; text-align: right; color: #1A1D27; font-weight: 600;">${inrFormatter.format(halfTax)}</td>
        </tr>
      `;
    } else {
      taxBreakdownHtml = `
        <tr style="font-size: 13px; border-bottom: 1px solid #E1E3EA;">
          <td style="padding: 6px 0; color: #4A4E69;">IGST (Integrated Tax)</td>
          <td style="padding: 6px 0; text-align: right; color: #1A1D27; font-weight: 600;">${inrFormatter.format(totalTax)}</td>
        </tr>
      `;
    }

    const invoiceDate = new Date().toLocaleDateString('en-IN');
    const invoiceNum = 'INV-' + Math.floor(100000 + Math.random() * 900000);

    // Build the Invoice print element
    const printContainer = document.createElement('div');
    printContainer.style.width = '210mm';
    printContainer.style.minHeight = '297mm';
    printContainer.style.padding = '20mm';
    printContainer.style.backgroundColor = '#FFFFFF';
    printContainer.style.color = '#1A1D27';
    printContainer.style.fontFamily = "'Inter', sans-serif";
    printContainer.style.boxSizing = 'border-box';
    printContainer.style.lineHeight = '1.5';

    printContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #FF9933; padding-bottom: 24px; margin-bottom: 24px;">
        <div>
          <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: 24px; color: #1A1D27; margin: 0; font-weight: 700;">TAX INVOICE</h1>
          <div style="font-size: 13px; color: #4A4E69; margin-top: 4px;">Date: ${invoiceDate} | Invoice No: ${invoiceNum}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 16px; font-weight: 700; color: #6C63FF;">${sellerName}</div>
          ${sellerGst !== 'None' ? `<div style="font-size: 12px; color: #4A4E69;">GSTIN: ${sellerGst}</div>` : ''}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; font-size: 13px;">
        <div>
          <h4 style="font-size: 11px; text-transform: uppercase; color: #8B8FA8; letter-spacing: 0.05em; margin-bottom: 6px;">BILL TO:</h4>
          <div style="font-size: 14px; font-weight: 700; color: #1A1D27; margin-bottom: 4px;">${buyerName}</div>
          ${buyerGst !== 'None' ? `<div style="color: #4A4E69;">GSTIN: ${buyerGst}</div>` : ''}
        </div>
        <div style="text-align: right;">
          <h4 style="font-size: 11px; text-transform: uppercase; color: #8B8FA8; letter-spacing: 0.05em; margin-bottom: 6px;">PAYMENT MODE:</h4>
          <div style="font-size: 13px; color: #1A1D27;">Bank Transfer / UPI</div>
          <div style="font-size: 12px; color: #4A4E69; margin-top: 4px;">Place of Supply: Inter-state / Intra-state</div>
        </div>
      </div>

      <!-- Line Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #F1F2F6; border-bottom: 2px solid #E1E3EA;">
            <th style="padding: 10px; font-size: 11px; font-weight: 700; color: #4A4E69; text-align: left; text-transform: uppercase;">Description</th>
            <th style="padding: 10px; font-size: 11px; font-weight: 700; color: #4A4E69; text-align: right; text-transform: uppercase; width: 100px;">Rate</th>
            <th style="padding: 10px; font-size: 11px; font-weight: 700; color: #4A4E69; text-align: center; text-transform: uppercase; width: 60px;">Qty</th>
            <th style="padding: 10px; font-size: 11px; font-weight: 700; color: #4A4E69; text-align: center; text-transform: uppercase; width: 80px;">GST Rate</th>
            <th style="padding: 10px; font-size: 11px; font-weight: 700; color: #4A4E69; text-align: right; text-transform: uppercase; width: 120px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <!-- Totals & Taxes -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; margin-top: 20px;">
        <div style="font-size: 12px; color: #8B8FA8; border: 1px solid #E1E3EA; padding: 16px; border-radius: 6px; background-color: #FCFDFE;">
          <h5 style="margin: 0 0 8px 0; color: #1A1D27; font-size: 12px; font-weight: 700;">Terms & Declarations</h5>
          <p style="margin: 0; line-height: 1.6;">1. Please pay within 15 days of invoice date.</p>
          <p style="margin: 0; line-height: 1.6;">2. This is a computer generated invoice and needs no signature.</p>
          <p style="margin: 0; line-height: 1.6;">3. All disputes subject to local jurisdiction.</p>
        </div>
        <div>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr style="font-size: 13px;">
                <td style="padding: 6px 0; color: #4A4E69;">Subtotal (Taxable Value)</td>
                <td style="padding: 6px 0; text-align: right; color: #1A1D27; font-weight: 600;">${inrFormatter.format(subtotal)}</td>
              </tr>
              ${taxBreakdownHtml}
              <tr style="font-size: 16px; font-weight: 700;">
                <td style="padding: 12px 0 0 0; color: #1A1D27;">Total Invoice Value</td>
                <td style="padding: 12px 0 0 0; text-align: right; color: #FF9933;">${inrFormatter.format(invoiceTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div style="margin-top: 60px; text-align: center; border-top: 1px solid #E1E3EA; padding-top: 20px; font-size: 12px; color: #8B8FA8;">
        Thank you for your business!
      </div>
    `;

    // Export PDF using html2pdf
    if (typeof html2pdf === 'undefined') {
      alert('html2pdf library is not loaded. Please try again in a moment.');
      return;
    }

    const options = {
      margin: 0,
      filename: `Invoice_${invoiceNum}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2.5, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(printContainer).set(options).save().catch(err => {
      console.error(err);
      alert('Failed to generate invoice PDF: ' + err.message);
    });
  });

  // ==========================================
  // 7. Tool 3: JSON Formatter Logic
  // ==========================================
  const jsonInput = document.getElementById('json-input');
  const jsonPreview = document.getElementById('json-preview');
  const jsonStatus = document.getElementById('json-status');
  const btnJsonFormat = document.getElementById('btn-json-format');
  const btnJsonMinify = document.getElementById('btn-json-minify');
  const btnJsonCopy = document.getElementById('btn-json-copy');
  const btnJsonClear = document.getElementById('btn-json-clear');

  // Input Live validation helper
  jsonInput.addEventListener('input', () => {
    const val = jsonInput.value;
    if (!val.trim()) {
      jsonStatus.className = 'validation-status empty';
      jsonStatus.innerHTML = `<i class="ti ti-circle"></i> Ready`;
      jsonPreview.innerHTML = 'Output will appear here with syntax colors...';
      return;
    }

    try {
      const parsed = JSON.parse(val);
      jsonStatus.className = 'validation-status valid';
      jsonStatus.innerHTML = `<i class="ti ti-circle-check"></i> Valid JSON`;
      
      // Update syntax highlighted preview live
      const formattedStr = JSON.stringify(parsed, null, 2);
      jsonPreview.innerHTML = syntaxHighlight(formattedStr);
    } catch (e) {
      jsonStatus.className = 'validation-status invalid';
      jsonStatus.innerHTML = `<i class="ti ti-alert-triangle"></i> Invalid JSON`;
      jsonPreview.innerHTML = `<span style="color: #FF5252; font-weight: 600;">Error parsing JSON:</span>\n<span style="color: #FF8888;">${e.message}</span>`;
    }
  });

  // Format click handler
  btnJsonFormat.addEventListener('click', () => {
    const val = jsonInput.value;
    if (!val.trim()) return;

    try {
      const parsed = JSON.parse(val);
      const formatted = JSON.stringify(parsed, null, 2);
      jsonInput.value = formatted;
      jsonStatus.className = 'validation-status valid';
      jsonStatus.innerHTML = `<i class="ti ti-circle-check"></i> Valid JSON`;
      jsonPreview.innerHTML = syntaxHighlight(formatted);
    } catch (e) {
      alert('Cannot format. JSON contains syntax errors.');
    }
  });

  // Minify click handler
  btnJsonMinify.addEventListener('click', () => {
    const val = jsonInput.value;
    if (!val.trim()) return;

    try {
      const parsed = JSON.parse(val);
      const minified = JSON.stringify(parsed);
      jsonInput.value = minified;
      jsonStatus.className = 'validation-status valid';
      jsonStatus.innerHTML = `<i class="ti ti-circle-check"></i> Valid JSON`;
      jsonPreview.innerHTML = syntaxHighlight(minified);
    } catch (e) {
      alert('Cannot minify. JSON contains syntax errors.');
    }
  });

  // Copy click handler
  btnJsonCopy.addEventListener('click', () => {
    const val = jsonInput.value;
    if (!val.trim()) return;
    
    navigator.clipboard.writeText(val).then(() => {
      const originalText = btnJsonCopy.innerHTML;
      btnJsonCopy.innerHTML = `<i class="ti ti-check"></i> Copied!`;
      setTimeout(() => {
        btnJsonCopy.innerHTML = originalText;
      }, 1500);
    }).catch(err => {
      alert('Could not copy text: ' + err.message);
    });
  });

  // Clear click handler
  btnJsonClear.addEventListener('click', () => {
    jsonInput.value = '';
    jsonStatus.className = 'validation-status empty';
    jsonStatus.innerHTML = `<i class="ti ti-circle"></i> Ready`;
    jsonPreview.innerHTML = 'Output will appear here with syntax colors...';
  });

  // Helper JSON Syntax highlighting function
  function syntaxHighlight(json) {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    // Escape HTML special characters
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Wrap tokens in markup using regex
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      
      if (cls === 'key') {
        return '<span class="json-key">' + match.replace(/:$/, '') + '</span>:';
      } else {
        return '<span class="json-' + cls + '">' + match + '</span>';
      }
    });
  }

});
