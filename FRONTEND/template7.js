initResumeEditor({
    templateNum: 7,
    storageKey: 'profile_canvas_state_t7',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const accent = data.accentDark || '#2F4C32'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        buildHtmlElement({ left: -100, top: -100, width: 300, html: `<div style="width:300px;height:300px;background:${accent};border-radius:50%;"></div>` })
        if (data.photo) buildImageElement({ src: data.photo, left: 40, top: 40, width: 160, height: 160, borderRadius: '50%' })

        let header = `<div style="margin-left:20px;">
      <div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.4}px;font-weight:700;text-transform:uppercase;margin-bottom:6px;">${esc(data.name)}</div>
      <div style="font-size:${fontSize + 4}px;margin-bottom:16px;">${esc(data.jobtitle)}</div>
      ${data.summary ? `<div style="font-size:${fontSize + 2}px;line-height:1.5;">${esc(data.summary)}</div>` : ''}</div>`
        buildHtmlElement({ left: 230, top: 40, width: 520, html: header })

        buildHtmlElement({ left: 0, top: 280, width: 794, html: `<div style="width:100%;height:2px;background:#111;"></div>` })

        let side = `<div style="padding-right:20px;">`
        const contacts = [data.email, data.phone, data.location].filter(Boolean)
        if (contacts.length) {
            side += `<div style="margin-bottom:40px;">`
            contacts.forEach(c => side += `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
        <div style="width:30px;height:30px;background:#ccc;border-radius:50%;flex-shrink:0;"></div>
        <div style="font-size:${fontSize}px;margin-top:4px;">${esc(c)}</div></div>`)
            side += `</div>`
        }
        if (data.skills) {
            side += `<div style="font-size:${fontSize + 10}px;font-weight:bold;margin-bottom:14px;">Skills</div>`
            side += `<div style="font-size:${fontSize + 2}px;line-height:1.6;">`
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => side += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`)
            side += `</div><div style="height:40px;"></div>`
        }
        if (data.languages && data.languages.length) {
            side += `<div style="font-size:${fontSize + 10}px;font-weight:bold;margin-bottom:14px;">Language’s</div>`
            data.languages.filter(l => l.name).forEach(l => side += `<div style="display:flex;gap:8px;align-items:baseline;font-size:${fontSize + 2}px;margin-bottom:8px;">
        <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize}px;">(${esc(l.level)})</span>` : ''}</div>`)
        }
        side += `</div>`
        buildHtmlElement({ left: 50, top: 310, width: 240, html: side })

        buildHtmlElement({ left: 310, top: 310, width: 2, html: `<div style="width:2px;height:780px;background:#111;"></div>` })

        let main = `<div style="padding-left:20px;">`
        const secHead = (title) => `<div style="text-align:center;margin-bottom:20px;">
      <div style="font-size:${fontSize + 8}px;font-weight:bold;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">${title}</div></div>`

        if (data.edu && data.edu.length) {
            main += secHead('Education')
            data.edu.forEach(e => {
                if (!e.school) return
                main += `<div style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;margin-bottom:2px;"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>
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
        if (data.certifications && data.certifications.length) {
            main += secHead('Certification')
            data.certifications.forEach(c => {
                if (!c.name) return
                main += `<div style="margin-bottom:12px;">
          <div style="font-size:${fontSize + 4}px;font-weight:bold;">${esc(c.name)}</div>
          ${c.org ? `<div style="font-size:${fontSize + 2}px;">${esc(c.org)}</div>` : ''}
          ${c.date ? `<div style="font-size:${fontSize + 2}px;">${esc(c.date)}</div>` : ''}</div>`
            })
        }
        main += `</div>`
        buildHtmlElement({ left: 340, top: 310, width: 420, html: main })

        buildHtmlElement({ left: 544, top: 823, width: 400, html: `<div style="width:400px;height:400px;background:${accent};border-radius:50%;opacity:0.9;"></div>` })
    }
})