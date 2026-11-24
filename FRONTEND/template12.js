initResumeEditor({
    templateNum: 12,
    storageKey: 'profile_canvas_state_t12',
    renderFromFormData({ data, buildHtmlElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const K = +(1.4 * fontSize / 12).toFixed(3)
        const Z = `zoom:${K};`
        const accent = data.accentDark || localStorage.getItem('profile_accent_dark') || '#4A3B32'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // Top Header Block
        let topHTML = `<div style="width:794px;height:100px;background:${accent};display:flex;align-items:center;justify-content:center;color:white;text-align:center;">`
        topHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.2}px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">${esc(data.name || 'Your Name')} ${data.jobtitle ? '- ' + esc(data.jobtitle) : ''}</div>`
        topHTML += `</div>`
        buildHtmlElement({ left: 0, top: 0, width: 794, html: topHTML })

        // Sub-header (Contacts)
        buildHtmlElement({
            left: 0, top: 100, width: 794, html: `<div style="width:794px;height:40px;background:#7A6353;display:flex;justify-content:center;align-items:center;gap:30px;color:white;font-family:'DM Serif Display',serif;font-size:${fontSize}px;">
      ${data.email ? `<div>${esc(data.email)}</div>` : ''}
      ${data.location ? `<div>${esc(data.location)}</div>` : ''}
      ${data.phone ? `<div>${esc(data.phone)}</div>` : ''}
    </div>` })

        // Skills Bar
        if (data.skills) {
            let skills = data.skills.split(',').map(s => s.trim()).filter(Boolean)
            let skHTML = `<div style="width:794px;height:40px;background:#9C826E;display:flex;justify-content:space-around;align-items:center;color:white;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;">`
            skills.forEach(s => skHTML += `<div>${esc(s)}</div>`)
            skHTML += `</div>`
            buildHtmlElement({ left: 0, top: 140, width: 794, html: skHTML })
        }

        // Full Horizontal Dividers
        const divider = (y) => buildHtmlElement({ left: 0, top: y, width: 794, html: `<div style="width:794px;height:2px;background:#111;"></div>` })

        // Summary Block
        let currentY = 180
        if (data.summary) {
            buildHtmlElement({ left: 50, top: currentY + 20, width: 694, html: `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;line-height:1.5;color:#333;">${esc(data.summary)}</div>` })
            currentY += 100
        }
        divider(currentY)
        currentY += 20

        // Languages Block
        if (data.languages && data.languages.length) {
            let langHTML = `<div style="display:flex;gap:40px;align-items:center;font-family:'DM Serif Display',serif;">`
            langHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};width:150px;">Language’s</div>`
            data.languages.filter(l => l.name).forEach(l => {
                langHTML += `<div style="display:flex;gap:8px;align-items:baseline;font-size:${fontSize + 2}px;color:#111;">
          <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize - 1}px;color:#555;">(${esc(l.level)})</span>` : ''}
        </div>`
            })
            langHTML += `</div>`
            buildHtmlElement({ left: 50, top: currentY + 10, width: 694, html: `<div style="${Z}">${langHTML}</div>` })
            currentY += 60
        }
        divider(currentY)
        currentY += 20

        // Work Block
        if (data.work && data.work.length) {
            let workHTML = `<div>`
            workHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:16px;">Work Experience’s</div>`
            data.work.filter(w => w.title).forEach(w => {
                workHTML += `<div style="margin-bottom:24px;">`
                workHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:8px;">
          <span style="width:180px;">${esc(w.company)}</span> <span style="flex:1;">${esc(w.title)}</span> <span>${esc(w.duration)}</span></div>`
                if (w.desc) {
                    workHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#333;line-height:1.5;padding-left:180px;">`
                    workHTML += `<div>${esc(w.desc).replace(/\n/g, '<br>')}</div>`
                    workHTML += `</div>`
                }
                workHTML += `</div>`
            })
            workHTML += `</div>`
            buildHtmlElement({ left: 50, top: currentY + 10, width: 694, html: `<div style="${Z}">${workHTML}</div>` })
            currentY += 220
        }
        divider(currentY)
        currentY += 20

        // Education Block
        if (data.edu && data.edu.length) {
            let eduHTML = `<div>`
            eduHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:16px;">Education</div>`
            data.edu.filter(e => e.school).forEach(e => {
                eduHTML += `<div style="margin-bottom:12px;">`
                eduHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:4px;"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>`
                if (e.course) eduHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#333;">${esc(e.course)}</div>`
                eduHTML += `</div>`
            })
            eduHTML += `</div>`
            buildHtmlElement({ left: 50, top: currentY + 10, width: 694, html: `<div style="${Z}">${eduHTML}</div>` })
            currentY += 120
        }
        divider(currentY)
        currentY += 20

        // Bottom Split: Awards & Certs
        let bottomHTML = `<div style="display:flex;gap:40px;">`
        // Awards
        bottomHTML += `<div style="flex:1;">`
        bottomHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:16px;">Awards and Achievement</div>`
        if (data.awards) {
            data.awards.filter(a => a.name).forEach(a => {
                bottomHTML += `<div style="margin-bottom:12px;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#111;">`
                bottomHTML += `<div>${esc(a.name)}</div>`
                if (a.issuer) bottomHTML += `<div style="color:#555;">${esc(a.issuer)}</div>`
                if (a.year) bottomHTML += `<div style="color:#555;">${esc(a.year)}</div>`
                bottomHTML += `</div>`
            })
        }
        bottomHTML += `</div>`

        // Certifications
        bottomHTML += `<div style="flex:1;">`
        bottomHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:16px;text-align:center;">Certification</div>`
        if (data.certifications) {
            data.certifications.filter(c => c.name).forEach(c => {
                bottomHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#111;margin-bottom:4px;">`
                bottomHTML += `<span style="font-weight:bold;">${esc(c.name)}</span> <span>${esc(c.date)}</span></div>`
                if (c.org) bottomHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize}px;color:#555;margin-bottom:12px;">${esc(c.org)}</div>`
            })
        }
        bottomHTML += `</div>`
        bottomHTML += `</div>`

        buildHtmlElement({ left: 50, top: currentY + 10, width: 694, html: `<div style="${Z}">${bottomHTML}</div>` })
        divider(currentY + 160)
    }
})