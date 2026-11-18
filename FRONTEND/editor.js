

function initResumeEditor({ templateNum, storageKey, renderFromFormData }) {

  const SERVER = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://profile-07v0.onrender.com'
  const PAPER_KEY = 'profile_paper_size'

  const PAPER_SIZES = {
    a4:     { w: 794,  h: 1123 },
    letter: { w: 816,  h: 1056 }
  }

  function applyPaperSize(size) {
    const s = PAPER_SIZES[size] || PAPER_SIZES.a4
    const resume = document.getElementById('resume')
    if (!resume) return
    resume.style.width  = s.w + 'px'
    resume.style.height = s.h + 'px'
    localStorage.setItem(PAPER_KEY, size)
  }
  window.applyPaperSize = applyPaperSize

  const resume = document.getElementById('resume')

  // BUILD TEXT ELEMENT
  function buildTextElement(opts = {}) {
    const el = document.createElement('div')
    el.className = 'text'
    if (opts.classes) opts.classes.forEach(c => el.classList.add(c))

    el.style.position = 'absolute'
    el.style.left     = (typeof opts.left === 'number' ? opts.left : parseInt(opts.left) || 0) + 'px'
    el.style.top      = (typeof opts.top  === 'number' ? opts.top  : parseInt(opts.top)  || 0) + 'px'
    if (opts.width)   el.style.width  = (parseInt(opts.width) || 200) + 'px'
    el.style.height   = 'auto'

    const content = document.createElement('div')
    content.className        = 'text-content'
    content.style.cursor     = 'default'
    content.style.userSelect = 'none'
    content.style.overflow   = 'visible'
    content.style.wordWrap   = 'break-word'
    content.style.whiteSpace = 'normal'
    content.style.height     = 'auto'
    content.style.padding    = '0'

    if (opts.html) content.innerHTML = opts.html
    else           content.innerText  = opts.text ?? ''

    if (opts.fontSize)   content.style.fontSize   = opts.fontSize
    if (opts.fontFamily) content.style.fontFamily = opts.fontFamily
    if (opts.color)      content.style.color      = opts.color
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
    el.className      = 'text img-element'
    el.style.position = 'absolute'
    el.style.left     = (opts.left   ?? 0)   + 'px'
    el.style.top      = (opts.top    ?? 0)   + 'px'
    el.style.width    = (opts.width  ?? 100) + 'px'
    el.style.height   = (opts.height ?? 100) + 'px'

    const img = document.createElement('img')
    img.src                  = opts.src
    img.style.width          = '100%'
    img.style.height         = '100%'
    img.style.objectFit      = 'cover'
    img.style.borderRadius   = opts.borderRadius ?? '0'
    img.style.display        = 'block'
    img.draggable            = false

    el.appendChild(img)
    resume.appendChild(el)
    return el
  }

  // LOAD FROM FORM DATA 
  function loadFormData() {
    const raw = localStorage.getItem('profile_form_data')
    if (!raw) return false
    try {
      const data = JSON.parse(raw)
      localStorage.removeItem('profile_form_data')
      applyPaperSize(data.paperSize || 'a4')

      document.querySelectorAll('#resume .text').forEach(el => el.remove())
      const resume = document.getElementById('resume')
      Array.from(resume.children).forEach(child => {
        if (!child.classList.contains('text')) {
  
          child.querySelectorAll('.text').forEach(el => el.remove())
        }
      })
      renderFromFormData({ data, buildTextElement, buildHtmlElement, buildImageElement })
      return true
    } catch(e) {
      console.warn('Could not load form data:', e)
      return false
    }
  }

  // LOAD FROM DRAFT 
  function loadFromDraft() {
    const raw = localStorage.getItem('profile_form_draft')
    if (!raw) return false
    try {
      const data = JSON.parse(raw)
      applyPaperSize(data.paperSize || 'a4')
      document.querySelectorAll('#resume .text').forEach(el => el.remove())
      renderFromFormData({ data, buildTextElement, buildHtmlElement, buildImageElement })
      return true
    } catch(e) {
      return false
    }
  }

  //RESET 
  window.resetSession = function() {
    if (!confirm('Clear this resume? You\'ll go back to the form.')) return
    localStorage.removeItem('profile_form_draft')
    localStorage.removeItem('profile_canvas_state')
    localStorage.removeItem('profile_canvas_state_t2')
    localStorage.removeItem('profile_canvas_state_t3')
    localStorage.removeItem('profile_canvas_state_t4')
    window.location.href = 'form.html?template=' + templateNum
  }

  //PDF EXPORT 
  window.generatePDF = async function() {
    const sizeKey = localStorage.getItem(PAPER_KEY) || 'a4'
    const size    = PAPER_SIZES[sizeKey]
    const token   = localStorage.getItem('profile_token')
    try {
      const res = await fetch(`${SERVER}/generate-pdf`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({
          html:     document.getElementById('resume').outerHTML,
          width:    size.w,
          height:   size.h,
          template: templateNum
        })
      })
      if (!res.ok) throw new Error('Server error: ' + res.status)
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = 'resume.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch(e) {
      alert('Could not generate PDF. Make sure the server is running.')
    }
  }

    // --- NEW: DIRECT PRINT ---
  window.printResume = function() {
    window.print();
  }

    // --- NEW: RESUME QUICK SHARING (Native OS Share) ---
  window.shareResume = async function() {
    try {
      const sizeKey = localStorage.getItem(PAPER_KEY) || 'a4'
      const size    = PAPER_SIZES[sizeKey]
      const token   = localStorage.getItem('profile_token')
      
      // 1. Generate the PDF from your existing backend
      const res = await fetch(`${SERVER}/generate-pdf`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({
          html:     document.getElementById('resume').outerHTML,
          width:    size.w,
          height:   size.h,
          template: templateNum
        })
      })
      
      if (!res.ok) throw new Error('Could not generate PDF')
      const blob = await res.blob()
      
      // 2. Convert the blob to a File object
      const file = new File([blob], 'My_Resume.pdf', { type: 'application/pdf' })

      // 3. Trigger the native Share Menu
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Resume',
          text: 'Here is my resume generated from ProFile.'
        })
        // The phone will now show a menu with Messenger, Mail, Bluetooth, etc.
      } else {
        // Fallback for Desktop (if they test it on a laptop)
        alert('Direct sharing is supported on mobile devices. Your PDF will download instead so you can send it manually.')
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'My_Resume.pdf'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Share error:', err)
      // If the user clicks "Cancel" on the share menu, it triggers an error. We ignore it.
      if (err.name !== 'AbortError') {
        alert('Could not share the resume. Please try downloading it instead.')
      }
    }
  }

  applyPaperSize(localStorage.getItem(PAPER_KEY) || 'a4')
  if (!loadFormData()) loadFromDraft()
}
