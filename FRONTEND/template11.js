initResumeEditor({
    templateNum: 11,
    storageKey: 'profile_canvas_state_t11',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const accent = data.accentDark || '#243424'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        buildHtmlElement({ left: 0, top: 0, width: 280, html: `<div style="width:280px;height:1123px;background:${accent};"></div>` })
        buildHtmlElement({
            left: 280, top: 0, width: 514, html: `<div style="width:514px;height:180px;background:white;display:flex;align-items:center;justify-content:flex-end;padding-right:40px;box-sizing:border-box;">
      <div style="text-align:right;">
        <div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.4}px;font-weight:700;text-transform:uppercase;margin-bottom:6px;">${esc(data.name)}</div>
        <div style="font-size:${fontSize + 4}px;">${esc(data.jobtitle)}</div></div></div>`
        })

        buildHtmlElement({ left: 280, top: 180, width: 514, html: `<div style="width:514px;height:12px;background:${accent};"></div>` })
        buildHtmlElement({ left: 0, top: 192, width: 794, html: `<div style="width:794px;border-bottom:2px solid ${accent};"></div>` })

        if (data.photo) buildImageElement({ src: data.photo, left: 40, top: 40, width: 200, height: 200, borderRadius: '50%' })

        let side = `<div style="padding:0 30px;">`
        side += `<div style="margin-top:260px;margin-bottom:40px;">`
            ;[data.email, data.phone, data.location].filter(Boolean).forEach(c => side += `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:20px;">
      <div style="width:36px;height:36px;background:#D1D5DB;border-radius:50%;flex-shrink:0;"></div>
      <div style="font-size:${fontSize}px;color:white;margin-top:6px;">${esc(c)}</div></div>`)
        side += `</div>`

        side += `<div style="font-size:${fontSize + 10}px;font-weight:bold;color:white;margin-bottom:14px;">Language’s</div>`
        if (data.languages) data.languages.filter(l => l.name).forEach(l => side += `<div style="display:flex;gap:8px;align-items:baseline;font-size:${fontSize + 2}px;color:white;margin-bottom:8px;">
      <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize}px;opacity:0.7;">(${esc(l.level)})</span>` : ''}</div>`)
        side += `<div style="height:40px;"></div>`

        side += `<div style="font-size:${fontSize + 10}px;font-weight:bold;color:white;margin-bottom:14px;">Skills</div>`
        if (data.skills) {
            side += `<div style="font-size:${fontSize + 2}px;color:white;line-height:1.6;">`
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => side += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`)
            side += `</div>`
        }
        side += `</div>`
        buildHtmlElement({ left: 0, top: 0, width: 280, html: side })

        let main = `<div style="padding-left:30px;">`
        if (data.summary) main += `<div style="font-size:${fontSize + 4}px;line-height:1.45;margin-top:40px;margin-bottom:30px;">${esc(data.summary)}</div>`

        const head = (title) => `<div style="display:flex;align-items:center;gap:10px;border-bottom:2px solid ${accent};padding-bottom:4px;margin-bottom:16px;">
      <div style="font-size:${fontSize + 10}px;font-weight:bold;">${title}</div></div>`

        if (data.edu && data.edu.length) {
            main += head('Education')
            data.edu.forEach(e => {
                if (!e.school) return
                main += `<div style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;margin-bottom:4px;"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>
          ${e.course ? `<div style="font-size:${fontSize + 2}px;">${esc(e.course)}</div>` : ''}</div>`
            })
        }

        if (data.work && data.work.length) {
            main += head('Work Experience’s')
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
            main += head('Awards and Achievement')
            data.awards.forEach(a => {
                if (!a.name) return
                main += `<div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;margin-bottom:12px;">
          <span>${esc(a.name)} ${a.issuer ? '<br><span style="font-size:' + fontSize + 'px;">' + esc(a.issuer) + '</span>' : ''}</span> <span>${esc(a.year)}</span></div>`
            })
        }

        if (data.certifications && data.certifications.length) {
            main += head('Certification')
            data.certifications.forEach(c => {
                if (!c.name) return
                main += `<div style="margin-bottom:16px;">
          <div style="font-size:${fontSize + 4}px;font-weight:bold;">${esc(c.name)}</div>
          ${c.org ? `<div style="font-size:${fontSize + 2}px;">${esc(c.org)}</div>` : ''}
          ${c.date ? `<div style="font-size:${fontSize + 2}px;">${esc(c.date)}</div>` : ''}</div>`
            })
        }
        main += `</div>`
        buildHtmlElement({ left: 280, top: 220, width: 514, html: main })
    }
})