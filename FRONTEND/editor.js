function initResumeEditor({ templateNum, storageKey, renderFromFormData }) {

  const SERVER = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://profile-07v0.onrender.com'

  const PAPER_KEY = 'profile_paper_size'

  const PAPER_SIZES = {
    a4: { w: 794, h: 1123 },
    letter: { w: 816, h: 1056 }
  }

  function applyPaperSize(size) {
    const s = PAPER_SIZES[size] || PAPER_SIZES.a4
    const resume = document.getElementById('resume')
    if (!resume) return
    resume.style.width = s.w + 'px'
    resume.style.height = s.h + 'px'
    localStorage.setItem(PAPER_KEY, size)
    if (typeof scaleResumePreview === 'function') setTimeout(scaleResumePreview, 50);
  }
  window.applyPaperSize = applyPaperSize

  const resume = document.getElementById('resume')

  function buildTextElement(opts = {}) {
    const el = document.createElement('div')
    el.className = 'text'
    if (opts.classes) opts.classes.forEach(c => el.classList.add(c))

    el.style.position = 'absolute'
    el.style.left = (typeof opts.left === 'number' ? opts.left : parseInt(opts.left) || 0) + 'px'
    el.style.top = (typeof opts.top === 'number' ? opts.top : parseInt(opts.top) || 0) + 'px'
    if (opts.width) el.style.width = (parseInt(opts.width) || 200) + 'px'
    el.style.height = 'auto'

    const content = document.createElement('div')
    content.className = 'text-content'
    content.style.cursor = 'default'
    content.style.userSelect = 'none'
    content.style.overflow = 'visible'
    content.style.wordWrap = 'break-word'
    content.style.whiteSpace = 'normal'
    content.style.height = 'auto'
    content.style.padding = '0'

    if (opts.html) content.innerHTML = opts.html
    else content.innerText = opts.text ?? ''

    if (opts.fontSize) content.style.fontSize = opts.fontSize
    if (opts.fontFamily) content.style.fontFamily = opts.fontFamily
    if (opts.color) content.style.color = opts.color
    if (opts.fontWeight) content.style.fontWeight = opts.fontWeight

    el.appendChild(content)
    resume.appendChild(el)
    return el
  }

  function buildHtmlElement(opts = {}) {
    return buildTextElement({ ...opts, html: opts.html })
  }

  function buildImageElement(opts = {}) {
    const el = document.createElement('div')
    el.className = 'text img-element'
    el.style.position = 'absolute'
    el.style.left = (opts.left ?? 0) + 'px'
    el.style.top = (opts.top ?? 0) + 'px'
    el.style.width = (opts.width ?? 100) + 'px'
    el.style.height = (opts.height ?? 100) + 'px'

    const img = document.createElement('img')
    img.src = opts.src
    img.style.width = '100%'
    img.style.height = '100%'
    img.style.objectFit = 'cover'
    img.style.borderRadius = opts.borderRadius ?? '0'
    img.style.display = 'block'
    img.draggable = false

    el.appendChild(img)
    resume.appendChild(el)
    return el
  }

  function loadFormData() {
    const raw = localStorage.getItem('profile_form_data') || localStorage.getItem('profile_form_draft_t' + templateNum)
    if (!raw) return false
    try {
      const data = JSON.parse(raw)
      localStorage.removeItem('profile_form_data')
      applyPaperSize(data.paperSize || 'a4')

      // --- FIX: Inject Font Loader ---
      if (data.fontFamily) {
        const fontName = data.fontFamily.replace(/'/g, '').split(',')[0];
        if (!document.getElementById('dynamic-font-loader')) {
          const link = document.createElement('link');
          link.id = 'dynamic-font-loader';
          link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;700&display=swap`;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      }
      // ------------------------------

      document.querySelectorAll('#resume .text').forEach(el => el.remove())
      const resumeEl = document.getElementById('resume')
      Array.from(resumeEl.children).forEach(child => {
        if (!child.classList.contains('text')) {
          child.querySelectorAll('.text').forEach(el => el.remove())
        }
      })

      renderFromFormData({ data, buildTextElement, buildHtmlElement, buildImageElement })
      return true
    } catch (e) {
      console.warn('Could not load form data:', e)
      return false
    }
  }

  function loadFromDraft() {
    const raw = localStorage.getItem('profile_form_draft_t' + templateNum)
    if (!raw) return false
    try {
      const data = JSON.parse(raw)
      applyPaperSize(data.paperSize || 'a4')
      document.querySelectorAll('#resume .text').forEach(el => el.remove())
      renderFromFormData({ data, buildTextElement, buildHtmlElement, buildImageElement })
      return true
    } catch (e) {
      return false
    }
  }

  window.resetSession = function () {
    if (!confirm('Clear this resume? You\'ll go back to the form.')) return
    localStorage.removeItem('profile_form_draft_t' + templateNum)
    localStorage.removeItem('profile_canvas_state')
    localStorage.removeItem('profile_canvas_state_t2')
    localStorage.removeItem('profile_canvas_state_t3')
    localStorage.removeItem('profile_canvas_state_t4')
    window.location.href = 'form.html?template=' + templateNum
  }

  window.generatePDF = async function () {
    const sizeKey = localStorage.getItem(PAPER_KEY) || 'a4'
    const size = PAPER_SIZES[sizeKey]
    const token = localStorage.getItem('profile_token')
    try {
      const res = await fetch(`${SERVER}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({
          html: document.getElementById('resume').outerHTML,
          width: size.w,
          height: size.h,
          template: templateNum
        })
      })
      if (!res.ok) throw new Error('Server error: ' + res.status)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resume.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Could not generate PDF. Make sure the server is running.')
    }
  }

  // --- FAILSAFE DIRECT PRINT ---
  window.printResume = function () {
    const printStyle = document.createElement('style');
    printStyle.id = 'dynamic-print-style';
    printStyle.innerHTML = `
      @media print {
        /* Force standard A4 size with 0 margins */
        @page { 
          size: A4 portrait; 
          margin: 0 !important; 
        }
        
        /* Reset body and html to strictly hide any overflow */
        html, body { 
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important; 
          padding: 0 !important; 
          overflow: hidden !important; 
          background: white !important;
        }

        /* Hide EVERYTHING except the resume container */
        body > *:not(.canvas-area) {
          display: none !important;
        }

        /* Reset the canvas area wrapper */
        .canvas-area { 
          display: block !important;
          position: static !important;
          margin: 0 !important; 
          padding: 0 !important; 
          transform: none !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
        }
        
        /* Lock the resume to the exact page size */
        #resume { 
          display: block !important;
          position: relative !important;
          top: 0 !important; 
          left: 0 !important; 
          box-shadow: none !important; 
          transform: none !important; /* Remove the mobile scaling */
          margin: 0 !important;
          border: none !important;
          page-break-after: avoid !important;
          page-break-before: avoid !important;
          page-break-inside: avoid !important;
          overflow: hidden !important;
        }
        
        /* Force background colors to print */
        * { 
          -webkit-print-color-adjust: exact !important; 
          print-color-adjust: exact !important; 
        }
      }
    `;
    document.head.appendChild(printStyle);

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        const el = document.getElementById('dynamic-print-style');
        if (el) el.remove();
      }, 1000);
    }, 150);
  }

  // --- FIXED: SMART QUICK SHARE (Desktop & Mobile) ---
  window.shareResume = async function (e) {
    const sizeKey = localStorage.getItem(PAPER_KEY) || 'a4'
    const size = PAPER_SIZES[sizeKey]
    const token = localStorage.getItem('profile_token')

    let btn = null; let originalHTML = '';
    if (e && e.currentTarget) {
      btn = e.currentTarget;
      originalHTML = btn.innerHTML;
      btn.innerHTML = 'Generating...';
      btn.disabled = true;
    }

    try {
      const res = await fetch(`${SERVER}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({
          html: document.getElementById('resume').outerHTML,
          width: size.w,
          height: size.h,
          template: templateNum
        })
      })

      if (!res.ok) throw new Error('Could not generate PDF')

      // Get the blob and explicitly set the type
      const arrayBuffer = await res.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

      // Create the File object
      const file = new File([blob], 'My_Resume.pdf', { type: 'application/pdf' });

      // Check if the device supports sharing files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Resume',
          text: 'Here is my resume generated from ProFile.'
        })
      } else {
        // Fallback for Desktop (Windows/Mac)
        alert('Direct file sharing is only supported on mobile devices. Your PDF will download instead so you can send it manually.')
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'My_Resume.pdf'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Share error:', err)
      if (err.name !== 'AbortError') {
        alert('Could not share the resume. Please try downloading it instead.')
      }
    } finally {
      if (btn) { btn.innerHTML = originalHTML; btn.disabled = false; }
    }
  }

  function scaleResumePreview() {
    const wrapper = document.querySelector('.canvas-area');
    const resumeEl = document.getElementById('resume');
    if (!wrapper || !resumeEl) return;

    const wrapperStyle = window.getComputedStyle(wrapper);
    const paddingLeft = parseFloat(wrapperStyle.paddingLeft);
    const paddingRight = parseFloat(wrapperStyle.paddingRight);
    const availableWidth = wrapper.clientWidth - paddingLeft - paddingRight;
    const paperWidth = resumeEl.offsetWidth;

    let scale = availableWidth / paperWidth;
    if (scale > 1) scale = 1;

    resumeEl.style.transform = `scale(${scale})`;
    resumeEl.style.transformOrigin = 'top center';

    const paperHeight = resumeEl.offsetHeight;
    wrapper.style.height = (paperHeight * scale) + 'px';
  }

  window.addEventListener('resize', scaleResumePreview);
  applyPaperSize(localStorage.getItem(PAPER_KEY) || 'a4')

  if (!loadFormData()) loadFromDraft()
  setTimeout(scaleResumePreview, 150);
}