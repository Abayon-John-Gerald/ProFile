initResumeEditor({
    templateNum: 10,
    storageKey: 'profile_canvas_state_t10',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const K = +(1.4 * fontSize / 12).toFixed(3)
        const Z = `zoom:${K};`
        const accent = data.accentDark || localStorage.getItem('profile_accent_dark') || '#1C291C'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // Top Header Background
        buildHtmlElement({ left: 0, top: 0, width: 794, html: `<div style="width:794px;height:150px;background:${accent};"></div>` })

        // Photo
        if (data.photo) {
            buildImageElement({ src: data.photo, left: 40, top: 25, width: 100, height: 100, borderRadius: '50%' })
        }

        // Header Text
        let headHTML = `<div style="text-align:right;margin-top:40px;margin-right:40px;">`
        headHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.2}px;font-weight:700;color:white;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">${esc(data.name || 'Your Name')}</div>`
        headHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#D1D5DB;">${esc(data.jobtitle || 'Job Title')}</div>`
        headHTML += `</div>`
        buildHtmlElement({ left: 150, top: 0, width: 644, html: `<div style="${Z}">${headHTML}</div>` })

        // Gray Contact Bar
        buildHtmlElement({ left: 0, top: 150, width: 794, html: `<div style="width:794px;height:40px;background:#EAEAEA;"></div>` })

        let contact = [data.email, data.phone, data.location].filter(Boolean)
        let contactHTML = `<div style="display:flex;justify-content:space-around;align-items:center;height:40px;font-family:'DM Serif Display',serif;font-size:${fontSize}px;color:#111;">`
        contact.forEach(c => contactHTML += `<div>${esc(c)}</div>`)
        contactHTML += `</div>`
        buildHtmlElement({ left: 0, top: 150, width: 794, html: `<div style="${Z}">${contactHTML}</div>` })

        // --- SPLIT GRID LAYOUT ---
        // Left Column Line
        buildHtmlElement({ left: 260, top: 190, width: 1, html: `<div style="width:2px;height:933px;background:#111;"></div>` })

        // Horizontal Lines
        const hLines = [480, 720, 860]
        hLines.forEach(y => {
            buildHtmlElement({ left: 0, top: y, width: 794, html: `<div style="width:794px;height:2px;background:#111;"></div>` })
        })

        // Helper for centered section heads
        const secHead = title => `<div style="text-align:center;font-family:'DM Serif Display',serif;font-size:${fontSize + 8}px;font-weight:bold;color:#111;margin-bottom:16px;">${title}</div>`

        // Left: Language's
        let left1 = `<div style="padding:20px;">`
        left1 += secHead('Language’s')
        if (data.languages) {
            data.languages.filter(l => l.name).forEach(l => {
                left1 += `<div style="display:flex;gap:8px;align-items:baseline;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#111;margin-bottom:10px;">
          <span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize}px;color:#555;">(${esc(l.level)})</span>` : ''}</div>`
            })
        }
        left1 += `</div>`
        buildHtmlElement({ left: 0, top: 190, width: 260, html: `<div style="${Z}">${left1}</div>` })

        // Right: Summary
        let right1 = `<div style="padding:20px 40px;">`
        if (data.summary) right1 += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;line-height:1.5;color:#111;text-align:justify;">${esc(data.summary)}</div>`
        right1 += `</div>`
        buildHtmlElement({ left: 260, top: 190, width: 534, html: `<div style="${Z}">${right1}</div>` })

        // Left: Education
        let left2 = `<div style="padding:20px;">${secHead('Education')}</div>`
        buildHtmlElement({ left: 0, top: 480, width: 260, html: `<div style="${Z}">${left2}</div>` })

        // Right: Education Content
        let right2 = `<div style="padding:30px 40px;">`
        if (data.edu) {
            data.edu.filter(e => e.school).forEach(e => {
                right2 += `<div style="margin-bottom:16px;">`
                right2 += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:4px;"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>`
                if (e.course) right2 += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#333;">${esc(e.course)}</div>`
                right2 += `</div>`
            })
        }
        right2 += `</div>`
        buildHtmlElement({ left: 260, top: 480, width: 534, html: `<div style="${Z}">${right2}</div>` })

        // Left: Experience
        let left3 = `<div style="padding:20px;">${secHead('Experience’s')}</div>`
        buildHtmlElement({ left: 0, top: 720, width: 260, html: `<div style="${Z}">${left3}</div>` })

        // Right: Experience Content
        let right3 = `<div style="padding:30px 40px;">`
        if (data.work) {
            data.work.filter(w => w.title).forEach(w => {
                right3 += `<div style="margin-bottom:16px;">`
                right3 += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:6px;">
          <span>${esc(w.title)} ${w.company ? ' | ' + esc(w.company) : ''}</span> <span>${esc(w.duration)}</span></div>`
                if (w.desc) {
                    right3 += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#222;line-height:1.4;">`
                    w.desc.split('\n').filter(Boolean).forEach(line => {
                        right3 += `<div style="display:flex;gap:8px;margin-bottom:2px;"><span>•</span> <span>${esc(line)}</span></div>`
                    })
                    right3 += `</div>`
                }
                right3 += `</div>`
            })
        }
        right3 += `</div>`
        buildHtmlElement({ left: 260, top: 720, width: 534, html: `<div style="${Z}">${right3}</div>` })

        // Left: Achievement
        let left4 = `<div style="padding:20px;">${secHead('Achievement')}</div>`
        buildHtmlElement({ left: 0, top: 860, width: 260, html: `<div style="${Z}">${left4}</div>` })

        // Right: Achievement Content
        let right4 = `<div style="padding:30px 40px;">`
        if (data.awards) {
            data.awards.filter(a => a.name).forEach(a => {
                right4 += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:#111;margin-bottom:12px;">
          <span>${esc(a.name)} ${a.issuer ? '<br><span style="font-size:' + fontSize + 'px;color:#555;">' + esc(a.issuer) + '</span>' : ''}</span> <span>${esc(a.year)}</span></div>`
            })
        }
        right4 += `</div>`
        buildHtmlElement({ left: 260, top: 860, width: 534, html: `<div style="${Z}">${right4}</div>` })

        // Bottom Split: Skills & Certifications
        let bottomHTML = `<div style="display:flex;height:243px;">`

        // Skills (Left)
        bottomHTML += `<div style="flex:1;padding:30px 20px;text-align:center;">${secHead('Skills')}`
        if (data.skills) {
            bottomHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#111;line-height:1.6;text-align:left;padding-left:20px;">`
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
                bottomHTML += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`
            })
            bottomHTML += `</div>`
        }
        bottomHTML += `</div>`

        // Certification (Right)
        bottomHTML += `<div style="flex:1;padding:30px 40px;text-align:center;">${secHead('Certification')}`
        if (data.certifications) {
            data.certifications.filter(c => c.name).forEach(c => {
                bottomHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#111;margin-bottom:8px;text-align:left;">
          <span style="font-weight:bold;">${esc(c.name)}</span> <span>${esc(c.date)}</span></div>`
                if (c.org) bottomHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize}px;color:#555;text-align:left;margin-bottom:12px;">${esc(c.org)}</div>`
            })
        }
        bottomHTML += `</div></div>`
        buildHtmlElement({ left: 0, top: 880, width: 794, html: `<div style="${Z}">${bottomHTML}</div>` })
    }
})