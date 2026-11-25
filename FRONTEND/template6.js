initResumeEditor({
  templateNum: 6,
  storageKey: 'profile_canvas_state_t6',
  renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
    const fontSize = parseFloat(data.fontSize) || 12
    const accent = data.accentDark || '#0B132B'
    const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    // Sidebar Background
    buildHtmlElement({ left: 0, top: 0, width: 280, html: `<div style="width:280px;height:1123px;background:${accent};overflow:hidden;position:relative;">
      <div style="position:absolute;bottom:-100px;right:-150px;width:400px;height:400px;background:${accent};border-radius:50%;"></div>
    </div>` })

    if (data.photo) buildImageElement({ src: data.photo, left: 40, top: 60, width: 200, height: 200, borderRadius: '50%' })

    let side = `<div style="padding:0 30px;color:white;box-sizing:border-box;">`
    side += `<div style="margin-top:340px;margin-bottom:30px;">`
    ;[data.email, data.phone, data.location].filter(Boolean).forEach(c => {
      side += `<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        <div style="width:24px;height:24px;background:#ddd;border-radius:50%;flex-shrink:0;"></div>
        <div style="font-size:${fontSize}px;line-height:1.3;">${esc(c)}</div></div>`
    })
    side += `</div>`

    if (data.languages && data.languages.length) {
      side += `<div style="font-size:${fontSize+6}px;margin-bottom:12px;">Language's</div>`
      data.languages.filter(l=>l.name).forEach(l => {
        side += `<div style="display:flex;justify-content:space-between;align-items:baseline;font-size:${fontSize+2}px;margin-bottom:8px;">
          <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize-1}px;opacity:0.8;">(${esc(l.level)})</span>` : ''}</div>`
      })
      side += `<div style="height:20px;"></div>`
    }

    if (data.skills) {
      side += `<div style="font-size:${fontSize+6}px;margin-bottom:12px;">Skills</div>`
      side += `<div style="font-size:${fontSize+2}px;line-height:1.6;">`
      data.skills.split(',').map(s=>s.trim()).filter(Boolean).forEach(s => {
        side += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`
      })
      side += `</div>`
    }
    side += `</div>`
    buildHtmlElement({ left: 0, top: 0, width: 280, html: side })

    let main = `<div style="padding-left:30px;box-sizing:border-box;">`
    main += `<div style="text-align:right;margin-top:40px;margin-bottom:40px;">
      <div style="font-family:'Playfair Display',serif;font-size:${fontSize*2.4}px;font-weight:700;text-transform:uppercase;margin-bottom:4px;">${esc(data.name)}</div>
      <div style="font-size:${fontSize+6}px;">${esc(data.jobtitle)}</div></div>`

    if (data.summary) main += `<div style="font-size:${fontSize+4}px;line-height:1.45;margin-bottom:30px;">${esc(data.summary)}</div>`

    const secHead = (title) => `<div style="display:flex;align-items:center;gap:10px;border-bottom:2px solid #ddd;padding-bottom:4px;margin-bottom:16px;">
      <div style="font-size:${fontSize+8}px;font-weight:bold;">${title}</div></div>`

    if (data.edu && data.edu.length) {
      main += secHead('Education')
      data.edu.forEach(e => {
        if (!e.school) return
        main += `<div style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;font-size:${fontSize+4}px;margin-bottom:4px;"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>
          ${e.course ? `<div style="font-size:${fontSize+2}px;">${esc(e.course)}</div>` : ''}</div>`
      })
    }

    if (data.work && data.work.length) {
      main += secHead('Work Experience’s')
      data.work.forEach(w => {
        if (!w.title) return
        main += `<div style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;font-size:${fontSize+4}px;margin-bottom:6px;"><span>${esc(w.title)} ${w.company ? ' - ' + esc(w.company) : ''}</span> <span>${esc(w.duration)}</span></div>`
        if (w.desc) {
          main += `<div style="font-size:${fontSize+2}px;line-height:1.4;">`
          w.desc.split('\n').filter(Boolean).forEach(line => main += `<div style="display:flex;gap:8px;margin-bottom:2px;"><span>•</span> <span>${esc(line)}</span></div>`)
          main += `</div>`
        }
        main += `</div>`
      })
    }

    if (data.awards && data.awards.length) {
      main += secHead('Awards and Achievement')
      data.awards.forEach(a => {
        if (!a.name) return
        main += `<div style="font-size:${fontSize+4}px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;"><span>${esc(a.name)}</span> <span>${esc(a.year)}</span></div>
          ${a.issuer ? `<div style="font-size:${fontSize+2}px;">${esc(a.issuer)}</div>` : ''}</div>`
      })
    }

    if (data.certifications && data.certifications.length) {
      main += secHead('Certification')
      data.certifications.forEach(c => {
        if (!c.name) return
        main += `<div style="margin-bottom:16px;">
          <div style="font-size:${fontSize+4}px;font-weight:bold;">${esc(c.name)}</div>
          ${c.org ? `<div style="font-size:${fontSize+2}px;">${esc(c.org)}</div>` : ''}
          ${c.date ? `<div style="font-size:${fontSize+2}px;">${esc(c.date)}</div>` : ''}</div>`
      })
    }
    main += `</div>`
    buildHtmlElement({ left: 280, top: 0, width: 514, html: main })
  }
})