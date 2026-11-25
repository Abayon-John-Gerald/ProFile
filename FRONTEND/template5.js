initResumeEditor({
    templateNum: 5,
    storageKey: 'profile_canvas_state_t5',
    renderFromFormData({ data, buildHtmlElement }) {
        const fontSize = Math.min(Math.max(parseFloat(data.fontSize) || 12, 9), 14)
        const accent = data.accentDark || '#0B132B'
        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        let html = `<div style="width:794px;height:1123px;padding:30px 40px;box-sizing:border-box;font-family:'DM Serif Display',serif;color:#111;overflow:hidden;">`

        // Header
        html += `<div style="text-align:center;margin-bottom:12px;">`
        html += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.4}px;font-weight:700;color:${accent};letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">${esc(data.name || 'Your Name')}</div>`
        html += `<div style="font-size:${fontSize + 3}px;color:#333;margin-bottom:10px;">${esc(data.jobtitle || 'Job Title')}</div>`
        const contacts = [data.email, data.location, data.phone].filter(Boolean).map(esc)
        html += `<div style="display:flex;justify-content:center;gap:20px;font-size:${fontSize}px;">${contacts.map(c => `<span>${c}</span>`).join('')}</div>`
        html += `</div>`

        // Divider & About Me
        html += `<div style="position:relative;height:4px;background:${accent};margin:20px 0 18px;">`
        html += `<div style="position:absolute;left:50%;transform:translateX(-50%);top:-14px;background:${accent};color:white;padding:3px 22px;border-radius:20px;font-size:${fontSize + 1}px;letter-spacing:1px;white-space:nowrap;">ABOUT ME</div>`
        html += `</div>`
        if (data.summary) {
            html += `<div style="text-align:center;font-size:${fontSize + 2}px;line-height:1.4;margin-bottom:16px;padding:0 16px;">${esc(data.summary)}</div>`
        }

        const secHead = title => `<div style="background:${accent};border-radius:6px;color:white;font-size:${fontSize + 4}px;text-align:center;padding:5px 0;margin-bottom:10px;">${title}</div>`
        const bar = `border-left:2px solid #A0A0A0;padding-left:12px;`

        // Education | Skills
        html += `<div style="display:flex;gap:24px;margin-bottom:14px;">`
        html += `<div style="flex:1;min-width:0;">`
        if (data.edu && data.edu.length) {
            html += secHead('Education')
            data.edu.forEach(e => {
                if (!e.school && !e.course) return
                html += `<div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:3px;font-size:${fontSize + 2}px;color:${accent};"><span>${esc(e.school)}</span><span style="white-space:nowrap;">${esc(e.year)}</span></div>`
                if (e.course) html += `<div style="${bar}font-size:${fontSize}px;margin-bottom:10px;white-space:pre-wrap;">${esc(e.course)}</div>`
            })
        }
        html += `</div><div style="flex:1;min-width:0;">`
        if (data.skills) {
            html += secHead('Skills')
            html += `<div style="${bar}font-size:${fontSize + 1}px;line-height:1.5;">`
            data.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
                html += `<div style="display:flex;gap:8px;margin-bottom:2px;"><span>•</span><span>${esc(s)}</span></div>`
            })
            html += `</div>`
        }
        html += `</div></div>`

        // Work
        if (data.work && data.work.length) {
            html += secHead('Work Experience’s')
            data.work.forEach(w => {
                if (!w.title && !w.company) return
                html += `<div style="margin-bottom:12px;">`
                html += `<div style="font-size:${fontSize + 2}px;color:${accent};margin-bottom:3px;">${esc(w.company)}</div>`
                html += `<div style="${bar}margin-left:6px;">`
                html += `<div style="font-size:${fontSize + 1}px;">${esc(w.title)}${w.duration ? ' <span style="opacity:0.75;">— ' + esc(w.duration) + '</span>' : ''}</div>`
                if (w.desc) html += `<div style="font-size:${fontSize}px;line-height:1.35;margin-top:4px;white-space:pre-wrap;">${esc(w.desc)}</div>`
                html += `</div></div>`
            })
        }

        // Awards
        if (data.awards && data.awards.length) {
            html += secHead('Awards and Achievement')
            data.awards.forEach(a => {
                if (!a.name) return
                html += `<div style="${bar}font-size:${fontSize + 2}px;margin-bottom:6px;">${esc(a.name)}${a.issuer ? ' - ' + esc(a.issuer) : ''}${a.year ? ' (' + esc(a.year) + ')' : ''}</div>`
            })
            html += `<div style="height:8px;"></div>`
        }

        // Certification | Language
        html += `<div style="display:flex;gap:24px;">`
        html += `<div style="flex:1;min-width:0;">`
        if (data.certifications && data.certifications.length) {
            html += secHead('Certification')
            data.certifications.forEach(c => {
                if (!c.name) return
                html += `<div style="${bar}margin-bottom:8px;">`
                html += `<div style="display:flex;justify-content:space-between;gap:8px;font-size:${fontSize + 2}px;"><span>${esc(c.name)}</span><span style="white-space:nowrap;">${esc(c.date)}</span></div>`
                if (c.org) html += `<div style="font-size:${fontSize}px;">${esc(c.org)}</div>`
                html += `</div>`
            })
        }
        html += `</div><div style="flex:1;min-width:0;">`
        if (data.languages && data.languages.filter(l => l.name).length) {
            html += secHead('Language’s')
            data.languages.forEach(l => {
                if (!l.name) return
                html += `<div style="${bar}display:flex;gap:10px;font-size:${fontSize + 2}px;margin-bottom:6px;"><span>${esc(l.name)}</span>${l.level ? `<span style="font-size:${fontSize}px;">(${esc(l.level)})</span>` : ''}</div>`
            })
        }
        html += `</div></div>`

        html += `</div>`
        buildHtmlElement({ left: 0, top: 0, width: 794, html })
    }
})