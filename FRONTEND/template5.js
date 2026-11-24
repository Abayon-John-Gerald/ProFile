initResumeEditor({
    templateNum: 5,
    storageKey: 'profile_canvas_state_t5',
    renderFromFormData({ data, buildHtmlElement, buildImageElement }) {
        const fontSize = parseFloat(data.fontSize) || 12
        const K = +(1.4 * fontSize / 12).toFixed(3)
        const Z = `zoom:${K};`
        const accent = data.accentDark || localStorage.getItem('profile_accent_dark') || '#0B132B'

        const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

        // --- TOP HEADER ---
        let topHTML = `<div style="text-align:center;width:100%;">`
        topHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize * 2.8}px;font-weight:700;color:${accent};letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">${esc(data.name || 'Your Name')}</div>`
        topHTML += `<div style="font-family:'Playfair Display',serif;font-size:${fontSize + 4}px;color:#333;margin-bottom:16px;">${esc(data.jobtitle || 'Job Title')}</div>`

        let contacts = []
        if (data.email) contacts.push(esc(data.email))
        if (data.location) contacts.push(esc(data.location))
        if (data.phone) contacts.push(esc(data.phone))
        topHTML += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:#1A1A18;padding:0 40px;margin-bottom:24px;">${contacts.map(c => `<div>${c}</div>`).join('')}</div>`
        topHTML += `</div>`
        buildHtmlElement({ left: 40, top: 40, width: 714, html: topHTML })

        // --- DIVIDER & ABOUT ME BADGE ---
        buildHtmlElement({ left: 0, top: 160, width: 794, html: `<div style="width:100%;height:3px;background:${accent};"></div>` })
        buildHtmlElement({ left: 280, top: 140, width: 234, html: `<div style="width:234px;height:40px;background:${accent};border-radius:20px;color:white;display:flex;align-items:center;justify-content:center;font-family:'DM Serif Display',serif;font-size:18px;letter-spacing:1px;">ABOUT ME</div>` })

        // --- SUMMARY ---
        if (data.summary && data.summary.trim()) {
            buildHtmlElement({ left: 110, top: 200, width: 574, html: `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:${accent};line-height:1.45;text-align:center;">${esc(data.summary)}</div>` })
        }

        // --- HELPER FOR SECTION HEADERS ---
        const sectionHead = (title) => `<div style="background:${accent};border-radius:6px;color:white;font-family:'DM Serif Display',serif;font-size:${fontSize + 6}px;text-align:center;padding:12px 0;margin-bottom:20px;width:100%;">${title}</div>`

        // --- TWO COLUMN LAYOUT (EDU & SKILLS) ---
        let leftCol = ''
        let rightCol = ''

        if (data.edu && data.edu.length) {
            leftCol += sectionHead('Education')
            data.edu.filter(e => e.school || e.course).forEach(e => {
                leftCol += `<div style="display:flex;justify-content:space-between;margin-bottom:4px;">`
                leftCol += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:${accent};">${esc(e.school)}</div>`
                leftCol += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:${accent};">${esc(e.year)}</div>`
                leftCol += `</div>`
                leftCol += `<div style="border-left:2px solid #A0A0A0;padding-left:10px;font-size:${fontSize}px;color:${accent};margin-bottom:16px;white-space:pre-wrap;">${esc(e.course)}</div>`
            })
        }

        if (data.skills) {
            rightCol += sectionHead('Skills')
            const skills = data.skills.split(',').map(s => s.trim()).filter(Boolean)
            rightCol += `<div style="border-left:2px solid #A0A0A0;padding-left:14px;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:${accent};line-height:1.6;">`
            skills.forEach(s => {
                rightCol += `<div style="display:flex;gap:8px;margin-bottom:4px;"><span>•</span> <span>${esc(s)}</span></div>`
            })
            rightCol += `</div>`
        }

        if (leftCol) buildHtmlElement({ left: 50, top: 320, width: 340, html: `<div style="${Z}">${leftCol}</div>` })
        if (rightCol) buildHtmlElement({ left: 440, top: 320, width: 320, html: `<div style="${Z}">${rightCol}</div>` })

        // --- WORK EXPERIENCE ---
        if (data.work && data.work.length) {
            let workHTML = sectionHead('Work Experience’s')
            data.work.filter(j => j.title || j.company).forEach(job => {
                workHTML += `<div style="margin-bottom:24px;">`
                workHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:${accent};margin-bottom:8px;">${esc(job.company)}</div>`
                workHTML += `<div style="border-left:2px solid #A0A0A0;padding-left:14px;margin-left:6px;">`
                workHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:${accent};margin-bottom:2px;">${esc(job.title)}</div>`
                workHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:${accent};margin-bottom:12px;">${esc(job.duration)}</div>`
                if (job.desc) workHTML += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:${accent};line-height:1.4;white-space:pre-wrap;">${esc(job.desc)}</div>`
                workHTML += `</div></div>`
            })
            buildHtmlElement({ left: 50, top: 550, width: 694, html: `<div style="${Z}">${workHTML}</div>` })
        }

        // --- AWARDS ---
        if (data.awards && data.awards.length) {
            let awardHTML = sectionHead('Awards and Achievement')
            data.awards.filter(a => a.name).forEach(a => {
                awardHTML += `<div style="border-left:2px solid #A0A0A0;padding-left:14px;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:${accent};margin-bottom:8px;">${esc(a.name)} ${a.issuer ? '- ' + esc(a.issuer) : ''} ${a.year ? esc(a.year) : ''}</div>`
            })
            buildHtmlElement({ left: 50, top: 760, width: 694, html: `<div style="${Z}">${awardHTML}</div>` })
        }

        // --- CERTIFICATIONS & LANGUAGES ---
        let certCol = ''
        if (data.certifications && data.certifications.length) {
            certCol += sectionHead('Certification')
            data.certifications.filter(c => c.name).forEach(c => {
                certCol += `<div style="border-left:2px solid #A0A0A0;padding-left:14px;margin-bottom:12px;">`
                certCol += `<div style="display:flex;justify-content:space-between;font-family:'DM Serif Display',serif;font-size:${fontSize + 4}px;color:${accent};"><span>${esc(c.name)}</span> <span>${esc(c.date)}</span></div>`
                if (c.org) certCol += `<div style="font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:${accent};">${esc(c.org)}</div>`
                certCol += `</div>`
            })
        }

        let langCol = ''
        if (data.languages && data.languages.length) {
            langCol += sectionHead('Language’s')
            data.languages.filter(l => l.name).forEach(l => {
                langCol += `<div style="border-left:2px solid #A0A0A0;padding-left:14px;display:flex;gap:12px;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:${accent};margin-bottom:8px;">`
                langCol += `<span>${esc(l.name)}</span> ${l.level ? `<span style="font-size:${fontSize}px;">(${esc(l.level)})</span>` : ''}`
                langCol += `</div>`
            })
        }

        if (certCol) buildHtmlElement({ left: 50, top: 880, width: 340, html: `<div style="${Z}">${certCol}</div>` })
        if (langCol) buildHtmlElement({ left: 440, top: 880, width: 320, html: `<div style="${Z}">${langCol}</div>` })

        // --- CUSTOM SECTIONS ---
        let customs = ''
        if (data.customSections) {
            data.customSections.forEach(sec => {
                const items = (sec.entries || []).filter(e => e && e.trim())
                if (!items.length) return
                customs += sectionHead(esc(sec.name))
                customs += items.map(i => `<div style="border-left:2px solid #A0A0A0;padding-left:14px;font-family:'DM Serif Display',serif;font-size:${fontSize + 2}px;color:${accent};margin-bottom:6px;">${esc(i)}</div>`).join('')
            })
            buildHtmlElement({ left: 50, top: 980, width: 694, html: `<div style="${Z}">${customs}</div>` })
        }
    }
})