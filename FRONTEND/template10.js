initResumeEditor({
    templateNum: 10,
    storageKey: 'profile_canvas_state_t10',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const accent = data.accentDark || '#1C291C'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        buildHtmlElement({ left: 0, top: 0, width: 794, html: `<div style="width:794px;height:150px;background:${accent};"></div>` })
        if (data.photo) buildImageElement({ src: data.photo, left: 40, top: 25, width: 100, height: 100, borderRadius: '50%' })

        let head = `<div style="text-align:right;margin-top:40px;margin-right:40px;">
      <div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.2}px;font-weight:700;color:white;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">${esc(data.name)}</div>
      <div style="font-size:${fontSize + 4}px;color:#D1D5DB;">${esc(data.jobtitle)}</div></div>`
        buildHtmlElement({ left: 150, top: 0, width: 644, html: head })

        buildHtmlElement({ left: 0, top: 150, width: 794, html: `<div style="width:794px;height:40px;background:#EAEAEA;"></div>` })
        let contact = [data.email, data.phone, data.location].filter(Boolean).map(esc)
        let contactHTML = `<div style="display:flex;justify-content:space-around;align-items:center;height:40px;font-size:${fontSize}px;">${contact.map(c => `<div>${c}</div>`).join('')}</div>`
        buildHtmlElement({ left: 0, top: 150, width: 794, html: contactHTML })

        buildHtmlElement({ left: 260, top: 190, width: 2, html: `<div style="width:2px;height:933px;background:#111;"></div>` })
            ;[480, 720, 860].forEach(y => buildHtmlElement({ left: 0, top: y, width: 794, html: `<div style="width:794px;height:2px;background:#111;"></div>` }))

        const secHead = (title) => `<div style="text-align:center;font-size:${fontSize + 8}px;font-weight:bold;margin-bottom:16px;">${title}</div>`

        // Left Lang
        let left1 = `<div style="padding:20px;">${secHead('Language’s')}`
        if (data.languages) data.languages.filter(l => l.name).forEach(l => left1 += `<div style="display:flex;gap:8px;align-items:baseline;font-size:${fontSize + 2}px;margin-bottom:10px;">
      <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize}px;">(${esc(l.level)})</span>` : ''}</div>`)
        left1 += `</div>`
        buildHtmlElement({ left: 0, top: 190, width: 260, html: left1 })

        // Right Summary
        let right1 = `<div style="padding:20px 40px;">`
        if (data.summary) right1 += `<div style="font-size:${fontSize + 4}px;line-height:1.5;text-align:justify;">${esc(data.summary)}</div>`
        right1 += `</div>`
        buildHtmlElement({ left: 260, top: 190, width: 534, html: right1 })

        // Left Edu
        let left2 = `<div style="padding:20px;">${secHead('Education')}</div>`
        buildHtmlElement({ left: 0, top: 480, width: 260, html: left2 })

        let right2 = `<div style="padding:30px 40px;">`
        if (data.edu) data.edu.forEach(e => {
            if (!e.school) return
            right2 += `<div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;margin-bottom:4px;"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>
        ${e.course ? `<div style="font-size:${fontSize + 2}px;">${esc(e.course)}</div>` : ''}</div>`
        })
        right2 += `</div>`
        buildHtmlElement({ left: 260, top: 480, width: 534, html: right2 })

        // Left Exp
        let left3 = `<div style="padding:20px;">${secHead('Experience’s')}</div>`
        buildHtmlElement({ left: 0, top: 720, width: 260, html: left3 })

        let right3 = `<div style="padding:30px 40px;">`
        if (data.work) data.work.forEach(w => {
            if (!w.title) return
            right3 += `<div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;margin-bottom:6px;"><span>${esc(w.title)} ${w.company ? ' | ' + esc(w.company) : ''}</span> <span>${esc(w.duration)}</span></div>`
            if (w.desc) {
                right3 += `<div style="font-size:${fontSize + 2}px;line-height:1.4;">`
                w.desc.split('\n').filter(Boolean).forEach(line => right3 += `<div style="display:flex;gap:8px;margin-bottom:2px;"><span>•</span> <span>${esc(line)}</span></div>`)
                right3 += `</div>`
            }
            right3 += `</div>`
        })
        right3 += `</div>`
        buildHtmlElement({ left: 260, top: 720, width: 534, html: right3 })

        // Left Award
        let left4 = `<div style="padding:20px;">${secHead('Achievement')}</div>`
        buildHtmlElement({ left: 0, top: 860, width: 260, html: left4 })

        let right4 = `<div style="padding:30px 40px;">`
        if (data.awards) data.awards.forEach(a => {
            if (!a.name) return
            right4 += `<div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;margin-bottom:12px;">
        <span>${esc(a.name)} ${a.issuer ? '<br><span style="font-size:' + fontSize + 'px;">' + esc(a.issuer) + '</span>' : ''}</span> <span>${esc(a.year)}</span></div>`
        })
        right4 += `</div>`
        buildHtmlElement({ left: 260, top: 860, width: 534, html: right4 })

        // Bottom
        let bottom = `<div style="display:flex;height:243px;">`
        bottom += `<div style="flex:1;padding:30px 20px;text-align:center;">${secHead('Skills')}`
        if (data.skills) {
            bottom += `<div style="font-size:${fontSize + 2}px;line-height:1.6;text-align:left;padding-left:20px;">`
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => bottom += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`)
            bottom += `</div>`
        }
        bottom += `</div>`
        bottom += `<div style="flex:1;padding:30px 40px;text-align:center;">${secHead('Certification')}`
        if (data.certifications) data.certifications.forEach(c => {
            if (!c.name) return
            bottom += `<div style="display:flex;justify-content:space-between;font-size:${fontSize + 2}px;margin-bottom:8px;text-align:left;"><span style="font-weight:bold;">${esc(c.name)}</span> <span>${esc(c.date)}</span></div>`
            if (c.org) bottom += `<div style="font-size:${fontSize}px;text-align:left;margin-bottom:12px;">${esc(c.org)}</div>`
        })
        bottom += `</div></div>`
        buildHtmlElement({ left: 0, top: 880, width: 794, html: bottom })
    }
})