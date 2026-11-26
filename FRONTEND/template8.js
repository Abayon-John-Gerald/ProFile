initResumeEditor({
    templateNum: 8,
    storageKey: 'profile_canvas_state_t8',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = Math.min(Math.max(parseFloat(data.fontSize) || 12, 9), 15)
        const accent = data.accentDark || '#3A5F3E'
        const accentLight = data.accentLight || '#D6E4D6'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // Custom sections added in the form (each: { name, entries: [text, ...] })
        const customHTML = headFn => (data.customSections || []).map(sec => {
            const items = (sec.entries || []).filter(e => e && String(e).trim())
            if (!items.length) return ''
            return headFn(esc(sec.name)) + items.map(i => `<div style="display:flex;gap:8px;margin-bottom:3px;font-size:${fontSize + 1}px;line-height:1.35;"><span>•</span><span>${esc(i)}</span></div>`).join('') + `<div style="height:10px;"></div>`
        }).join('')

        buildHtmlElement({
            left: 0, top: 0, width: 280, html: `<div style="width:280px;height:1123px;background:white;position:relative;">
      <div style="position:absolute;top:0;left:0;width:100%;height:42%;background:${accent};"></div>
      <div style="position:absolute;bottom:0;left:0;width:100%;height:58%;background:${accentLight};"></div></div>`
        })
        if (data.photo) buildImageElement({ src: data.photo, left: 40, top: 40, width: 200, height: 200, borderRadius: '50%' })

        let side = `<div style="padding:0 26px;">`
        side += `<div style="margin-top:268px;margin-bottom:0;height:150px;overflow:hidden;">`
        ;[data.email, data.phone, data.location].filter(Boolean).forEach(c => side += `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
      <div style="width:28px;height:28px;background:rgba(255,255,255,0.25);border-radius:50%;flex-shrink:0;"></div>
      <div style="font-size:${fontSize}px;color:white;margin-top:5px;word-break:break-word;min-width:0;">${esc(c)}</div></div>`)
        side += `</div>`

        side += `<div style="font-size:${fontSize + 6}px;font-weight:bold;color:${accent};margin-bottom:10px;">Skills</div>`
        side += `<div style="font-size:${fontSize + 1}px;line-height:1.5;">`
        if (data.skills) data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => side += `<div style="display:flex;gap:8px;margin-bottom:3px;"><span>•</span><span>${esc(s)}</span></div>`)
        side += `</div><div style="height:18px;"></div>`

        if (data.languages && data.languages.filter(l => l.name).length) {
            side += `<div style="font-size:${fontSize + 6}px;font-weight:bold;color:${accent};margin-bottom:10px;">Language’s</div>`
            data.languages.filter(l => l.name).forEach(l => side += `<div style="display:flex;gap:8px;align-items:baseline;font-size:${fontSize + 1}px;margin-bottom:6px;">
      <span>${esc(l.name)}</span>${l.level ? `<span style="font-size:${fontSize}px;">(${esc(l.level)})</span>` : ''}</div>`)
            side += `<div style="height:18px;"></div>`
        }

        if (data.certifications && data.certifications.filter(c => c.name).length) {
            side += `<div style="font-size:${fontSize + 6}px;font-weight:bold;color:${accent};margin-bottom:10px;">Certification</div>`
            data.certifications.filter(c => c.name).forEach(c => side += `<div style="margin-bottom:8px;">
        <div style="font-size:${fontSize + 1}px;font-weight:bold;">${esc(c.name)}</div>
        ${c.org ? `<div style="font-size:${fontSize}px;">${esc(c.org)}</div>` : ''}
        ${c.date ? `<div style="font-size:${fontSize}px;">${esc(c.date)}</div>` : ''}</div>`)
        }
        side += `</div>`
        buildHtmlElement({ left: 0, top: 0, width: 280, html: side })

        let main = `<div style="padding:0 34px 0 20px;">`
        main += `<div style="text-align:right;margin-top:36px;margin-bottom:22px;">
      <div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.2}px;font-weight:700;text-transform:uppercase;margin-bottom:4px;">${esc(data.name)}</div>
      <div style="font-size:${fontSize + 4}px;">${esc(data.jobtitle)}</div></div>`

        const secHead = title => `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      <div style="width:34px;height:34px;background:#E5E5E5;border-radius:50%;flex-shrink:0;"></div>
      <div style="font-size:${fontSize + 6}px;font-weight:bold;border-bottom:2px solid #111;padding-bottom:3px;flex:1;">${title}</div></div>`

        if (data.summary) { main += secHead('About Me'); main += `<div style="font-size:${fontSize + 2}px;line-height:1.4;margin-bottom:18px;">${esc(data.summary)}</div>` }

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
          <div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;margin-bottom:3px;"><span>${esc(w.title)}${w.company ? ' | ' + esc(w.company) : ''}</span><span style="white-space:nowrap;">${esc(w.duration)}</span></div>`
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
                main += `<div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;margin-bottom:8px;">
          <span>${esc(a.name)}${a.issuer ? '<br><span style="font-size:' + fontSize + 'px;">' + esc(a.issuer) + '</span>' : ''}</span><span style="white-space:nowrap;">${esc(a.year)}</span></div>`
            })
        }
        main += customHTML(secHead)
        main += `</div>`
        buildHtmlElement({ left: 280, top: 0, width: 514, html: main })
    }
})