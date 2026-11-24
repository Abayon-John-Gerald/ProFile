initResumeEditor({
    templateNum: 8,
    storageKey: 'profile_canvas_state_t8',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const K = +(1.4 * fontSize / 12).toFixed(3)
        const Z = `zoom:${K};`
        const accent = data.accentDark || localStorage.getItem('profile_accent_dark') || '#3A5F3E'
        const accentLight = data.accentLight || localStorage.getItem('profile_accent_light') || '#D6E4D6'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // Sidebar Background (Split)
        buildHtmlElement({
            left: 0, top: 0, width: 280,
            html: `<div style="width:280px;height:1123px;background:white;position:relative;">
              <div style="position:absolute;top:0;left:0;width:100%;height:55%;background:${accent};"></div>
              <div style="position:absolute;bottom:0;left:0;width:100%;height:45%;background:${accentLight};"></div>
             </div>`
        })

        // Photo (borderless, blends into the green)
        if (data.photo) {
            buildImageElement({ src: data.photo, left: 40, top: 40, width: 200, height: 200, borderRadius: '50%' })
        }

        // Sidebar Content
        let sideHTML = `<div style="padding:0 30px;">`

        // Top: Contact (White text)
        sideHTML += `<div style="margin-top:300px;margin-bottom:40px;">`
        const contacts = [data.email, data.phone, data.location].filter(Boolean)
        contacts.forEach(c => {
            sideHTML += `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:20px;">
        <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:50%;flex-shrink:0;"></div>
        <div style="font-family:'DM Serif Display',serif;font-size:${fontSize}px;color:white;margin-top:6px;">${esc(c)}</div>
      </div>`
        })
        sideHTML += `</div>`

        // Bottom: Skills (Dark text)
        sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:14px;">Skills</div>`
        sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#111;line-height:1.6;">`
        if (data.skills) {
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
                sideHTML += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`
            })
        }
        sideHTML += `</div><div style="height:30px;"></div>`

        // Languages
        sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:14px;">Language’s</div>`
        if (data.languages) {
            data.languages.filter(l => l.name).forEach(l => {
                sideHTML += `<div style="display:flex;gap:8px;align-items:baseline;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#111;margin-bottom:8px;">
          <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize}px;color:#555;">(${esc(l.level)})</span>` : ''}
        </div>`
            })
        }
        sideHTML += `<div style="height:30px;"></div>`

        // Certifications
        if (data.certifications && data.certifications.length) {
            sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:${accent};margin-bottom:14px;">Certification</div>`
            data.certifications.filter(c => c.name).forEach(c => {
                sideHTML += `<div style="margin-bottom:12px;">`
                sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;font-weight:bold;color:#111;">${esc(c.name)}</div>`
                if (c.org) sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize}px;color:#555;">${esc(c.org)}</div>`
                if (c.date) sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize}px;color:#555;">${esc(c.date)}</div>`
                sideHTML += `</div>`
            })
        }
        sideHTML += `</div>`

        buildHtmlElement({ left: 0, top: 0, width: 280, html: `<div style="${Z}">${sideHTML}</div>` })

        // Main Content Area (Right side)
        let mainHTML = `<div style="padding-left:20px;">`

        // Header
        mainHTML += `<div style="text-align:right;margin-top:40px;margin-bottom:40px;">`
        mainHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.4}px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${esc(data.name || 'Your Name')}</div>`
        mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 6}px;color:#111;">${esc(data.jobtitle || 'Job Title')}</div>`
        mainHTML += `</div>`

        // Helper for main headers
        const mainHead = (title) => `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:50px;height:50px;background:#E5E5E5;border-radius:50%;flex-shrink:0;"></div>
        <div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 10}px;font-weight:bold;color:#111;border-bottom:2px solid #111;padding-bottom:4px;width:100%;">${title}</div>
      </div>`

        // About Me
        if (data.summary) {
            mainHTML += mainHead('About Me')
            mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;line-height:1.45;color:#222;margin-bottom:30px;">${esc(data.summary)}</div>`
        }

        // Education
        if (data.edu && data.edu.length) {
            mainHTML += mainHead('Education')
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
            mainHTML += mainHead('Work Experience’s')
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
            mainHTML += `<div style="height:16px;"></div>`
        }

        // Awards
        if (data.awards && data.awards.length) {
            mainHTML += mainHead('Awards and Achievement')
            data.awards.filter(a => a.name).forEach(a => {
                mainHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:12px;">
          <span>${esc(a.name)} ${a.issuer ? '<br><span style="font-size:' + fontSize + 'px;color:#555;">' + esc(a.issuer) + '</span>' : ''}</span> <span>${esc(a.year)}</span></div>`
            })
        }

        mainHTML += `</div>`
        buildHtmlElement({ left: 280, top: 0, width: 514, html: `<div style="${Z}">${mainHTML}</div>` })
    }
})