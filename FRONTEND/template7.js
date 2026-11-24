initResumeEditor({
    templateNum: 7,
    storageKey: 'profile_canvas_state_t7',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const K = +(1.4 * fontSize / 12).toFixed(3)
        const Z = `zoom:${K};`
        const accent = data.accentDark || localStorage.getItem('profile_accent_dark') || '#2F4C32'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // Top Decorative Circle
        buildHtmlElement({ left: -100, top: -100, width: 300, html: `<div style="width:300px;height:300px;background:${accent};border-radius:50%;"></div>` })

        // Photo
        if (data.photo) {
            buildImageElement({ src: data.photo, left: 40, top: 40, width: 160, height: 160, borderRadius: '50%' })
        }

        // Header Block
        let headerHTML = `<div style="margin-left:20px;">`
        headerHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.4}px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">${esc(data.name || 'Your Name')}</div>`
        headerHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#222;margin-bottom:16px;">${esc(data.jobtitle || 'Job Title')}</div>`
        if (data.summary) headerHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#333;line-height:1.5;">${esc(data.summary)}</div>`
        headerHTML += `</div>`
        buildHtmlElement({ left: 230, top: 40, width: 520, html: `<div style="${Z}">${headerHTML}</div>` })

        // Horizontal Separator
        buildHtmlElement({ left: 0, top: 280, width: 794, html: `<div style="width:100%;height:2px;background:#111;"></div>` })

        // Sidebar (Contacts, Skills, Languages)
        let sideHTML = `<div style="padding-right:20px;">`

        // Contacts
        const contacts = [data.email, data.phone, data.location].filter(Boolean)
        if (contacts.length) {
            sideHTML += `<div style="margin-bottom:40px;">`
            contacts.forEach(c => {
                sideHTML += `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
          <div style="width:30px;height:30px;background:#ccc;border-radius:50%;flex-shrink:0;"></div>
          <div style="font-family:'DM Serif Display',serif;font-size:${fontSize}px;color:#222;margin-top:4px;">${esc(c)}</div>
        </div>`
            })
            sideHTML += `</div>`
        }

        // Skills
        if (data.skills) {
            sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:#111;margin-bottom:14px;">Skills</div>`
            sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#222;line-height:1.6;">`
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
                sideHTML += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`
            })
            sideHTML += `</div><div style="height:40px;"></div>`
        }

        // Languages
        if (data.languages && data.languages.length) {
            sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:#111;margin-bottom:14px;">Language’s</div>`
            data.languages.filter(l => l.name).forEach(l => {
                sideHTML += `<div style="display:flex;gap:8px;align-items:baseline;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#222;margin-bottom:8px;">
          <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize}px;color:#666;">(${esc(l.level)})</span>` : ''}
        </div>`
            })
        }
        sideHTML += `</div>`
        buildHtmlElement({ left: 50, top: 310, width: 240, html: `<div style="${Z}">${sideHTML}</div>` })

        // Vertical Divider
        buildHtmlElement({ left: 310, top: 310, width: 1, html: `<div style="width:2px;height:780px;background:#111;"></div>` })

        // Main Content Area
        let mainHTML = `<div style="padding-left:20px;">`

        // Education
        if (data.edu && data.edu.length) {
            mainHTML += `<div style="text-align:center;margin-bottom:20px;">`
            mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 8}px;font-weight:bold;color:#111;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">Education</div></div>`
            data.edu.filter(e => e.school).forEach(e => {
                mainHTML += `<div style="margin-bottom:14px;">`
                mainHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:2px;"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>`
                if (e.course) mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#333;">${esc(e.course)}</div>`
                mainHTML += `</div>`
            })
            mainHTML += `<div style="height:20px;"></div>`
        }

        // Work
        if (data.work && data.work.length) {
            mainHTML += `<div style="text-align:center;margin-bottom:20px;">`
            mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 8}px;font-weight:bold;color:#111;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">Work Experience’s</div></div>`
            data.work.filter(w => w.title).forEach(w => {
                mainHTML += `<div style="margin-bottom:16px;">`
                mainHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:6px;">
          <span>${esc(w.title)} ${w.company ? ' | ' + esc(w.company) : ''}</span> <span>${esc(w.duration)}</span></div>`
                if (w.desc) {
                    mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#222;line-height:1.4;">`
                    w.desc.split('\n').filter(Boolean).forEach(line => {
                        mainHTML += `<div style="display:flex;gap:8px;margin-bottom:2px;"><span>•</span> <span>${esc(line)}</span></div>`
                    })
                    mainHTML += `</div>`
                }
                mainHTML += `</div>`
            })
            mainHTML += `<div style="height:20px;"></div>`
        }

        // Awards
        if (data.awards && data.awards.length) {
            mainHTML += `<div style="text-align:center;margin-bottom:20px;">`
            mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 8}px;font-weight:bold;color:#111;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">Awards and Achievement</div></div>`
            data.awards.filter(a => a.name).forEach(a => {
                mainHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:12px;">
          <span>${esc(a.name)} ${a.issuer ? '<br><span style="font-size:' + fontSize + 'px;color:#555;">' + esc(a.issuer) + '</span>' : ''}</span> <span>${esc(a.year)}</span></div>`
            })
            mainHTML += `<div style="height:20px;"></div>`
        }

        // Certifications
        if (data.certifications && data.certifications.length) {
            mainHTML += `<div style="text-align:center;margin-bottom:20px;">`
            mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 8}px;font-weight:bold;color:#111;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">Certification</div></div>`
            data.certifications.filter(c => c.name).forEach(c => {
                mainHTML += `<div style="margin-bottom:12px;">`
                mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;font-weight:bold;color:#111;">${esc(c.name)}</div>`
                if (c.org) mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#333;">${esc(c.org)}</div>`
                if (c.date) mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#666;">${esc(c.date)}</div>`
                mainHTML += `</div>`
            })
        }

        mainHTML += `</div>`
        buildHtmlElement({ left: 340, top: 310, width: 420, html: `<div style="${Z}">${mainHTML}</div>` })

        // Bottom Decorative Circle
        buildHtmlElement({ left: 544, top: 823, width: 400, html: `<div style="width:400px;height:400px;background:${accent};border-radius:50%;opacity:0.9;"></div>` })
    }
})