initResumeEditor({
    templateNum: 9,
    storageKey: 'profile_canvas_state_t9',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const K = +(1.4 * fontSize / 12).toFixed(3)
        const Z = `zoom:${K};`
        const accent = data.accentDark || localStorage.getItem('profile_accent_dark') || '#6A4766'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // Left Sidebar Base (Light Gray)
        buildHtmlElement({ left: 0, top: 0, width: 260, html: `<div style="width:260px;height:1123px;background:#E8E8E8;"></div>` })

        // Top Left Purple Accent Block
        buildHtmlElement({ left: 0, top: 0, width: 60, html: `<div style="width:60px;height:160px;background:${accent};"></div>` })

        // Photo
        if (data.photo) {
            buildImageElement({ src: data.photo, left: 50, top: 50, width: 160, height: 160, borderRadius: '0' })
        }

        // Photo Accent Bar
        buildHtmlElement({ left: 80, top: 230, width: 100, html: `<div style="width:100px;height:6px;background:${accent};"></div>` })

        // Sidebar Content
        let sideHTML = `<div style="padding:0 30px;">`

        // Contact
        sideHTML += `<div style="margin-top:260px;margin-bottom:40px;">`
        const contacts = [data.email, data.phone, data.location].filter(Boolean)
        contacts.forEach(c => {
            sideHTML += `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:20px;">
        <div style="width:30px;height:30px;background:#999;border-radius:50%;flex-shrink:0;"></div>
        <div style="font-family:'DM Serif Display',serif;font-size:${fontSize}px;color:#111;margin-top:4px;">${esc(c)}</div>
      </div>`
        })
        sideHTML += `</div>`

        // Skills
        sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:#111;margin-bottom:14px;text-align:center;">Skills</div>`
        sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#111;line-height:1.6;">`
        if (data.skills) {
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
                sideHTML += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`
            })
        }
        sideHTML += `</div><div style="height:40px;"></div>`

        // Languages
        sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:#111;margin-bottom:14px;text-align:center;">Language’s</div>`
        if (data.languages) {
            data.languages.filter(l => l.name).forEach(l => {
                sideHTML += `<div style="display:flex;gap:8px;align-items:baseline;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#111;margin-bottom:8px;justify-content:center;">
          <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize}px;color:#555;">(${esc(l.level)})</span>` : ''}
        </div>`
            })
        }
        sideHTML += `</div>`
        buildHtmlElement({ left: 0, top: 0, width: 260, html: `<div style="${Z}">${sideHTML}</div>` })

        // Main Column Backgrounds
        buildHtmlElement({ left: 260, top: 0, width: 534, html: `<div style="width:534px;height:1123px;background:white;"></div>` })
        buildHtmlElement({ left: 260, top: 0, width: 534, html: `<div style="width:534px;height:135px;background:${accent};"></div>` })
        buildHtmlElement({ left: 260, top: 480, width: 534, html: `<div style="width:534px;height:240px;background:${accent};"></div>` })

        // Header
        let mainHTML = `<div style="padding:30px 40px;">`
        mainHTML += `<div style="text-align:center;margin-bottom:30px;">`
        mainHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.2}px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${esc(data.name || 'Your Name')}</div>`
        mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#222;">${esc(data.jobtitle || 'Job Title')}</div>`
        mainHTML += `</div>`

        if (data.summary) {
            mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;line-height:1.45;color:#222;text-align:center;margin-bottom:40px;">${esc(data.summary)}</div>`
        }

        // Education
        if (data.edu && data.edu.length) {
            mainHTML += `<div style="text-align:center;margin-bottom:16px;">`
            mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:#111;">Education</div></div>`
            data.edu.filter(e => e.school).forEach(e => {
                mainHTML += `<div style="margin-bottom:16px;">`
                mainHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:4px;"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>`
                if (e.course) mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#333;">${esc(e.course)}</div>`
                mainHTML += `</div>`
            })
        }
        mainHTML += `</div>` // End padding div

        buildHtmlElement({ left: 260, top: 135, width: 534, html: `<div style="${Z}">${mainHTML}</div>` })

        // Work (Inside Purple Block)
        let workHTML = `<div style="padding:0 40px;">`
        if (data.work && data.work.length) {
            workHTML += `<div style="text-align:center;margin-bottom:16px;">`
            workHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:#111;">Work Experience’s</div></div>`
            data.work.filter(w => w.title).forEach(w => {
                workHTML += `<div style="margin-bottom:16px;">`
                workHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:6px;">
          <span>${esc(w.title)} ${w.company ? ' | ' + esc(w.company) : ''}</span> <span>${esc(w.duration)}</span></div>`
                if (w.desc) {
                    workHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#222;line-height:1.4;">`
                    w.desc.split('\n').filter(Boolean).forEach(line => {
                        workHTML += `<div style="display:flex;gap:8px;margin-bottom:2px;"><span>•</span> <span>${esc(line)}</span></div>`
                    })
                    workHTML += `</div>`
                }
                workHTML += `</div>`
            })
        }
        workHTML += `</div>`
        buildHtmlElement({ left: 260, top: 480, width: 534, html: `<div style="${Z}">${workHTML}</div>` })

        // Awards & Certifications (Below Purple Block)
        let bottomHTML = `<div style="padding:30px 40px;">`
        if (data.awards && data.awards.length) {
            bottomHTML += `<div style="text-align:center;margin-bottom:16px;">`
            bottomHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:#111;">Awards and Achievement</div></div>`
            data.awards.filter(a => a.name).forEach(a => {
                bottomHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:12px;">
          <span>${esc(a.name)} ${a.issuer ? '<br><span style="font-size:' + fontSize + 'px;color:#555;">' + esc(a.issuer) + '</span>' : ''}</span> <span>${esc(a.year)}</span></div>`
            })
            bottomHTML += `<div style="height:20px;"></div>`
        }
        if (data.certifications && data.certifications.length) {
            bottomHTML += `<div style="text-align:center;margin-bottom:16px;">`
            bottomHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:#111;">Certification</div></div>`
            data.certifications.filter(c => c.name).forEach(c => {
                bottomHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:8px;">
          <span>${esc(c.name)}</span> <span>${esc(c.date)}</span></div>`
                if (c.org) bottomHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize}px;color:#555;margin-bottom:12px;">${esc(c.org)}</div>`
            })
        }
        bottomHTML += `</div>`
        buildHtmlElement({ left: 260, top: 720, width: 534, html: `<div style="${Z}">${bottomHTML}</div>` })
    }
})