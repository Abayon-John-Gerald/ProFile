initResumeEditor({
  templateNum: 1,
  storageKey: 'profile_canvas_state',
  renderFromFormData({ data, buildHtmlElement }) {
    const fontSize = parseFloat(data.fontSize) || 12
    const K = +(1.4 * fontSize / 12).toFixed(3)
    const Z = `zoom:${K};`

    const accentDark = data.accentDark || localStorage.getItem('profile_accent_dark') || '#2C2C2C'
    const accentLight = data.accentLight || localStorage.getItem('profile_accent_light') || '#8FB89A'

    const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    const sideHead = t => `<div style="font-size:8px;font-weight:600;color:${accentLight};letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px;">${t}</div>`
    const mainHead = (t, extra = '') => `<div style="font-size:8px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#2C2C2C;border-bottom:1.5px solid #2C2C2C;padding-bottom:2px;margin-bottom:6px;${extra}">${t}</div>`

    const eduList = (data.edu || data.education || []).filter(e => e.school || e.course)
    const skillList = (data.skills || '').split(',').map(s => s.trim()).filter(Boolean)
    const langList = (data.languages || []).filter(l => l.name)

    let side = `<div style="width:220px;height:1123px;overflow:hidden;background:${accentDark};font-family:'DM Sans',sans-serif;box-sizing:border-box;">`
    if (data.photo) {
      side += `<div style="width:220px;height:200px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><img src="${data.photo}" style="width:180px;height:180px;object-fit:cover;border-radius:2px;display:block;"></div>`
    } else {
      side += `<div style="width:220px;height:200px;background:#3A3A3A;flex-shrink:0;"></div>`
    }
    side += `<div style="padding:16px 14px;">`
    if (eduList.length) {
      let items = ''
      eduList.forEach(e => {
        items += `<div style="margin-bottom:8px;">`
        if (e.year) items += `<div style="font-size:7px;color:#999;margin-bottom:1px;">${esc(e.year)}</div>`
        if (e.course) items += `<div style="font-size:8px;font-weight:600;color:#fff;text-transform:uppercase;line-height:1.3;">${esc(e.course)}</div>`
        if (e.school) items += `<div style="font-size:8px;color:#ccc;font-style:italic;">${esc(e.school)}</div>`
        items += `</div>`
      })
      side += `<div style="${Z}">${sideHead('Education')}<div style="font-size:8px;color:#ccc;margin-bottom:8px;">${items}</div><div style="height:1px;background:#444;margin-bottom:12px;"></div></div>`
    }
    if (skillList.length) {
      side += `<div style="${Z}">${sideHead('Skills')}` + skillList.map(s => `<div style="font-size:8px;color:#ccc;margin-bottom:3px;display:flex;align-items:center;gap:5px;"><span style="color:${accentLight};">•</span>${esc(s)}</div>`).join('') + `<div style="height:1px;background:#444;margin:12px 0;"></div></div>`
    }
    if (langList.length) {
      const items = langList.map(l => `<div style="font-size:8px;color:#ccc;margin-bottom:3px;"><span style="color:#fff;font-weight:500;">${esc(l.name)}</span>${l.level ? ` <span style="color:#999;font-size:7px;">(${esc(l.level)})</span>` : ''}</div>`).join('')
      side += `<div style="${Z}">${sideHead('Languages')}<div style="font-size:8px;color:#ccc;margin-bottom:4px;">${items}</div><div style="height:1px;background:#444;margin:12px 0;"></div></div>`
    }
    let contact = ''
    if (data.email) contact += `<div style="margin-bottom:3px;">📧 ${esc(data.email)}</div>`
    if (data.phone) contact += `<div style="margin-bottom:3px;">📞 ${esc(data.phone)}</div>`
    if (data.location) contact += `<div style="margin-bottom:3px;">📍 ${esc(data.location)}</div>`
    side += `<div style="${Z}">${sideHead('Contact')}<div style="font-size:8px;color:#ccc;line-height:1.7;overflow-wrap:anywhere;word-break:break-word;">${contact}</div></div>`
    side += `</div></div>`
    buildHtmlElement({ left: 0, top: 0, width: 220, html: side })

    let main = `<div style="font-family:'DM Sans',sans-serif;box-sizing:border-box;">`
    main += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize * 2}px;color:#1A1A18;line-height:1.2;margin-bottom:4px;">${esc((data.name || 'YOUR NAME').toUpperCase())}</div>`
    main += `<div style="font-size:${fontSize + 2}px;color:#7A776E;margin-bottom:8px;">${esc(data.jobtitle || 'Job Title')}</div>`
    main += `<div style="height:1px;background:#D4CFC4;margin-bottom:10px;"></div>`
    if (data.summary && data.summary.trim()) {
      main += `<div style="${Z}">${mainHead('Profile Info')}<div style="font-size:9px;color:#333;line-height:1.6;margin-bottom:10px;">${esc(data.summary)}</div></div>`
    }
    const jobs = (data.work || []).filter(j => j.title || j.company)
    if (jobs.length) {
      const items = jobs.map(j => `<div style="display:flex;gap:8px;margin-bottom:8px;align-items:flex-start;"><div style="flex-shrink:0;width:8px;height:8px;border-radius:50%;background:#2C2C2C;border:2px solid ${accentLight};margin-top:3px;"></div><div style="flex:1;"><div style="display:flex;justify-content:space-between;align-items:baseline;"><b style="font-size:9px;color:#1A1A18;">${esc(j.title)}</b>${j.duration ? `<span style="font-size:7px;color:#7A776E;white-space:nowrap;">${esc(j.duration)}</span>` : ''}</div>${j.company ? `<div style="font-size:8px;color:#555;font-style:italic;margin-bottom:1px;">${esc(j.company)}</div>` : ''} ${j.desc ? `<div style="font-size:8px;color:#444;line-height:1.4;">${esc(j.desc)}</div>` : ''}</div></div>`).join('')
      main += `<div style="${Z}">${mainHead('Experience')}<div style="font-size:9px;color:#1A1A18;">${items}</div></div>`
    }
    const certs = (data.certifications || []).filter(c => c.name || c.org)
    if (certs.length) {
      const items = certs.map(c => `<div style="margin-bottom:5px;"><div style="font-weight:600;font-size:9px;">${esc(c.name)}</div>${c.org ? `<div style="font-size:8px;color:#555;">${esc(c.org)}</div>` : ''} ${c.date ? `<div style="font-size:7px;color:#7A776E;">${esc(c.date)}</div>` : ''}</div>`).join('')
      main += `<div style="${Z}">${mainHead('Certifications', 'margin-top:8px;')}<div style="font-size:9px;color:#1A1A18;">${items}</div></div>`
    }
    const awards = (data.awards || []).filter(a => a.name || a.issuer)
    if (awards.length) {
      const items = awards.map(a => `<div style="background:#F7F5F0;padding:6px 8px;border-left:2.5px solid ${accentLight};">${a.year ? `<div style="font-size:7px;color:#7A776E;">${esc(a.year)}</div>` : ''}<div style="font-weight:600;font-size:8px;">${esc(a.name)}</div>${a.issuer ? `<div style="font-size:7px;color:#555;">${esc(a.issuer)}</div>` : ''}</div>`).join('')
      main += `<div style="${Z}">${mainHead('Achievement', 'margin-top:8px;')}<div style="font-size:9px;color:#1A1A18;display:grid;grid-template-columns:1fr 1fr;gap:6px;">${items}</div></div>`
    }
    const customs = (data.customSections || []).map(sec => {
      const items = (sec.entries || []).filter(e => e && e.trim())
      if (!items.length) return ''
      return `<div style="margin-top:10px;"><div style="font-size:8px;font-weight:600;color:#2B3A2E;letter-spacing:0.12em;text-transform:uppercase;border-bottom:1px solid #D4CFC4;padding-bottom:2px;margin-bottom:6px;">${esc(sec.name)}</div>${items.map(i => `<div style="font-size:8px;color:#555;margin-bottom:3px;line-height:1.5;">• ${esc(i)}</div>`).join('')}</div>`
    }).join('')
    if (customs) main += `<div style="margin-top:8px;${Z}">${customs}</div>`
    main += `</div>`
    buildHtmlElement({ left: 258, top: 28, width: 518, classes: ['main-body'], html: main })
  }
})