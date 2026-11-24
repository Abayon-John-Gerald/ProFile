initResumeEditor({
    templateNum: 11,
    storageKey: 'profile_canvas_state_t11',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const K = +(1.4 * fontSize / 12).toFixed(3)
        const Z = `zoom:${K};`
        const accent = data.accentDark || localStorage.getItem('profile_accent_dark') || '#243424'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // Sidebar Background
        buildHtmlElement({ left: 0, top: 0, width: 280, html: `<div style="width:280px;height:1123px;background:${accent};"></div>` })

        // Top Header White Block (Right side)
        buildHtmlElement({
            left: 280, top: 0, width: 514, html: `<div style="width:514px;height:180px;background:white;display:flex;align-items:center;justify-content:flex-end;padding-right:40px;box-sizing:border-box;">
      <div style="text-align:right;">
        <div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.4}px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">${esc(data.name || 'Your Name')}</div>
        <div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#222;">${esc(data.jobtitle || 'Job Title')}</div>
      </div>
    </div>` })

        // Top Header Dark Block (Right side)
        buildHtmlElement({ left: 280, top: 180, width: 514, html: `<div style="width:514px;height:12px;background:${accent};"></div>` })
        buildHtmlElement({ left: 0, top: 192, width: 794, html: `<div style="width:794px;height:0px;border-bottom:2px solid ${accent};"></div>` })

        // Photo
        if (data.photo) {
            buildImageElement({ src: data.photo, left: 40, top: 40, width: 200, height: 200, borderRadius: '50%' })
        }

        // Sidebar Content
        let sideHTML = `<div style="padding:0 30px;">`

        // Contacts
        sideHTML += `<div style="margin-top:260px;margin-bottom:40px;">`
        const contacts = [data.email, data.phone, data.location].filter(Boolean)
        contacts.forEach(c => {
            sideHTML += `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:20px;">
        <div style="width:36px;height:36px;background:#D1D5DB;border-radius:50%;flex-shrink:0;"></div>
        <div style="font-family:'DM Serif Display',serif;font-size:${fontSize}px;color:white;margin-top:6px;">${esc(c)}</div>
      </div>`
        })
        sideHTML += `</div>`

        // Languages
        sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:white;margin-bottom:14px;">Language’s</div>`
        if (data.languages) {
            data.languages.filter(l => l.name).forEach(l => {
                sideHTML += `<div style="display:flex;gap:8px;align-items:baseline;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:white;margin-bottom:8px;">
          <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize}px;opacity:0.7;">(${esc(l.level)})</span>` : ''}</div>`
            })
        }
        sideHTML += `<div style="height:40px;"></div>`

        // Skills
        sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:white;margin-bottom:14px;">Skills</div>`
        if (data.skills) {
            sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:white;line-height:1.6;">`
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
                sideHTML += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`
            })
            sideHTML += `</div>`
        }
        sideHTML += `</div>`
        buildHtmlElement({ left: 0, top: 0, width: 280, html: `<div style="${Z}">${sideHTML}</div>` })

        // Main Content Area
        let mainHTML = `<div style="padding-left:30px;">`

        // Summary
        if (data.summary) {
            mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;line-height:1.45;color:#111;margin-top:40px;margin-bottom:30px;">${esc(data.summary)}</div>`
        }

        // Helper for headers with icons
        const head = (title) => `<div style="display:flex;align-items:center;gap:10px;border-bottom:2px solid ${accent};padding-bottom:4px;margin-bottom:16px;">
      <div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:#111;">${title}</div></div>`

        // Education
        if (data.edu && data.edu.length) {
            mainHTML += head('Education')
            data.edu.filter(e => e.school).forEach(e => {
                mainHTML += `<div style="margin-bottom:16px;">`
                mainHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:4px;"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>`
                if (e.course) mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#333;">${esc(e.course)}</div>`
                mainHTML += `</div>`
            })
            mainHTML += `<div style="height:16px;"></div>`
        }

        // Work
        if (data.work && data.work.length) {
            mainHTML += head('Work Experience’s')
            data.work.filter(w => w.title).forEach(w => {
                mainHTML += `<div style="margin-bottom:16px;">`
                mainHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:6px;"><span>${esc(w.title)} ${w.company ? ' | ' + esc(w.company) : ''}</span> <span>${esc(w.duration)}</span></div>`
                if (w.desc) {
                    mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#222;line-height:1.4;">`
                    w.desc.split('\n').filter(Boolean).forEach(line => {
                        mainHTML += `<div style="display:flex;gap:8px;margin-bottom:2px;"><span>•</span> <span>${esc(line)}</span></div>`
                    })
                    mainHTML += `</div>`
                }
                mainHTML += `</div>`
            })
            mainHTML += `<div style="height:16px;"></div>`
        }

        // Awards
        if (data.awards && data.awards.length) {
            mainHTML += head('Awards and Achievement')
            data.awards.filter(a => a.name).forEach(a => {
                mainHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:12px;">
          <span>${esc(a.name)} ${a.issuer ? '<br><span style="font-size:' + fontSize + 'px;color:#555;">' + esc(a.issuer) + '</span>' : ''}</span> <span>${esc(a.year)}</span></div>`
            })
            mainHTML += `<div style="height:16px;"></div>`
        }

        // Certifications
        if (data.certifications && data.certifications.length) {
            mainHTML += head('Certification')
            data.certifications.filter(c => c.name).forEach(c => {
                mainHTML += `<div style="margin-bottom:16px;">`
                mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;font-weight:bold;color:#111;">${esc(c.name)}</div>`
                if (c.org) mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#333;">${esc(c.org)}</div>`
                if (c.date) mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#666;">${esc(c.date)}</div>`
                mainHTML += `</div>`
            })
        }

        mainHTML += `</div>`
        buildHtmlElement({ left: 280, top: 220, width: 514, html: `<div style="${Z}">${mainHTML}</div>` })
    }
})