initResumeEditor({
    templateNum: 9,
    storageKey: 'profile_canvas_state_t9',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = Math.min(Math.max(parseFloat(data.fontSize) || 12, 9), 15)
        const accent = data.accentDark || '#6A4766'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // Custom sections added in the form (each: { name, entries: [text, ...] })
        const customHTML = headFn => (data.customSections || []).map(sec => {
            const items = (sec.entries || []).filter(e => e && String(e).trim())
            if (!items.length) return ''
            return headFn(esc(sec.name)) + items.map(i => `<div style="display:flex;gap:8px;margin-bottom:3px;font-size:${fontSize + 1}px;line-height:1.35;"><span>•</span><span>${esc(i)}</span></div>`).join('') + `<div style="height:10px;"></div>`
        }).join('')

        // Backgrounds (drawn first, behind everything)
        buildHtmlElement({ left: 0, top: 0, width: 260, html: `<div style="width:260px;height:1123px;background:#E8E8E8;"></div>` })
        buildHtmlElement({ left: 0, top: 0, width: 60, html: `<div style="width:60px;height:160px;background:${accent};"></div>` })
        buildHtmlElement({ left: 260, top: 0, width: 534, html: `<div style="width:534px;height:1123px;background:white;"></div>` })
        buildHtmlElement({ left: 260, top: 0, width: 534, html: `<div style="width:534px;height:135px;background:${accent};"></div>` })
        buildHtmlElement({ left: 80, top: 230, width: 100, html: `<div style="width:100px;height:6px;background:${accent};"></div>` })
        if (data.photo) buildImageElement({ src: data.photo, left: 50, top: 50, width: 160, height: 160, borderRadius: '0' })

        // Sidebar
        let side = `<div style="padding:0 28px;">`
        side += `<div style="margin-top:260px;margin-bottom:28px;">`
        ;[data.email, data.phone, data.location].filter(Boolean).forEach(c => side += `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;">
      <div style="width:28px;height:28px;background:#999;border-radius:50%;flex-shrink:0;"></div>
      <div style="font-size:${fontSize}px;margin-top:5px;word-break:break-word;min-width:0;">${esc(c)}</div></div>`)
        side += `</div>`

        side += `<div style="font-size:${fontSize + 8}px;font-weight:bold;margin-bottom:10px;text-align:center;">Skills</div>`
        side += `<div style="font-size:${fontSize + 1}px;line-height:1.5;">`
        if (data.skills) data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => side += `<div style="display:flex;gap:8px;margin-bottom:3px;"><span>•</span><span>${esc(s)}</span></div>`)
        side += `</div><div style="height:24px;"></div>`

        if (data.languages && data.languages.filter(l => l.name).length) {
            side += `<div style="font-size:${fontSize + 8}px;font-weight:bold;margin-bottom:10px;text-align:center;">Language’s</div>`
            data.languages.filter(l => l.name).forEach(l => side += `<div style="display:flex;gap:8px;align-items:baseline;font-size:${fontSize + 1}px;margin-bottom:6px;justify-content:center;">
      <span>${esc(l.name)}</span>${l.level ? `<span style="font-size:${fontSize}px;">(${esc(l.level)})</span>` : ''}</div>`)
        }
        side += `</div>`
        buildHtmlElement({ left: 0, top: 0, width: 260, html: side })

        // Name / summary / education (between top band and work band)
        let main = `<div style="padding:22px 36px 0;">`
        main += `<div style="text-align:center;margin-bottom:16px;">
      <div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.1}px;font-weight:700;text-transform:uppercase;margin-bottom:4px;">${esc(data.name)}</div>
      <div style="font-size:${fontSize + 3}px;">${esc(data.jobtitle)}</div></div>`
        if (data.summary) main += `<div style="font-size:${fontSize + 1}px;line-height:1.4;text-align:center;margin-bottom:20px;">${esc(data.summary)}</div>`

        if (data.edu && data.edu.length) {
            main += `<div style="text-align:center;margin-bottom:10px;"><div style="font-size:${fontSize + 8}px;font-weight:bold;">Education</div></div>`
            data.edu.forEach(e => {
                if (!e.school) return
                main += `<div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;margin-bottom:2px;"><span>${esc(e.school)}</span><span style="white-space:nowrap;">${esc(e.year)}</span></div>
          ${e.course ? `<div style="font-size:${fontSize + 1}px;">${esc(e.course)}</div>` : ''}</div>`
            })
        }
        main += `</div>`
        buildHtmlElement({ left: 260, top: 135, width: 534, html: main })

        // Work band: the accent background and the text live in ONE element,
        // so the text is always on the band (white on accent) and the band grows with it
        let workHTML = `<div style="background:${accent};color:white;padding:16px 40px;min-height:240px;box-sizing:border-box;">`
        if (data.work && data.work.length) {
            workHTML += `<div style="text-align:center;margin-bottom:10px;"><div style="font-size:${fontSize + 8}px;font-weight:bold;">Work Experience’s</div></div>`
            data.work.forEach(w => {
                if (!w.title) return
                workHTML += `<div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;margin-bottom:3px;"><span>${esc(w.title)}${w.company ? ' | ' + esc(w.company) : ''}</span><span style="white-space:nowrap;">${esc(w.duration)}</span></div>`
                if (w.desc) {
                    workHTML += `<div style="font-size:${fontSize + 1}px;line-height:1.3;">`
                    w.desc.split('\n').filter(Boolean).forEach(line => workHTML += `<div style="display:flex;gap:8px;margin-bottom:1px;"><span>•</span><span>${esc(line)}</span></div>`)
                    workHTML += `</div>`
                }
                workHTML += `</div>`
            })
        }
        workHTML += `</div>`
        buildHtmlElement({ left: 260, top: 480, width: 534, html: workHTML })

        // Awards + certifications
        let bottom = `<div style="padding:20px 40px;">`
        if (data.awards && data.awards.length) {
            bottom += `<div style="text-align:center;margin-bottom:10px;"><div style="font-size:${fontSize + 8}px;font-weight:bold;">Awards and Achievement</div></div>`
            data.awards.forEach(a => {
                if (!a.name) return
                bottom += `<div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;margin-bottom:8px;">
          <span>${esc(a.name)}${a.issuer ? '<br><span style="font-size:' + fontSize + 'px;">' + esc(a.issuer) + '</span>' : ''}</span><span style="white-space:nowrap;">${esc(a.year)}</span></div>`
            })
            bottom += `<div style="height:10px;"></div>`
        }
        if (data.certifications && data.certifications.length) {
            bottom += `<div style="text-align:center;margin-bottom:10px;"><div style="font-size:${fontSize + 8}px;font-weight:bold;">Certification</div></div>`
            data.certifications.forEach(c => {
                if (!c.name) return
                bottom += `<div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;margin-bottom:3px;"><span>${esc(c.name)}</span><span style="white-space:nowrap;">${esc(c.date)}</span></div>`
                if (c.org) bottom += `<div style="font-size:${fontSize}px;margin-bottom:8px;">${esc(c.org)}</div>`
            })
        }
        bottom += customHTML(t => `<div style="text-align:center;margin:10px 0;"><div style="font-size:${fontSize + 8}px;font-weight:bold;">${t}</div></div>`)
        bottom += `</div>`
        buildHtmlElement({ left: 260, top: 720, width: 534, html: bottom })
    }
})