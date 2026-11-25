initResumeEditor({
    templateNum: 12,
    storageKey: 'profile_canvas_state_t12',
    renderFromFormData({ data, buildHtmlElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const accent = data.accentDark || '#4A3B32'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        let top = `<div style="width:794px;height:100px;background:${accent};display:flex;align-items:center;justify-content:center;color:white;text-align:center;">
      <div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.2}px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">${esc(data.name)} ${data.jobtitle ? '- ' + esc(data.jobtitle) : ''}</div></div>`
        buildHtmlElement({ left: 0, top: 0, width: 794, html: top })

        buildHtmlElement({
            left: 0, top: 100, width: 794, html: `<div style="width:794px;height:40px;background:#7A6353;display:flex;justify-content:center;align-items:center;gap:30px;color:white;font-size:${fontSize}px;">
      ${data.email ? `<div>${esc(data.email)}</div>` : ''} ${data.location ? `<div>${esc(data.location)}</div>` : ''} ${data.phone ? `<div>${esc(data.phone)}</div>` : ''}</div>`
        })

        if (data.skills) {
            let skHTML = `<div style="width:794px;height:40px;background:#9C826E;display:flex;justify-content:space-around;align-items:center;color:white;font-size:${fontSize + 2}px;">`
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => skHTML += `<div>${esc(s)}</div>`)
            skHTML += `</div>`
            buildHtmlElement({ left: 0, top: 140, width: 794, html: skHTML })
        }

        const divider = (y) => buildHtmlElement({ left: 0, top: y, width: 794, html: `<div style="width:794px;height:2px;background:#111;"></div>` })

        let y = 180
        if (data.summary) {
            buildHtmlElement({ left: 50, top: y + 20, width: 694, html: `<div style="font-size:${fontSize + 4}px;line-height:1.5;">${esc(data.summary)}</div>` })
            y += 100
        }
        divider(y); y += 20

        if (data.languages && data.languages.length) {
            let langHTML = `<div style="display:flex;gap:40px;align-items:center;">`
            langHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};width:150px;">Language’s</div>`
            data.languages.filter(l => l.name).forEach(l => {
                langHTML += `<div style="display:flex;gap:8px;align-items:baseline;font-size:${fontSize + 2}px;"><span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize - 1}px;">(${esc(l.level)})</span>` : ''}</div>`
            })
            langHTML += `</div>`
            buildHtmlElement({ left: 50, top: y + 10, width: 694, html: langHTML })
            y += 60
        }
        divider(y); y += 20

        if (data.work && data.work.length) {
            let workHTML = `<div><div style="font-family:'Playfair Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:16px;">Work Experience’s</div>`
            data.work.forEach(w => {
                if (!w.title) return
                workHTML += `<div style="margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;margin-bottom:8px;">
            <span style="width:180px;">${esc(w.company)}</span> <span style="flex:1;">${esc(w.title)}</span> <span>${esc(w.duration)}</span></div>`
                if (w.desc) workHTML += `<div style="font-size:${fontSize + 2}px;line-height:1.5;padding-left:180px;">${esc(w.desc).replace(/\n/g, '<br>')}</div>`
                workHTML += `</div>`
            })
            workHTML += `</div>`
            buildHtmlElement({ left: 50, top: y + 10, width: 694, html: workHTML })
            y += 220
        }
        divider(y); y += 20

        if (data.edu && data.edu.length) {
            let eduHTML = `<div><div style="font-family:'Playfair Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:16px;">Education</div>`
            data.edu.forEach(e => {
                if (!e.school) return
                eduHTML += `<div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;margin-bottom:4px;"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>
          ${e.course ? `<div style="font-size:${fontSize + 2}px;">${esc(e.course)}</div>` : ''}</div>`
            })
            eduHTML += `</div>`
            buildHtmlElement({ left: 50, top: y + 10, width: 694, html: eduHTML })
            y += 120
        }
        divider(y); y += 20

        let bottom = `<div style="display:flex;gap:40px;">`
        bottom += `<div style="flex:1;"><div style="font-family:'Playfair Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:16px;">Awards and Achievement</div>`
        if (data.awards) data.awards.forEach(a => {
            if (!a.name) return
            bottom += `<div style="margin-bottom:12px;font-size:${fontSize + 2}px;"><div>${esc(a.name)}</div>${a.issuer ? `<div>${esc(a.issuer)}</div>` : ''}${a.year ? `<div>${esc(a.year)}</div>` : ''}</div>`
        })
        bottom += `</div>`
        bottom += `<div style="flex:1;"><div style="font-family:'Playfair Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:16px;text-align:center;">Certification</div>`
        if (data.certifications) data.certifications.forEach(c => {
            if (!c.name) return
            bottom += `<div style="display:flex;justify-content:space-between;font-size:${fontSize + 2}px;margin-bottom:4px;"><span style="font-weight:bold;">${esc(c.name)}</span> <span>${esc(c.date)}</span></div>`
            if (c.org) bottom += `<div style="font-size:${fontSize}px;margin-bottom:12px;">${esc(c.org)}</div>`
        })
        bottom += `</div></div>`
        buildHtmlElement({ left: 50, top: y + 10, width: 694, html: bottom })
        divider(y + 160)
    }
})