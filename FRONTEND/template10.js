initResumeEditor({
    templateNum: 10,
    storageKey: 'profile_canvas_state_t10',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = Math.min(Math.max(parseFloat(data.fontSize) || 12, 9), 14)
        const accent = data.accentDark || '#1C291C'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // Row boundaries (no overlaps): summary 190-400, edu 400-540, exp 540-780, awards 780-880, bottom 880-1123
        const R = { sum: 190, edu: 400, exp: 540, aw: 780, bot: 880 }

        buildHtmlElement({ left: 0, top: 0, width: 794, html: `<div style="width:794px;height:150px;background:${accent};"></div>` })
        if (data.photo) buildImageElement({ src: data.photo, left: 40, top: 25, width: 100, height: 100, borderRadius: '50%' })

        let head = `<div style="text-align:right;margin-top:36px;margin-right:40px;">
      <div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.2}px;font-weight:700;color:white;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">${esc(data.name)}</div>
      <div style="font-size:${fontSize + 3}px;color:#D1D5DB;">${esc(data.jobtitle)}</div></div>`
        buildHtmlElement({ left: 150, top: 0, width: 644, html: head })

        buildHtmlElement({ left: 0, top: 150, width: 794, html: `<div style="width:794px;height:40px;background:#EAEAEA;"></div>` })
        const contact = [data.email, data.phone, data.location].filter(Boolean).map(esc)
        buildHtmlElement({ left: 0, top: 150, width: 794, html: `<div style="display:flex;justify-content:space-around;align-items:center;height:40px;font-size:${fontSize}px;">${contact.map(c => `<div>${c}</div>`).join('')}</div>` })

        // Lines
        buildHtmlElement({ left: 260, top: 190, width: 2, html: `<div style="width:2px;height:${R.bot - 190}px;background:#111;"></div>` })
        ;[R.edu, R.exp, R.aw, R.bot].forEach(y => buildHtmlElement({ left: 0, top: y, width: 794, html: `<div style="width:794px;height:2px;background:#111;"></div>` }))

        const secHead = title => `<div style="text-align:center;font-size:${fontSize + 6}px;font-weight:bold;margin-bottom:12px;">${title}</div>`

        // Summary row: languages (left) | summary (right)
        let left1 = `<div style="padding:16px 20px;">${secHead('Language’s')}`
        if (data.languages) data.languages.filter(l => l.name).forEach(l => left1 += `<div style="display:flex;gap:8px;align-items:baseline;font-size:${fontSize + 1}px;margin-bottom:8px;">
      <span>${esc(l.name)}</span>${l.level ? `<span style="font-size:${fontSize}px;">(${esc(l.level)})</span>` : ''}</div>`)
        left1 += `</div>`
        buildHtmlElement({ left: 0, top: R.sum, width: 260, html: left1 })

        let right1 = `<div style="padding:16px 36px;">`
        if (data.summary) right1 += `<div style="font-size:${fontSize + 2}px;line-height:1.45;text-align:justify;">${esc(data.summary)}</div>`
        right1 += `</div>`
        buildHtmlElement({ left: 260, top: R.sum, width: 534, html: right1 })

        // Education row
        buildHtmlElement({ left: 0, top: R.edu, width: 260, html: `<div style="padding:16px 20px;">${secHead('Education')}</div>` })
        let right2 = `<div style="padding:16px 36px;">`
        if (data.edu) data.edu.forEach(e => {
            if (!e.school) return
            right2 += `<div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;margin-bottom:2px;"><span>${esc(e.school)}</span><span style="white-space:nowrap;">${esc(e.year)}</span></div>
        ${e.course ? `<div style="font-size:${fontSize + 1}px;">${esc(e.course)}</div>` : ''}</div>`
        })
        right2 += `</div>`
        buildHtmlElement({ left: 260, top: R.edu, width: 534, html: right2 })

        // Experience row
        buildHtmlElement({ left: 0, top: R.exp, width: 260, html: `<div style="padding:16px 20px;">${secHead('Experience’s')}</div>` })
        let right3 = `<div style="padding:16px 36px;">`
        if (data.work) data.work.forEach(w => {
            if (!w.title) return
            right3 += `<div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;margin-bottom:3px;"><span>${esc(w.title)}${w.company ? ' | ' + esc(w.company) : ''}</span><span style="white-space:nowrap;">${esc(w.duration)}</span></div>`
            if (w.desc) {
                right3 += `<div style="font-size:${fontSize + 1}px;line-height:1.3;">`
                w.desc.split('\n').filter(Boolean).forEach(line => right3 += `<div style="display:flex;gap:8px;margin-bottom:1px;"><span>•</span><span>${esc(line)}</span></div>`)
                right3 += `</div>`
            }
            right3 += `</div>`
        })
        right3 += `</div>`
        buildHtmlElement({ left: 260, top: R.exp, width: 534, html: right3 })

        // Achievement row
        buildHtmlElement({ left: 0, top: R.aw, width: 260, html: `<div style="padding:16px 20px;">${secHead('Achievement')}</div>` })
        let right4 = `<div style="padding:14px 36px;">`
        if (data.awards) data.awards.forEach(a => {
            if (!a.name) return
            right4 += `<div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;margin-bottom:6px;">
        <span>${esc(a.name)}${a.issuer ? ' <span style="font-size:' + fontSize + 'px;opacity:0.8;">— ' + esc(a.issuer) + '</span>' : ''}</span><span style="white-space:nowrap;">${esc(a.year)}</span></div>`
        })
        right4 += `</div>`
        buildHtmlElement({ left: 260, top: R.aw, width: 534, html: right4 })

        // Bottom row: skills | certification
        let bottom = `<div style="display:flex;height:${1123 - R.bot}px;">`
        bottom += `<div style="flex:1;padding:14px 20px;text-align:center;">${secHead('Skills')}`
        if (data.skills) {
            bottom += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 12px;font-size:${fontSize + 1}px;line-height:1.4;text-align:left;">`
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => bottom += `<div style="display:flex;gap:6px;"><span>•</span><span>${esc(s)}</span></div>`)
            bottom += `</div>`
        }
        bottom += `</div>`
        bottom += `<div style="flex:1;padding:14px 36px;text-align:center;">${secHead('Certification')}`
        if (data.certifications) data.certifications.forEach(c => {
            if (!c.name) return
            bottom += `<div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 1}px;margin-bottom:3px;text-align:left;"><span style="font-weight:bold;">${esc(c.name)}</span><span style="white-space:nowrap;">${esc(c.date)}</span></div>`
            if (c.org) bottom += `<div style="font-size:${fontSize}px;text-align:left;margin-bottom:8px;">${esc(c.org)}</div>`
        })
        bottom += `</div></div>`
        buildHtmlElement({ left: 0, top: R.bot + 2, width: 794, html: bottom })
    }
})