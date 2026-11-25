initResumeEditor({
    templateNum: 12,
    storageKey: 'profile_canvas_state_t12',
    renderFromFormData({ data, buildHtmlElement }) {
        const fontSize = Math.min(Math.max(parseFloat(data.fontSize) || 12, 9), 15)
        const accent = data.accentDark || '#4A3B32'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const heading = (title, extra) => `<div style="font-family:'Playfair Display',serif;font-size:${fontSize + 8}px;font-weight:bold;color:${accent};margin-bottom:10px;${extra || ''}">${title}</div>`

        // Rough height estimators (the page is absolutely positioned, so we stack sections by estimated height)
        const LH = 1.45
        const lines = (text, charsPerLine) => String(text || '').split('\n').reduce((n, l) => n + Math.max(1, Math.ceil(l.length / charsPerLine)), 0)
        const charsFor = (widthPx, size) => Math.max(10, Math.floor(widthPx / (size * 0.52)))

        const work = (data.work || []).filter(w => w.title)
        const edu = (data.edu || []).filter(e => e.school)
        const awards = (data.awards || []).filter(a => a.name)
        const certs = (data.certifications || []).filter(c => c.name)
        const langs = (data.languages || []).filter(l => l.name)

        // Title bar, contact bar, skills bar
        buildHtmlElement({
            left: 0, top: 0, width: 794, html: `<div style="width:794px;height:100px;background:${accent};display:flex;align-items:center;justify-content:center;color:white;text-align:center;padding:0 20px;box-sizing:border-box;">
      <div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2}px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">${esc(data.name)}${data.jobtitle ? ' - ' + esc(data.jobtitle) : ''}</div></div>`
        })

        buildHtmlElement({
            left: 0, top: 100, width: 794, html: `<div style="width:794px;height:40px;background:#7A6353;display:flex;justify-content:center;align-items:center;gap:26px;color:white;font-size:${fontSize}px;">
      ${data.email ? `<div>${esc(data.email)}</div>` : ''}${data.location ? `<div>${esc(data.location)}</div>` : ''}${data.phone ? `<div>${esc(data.phone)}</div>` : ''}</div>`
        })

        const skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : []
        if (skills.length) {
            buildHtmlElement({
                left: 0, top: 140, width: 794, html: `<div style="width:794px;min-height:40px;background:#9C826E;display:flex;flex-wrap:wrap;justify-content:space-around;align-items:center;gap:2px 16px;padding:6px 20px;box-sizing:border-box;color:white;font-size:${fontSize + 1}px;">
        ${skills.map(s => `<div>${esc(s)}</div>`).join('')}</div>`
            })
        }

        const divider = y => buildHtmlElement({ left: 0, top: y, width: 794, html: `<div style="width:794px;height:2px;background:#111;"></div>` })
        const W = 694
        let y = 190

        // Summary
        if (data.summary) {
            const h = lines(data.summary, charsFor(W, fontSize + 2)) * (fontSize + 2) * LH
            buildHtmlElement({ left: 50, top: y, width: W, html: `<div style="font-size:${fontSize + 2}px;line-height:${LH};">${esc(data.summary)}</div>` })
            y += Math.ceil(h) + 16
        }
        divider(y); y += 14

        // Languages
        if (langs.length) {
            buildHtmlElement({
                left: 50, top: y, width: W, html: `<div style="display:flex;flex-wrap:wrap;gap:6px 30px;align-items:center;">
        <div style="font-family:'Playfair Display',serif;font-size:${fontSize + 8}px;font-weight:bold;color:${accent};width:140px;">Language’s</div>
        ${langs.map(l => `<div style="display:flex;gap:8px;align-items:baseline;font-size:${fontSize + 1}px;"><span>${esc(l.name)}</span>${l.level ? `<span style="font-size:${fontSize - 1}px;">(${esc(l.level)})</span>` : ''}</div>`).join('')}</div>`
            })
            y += 44
            divider(y); y += 14
        }

        // Work experience
        if (work.length) {
            let h = fontSize + 8 + 10 + 6
            let html = `<div>${heading('Work Experience’s')}`
            work.forEach(w => {
                html += `<div style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;gap:10px;font-size:${fontSize + 2}px;margin-bottom:4px;">
            <span style="width:170px;flex-shrink:0;">${esc(w.company)}</span><span style="flex:1;">${esc(w.title)}</span><span style="white-space:nowrap;">${esc(w.duration)}</span></div>`
                h += (fontSize + 2) * LH + 4 + 14
                if (w.desc) {
                    html += `<div style="font-size:${fontSize + 1}px;line-height:1.4;padding-left:180px;">${esc(w.desc).replace(/\n/g, '<br>')}</div>`
                    h += lines(w.desc, charsFor(W - 180, fontSize + 1)) * (fontSize + 1) * 1.4
                }
                html += `</div>`
            })
            html += `</div>`
            buildHtmlElement({ left: 50, top: y, width: W, html })
            y += Math.ceil(h) + 6
            divider(y); y += 14
        }

        // Education
        if (edu.length) {
            let h = fontSize + 8 + 10 + 6
            let html = `<div>${heading('Education')}`
            edu.forEach(e => {
                html += `<div style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;gap:10px;font-size:${fontSize + 2}px;margin-bottom:2px;"><span>${esc(e.school)}</span><span style="white-space:nowrap;">${esc(e.year)}</span></div>
          ${e.course ? `<div style="font-size:${fontSize + 1}px;">${esc(e.course)}</div>` : ''}</div>`
                h += (fontSize + 2) * LH + 2 + (e.course ? (fontSize + 1) * LH : 0) + 8
            })
            html += `</div>`
            buildHtmlElement({ left: 50, top: y, width: W, html })
            y += Math.ceil(h) + 6
            divider(y); y += 14
        }

        // Awards | Certification (two columns)
        if (awards.length || certs.length) {
            let hA = awards.length ? fontSize + 8 + 16 : 0
            awards.forEach(a => { hA += ((a.issuer ? 2 : 1) + (a.year ? 1 : 0)) * (fontSize + 1) * LH + 8 })
            let hC = certs.length ? fontSize + 8 + 16 : 0
            certs.forEach(c => { hC += (fontSize + 1) * LH + (c.org ? fontSize * LH : 0) + 8 })

            let bottom = `<div style="display:flex;gap:36px;">`
            bottom += `<div style="flex:1;min-width:0;">${awards.length ? heading('Awards and Achievement') : ''}`
            awards.forEach(a => {
                bottom += `<div style="margin-bottom:8px;font-size:${fontSize + 1}px;"><div>${esc(a.name)}</div>${a.issuer ? `<div>${esc(a.issuer)}</div>` : ''}${a.year ? `<div>${esc(a.year)}</div>` : ''}</div>`
            })
            bottom += `</div>`
            bottom += `<div style="flex:1;min-width:0;">${certs.length ? heading('Certification', 'text-align:center;') : ''}`
            certs.forEach(c => {
                bottom += `<div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 1}px;margin-bottom:2px;"><span style="font-weight:bold;">${esc(c.name)}</span><span style="white-space:nowrap;">${esc(c.date)}</span></div>`
                if (c.org) bottom += `<div style="font-size:${fontSize}px;margin-bottom:8px;">${esc(c.org)}</div>`
            })
            bottom += `</div></div>`
            buildHtmlElement({ left: 50, top: y, width: W, html: bottom })
            y += Math.ceil(Math.max(hA, hC)) + 6
            divider(y)
        }
    }
})