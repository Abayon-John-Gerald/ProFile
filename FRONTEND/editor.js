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
    resume.style.overflow = 'hidden'; // <-- ADD THIS
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

    // We no longer apply fontSize and fontFamily here. 
    // We will let a global CSS rule handle it so it affects EVERYTHING.
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

      // --- FIX: Load the selected font dynamically from Google Fonts ---
      if (data.fontFamily) {
        const fontName = data.fontFamily.replace(/'/g, '').split(',')[0].trim();
        if (fontName && fontName !== 'Times New Roman' && fontName !== 'Georgia') {
          const link = document.createElement('link');
          const weights = { 'Playfair Display': '400;700', 'Merriweather': '300;400;700', 'Lato': '300;400;700', 'DM Sans': '300;400;500;700' }[fontName] || '400;700';
          link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@${weights}&display=swap`;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      }

      // --- FIX: Override ALL fonts and sizes globally based on user selection ---
      let styleTag = document.getElementById('global-font-override');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'global-font-override';
        document.head.appendChild(styleTag);
      }

      const selectedFont = data.fontFamily || "'DM Sans', sans-serif";
      const selectedSize = data.fontSize || 12;

      styleTag.innerHTML = `
        /* Force the font family on the entire resume */
        #resume, #resume * {
          font-family: ${selectedFont} !important;
        }
        /* Scale font sizes proportionally based on user selection (base 12px) */
        #resume .text-content {
          font-size: ${selectedSize}px !important;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        #resume [style*="font-size"] {
          /* Remove hardcoded inline font sizes */
          font-size: inherit !important; 
        }
      `;
      // ------------------------------------------------------------------------

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

  // --- PDF helpers (shared by download + share) ---
  let cachedPdf = { key: null, file: null }

  function getPdfKey() {
    const sizeKey = localStorage.getItem(PAPER_KEY) || 'a4'
    return sizeKey + '|' + document.getElementById('resume').outerHTML
  }

  function isPdfCached() {
    return !!cachedPdf.file && cachedPdf.key === getPdfKey()
  }

  function fetchWithTimeout(url, options, ms) {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), ms)
    return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(t))
  }

  async function requestPdf() {
    if (isPdfCached()) return cachedPdf.file

    const sizeKey = localStorage.getItem(PAPER_KEY) || 'a4'
    const size = PAPER_SIZES[sizeKey] || PAPER_SIZES.a4
    const token = localStorage.getItem('profile_token')
    const key = getPdfKey()

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({
        html: document.getElementById('resume').outerHTML,
        width: size.w,
        height: size.h,
        template: templateNum
      })
    }

    // The Render server may be asleep, so try once more if the first try fails
    let res
    try {
      res = await fetchWithTimeout(`${SERVER}/generate-pdf`, options, 45000)
    } catch (err) {
      res = await fetchWithTimeout(`${SERVER}/generate-pdf`, options, 60000)
    }
    if (!res.ok) throw new Error('Server error: ' + res.status)

    const blob = new Blob([await res.arrayBuffer()], { type: 'application/pdf' })
    const file = new File([blob], 'My_Resume.pdf', { type: 'application/pdf', lastModified: Date.now() })
    cachedPdf = { key, file }
    return file
  }

  function downloadFile(file) {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name || 'My_Resume.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // Wake up the Render server as soon as the page opens
  fetch(SERVER + '/', { mode: 'no-cors' }).catch(() => { })

  window.generatePDF = async function () {
    try {
      const file = await requestPdf()
      downloadFile(file)
    } catch (e) {
      console.error('PDF error:', e)
      alert('Could not generate PDF. The server may be waking up, please try again in a few seconds.')
    }
  }

  window.printResume = function () {
    const printStyle = document.createElement('style');
    printStyle.id = 'dynamic-print-style';
    printStyle.innerHTML = `
      @media print {
        @page { size: A4 portrait; margin: 0; }
        html, body { width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: white !important; }
        body > *:not(.canvas-area) { display: none !important; }
        .canvas-area { display: block !important; position: static !important; margin: 0 !important; padding: 0 !important; transform: none !important; width: 100% !important; height: 100% !important; overflow: hidden !important; }
        #resume { display: block !important; position: relative !important; top: 0 !important; left: 0 !important; box-shadow: none !important; transform: none !important; margin: 0 !important; border: none !important; page-break-after: avoid !important; page-break-inside: avoid !important; overflow: hidden !important; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `;
    document.head.appendChild(printStyle);
    setTimeout(() => { window.print(); setTimeout(() => { const el = document.getElementById('dynamic-print-style'); if (el) el.remove(); }, 1000); }, 150);
  }

  // --- SMART QUICK SHARE (Mobile & Desktop) ---
  window.shareResume = async function (e) {
    if (e && e.preventDefault) e.preventDefault()

    const btn = e && e.currentTarget ? e.currentTarget : null
    if (btn && btn.dataset.originalHtml === undefined) btn.dataset.originalHtml = btn.innerHTML
    const originalHTML = btn ? btn.dataset.originalHtml : ''
    const setBtn = (html, disabled) => { if (btn) { btn.innerHTML = html; btn.disabled = disabled } }

    let keepLabel = false

    try {
      if (!isPdfCached()) setBtn('Generating...', true)

      const file = await requestPdf()

      if (!(navigator.canShare && navigator.canShare({ files: [file] }))) {
        alert('Direct file sharing is not supported on this browser. Your PDF will download instead.')
        downloadFile(file)
        return
      }

      try {
        await navigator.share({
          files: [file],
          title: 'My Resume',
          text: 'Here is my resume generated from ProFile.'
        })
      } catch (err) {
        if (err.name === 'AbortError') return
        if (err.name === 'NotAllowedError') {
          // The browser needs a fresh tap. The PDF is cached, so the next tap shares instantly.
          keepLabel = true
          setBtn('PDF ready - tap to share', false)
          return
        }
        throw err
      }
    } catch (err) {
      console.error('Share error:', err)
      alert('Could not share the resume. The server may be waking up, so please try again in a few seconds, or download it instead.')
    } finally {
      if (btn && !keepLabel) setBtn(originalHTML, false)
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