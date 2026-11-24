initResumeEditor({
    templateNum: 6,
    storageKey: 'profile_canvas_state_t6',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const K = +(1.4 * fontSize / 12).toFixed(3)
        const Z = `zoom:${K};`
        const accent = data.accentDark || localStorage.getItem('profile_accent_dark') || '#0B132B'

        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // --- SIDEBAR BACKGROUND & SHAPE ---
        buildHtmlElement({
            left: 0, top: 0, width: 280,
            html: `<div style="width:280px;height:1123px;background:${accent};overflow:hidden;position:relative;">
              <div style="position:absolute;bottom:-100px;right:-150px;width:400px;height:400px;background:${accent};border-radius:50%;"></div>
             </div>`
        })

        // --- PHOTO ---
        if (data.photo) {
            buildImageElement({ src: data.photo, left: 40, top: 60, width: 200, height: 200, borderRadius: '50%' })
        }

        // --- SIDEBAR CONTENT (Contacts, Skills, Languages) ---
        let sideHTML = `<div style="padding:0 30px; color:white;">`

        // Contacts
        sideHTML += `<div style="margin-top:340px;margin-bottom:30px;">`
        const contact = [
            { v: data.email }, { v: data.phone }, { v: data.location }
        ].filter(c => c.v)
        contact.forEach(c => {
            sideHTML += `<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        <div style="width:24px;height:24px;background:#ddd;border-radius:50%;flex-shrink:0;"></div>
        <div style="font-family:'DM Serif Display',serif;font-size:${fontSize}px;line-height:1.3;">${esc(c.v)}</div>
      </div>`
        })
        sideHTML += `</div>`

        // Languages
        if (data.languages && data.languages.length) {
            sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 6}px;margin-bottom:12px;">Language's</div>`
            data.languages.filter(l => l.name).forEach(l => {
                sideHTML += `<div style="display:flex;justify-content:space-between;align-items:baseline;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;margin-bottom:8px;">
          <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize - 1}px;opacity:0.8;">(${esc(l.level)})</span>` : ''}
        </div>`
            })
            sideHTML += `<div style="height:20px;"></div>`
        }

        // Skills
        if (data.skills) {
            sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 6}px;margin-bottom:12px;">Skills</div>`
            sideHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;line-height:1.6;">`
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
                sideHTML += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`
            })
            sideHTML += `</div>`
        }
        sideHTML += `</div>`

        buildHtmlElement({ left: 0, top: 0, width: 280, html: `<div style="${Z}">${sideHTML}</div>` })

        // --- MAIN CONTENT ---
        let mainHTML = `<div style="padding-left:30px;">`

        // Header
        mainHTML += `<div style="text-align:right;margin-top:40px;margin-bottom:40px;">`
        mainHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.4}px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${esc(data.name || 'Your Name')}</div>`
        mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 6}px;color:#111;">${esc(data.jobtitle || 'Job Title')}</div>`
        mainHTML += `</div>`

        // Summary
        if (data.summary) {
            mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;line-height:1.45;color:#222;margin-bottom:30px;">${esc(data.summary)}</div>`
        }

        // Helper for section headers with SVG icons
        const mainHead = (iconSvg, title) => `
      <div style="display:flex;align-items:center;gap:10px;border-bottom:2px solid #ddd;padding-bottom:4px;margin-bottom:16px;">
        ${iconSvg}
        <div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 8}px;font-weight:bold;color:#111;">${title}</div>
      </div>`

        const iconEdu = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/></svg>`
        const iconWork = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>`
        const iconAward = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
        const iconCert = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`

        // Education
        if (data.edu && data.edu.length) {
            mainHTML += mainHead(iconEdu, 'Education')
            data.edu.filter(e => e.school || e.course).forEach(e => {
                mainHTML += `<div style="margin-bottom:16px;">`
                mainHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:4px;">
          <span>${esc(e.school)}</span> <span>${esc(e.year)}</span>
        </div>`
                if (e.course) mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#333;line-height:1.3;">${esc(e.course)}</div>`
                mainHTML += `</div>`
            })
            mainHTML += `<div style="height:16px;"></div>`
        }

        // Work
        if (data.work && data.work.length) {
            mainHTML += mainHead(iconWork, 'Work Experience’s')
            data.work.filter(w => w.title || w.company).forEach(w => {
                mainHTML += `<div style="margin-bottom:16px;">`
                mainHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:6px;">
          <span>${esc(w.title)} ${w.company ? ' - ' + esc(w.company) : ''}</span> <span>${esc(w.duration)}</span>
        </div>`
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
            mainHTML += mainHead(iconAward, 'Awards and Achievement')
            data.awards.filter(a => a.name).forEach(a => {
                mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:12px;">`
                mainHTML += `<div style="display:flex;justify-content:space-between;"><span>${esc(a.name)}</span> <span>${esc(a.year)}</span></div>`
                if (a.issuer) mainHTML += `<div style="font-size:${fontSize + 2}px;color:#333;">${esc(a.issuer)}</div>`
                mainHTML += `</div>`
            })
            mainHTML += `<div style="height:16px;"></div>`
        }

        // Certifications
        if (data.certifications && data.certifications.length) {
            mainHTML += mainHead(iconCert, 'Certification')
            data.certifications.filter(c => c.name).forEach(c => {
                mainHTML += `<div style="margin-bottom:16px;">`
                mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;font-weight:bold;color:#111;">${esc(c.name)}</div>`
                if (c.org) mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#333;">${esc(c.org)}</div>`
                if (c.date) mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#666;">${esc(c.date)}</div>`
                mainHTML += `</div>`
            })
        }

        // Custom Sections
        if (data.customSections) {
            data.customSections.forEach(sec => {
                const items = (sec.entries || []).filter(e => e && e.trim())
                if (!items.length) return
                mainHTML += mainHead('', esc(sec.name))
                items.forEach(i => {
                    mainHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#222;margin-bottom:4px;">• ${esc(i)}</div>`
                })
                mainHTML += `<div style="height:16px;"></div>`
            })
        }

        mainHTML += `</div>`
        buildHtmlElement({ left: 280, top: 0, width: 514, html: `<div style="${Z}">${mainHTML}</div>` })
    }
})