initResumeEditor({
    templateNum: 5,
    storageKey: 'profile_canvas_state_t5',
    renderFromFormData({ data, buildHtmlElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const accent = data.accentDark || '#0B132B'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        let html = `<div style="width:794px;height:1123px;padding:40px 50px;box-sizing:border-box;font-family:'DM Serif Display',serif;color:#111;display:flex;flex-direction:column;">`

        // Header
        html += `<div style="text-align:center;margin-bottom:20px;">`
        html += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.8}px;font-weight:700;color:${accent};letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">${esc(data.name || 'Your Name')}</div>`
        html += `<div style="font-size:${fontSize + 4}px;color:#333;margin-bottom:16px;">${esc(data.jobtitle || 'Job Title')}</div>`
        let contacts = [data.email, data.location, data.phone].filter(Boolean).map(esc)
        html += `<div style="display:flex;justify-content:center;gap:20px;font-size:${fontSize + 1}px;">${contacts.map(c => `<span>${c}</span>`).join('')}</div>`
        html += `</div>`

        // Divider & About Me
        html += `<div style="position:relative;height:4px;background:${accent};margin:20px 0 30px;">`
        html += `<div style="position:absolute;left:50%;transform:translateX(-50%);top:-18px;background:${accent};color:white;padding:4px 24px;border-radius:20px;font-size:${fontSize + 2}px;letter-spacing:1px;">ABOUT ME</div>`
        html += `</div>`

        if (data.summary) {
            html += `<div style="text-align:center;font-size:${fontSize + 4}px;line-height:1.45;margin-bottom:30px;padding:0 20px;">${esc(data.summary)}</div>`
        }

        const secHead = (title) => `<div style="background:${accent};border-radius:6px;color:white;font-size:${fontSize + 6}px;text-align:center;padding:10px 0;margin-bottom:16px;">${title}</div>`

        // Two Columns (Edu & Skills)
        html += `<div style="display:flex;gap:30px;margin-bottom:30px;">`
        // Left Col
        html += `<div style="flex:1;">`
        if (data.edu && data.edu.length) {
            html += secHead('Education')
            data.edu.forEach(e => {
                if (!e.school && !e.course) return
                html += `<div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:${fontSize + 4}px;color:${accent};"><span>${esc(e.school)}</span> <span>${esc(e.year)}</span></div>`
                if (e.course) html += `<div style="border-left:2px solid #A0A0A0;padding-left:10px;font-size:${fontSize}px;margin-bottom:12px;white-space:pre-wrap;">${esc(e.course)}</div>`
            })
        }
        html += `</div>`
        // Right Col
        html += `<div style="flex:1;">`
        if (data.skills) {
            html += secHead('Skills')
            html += `<div style="border-left:2px solid #A0A0A0;padding-left:14px;font-size:${fontSize + 2}px;line-height:1.6;">`
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
                html += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`
            })
            html += `</div>`
        }
        html += `</div>`
        html += `</div>`

        // Work
        if (data.work && data.work.length) {
            html += secHead('Work Experience’s')
            data.work.forEach(w => {
                if (!w.title && !w.company) return
                html += `<div style="margin-bottom:20px;">`
                html += `<div style="font-size:${fontSize + 4}px;color:${accent};margin-bottom:4px;">${esc(w.company)}</div>`
                html += `<div style="border-left:2px solid #A0A0A0;padding-left:14px;margin-left:6px;">`
                html += `<div style="font-size:${fontSize + 2}px;margin-bottom:2px;">${esc(w.title)}</div>`
                html += `<div style="font-size:${fontSize + 2}px;margin-bottom:8px;">${esc(w.duration)}</div>`
                if (w.desc) html += `<div style="font-size:${fontSize + 2}px;line-height:1.4;white-space:pre-wrap;">${esc(w.desc)}</div>`
                html += `</div></div>`
            })
        }

        // Awards
        if (data.awards && data.awards.length) {
            html += secHead('Awards and Achievement')
            data.awards.forEach(a => {
                if (!a.name) return
                html += `<div style="border-left:2px solid #A0A0A0;padding-left:14px;font-size:${fontSize + 4}px;margin-bottom:8px;">${esc(a.name)} ${a.issuer ? '- ' + esc(a.issuer) : ''} ${a.year ? esc(a.year) : ''}</div>`
            })
            html += `<div style="height:16px;"></div>`
        }

        // Cert & Lang
        html += `<div style="display:flex;gap:30px;">`
        html += `<div style="flex:1;">`
        if (data.certifications && data.certifications.length) {
            html += secHead('Certification')
            data.certifications.forEach(c => {
                if (!c.name) return
                html += `<div style="border-left:2px solid #A0A0A0;padding-left:14px;margin-bottom:10px;">`
                html += `<div style="display:flex;justify-content:space-between;font-size:${fontSize + 4}px;"><span>${esc(c.name)}</span> <span>${esc(c.date)}</span></div>`
                if (c.org) html += `<div style="font-size:${fontSize + 2}px;">${esc(c.org)}</div>`
                html += `</div>`
            })
        }
        html += `</div>`
        html += `<div style="flex:1;">`
        if (data.languages && data.languages.length) {
            html += secHead('Language’s')
            data.languages.forEach(l => {
                if (!l.name) return
                html += `<div style="border-left:2px solid #A0A0A0;padding-left:14px;display:flex;gap:12px;font-size:${fontSize + 2}px;margin-bottom:8px;">`
                html += `<span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize}px;">(${esc(l.level)})</span>` : ''}`
                html += `</div>`
            })
        }
        html += `</div></div>`

        html += `</div>`
        buildHtmlElement({ left: 0, top: 0, width: 794, html })
    }
})