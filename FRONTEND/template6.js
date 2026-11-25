initResumeEditor({
  templateNum: 6,
  storageKey: 'profile_canvas_state_t6',
  renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
    const fontSize = Math.min(Math.max(parseFloat(data.fontSize) || 12, 9), 15)
    const accent = data.accentDark || '#0B132B'
    const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // Custom sections added in the form (each: { name, entries: [text, ...] })
        const customHTML = headFn => (data.customSections || []).map(sec => {
            const items = (sec.entries || []).filter(e => e && String(e).trim())
            if (!items.length) return ''
            return headFn(esc(sec.name)) + items.map(i => `<div style="display:flex;gap:8px;margin-bottom:3px;font-size:${fontSize + 1}px;line-height:1.35;"><span>•</span><span>${esc(i)}</span></div>`).join('') + `<div style="height:10px;"></div>`
        }).join('')

    // Sidebar background
    buildHtmlElement({ left: 0, top: 0, width: 280, html: `<div style="width:280px;height:1123px;background:${accent};"></div>` })

    if (data.photo) buildImageElement({ src: data.photo, left: 40, top: 60, width: 200, height: 200, borderRadius: '50%' })

    let side = `<div style="padding:0 28px;color:white;box-sizing:border-box;">`
    side += `<div style="margin-top:300px;margin-bottom:24px;">`
    ;[data.email, data.phone, data.location].filter(Boolean).forEach(c => {
      side += `<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div style="width:22px;height:22px;background:#ddd;border-radius:50%;flex-shrink:0;"></div>
        <div style="font-size:${fontSize}px;line-height:1.3;word-break:break-word;min-width:0;">${esc(c)}</div></div>`
    })
    side += `</div>`

    if (data.languages && data.languages.filter(l => l.name).length) {
      side += `<div style="font-size:${fontSize + 5}px;margin-bottom:10px;">Language’s</div>`
      data.languages.filter(l => l.name).forEach(l => {
        side += `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px;font-size:${fontSize + 1}px;margin-bottom:6px;">
          <span>${esc(l.name)}</span>${l.level ? `<span style="font-size:${fontSize - 1}px;opacity:0.8;">(${esc(l.level)})</span>` : ''}</div>`
      })
      side += `<div style="height:16px;"></div>`
    }

    if (data.skills) {
      side += `<div style="font-size:${fontSize + 5}px;margin-bottom:10px;">Skills</div>`
      side += `<div style="font-size:${fontSize + 1}px;line-height:1.5;">`
      data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
        side += `<div style="display:flex;gap:8px;margin-bottom:3px;"><span>•</span><span>${esc(s)}</span></div>`
      })
      side += `</div>`
    }
    side += `</div>`
    buildHtmlElement({ left: 0, top: 0, width: 280, html: side })

    let main = `<div style="padding:0 36px 0 30px;box-sizing:border-box;">`
    main += `<div style="text-align:right;margin-top:36px;margin-bottom:22px;">
      <div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.2}px;font-weight:700;text-transform:uppercase;margin-bottom:4px;">${esc(data.name)}</div>
      <div style="font-size:${fontSize + 4}px;">${esc(data.jobtitle)}</div></div>`

    if (data.summary) main += `<div style="font-size:${fontSize + 2}px;line-height:1.4;margin-bottom:20px;">${esc(data.summary)}</div>`

    const secHead = title => `<div style="border-bottom:2px solid #ddd;padding-bottom:3px;margin-bottom:10px;">
      <div style="font-size:${fontSize + 6}px;font-weight:bold;">${title}</div></div>`

    if (data.edu && data.edu.length) {
      main += secHead('Education')
      data.edu.forEach(e => {
        if (!e.school) return
        main += `<div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;margin-bottom:2px;"><span>${esc(e.school)}</span><span style="white-space:nowrap;">${esc(e.year)}</span></div>
          ${e.course ? `<div style="font-size:${fontSize + 1}px;">${esc(e.course)}</div>` : ''}</div>`
      })
    }

    if (data.work && data.work.length) {
      main += secHead('Work Experience’s')
      data.work.forEach(w => {
        if (!w.title) return
        main += `<div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;margin-bottom:3px;"><span>${esc(w.title)}${w.company ? ' - ' + esc(w.company) : ''}</span><span style="white-space:nowrap;">${esc(w.duration)}</span></div>`
        if (w.desc) {
          main += `<div style="font-size:${fontSize + 1}px;line-height:1.3;">`
          w.desc.split('\n').filter(Boolean).forEach(line => main += `<div style="display:flex;gap:8px;margin-bottom:1px;"><span>•</span><span>${esc(line)}</span></div>`)
          main += `</div>`
        }
        main += `</div>`
      })
    }

    if (data.awards && data.awards.length) {
      main += secHead('Awards and Achievement')
      data.awards.forEach(a => {
        if (!a.name) return
        main += `<div style="font-size:${fontSize + 2}px;margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;gap:8px;"><span>${esc(a.name)}</span><span style="white-space:nowrap;">${esc(a.year)}</span></div>
          ${a.issuer ? `<div style="font-size:${fontSize}px;">${esc(a.issuer)}</div>` : ''}</div>`
      })
    }

    if (data.certifications && data.certifications.length) {
      main += secHead('Certification')
      data.certifications.forEach(c => {
        if (!c.name) return
        main += `<div style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;font-weight:bold;"><span>${esc(c.name)}</span><span style="white-space:nowrap;font-weight:normal;font-size:${fontSize}px;">${esc(c.date)}</span></div>
          ${c.org ? `<div style="font-size:${fontSize}px;">${esc(c.org)}</div>` : ''}</div>`
      })
    }
    main += customHTML(secHead)
    main += `</div>`
    buildHtmlElement({ left: 280, top: 0, width: 514, html: main })
  }
})