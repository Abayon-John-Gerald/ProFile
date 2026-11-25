initResumeEditor({
    templateNum: 8,
    storageKey: 'profile_canvas_state_t8',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const accent = data.accentDark || '#3A5F3E'
        const accentLight = data.accentLight || '#D6E4D6'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        buildHtmlElement({
            left: 0, top: 0, width: 280, html: `<div style="width:280px;height:1123px;background:white;position:relative;">
      <div style="position:absolute;top:0;left:0;width:100%;height:55%;background:${accent};"></div>
      <div style="position:absolute;bottom:0;left:0;width:100%;height:45%;background:${accentLight};"></div></div>`
        })
        if (data.photo) buildImageElement({ src: data.photo, left: 40, top: 40, width: 200, height: 200, borderRadius: '50%' })

        let side = `<div style="padding:0 30px;">`
        side += `<div style="margin-top:300px;margin-bottom:40px;">`
            ;[data.email, data.phone, data.location].filter(Boolean).forEach(c => side += `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:20px;">
      <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:50%;flex-shrink:0;"></div>
      <div style="font-size:${fontSize}px;color:white;margin-top:6px;">${esc(c)}</div></div>`)
        side += `</div>`

        side += `<div style="font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:14px;">Skills</div>`
        side += `<div style="font-size:${fontSize + 2}px;line-height:1.6;">`
        if (data.skills) data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => side += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`)
        side += `</div><div style="height:30px;"></div>`

        side += `<div style="font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:14px;">Language’s</div>`
        if (data.languages) data.languages.filter(l => l.name).forEach(l => side += `<div style="display:flex;gap:8px;align-items:baseline;font-size:${fontSize + 2}px;margin-bottom:8px;">
      <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize}px;">(${esc(l.level)})</span>` : ''}</div>`)
        side += `<div style="height:30px;"></div>`

        if (data.certifications && data.certifications.length) {
            side += `<div style="font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:14px;">Certification</div>`
            data.certifications.filter(c => c.name).forEach(c => side += `<div style="margin-bottom:12px;">
        <div style="font-size:${fontSize + 2}px;font-weight:bold;">${esc(c.name)}</div>
        ${c.org ? `<div style="font-size:${fontSize}px;">${esc(c.org)}</div>` : ''}
        ${c.date ? `<div style="font-size:${fontSize}px;">${esc(c.date)}</div>` : ''}</div>`)
        }
        side += `</div>`
        buildHtmlElement({ left: 0, top: 0, width: 280, html: side })

        let main = `<div style="padding-left:20px;">`
        main += `<div style="text-align:right;margin-top:40px;margin-bottom:40px;">
      <div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.4}px;font-weight:700;text-transform:uppercase;margin-bottom:4px;">${esc(data.name)}</div>
      <div style="font-size:${fontSize + 6}px;">${esc(data.jobtitle)}</div></div>`

        const secHead = (title) => `<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div style="width:50px;height:50px;background:#E5E5E5;border-radius:50%;flex-shrink:0;"></div>
      <div style="font-size:${fontSize + 10}px;font-weight:bold;border-bottom:2px solid #111;padding-bottom:4px;width:100%;">${title}</div></div>`

        if (data.summary) { main += secHead('About Me'); main += `<div style="font-size:${fontSize + 4}px;line-height:1.45;margin-bottom:30px;">${esc(data.summary)}</div>` }

        if (data.edu && data.edu.length) {
            main += secHead('Education')
            data.edu.forEach(e => {
                if (!e.school) return
                main += `<div style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;margin-bottom:4px;"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>
          ${e.course ? `<div style="font-size:${fontSize + 2}px;">${esc(e.course)}</div>` : ''}</div>`
            })
        }

        if (data.work && data.work.length) {
            main += secHead('Work Experience’s')
            data.work.forEach(w => {
                if (!w.title) return
                main += `<div style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;margin-bottom:6px;"><span>${esc(w.title)} ${w.company ? ' | ' + esc(w.company) : ''}</span> <span>${esc(w.duration)}</span></div>`
                if (w.desc) {
                    main += `<div style="font-size:${fontSize + 2}px;line-height:1.4;">`
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
                main += `<div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;margin-bottom:12px;">
          <span>${esc(a.name)} ${a.issuer ? '<br><span style="font-size:' + fontSize + 'px;">' + esc(a.issuer) + '</span>' : ''}</span> <span>${esc(a.year)}</span></div>`
            })
        }
        main += `</div>`
        buildHtmlElement({ left: 280, top: 0, width: 514, html: main })
    }
})