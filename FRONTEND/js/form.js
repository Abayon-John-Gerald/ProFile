const urlParams = new URLSearchParams(window.location.search);
const rawTemplate = urlParams.get('template');
const templateNum = ['1', '2', '3', '4'].includes(rawTemplate) ? rawTemplate : '1';

const TEMPLATE_DEFAULTS = {
    '1': { dark: '#2C2C2C', light: '#8FB89A' },
    '2': { dark: '#4A5568', light: '#7EB5D6' },
    '3': { dark: '#2B3A2E', light: '#8FB89A' },
    '4': { dark: '#EDEAE3', light: '#8FB89A' }
};

const savedDark = localStorage.getItem('profile_accent_dark');
const savedLight = localStorage.getItem('profile_accent_light');

window.currentAccentDark = savedDark || TEMPLATE_DEFAULTS[templateNum].dark;
window.currentAccentLight = savedLight || TEMPLATE_DEFAULTS[templateNum].light;

let photoBase64 = null
let workCount = 0, eduCount = 0, certCount = 0, awardCount = 0, langCount = 0
let paperSize = 'a4'
let customSections = []
let customSectionCount = 0

// DEBOUNCE: Prevents mobile lag by not saving to localStorage on every keystroke
let saveTimeout;
function saveDraft() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const data = collectFormData()
        localStorage.setItem('profile_form_draft_t' + templateNum, JSON.stringify(data))
        localStorage.setItem('profile_form_data', JSON.stringify(data))
    }, 500); // 500ms delay
}

// ── Font / Size customization ──
function applyCustomizations() {
    const font = document.getElementById('fontFamily').value
    const size = document.getElementById('fontSize').value
    const sizeNum = parseInt(size);

    document.getElementById('fontSizeVal').textContent = size + 'px'

    const fontName = font.replace(/'/g, '').split(',')[0].trim();
    if (fontName && fontName !== 'Times New Roman' && fontName !== 'Georgia') {
        const linkId = 'font-link-' + fontName.replace(/ /g, '-');
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            const weights = { 'Playfair Display': '400;700', 'Merriweather': '300;400;700', 'Lato': '300;400;700', 'DM Sans': '300;400;500;700' }[fontName] || '400;700';
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@${weights}&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    }

    let styleTag = document.getElementById('preview-custom-style')
    if (!styleTag) { styleTag = document.createElement('style'); styleTag.id = 'preview-custom-style'; document.head.appendChild(styleTag) }

    styleTag.textContent = `
    #previewResume, #previewResume * { font-family: ${font} !important; }
    #previewResume .text-content { font-size: ${sizeNum}px !important; }
    #previewResume .prev-name, #previewResume [id$="-name"], #previewResume [id$="-name-main"] { font-size: ${sizeNum * 2}px !important; }
    #previewResume .prev-jobtitle, #previewResume [id$="-job"], #previewResume [id$="-job-main"] { font-size: ${sizeNum + 2}px !important; }
    #prev-t2-summary-wrap, #prev-t2-contact-wrap, #prev-t2-edu-wrap, #prev-t2-lang-wrap, #prev-t2-custom-left, #prev-t2-skills-wrap, #prev-t2-work-wrap, #prev-t2-cert-wrap, #prev-t2-award-wrap, #prev-t2-custom-right,
    #prev-t1-edu-wrap, #prev-t1-contact-head, #prev-skills-section, #prev-t1-lang-wrap, #prev-contact, #prev-t1-custom, #prev-t1-summary-wrap, #prev-work-wrap, #prev-cert-wrap, #prev-award-wrap, #prev-t1-main-custom,
    #prev-t4-edu-wrap, #prev-t4-skills-wrap, #prev-t4-lang-wrap, #prev-t4-cert-sidebar-wrap, #prev-t4-contact-head, #prev-t4-contact, #prev-t4-custom-sidebar, #prev-t4-summary-wrap, #prev-t4-work-wrap, #prev-t4-award-wrap, #prev-t4-custom-main {
      zoom: ${(1.4 * sizeNum / 12).toFixed(3)};
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    #prev-t3-summary, #prev-t3-work, #prev-t3-edu, #prev-t3-custom, #prev-t3-contact { zoom: ${(sizeNum / 12).toFixed(3)}; overflow-wrap: anywhere; line-height: 1.4 !important; }
  `
    saveDraft()
}

function resetAccentColor() {
    const defaults = TEMPLATE_DEFAULTS[templateNum]
    applyAccentColor(defaults.dark, defaults.light, null)
    const accentStyle = document.getElementById('accent-color-style')
    if (accentStyle) accentStyle.textContent = ''
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'))
}

function applyAccentColor(dark, light, el) {
    window.currentAccentDark = dark
    window.currentAccentLight = light

    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'))
    if (el) el.classList.add('active')

    const t1 = document.getElementById('prev-t1')
    if (t1) t1.querySelector('div:first-child').style.background = dark

    const t2 = document.getElementById('prev-t2')
    if (t2) {
        if (t2.children[0]) t2.children[0].style.background = dark
        if (t2.children[1]) t2.children[1].style.background = dark
    }

    const t3 = document.getElementById('prev-t3')
    if (t3) t3.querySelector('div:first-child').style.background = dark

    const t4 = document.getElementById('prev-t4')
    if (t4) t4.children[0].style.background = dark

    let accentStyle = document.getElementById('accent-color-style')
    if (!accentStyle) { accentStyle = document.createElement('style'); accentStyle.id = 'accent-color-style'; document.head.appendChild(accentStyle) }

    const isLight = dark === '#EDEAE3' || dark === '#F0EDE5'

    // FIXED: The selector for T4 now correctly targets the sidebar wrapper, not the hidden photo placeholder
    accentStyle.textContent = `
  #prev-t1 [style*="color:#8FB89A"] { color: ${light} !important; }
  #prev-t1 [style*="border:2px solid #8FB89A"] { border-color: ${light} !important; }

  #prev-t4 [style*="color:#8FB89A"] { color: ${light} !important; }
  #prev-t4 [style*="border-bottom:1.5px solid #8FB89A"] { border-color: ${light} !important; }
  #prev-t4 > div:nth-child(4) [style*="color:#7A776E"] { color: ${isLight ? '#7A776E' : '#ccc'} !important; }
  #prev-t4 > div:nth-child(4) [style*="color:#2B3A2E"] { color: ${isLight ? '#2B3A2E' : '#fff'} !important; }
  #prev-t4 > div:nth-child(4) [style*="color:#1A1A18"] { color: ${isLight ? '#1A1A18' : '#fff'} !important; }
  #prev-t4 > div:nth-child(4) [style*="font-weight:700"] { color: ${isLight ? '#2B3A2E' : '#fff'} !important; }
  #prev-t4 > div:nth-child(4) [style*="border-bottom:1px solid #D4CFC4"] { border-color: ${isLight ? '#D4CFC4' : '#555'} !important; }

  #prev-t2 [style*="color:#4A5568"][style*="font-weight:700"] { color: ${dark} !important; }
  #prev-t2 [style*="border-left:3px solid #4A5568"] { border-color: ${dark} !important; }
  #prev-t2 [style*="border-bottom:1px solid #D4CFC4"][style*="font-weight:700"] { color: ${dark} !important; }

  #prev-t3 > div:first-child { background: ${dark} !important; }
  `
    saveDraft()
}

function loadAccentColor(dark, light) {
    // FIXED: Matches dataset.color instead of dataset.dark
    const swatch = Array.from(document.querySelectorAll('.color-swatch')).find(s => s.dataset.color === dark)
    applyAccentColor(dark, light, swatch || null)
}

function validateEmail(input) {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)
    const existing = input.parentElement.querySelector('.email-hint')
    if (input.value && !valid) {
        input.style.borderColor = '#E07070'; input.style.boxShadow = '0 0 0 3px rgba(224,112,112,0.1)'
        if (!existing) {
            const hint = document.createElement('p'); hint.className = 'hint email-hint'; hint.style.color = '#c0392b'; hint.textContent = 'Please enter a valid email address.'; input.parentElement.appendChild(hint)
        }
    } else { input.style.borderColor = ''; input.style.boxShadow = ''; if (existing) existing.remove() }
}

function addCustomSection() {
    const nameInput = document.getElementById('newSectionName'); const name = nameInput.value.trim()
    if (!name) { nameInput.focus(); return }
    customSections.push({ id: 'custom-sec-' + customSectionCount++, name, entries: [''] })
    nameInput.value = ''; renderCustomSections(); updatePreview()
}
function removeCustomSection(id) { customSections = customSections.filter(s => s.id !== id); renderCustomSections(); updatePreview() }
function addCustomEntry(sectionId) { const sec = customSections.find(s => s.id === sectionId); if (sec) { sec.entries.push(''); renderCustomSections(); updatePreview() } }
function removeCustomEntry(sectionId, index) { const sec = customSections.find(s => s.id === sectionId); if (sec) { sec.entries.splice(index, 1); if (!sec.entries.length) sec.entries.push(''); renderCustomSections(); updatePreview() } }
function updateCustomEntry(sectionId, index, value) { const sec = customSections.find(s => s.id === sectionId); if (sec) { sec.entries[index] = value; updatePreview() } }

function renderCustomSections() {
    const list = document.getElementById('custom-sections-list'); list.innerHTML = ''
    customSections.forEach(sec => {
        const card = document.createElement('div'); card.className = 'custom-section-card'
        card.innerHTML = `
      <div class="custom-section-head"><span>${sec.name}</span><button class="btn-remove-custom" onclick="removeCustomSection('${sec.id}')">✕ Remove section</button></div>
      <div class="custom-section-body">
        ${sec.entries.map((entry, i) => `
          <div class="custom-entry">
            <textarea placeholder="Add content for this section..." oninput="updateCustomEntry('${sec.id}', ${i}, this.value)">${entry}</textarea>
            <button class="btn-remove-entry" onclick="removeCustomEntry('${sec.id}', ${i})">✕</button>
          </div>`).join('')}
        <button class="btn-add-entry" onclick="addCustomEntry('${sec.id}')">+ Add item</button>
      </div>`
        list.appendChild(card)
    })
}

function getCustomSectionsPreviewHTML(darkMode) {
    if (!customSections.length) return ''
    return customSections.map(sec => {
        const items = sec.entries.filter(e => e && e.trim()); if (!items.length) return ''
        const titleColor = darkMode ? '#8FB89A' : '#2B3A2E'; const textColor = darkMode ? '#ccc' : '#555'; const borderColor = darkMode ? '#444' : '#D4CFC4'
        return `<div style="margin-top:10px;"><div style="font-size:8px;font-weight:600;color:${titleColor};letter-spacing:0.12em;text-transform:uppercase;border-bottom:1px solid ${borderColor};padding-bottom:2px;margin-bottom:6px;">${sec.name}</div>${items.map(item => `<div style="font-size:8px;color:${textColor};margin-bottom:3px;line-height:1.5;">• ${item}</div>`).join('')}</div>`
    }).join('')
}

function handlePhotoUpload(e) {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = function (ev) {
        photoBase64 = ev.target.result
        document.getElementById('photoPreviewImg').src = photoBase64
        document.getElementById('photoPreviewImg').style.display = 'block'
        document.getElementById('photoPlaceholder').style.display = 'none'
        e.target.value = ''; updatePreview()
    }
    reader.readAsDataURL(file)
}

function setPaper(size) {
    paperSize = size
    document.getElementById('btn-a4').classList.toggle('active', size === 'a4')
    document.getElementById('btn-letter').classList.toggle('active', size === 'letter')
    const resumeEl = document.getElementById('previewResume'); const outerEl = document.getElementById('previewOuter')
    const specs = { a4: { w: 794, h: 1123 }, letter: { w: 816, h: 1056 } }; const d = specs[size]
    resumeEl.style.width = d.w + 'px'; resumeEl.style.height = d.h + 'px'
    const scaleFactor = outerEl.offsetWidth / d.w
    resumeEl.style.transform = `scale(${scaleFactor})`
    outerEl.style.height = (d.h * scaleFactor) + 'px'
    localStorage.setItem('profile_paper_size', size)
    if (typeof updatePreview === 'function') updatePreview()
}

function toggleSection(id) {
    const body = document.getElementById('body-' + id); const chev = document.getElementById('chev-' + id)
    const open = body.style.display !== 'none'
    body.style.display = open ? 'none' : 'block'; chev.textContent = open ? '▸' : '▾'
}

function addEntry(type) {
    const div = document.createElement('div'); div.className = 'entry-card'
    if (type === 'work') {
        const id = 'work-' + workCount++; div.id = id
        div.innerHTML = `<div class="entry-header"><span class="entry-label">Experience #${workCount}</span><button class="btn-remove" onclick="removeEntry('${id}')">Remove</button></div><div class="field-grid"><div class="field"><label>Job Title</label><input type="text" placeholder="e.g. Frontend Developer" oninput="updatePreview()"></div><div class="field"><label>Company</label><input type="text" placeholder="e.g. Acme Corp" oninput="updatePreview()"></div><div class="field"><label>Duration</label><input type="text" placeholder="e.g. 2022 - 2024" oninput="this.value=this.value.replace(/[^0-9\\s\\-–]/g,''); updatePreview()"></div><div class="field full"><label>Description</label><textarea rows="2" placeholder="What did you do there?" oninput="updatePreview()"></textarea></div></div>`
        document.getElementById('work-entries').appendChild(div)
    } else if (type === 'edu') {
        const id = 'edu-' + eduCount++; div.id = id
        div.innerHTML = `<div class="entry-header"><span class="entry-label">Education #${eduCount}</span><button class="btn-remove" onclick="removeEntry('${id}')">Remove</button></div><div class="field-grid"><div class="field"><label>School / University</label><input type="text" placeholder="e.g. University of Santo Tomas" oninput="updatePreview()"></div><div class="field"><label>Course / Degree</label><input type="text" placeholder="e.g. BS Information Technology" oninput="updatePreview()"></div><div class="field"><label>Year</label><input type="text" placeholder="e.g. 2020 - 2024" oninput="this.value=this.value.replace(/[^0-9\\s\\-–]/g,''); updatePreview()"></div></div>`
        document.getElementById('edu-entries').appendChild(div)
    } else if (type === 'cert') {
        const id = 'cert-' + certCount++; div.id = id
        div.innerHTML = `<div class="entry-header"><span class="entry-label">Certification #${certCount}</span><button class="btn-remove" onclick="removeEntry('${id}')">Remove</button></div><div class="field-grid"><div class="field"><label>Certificate Name</label><input type="text" placeholder="e.g. AWS Cloud Practitioner" oninput="updatePreview()"></div><div class="field"><label>Issuing Organization</label><input type="text" placeholder="e.g. Amazon Web Services" oninput="updatePreview()"></div><div class="field full"><label>Date / Expiry</label><input type="text" placeholder="e.g. May 2025 | Expires May 2028" oninput="this.value=this.value.replace(/[^0-9a-zA-Z\\s\\-|]/g,''); updatePreview()"></div></div>`
        document.getElementById('cert-entries').appendChild(div)
    } else if (type === 'award') {
        const id = 'award-' + awardCount++; div.id = id
        div.innerHTML = `<div class="entry-header"><span class="entry-label">Award #${awardCount}</span><button class="btn-remove" onclick="removeEntry('${id}')">Remove</button></div><div class="field-grid"><div class="field"><label>Award Name</label><input type="text" placeholder="e.g. Dean's Lister" oninput="updatePreview()"></div><div class="field"><label>Issuer</label><input type="text" placeholder="e.g. University of Santo Tomas" oninput="updatePreview()"></div><div class="field full"><label>Year</label><input type="text" placeholder="e.g. 2024" oninput="this.value=this.value.replace(/[^0-9\\s\\-–]/g,''); updatePreview()"></div></div>`
        document.getElementById('award-entries').appendChild(div)
    } else if (type === 'lang') {
        const id = 'lang-' + langCount++; div.id = id
        div.innerHTML = `<div class="entry-header"><span class="entry-label">Language #${langCount}</span><button class="btn-remove" onclick="removeEntry('${id}')">Remove</button></div><div class="field-grid"><div class="field"><label>Language</label><input type="text" placeholder="e.g. English" oninput="updatePreview()"></div><div class="field"><label>Proficiency Level</label><select oninput="updatePreview()"><option value="">Select level</option><option>Native / Bilingual</option><option>Fluent</option><option>Professional Working</option><option>Intermediate</option><option>Basic</option></select></div></div>`
        document.getElementById('lang-entries').appendChild(div)
    }
}

function removeEntry(id) { document.getElementById(id).remove(); updatePreview() }

function buildBlock(title, body, borderColor) {
    if (!body) return ''
    return `<div style="color:#2B3A2E;font-weight:bold;font-size:inherit;border-bottom:0.5px solid ${borderColor};margin-bottom:3px;margin-top:4px;">${title}</div>${body}`
}

function buildSectionHTML({ work, edu, skills, certs, awards, languages, borderColor }) {
    let html = ''
    if (skills.trim()) {
        const sl = skills.split(',').map(s => s.trim()).filter(Boolean)
        html += `<div style="color:#2B3A2E;font-weight:bold;font-size:inherit;border-bottom:0.5px solid ${borderColor};margin-bottom:3px;">SKILLS</div><div style="margin-bottom:4px;">${sl.join('  •  ')}</div>`
    }
    html += buildBlock('WORK EXPERIENCE', work, borderColor) + buildBlock('EDUCATION', edu, borderColor) + buildBlock('CERTIFICATIONS', certs, borderColor) + buildBlock('AWARDS & ACHIEVEMENTS', awards, borderColor) + buildBlock('LANGUAGES', languages, borderColor)
    return html
}

function getWorkHTML() {
    let html = ''
    document.querySelectorAll('#work-entries .entry-card').forEach(entry => {
        const inputs = entry.querySelectorAll('input'); const title = inputs[0]?.value, company = inputs[1]?.value, duration = inputs[2]?.value, desc = entry.querySelector('textarea')?.value
        if (title || company) {
            html += `<div style="margin-bottom:3px;"><b>${title || ''}${company ? ' — ' + company : ''}</b>`
            if (duration) html += `<br><span style="color:#7A776E">${duration}</span>`
            if (desc) html += `<br>${desc}`; html += `</div>`
        }
    })
    return html
}

function getEduHTML() {
    let html = ''
    document.querySelectorAll('#edu-entries .entry-card').forEach(entry => {
        const inputs = entry.querySelectorAll('input'); const school = inputs[0]?.value, course = inputs[1]?.value, year = inputs[2]?.value
        if (school || course) {
            html += `<div style="margin-bottom:3px;">`
            if (school) html += `<b>${school}</b>`; if (course) html += `<br>${course}`; if (year) html += `<br><span style="color:#7A776E">${year}</span>`; html += `</div>`
        }
    })
    return html
}

function getCertHTML() {
    let html = ''
    document.querySelectorAll('#cert-entries .entry-card').forEach(entry => {
        const inputs = entry.querySelectorAll('input'); const name = inputs[0]?.value, org = inputs[1]?.value, date = inputs[2]?.value
        if (name || org) {
            html += `<div style="margin-bottom:3px;">`
            if (name) html += `<b>${name}</b>`; if (org) html += `<br>${org}`; if (date) html += `<br><span style="color:#7A776E">${date}</span>`; html += `</div>`
        }
    })
    return html
}

function getAwardHTML() {
    let html = ''
    document.querySelectorAll('#award-entries .entry-card').forEach(entry => {
        const inputs = entry.querySelectorAll('input'); const name = inputs[0]?.value, issuer = inputs[1]?.value, year = inputs[2]?.value
        if (name || issuer) {
            html += `<div style="margin-bottom:3px;">`
            if (name) html += `<b>${name}</b>`; if (issuer) html += `<br>${issuer}`; if (year) html += `<br><span style="color:#7A776E">${year}</span>`; html += `</div>`
        }
    })
    return html
}

function getLanguageHTML() {
    let html = ''
    document.querySelectorAll('#lang-entries .entry-card').forEach(entry => {
        const name = entry.querySelector('input')?.value; const level = entry.querySelector('select')?.value
        if (name) html += `<div style="margin-bottom:3px;"><b>${name}</b>${level ? ` — ${level}` : ''}</div>`
    })
    return html
}

function collectFormData() {
    const workData = Array.from(document.querySelectorAll('#work-entries .entry-card')).map(entry => {
        const inputs = entry.querySelectorAll('input'); return { title: inputs[0]?.value || '', company: inputs[1]?.value || '', duration: inputs[2]?.value || '', desc: entry.querySelector('textarea')?.value || '' }
    })
    const eduData = Array.from(document.querySelectorAll('#edu-entries .entry-card')).map(entry => {
        const inputs = entry.querySelectorAll('input'); return { school: inputs[0]?.value || '', course: inputs[1]?.value || '', year: inputs[2]?.value || '' }
    })
    const certData = Array.from(document.querySelectorAll('#cert-entries .entry-card')).map(entry => {
        const inputs = entry.querySelectorAll('input'); return { name: inputs[0]?.value || '', org: inputs[1]?.value || '', date: inputs[2]?.value || '' }
    })
    const awardData = Array.from(document.querySelectorAll('#award-entries .entry-card')).map(entry => {
        const inputs = entry.querySelectorAll('input'); return { name: inputs[0]?.value || '', issuer: inputs[1]?.value || '', year: inputs[2]?.value || '' }
    })
    const langData = Array.from(document.querySelectorAll('#lang-entries .entry-card')).map(entry => ({
        name: entry.querySelector('input')?.value || '', level: entry.querySelector('select')?.value || ''
    }))
    return {
        name: document.getElementById('f-name').value, jobtitle: document.getElementById('f-jobtitle').value, location: document.getElementById('f-location').value,
        email: document.getElementById('f-email').value, phone: document.getElementById('f-phone').value, skills: document.getElementById('f-skills').value,
        summary: document.getElementById('f-summary').value, work: workData, edu: eduData, certifications: certData, awards: awardData, languages: langData,
        customSections, fontFamily: document.getElementById('fontFamily').value, fontSize: document.getElementById('fontSize').value, paperSize, photo: photoBase64,
        accentDark: window.currentAccentDark, accentLight: window.currentAccentLight // Saves colors into resume data
    }
}

function saveDraftNow() {
    const data = collectFormData()
    localStorage.setItem('profile_form_draft_t' + templateNum, JSON.stringify(data))
    localStorage.setItem('profile_form_data', JSON.stringify(data))
}

async function loadResumeFromServer() {
    const resumeId = new URLSearchParams(window.location.search).get('id')
    if (!resumeId) { loadSavedForm(); return }
    const token = localStorage.getItem('profile_token')
    try {
        const res = await fetch(`/api/resumes/${resumeId}`, { headers: { 'Authorization': 'Bearer ' + token } })
        if (!res.ok) { loadSavedForm(); return }
        const resume = await res.json()
        const data = typeof resume.resume_data === 'string' ? JSON.parse(resume.resume_data) : resume.resume_data
        // Clear old draft so we don't overwrite the server data we are trying to load
        localStorage.removeItem('profile_form_draft_t' + templateNum)
        localStorage.setItem('profile_form_data', JSON.stringify(data))
        loadSavedForm()
    } catch (e) { loadSavedForm() }
}

function loadSavedForm() {
    const raw = localStorage.getItem('profile_form_draft_t' + templateNum) || localStorage.getItem('profile_form_data')
    if (!raw) { addEntry('work'); addEntry('edu'); updatePreview(); return }
    const data = JSON.parse(raw)

    document.getElementById('f-name').value = data.name || ''
    document.getElementById('f-jobtitle').value = data.jobtitle || ''
    document.getElementById('f-location').value = data.location || ''
    document.getElementById('f-email').value = data.email || ''
    document.getElementById('f-phone').value = data.phone || ''
    document.getElementById('f-skills').value = data.skills || ''
    document.getElementById('f-summary').value = data.summary || ''

    if (data.fontFamily) document.getElementById('fontFamily').value = data.fontFamily
    if (data.fontSize) {
        document.getElementById('fontSize').value = data.fontSize
        document.getElementById('fontSizeVal').textContent = data.fontSize + 'px'
    }

    paperSize = data.paperSize || 'a4'
    setPaper(paperSize)

    photoBase64 = data.photo || null
    if (photoBase64) {
        document.getElementById('photoPreviewImg').src = photoBase64
        document.getElementById('photoPreviewImg').style.display = 'block'
        document.getElementById('photoPlaceholder').style.display = 'none'
    }

    if (data.customSections && data.customSections.length) {
        customSections = data.customSections
        customSectionCount = customSections.length
        renderCustomSections()
    }

    document.getElementById('work-entries').innerHTML = ''; document.getElementById('edu-entries').innerHTML = '';
    document.getElementById('cert-entries').innerHTML = ''; document.getElementById('award-entries').innerHTML = ''; document.getElementById('lang-entries').innerHTML = '';
    workCount = 0; eduCount = 0; certCount = 0; awardCount = 0; langCount = 0;

    (data.work || []).forEach(item => { addEntry('work'); const entry = document.querySelector('#work-entries .entry-card:last-child'); const inputs = entry.querySelectorAll('input'); inputs[0].value = item.title || ''; inputs[1].value = item.company || ''; inputs[2].value = item.duration || ''; entry.querySelector('textarea').value = item.desc || ''; })
        (data.edu || []).forEach(item => { addEntry('edu'); const entry = document.querySelector('#edu-entries .entry-card:last-child'); const inputs = entry.querySelectorAll('input'); inputs[0].value = item.school || ''; inputs[1].value = item.course || ''; inputs[2].value = item.year || ''; })
        (data.certifications || []).forEach(item => { addEntry('cert'); const entry = document.querySelector('#cert-entries .entry-card:last-child'); const inputs = entry.querySelectorAll('input'); inputs[0].value = item.name || ''; inputs[1].value = item.org || ''; inputs[2].value = item.date || ''; })
        (data.awards || []).forEach(item => { addEntry('award'); const entry = document.querySelector('#award-entries .entry-card:last-child'); const inputs = entry.querySelectorAll('input'); inputs[0].value = item.name || ''; inputs[1].value = item.issuer || ''; inputs[2].value = item.year || ''; })
        (data.languages || []).forEach(item => { addEntry('lang'); const entry = document.querySelector('#lang-entries .entry-card:last-child'); entry.querySelector('input').value = item.name || ''; entry.querySelector('select').value = item.level || ''; })

    if (!(data.work || []).length) addEntry('work')
    if (!(data.edu || []).length) addEntry('edu')

    if (data.accentDark) loadAccentColor(data.accentDark, data.accentLight)
    applyCustomizations()
    updatePreview()
}

function updatePreview() {
    const name = document.getElementById('f-name').value || 'Your Name'
    const jobtitle = document.getElementById('f-jobtitle').value || 'Job Title'
    const location = document.getElementById('f-location').value || ''
    const email = document.getElementById('f-email').value || ''
    const phone = document.getElementById('f-phone').value || ''
    const skills = document.getElementById('f-skills').value || ''
    const summary = document.getElementById('f-summary').value || ''

    const work = getWorkHTML(); const edu = getEduHTML(); const certs = getCertHTML(); const awards = getAwardHTML(); const languages = getLanguageHTML();
    const customDark = getCustomSectionsPreviewHTML(true); const customLight = getCustomSectionsPreviewHTML(false)

    // Template 1
    if (templateNum === '1') {
        const mainName = document.getElementById('prev-t1-name-main'); const mainJob = document.getElementById('prev-t1-job-main')
        if (mainName) mainName.textContent = (name || 'YOUR NAME').toUpperCase(); if (mainJob) mainJob.textContent = jobtitle || 'Job Title'
        const t1photoWrap = document.getElementById('prev-t1-photo-wrap'); const t1photoImg = document.getElementById('prev-t1-photo-img')
        if (t1photoWrap && t1photoImg) { if (photoBase64) { t1photoImg.src = photoBase64; t1photoImg.style.display = 'block'; t1photoWrap.style.background = 'transparent' } else { t1photoImg.style.display = 'none'; t1photoWrap.style.background = '#3A3A3A' } }
        let contactHTML = ''; if (email) contactHTML += `<div style="margin-bottom:3px;">📧 ${email}</div>`; if (phone) contactHTML += `<div style="margin-bottom:3px;">📞 ${phone}</div>`; if (location) contactHTML += `<div style="margin-bottom:3px;">📍 ${location}</div>`
        document.getElementById('prev-contact').innerHTML = contactHTML
        const eduSideData = Array.from(document.querySelectorAll('#edu-entries .entry-card')).map(entry => { const inputs = entry.querySelectorAll('input'); return { school: inputs[0]?.value, course: inputs[1]?.value, year: inputs[2]?.value } })
        const eduWrap1 = document.getElementById('prev-t1-edu-wrap')
        if (eduSideData.some(e => e.school || e.course)) {
            let eduHTML = ''; eduSideData.forEach(e => { if (!e.school && !e.course) return; eduHTML += `<div style="margin-bottom:8px;">`; if (e.year) eduHTML += `<div style="font-size:7px;color:#999;margin-bottom:1px;">${e.year}</div>`; if (e.course) eduHTML += `<div style="font-size:8px;font-weight:600;color:#fff;text-transform:uppercase;line-height:1.3;">${e.course}</div>`; if (e.school) eduHTML += `<div style="font-size:8px;color:#ccc;font-style:italic;">${e.school}</div>`; eduHTML += `</div>` })
            document.getElementById('prev-t1-edu').innerHTML = eduHTML; eduWrap1.style.display = 'block'
        } else { eduWrap1.style.display = 'none' }
        let skillsHTML = ''; if (skills.trim()) { const list = skills.split(',').map(s => s.trim()).filter(Boolean); skillsHTML = `<div style="font-size:8px;font-weight:600;color:#8FB89A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px;">Skills</div>` + list.map(s => `<div style="font-size:8px;color:#ccc;margin-bottom:3px;display:flex;align-items:center;gap:5px;"><span style="color:#8FB89A;">•</span>${s}</div>`).join('') + `<div style="height:1px;background:#444;margin:12px 0;"></div>` }
        document.getElementById('prev-skills-section').innerHTML = skillsHTML
        const langSideData = Array.from(document.querySelectorAll('#lang-entries .entry-card')).map(entry => ({ name: entry.querySelector('input')?.value, level: entry.querySelector('select')?.value }))
        const langWrap1 = document.getElementById('prev-t1-lang-wrap')
        if (langSideData.some(l => l.name)) { let langHTML = ''; langSideData.forEach(l => { if (!l.name) return; langHTML += `<div style="font-size:8px;color:#ccc;margin-bottom:3px;"><span style="color:#fff;font-weight:500;">${l.name}</span>${l.level ? ` <span style="color:#999;font-size:7px;">(${l.level})</span>` : ''}</div>` }); document.getElementById('prev-t1-lang').innerHTML = langHTML; langWrap1.style.display = 'block' } else { langWrap1.style.display = 'none' }
        const summaryWrap1 = document.getElementById('prev-t1-summary-wrap')
        if (summary.trim()) { document.getElementById('prev-summary').textContent = summary; summaryWrap1.style.display = 'block' } else { summaryWrap1.style.display = 'none' }
        const workWrap1 = document.getElementById('prev-work-wrap')
        let workHTML = ''
        document.querySelectorAll('#work-entries .entry-card').forEach(entry => {
            const inputs = entry.querySelectorAll('input'); const t = inputs[0]?.value, c = inputs[1]?.value, dur = inputs[2]?.value, desc = entry.querySelector('textarea')?.value
            if (t || c) { workHTML += `<div style="display:flex;gap:8px;margin-bottom:8px;align-items:flex-start;"><div style="flex-shrink:0;width:8px;height:8px;border-radius:50%;background:#2C2C2C;border:2px solid #8FB89A;margin-top:3px;"></div><div style="flex:1;"><div style="display:flex;justify-content:space-between;align-items:baseline;"><b style="font-size:9px;color:#1A1A18;">${t || ''}</b>${dur ? `<span style="font-size:7px;color:#7A776E;white-space:nowrap;">${dur}</span>` : ''}</div>${c ? `<div style="font-size:8px;color:#555;font-style:italic;margin-bottom:1px;">${c}</div>` : ''}${desc ? `<div style="font-size:8px;color:#444;line-height:1.4;">${desc}</div>` : ''}</div></div>` }
        })
        if (workHTML) { document.getElementById('prev-work-section').innerHTML = workHTML; workWrap1.style.display = 'block' } else { workWrap1.style.display = 'none' }
        const certWrap1 = document.getElementById('prev-cert-wrap'); const certData1 = Array.from(document.querySelectorAll('#cert-entries .entry-card')).map(entry => { const inputs = entry.querySelectorAll('input'); return { name: inputs[0]?.value, org: inputs[1]?.value, date: inputs[2]?.value } })
        if (certData1.some(c => c.name || c.org)) { let certHTML = ''; certData1.forEach(c => { if (!c.name && !c.org) return; certHTML += `<div style="margin-bottom:5px;"><div style="font-weight:600;font-size:9px;">${c.name || ''}</div>${c.org ? `<div style="font-size:8px;color:#555;">${c.org}</div>` : ''} ${c.date ? `<div style="font-size:7px;color:#7A776E;">${c.date}</div>` : ''}</div>` }); document.getElementById('prev-cert-section').innerHTML = certHTML; certWrap1.style.display = 'block' } else { certWrap1.style.display = 'none' }
        const awardWrap1 = document.getElementById('prev-award-wrap'); const awardData1 = Array.from(document.querySelectorAll('#award-entries .entry-card')).map(entry => { const inputs = entry.querySelectorAll('input'); return { name: inputs[0]?.value, issuer: inputs[1]?.value, year: inputs[2]?.value } })
        if (awardData1.some(a => a.name || a.issuer)) { let awardHTML = ''; awardData1.forEach(a => { if (!a.name && !a.issuer) return; awardHTML += `<div style="background:#F7F5F0;padding:6px 8px;border-left:2.5px solid #8FB89A;">${a.year ? `<div style="font-size:7px;color:#7A776E;">${a.year}</div>` : ''}<div style="font-weight:600;font-size:8px;">${a.name || ''}</div>${a.issuer ? `<div style="font-size:7px;color:#555;">${a.issuer}</div>` : ''}</div>` }); document.getElementById('prev-award-section').innerHTML = awardHTML; awardWrap1.style.display = 'block' } else { awardWrap1.style.display = 'none' }
        const t1sidebar = document.getElementById('prev-t1-custom'); const t1main = document.getElementById('prev-t1-main-custom')
        if (t1sidebar) t1sidebar.innerHTML = ''; if (t1main) t1main.innerHTML = customLight
    }

    // Template 2
    if (templateNum === '2') {
        document.getElementById('prev-t2-name').textContent = name; document.getElementById('prev-t2-job').textContent = jobtitle
        const sumWrap2 = document.getElementById('prev-t2-summary-wrap')
        if (summary.trim()) { document.getElementById('prev-t2-summary').textContent = summary; sumWrap2.style.display = 'block' } else { sumWrap2.style.display = 'none' }
        const contactWrap2 = document.getElementById('prev-t2-contact-wrap'); let contact2 = ''
        if (email) contact2 += `<div style="margin-bottom:2px;display:flex;gap:4px;align-items:center;"><span style="color:#4A5568;">✉</span><span style="word-break:break-all;">${email}</span></div>`
        if (phone) contact2 += `<div style="margin-bottom:2px;display:flex;gap:4px;"><span style="color:#4A5568;">📞</span>${phone}</div>`
        if (location) contact2 += `<div style="margin-bottom:2px;display:flex;gap:4px;"><span style="color:#4A5568;">📍</span>${location}</div>`
        if (contact2) { document.getElementById('prev-t2-contact').innerHTML = contact2; contactWrap2.style.display = 'block' } else { contactWrap2.style.display = 'none' }
        const eduWrap2 = document.getElementById('prev-t2-edu-wrap'); let e2 = ''
        document.querySelectorAll('#edu-entries .entry-card').forEach(entry => { const inputs = entry.querySelectorAll('input'); const school = inputs[0]?.value, course = inputs[1]?.value, year = inputs[2]?.value; if (school || course) { e2 += `<div style="margin-bottom:6px;">${school ? `<div style="font-weight:600;">${school}</div>` : ''} ${course ? `<div style="color:#555;">${course}</div>` : ''} ${year ? `<div style="color:#7A776E;font-size:7px;">${year}</div>` : ''}</div>` } })
        if (e2) { document.getElementById('prev-t2-edu').innerHTML = e2; eduWrap2.style.display = 'block' } else { eduWrap2.style.display = 'none' }
        const langWrap2 = document.getElementById('prev-t2-lang-wrap'); const langData2 = Array.from(document.querySelectorAll('#lang-entries .entry-card')).map(entry => ({ name: entry.querySelector('input')?.value, level: entry.querySelector('select')?.value }))
        if (langData2.some(l => l.name)) { let langHTML2 = ''; langData2.forEach(l => { if (!l.name) return; langHTML2 += `<div style="margin-bottom:2px;"><span style="font-weight:600;">${l.name}</span>${l.level ? ` <span style="color:#7A776E;font-size:7px;">(${l.level})</span>` : ''}</div>` }); document.getElementById('prev-t2-lang').innerHTML = langHTML2; langWrap2.style.display = 'block' } else { langWrap2.style.display = 'none' }
        const skillsWrap2 = document.getElementById('prev-t2-skills-wrap')
        if (skills.trim()) { const skillList = skills.split(',').map(s => s.trim()).filter(Boolean); document.getElementById('prev-t2-skills').innerHTML = skillList.map(s => `<div style="display:flex;gap:4px;align-items:flex-start;margin-bottom:2px;break-inside:avoid;"><span style="color:#4A5568;flex-shrink:0;">•</span>${s}</div>`).join(''); skillsWrap2.style.display = 'block' } else { skillsWrap2.style.display = 'none' }
        const workWrap2 = document.getElementById('prev-t2-work-wrap'); let w2 = ''
        document.querySelectorAll('#work-entries .entry-card').forEach(entry => { const inputs = entry.querySelectorAll('input'); const t = inputs[0]?.value, c = inputs[1]?.value, dur = inputs[2]?.value, desc = entry.querySelector('textarea')?.value; if (t || c) { w2 += `<div style="margin-bottom:7px;"><div style="display:flex;justify-content:space-between;align-items:baseline;"><div style="font-weight:700;">${t || ''}</div>${dur ? `<span style="color:#7A776E;font-size:7px;white-space:nowrap;">${dur}</span>` : ''}</div>${c ? `<div style="color:#4A5568;font-style:italic;margin-bottom:2px;">${c}</div>` : ''} ${desc ? `<div style="color:#444;line-height:1.5;">${desc}</div>` : ''}</div>` } })
        if (w2) { document.getElementById('prev-t2-work').innerHTML = w2; workWrap2.style.display = 'block' } else { workWrap2.style.display = 'none' }
        const certWrap2 = document.getElementById('prev-t2-cert-wrap'); const certData2 = Array.from(document.querySelectorAll('#cert-entries .entry-card')).map(entry => { const inputs = entry.querySelectorAll('input'); return { name: inputs[0]?.value, org: inputs[1]?.value, date: inputs[2]?.value } })
        if (certData2.some(c => c.name || c.org)) { let certHTML2 = ''; certData2.forEach(c => { if (!c.name && !c.org) return; certHTML2 += `<div style="margin-bottom:5px;"><div style="font-weight:600;">${c.name || ''}</div>${c.org ? `<div style="color:#555;">${c.org}</div>` : ''} ${c.date ? `<div style="color:#7A776E;font-size:7px;">${c.date}</div>` : ''}</div>` }); document.getElementById('prev-t2-cert').innerHTML = certHTML2; certWrap2.style.display = 'block' } else { certWrap2.style.display = 'none' }
        const awardWrap2 = document.getElementById('prev-t2-award-wrap'); const awardData2 = Array.from(document.querySelectorAll('#award-entries .entry-card')).map(entry => { const inputs = entry.querySelectorAll('input'); return { name: inputs[0]?.value, issuer: inputs[1]?.value, year: inputs[2]?.value } })
        if (awardData2.some(a => a.name || a.issuer)) { let awardHTML2 = ''; awardData2.forEach(a => { if (!a.name && !a.issuer) return; awardHTML2 += `<div style="margin-bottom:5px;"><div style="font-weight:600;">${a.name || ''}</div>${a.issuer ? `<div style="color:#555;">${a.issuer}</div>` : ''} ${a.year ? `<div style="color:#7A776E;font-size:7px;">${a.year}</div>` : ''}</div>` }); document.getElementById('prev-t2-award').innerHTML = awardHTML2; awardWrap2.style.display = 'block' } else { awardWrap2.style.display = 'none' }
        if (photoBase64) { document.getElementById('prev-t2-photo').style.display = 'block'; document.getElementById('prev-t2-photo-img').src = photoBase64 } else { document.getElementById('prev-t2-photo').style.display = 'none' }
        const t2left = document.getElementById('prev-t2-custom-left'); const t2right = document.getElementById('prev-t2-custom-right')
        if (t2left) t2left.innerHTML = customLight; if (t2right) t2right.innerHTML = ''
    }

    // Template 3
    if (templateNum === '3') {
        document.getElementById('prev-t3-name').textContent = name; document.getElementById('prev-t3-job').textContent = jobtitle + (location ? ' · ' + location : '')
        document.getElementById('prev-t3-contact').textContent = [email && `Email: ${email}`, phone && `Phone: ${phone}`, location && `Location: ${location}`].filter(Boolean).join('  |  ')
        document.getElementById('prev-t3-summary').textContent = summary
        document.getElementById('prev-t3-work').innerHTML = buildSectionHTML({ work, edu, skills, certs, awards, languages, borderColor: '#D4CFC4' })
        document.getElementById('prev-t3-edu').innerHTML = ''
        const t3custom = document.getElementById('prev-t3-custom'); if (t3custom) t3custom.innerHTML = customLight
        const t3photo = document.getElementById('prev-t3-photo-wrap'); const t3img = document.getElementById('prev-t3-photo-img')
        if (photoBase64) { t3photo.style.display = 'block'; t3img.src = photoBase64 } else { t3photo.style.display = 'none' }
    }

    // Template 4
    if (templateNum === '4') {
        document.getElementById('prev-t4-name').textContent = (name || 'YOUR NAME').toUpperCase(); document.getElementById('prev-t4-job').textContent = jobtitle || 'Job Title'
        const t4photo = document.getElementById('prev-t4-photo-wrap'); const t4noPhoto = document.getElementById('prev-t4-no-photo'); const t4img = document.getElementById('prev-t4-photo-img')
        if (photoBase64) { t4photo.style.display = 'block'; t4img.src = photoBase64; t4noPhoto.style.display = 'none' } else { t4photo.style.display = 'none'; t4noPhoto.style.display = 'block' }
        const eduSidebarData = Array.from(document.querySelectorAll('#edu-entries .entry-card')).map(entry => { const inputs = entry.querySelectorAll('input'); return { school: inputs[0]?.value, course: inputs[1]?.value, year: inputs[2]?.value } })
        const eduWrap = document.getElementById('prev-t4-edu-wrap')
        if (eduSidebarData.some(e => e.school || e.course)) { let eduHTML = ''; eduSidebarData.forEach(e => { if (!e.school && !e.course) return; if (e.year) eduHTML += `<div style="font-size:7px;color:#7A776E;margin-bottom:1px;">${e.year}</div>`; if (e.course) eduHTML += `<div style="font-weight:600;color:#1A1A18;">${e.course}</div>`; if (e.school) eduHTML += `<div style="font-style:italic;">${e.school}</div>`; eduHTML += `<div style="margin-bottom:6px;"></div>` }); document.getElementById('prev-t4-edu-sidebar').innerHTML = eduHTML; eduWrap.style.display = 'block' } else { eduWrap.style.display = 'none' }
        const skillsWrap = document.getElementById('prev-t4-skills-wrap')
        if (skills.trim()) { document.getElementById('prev-t4-skills').innerHTML = skills.split(',').map(s => s.trim()).filter(Boolean).map(s => `<div style="display:flex;align-items:center;gap:4px;margin-bottom:3px;"><span style="color:#8FB89A;">•</span>${s}</div>`).join(''); skillsWrap.style.display = 'block' } else { skillsWrap.style.display = 'none' }
        const langSidebarData = Array.from(document.querySelectorAll('#lang-entries .entry-card')).map(entry => ({ name: entry.querySelector('input')?.value, level: entry.querySelector('select')?.value }))
        const langWrap = document.getElementById('prev-t4-lang-wrap')
        if (langSidebarData.some(l => l.name)) { let langHTML = ''; langSidebarData.forEach(l => { if (!l.name) return; langHTML += `<div style="margin-bottom:3px;"><span style="color:#1A1A18;font-weight:600;">${l.name}</span>${l.level ? ` <span style="font-size:7px;">(${l.level})</span>` : ''}</div>` }); document.getElementById('prev-t4-lang-sidebar').innerHTML = langHTML; langWrap.style.display = 'block' } else { langWrap.style.display = 'none' }
        const certSidebarData = Array.from(document.querySelectorAll('#cert-entries .entry-card')).map(entry => { const inputs = entry.querySelectorAll('input'); return { name: inputs[0]?.value, org: inputs[1]?.value, date: inputs[2]?.value } })
        const certSidebarWrap = document.getElementById('prev-t4-cert-sidebar-wrap')
        if (certSidebarData.some(c => c.name || c.org)) { let certHTML = ''; certSidebarData.forEach(c => { if (!c.name && !c.org) return; certHTML += `<div style="margin-bottom:5px;">${c.name ? `<div style="font-weight:600;color:#1A1A18;">${c.name}</div>` : ''} ${c.org ? `<div style="font-style:italic;">${c.org}</div>` : ''} ${c.date ? `<div style="font-size:7px;">${c.date}</div>` : ''}</div>` }); document.getElementById('prev-t4-cert-sidebar').innerHTML = certHTML; certSidebarWrap.style.display = 'block' } else { certSidebarWrap.style.display = 'none' }
        let contact = ''; if (email) contact += `<div style="margin-bottom:3px;">📧 ${email}</div>`; if (phone) contact += `<div style="margin-bottom:3px;">📞 ${phone}</div>`; if (location) contact += `<div style="margin-bottom:3px;">📍 ${location}</div>`
        document.getElementById('prev-t4-contact').innerHTML = contact
        const summaryWrap = document.getElementById('prev-t4-summary-wrap')
        if (summary.trim()) { document.getElementById('prev-t4-summary').textContent = summary; summaryWrap.style.display = 'block' } else { summaryWrap.style.display = 'none' }
        const workWrap = document.getElementById('prev-t4-work-wrap'); let workHTML = ''
        document.querySelectorAll('#work-entries .entry-card').forEach(entry => {
            const inputs = entry.querySelectorAll('input'); const t = inputs[0]?.value, c = inputs[1]?.value, dur = inputs[2]?.value, desc = entry.querySelector('textarea')?.value
            if (t || c) { workHTML += `<div style="display:flex;gap:6px;margin-bottom:8px;align-items:flex-start;"><div style="flex-shrink:0;width:7px;height:7px;border-radius:50%;background:#2B3A2E;border:1.5px solid #8FB89A;margin-top:3px;"></div><div style="flex:1;"><div style="display:flex;justify-content:space-between;align-items:baseline;"><b style="font-size:9px;">${t || ''}</b>${dur ? `<span style="font-size:7px;color:#7A776E;white-space:nowrap;">${dur}</span>` : ''}</div>${c ? `<div style="font-size:8px;color:#555;font-style:italic;margin-bottom:1px;">${c}</div>` : ''} ${desc ? `<div style="font-size:8px;color:#444;line-height:1.4;">${desc}</div>` : ''}</div></div>` }
        })
        if (workHTML) { document.getElementById('prev-t4-work').innerHTML = workHTML; workWrap.style.display = 'block' } else { workWrap.style.display = 'none' }
        const awardWrap = document.getElementById('prev-t4-award-wrap'); const awardData = Array.from(document.querySelectorAll('#award-entries .entry-card')).map(entry => { const inputs = entry.querySelectorAll('input'); return { name: inputs[0]?.value, issuer: inputs[1]?.value, year: inputs[2]?.value } })
        if (awardData.some(a => a.name || a.issuer)) { let awardHTML = ''; awardData.forEach(a => { if (!a.name && !a.issuer) return; awardHTML += `<div style="background:#F7F5F0;padding:6px 8px;border-left:2.5px solid #8FB89A;">${a.year ? `<div style="font-size:7px;color:#7A776E;">${a.year}</div>` : ''}<div style="font-weight:600;font-size:8px;">${a.name || ''}</div>${a.issuer ? `<div style="font-size:7px;color:#555;">${a.issuer}</div>` : ''}</div>` }); document.getElementById('prev-t4-award').innerHTML = awardHTML; awardWrap.style.display = 'block' } else { awardWrap.style.display = 'none' }
        const t4sidebar = document.getElementById('prev-t4-custom-sidebar'); const t4main = document.getElementById('prev-t4-custom-main')
        if (t4sidebar) t4sidebar.innerHTML = ''; if (t4main) t4main.innerHTML = customLight
    }

    saveDraft()
}

async function buildResume() {
    const formData = collectFormData()
    formData.fontFamily = document.getElementById('fontFamily').value;
    formData.fontSize = document.getElementById('fontSize').value;

    localStorage.setItem('profile_form_data', JSON.stringify(formData))
    localStorage.setItem('profile_form_draft_t' + templateNum, JSON.stringify(formData))
    localStorage.setItem('profile_accent_dark', window.currentAccentDark || TEMPLATE_DEFAULTS[templateNum].dark)
    localStorage.setItem('profile_accent_light', window.currentAccentLight || TEMPLATE_DEFAULTS[templateNum].light)

    const token = localStorage.getItem('profile_token')
    if (token) {
        try {
            await fetch('/api/resumes', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ title: formData.name ? formData.name + "'s Resume" : 'Untitled Resume', template_num: parseInt(templateNum), resume_data: formData })
            })
        } catch (e) { console.warn('Could not save to server:', e) }
    }

    window.location.href = '../template' + templateNum + '.html';
}

function scalePreview() {
    const outer = document.getElementById('previewOuter'); const inner = document.getElementById('previewResume')
    if (!outer || !inner) return
    const panelW = outer.parentElement.clientWidth - 32
    const fitScale = panelW / 700; const scale = Math.min(fitScale, 1.0)
    inner.style.transform = `scale(${scale})`; inner.style.transformOrigin = 'top left'
    outer.style.height = Math.round(1123 * scale) + 'px'; outer.style.width = Math.round(794 * scale) + 'px'; outer.style.margin = '0 auto'
}

// ── AI Assist ──
let aiLastResult = ''
function toggleAiPanel() {
    const panel = document.getElementById('aiAssistPanel'); const isHidden = panel.style.display === 'none'
    panel.style.display = isHidden ? 'block' : 'none'
    if (isHidden) { setTimeout(() => document.getElementById('aiPromptInput').focus(), 50); document.getElementById('aiResultArea').style.display = 'none'; document.getElementById('aiErrorArea').style.display = 'none' }
}

async function runAiGenerate() {
    const userPrompt = document.getElementById('aiPromptInput').value.trim()
    const btn = document.getElementById('btnGenerate'); const btnText = document.getElementById('generateBtnText')
    const resultArea = document.getElementById('aiResultArea'); const resultText = document.getElementById('aiResultText'); const errorArea = document.getElementById('aiErrorArea')

    const name = document.getElementById('f-name').value.trim(); const jobtitle = document.getElementById('f-jobtitle').value.trim()
    const location = document.getElementById('f-location').value.trim(); const skills = document.getElementById('f-skills').value.trim()

    const workEntries = []
    document.querySelectorAll('#work-entries .entry-card').forEach(entry => {
        const inputs = entry.querySelectorAll('input'); const title = inputs[0]?.value.trim(); const company = inputs[1]?.value.trim(); const dur = inputs[2]?.value.trim(); const desc = entry.querySelector('textarea')?.value.trim()
        if (title || company) workEntries.push(`${title}${company ? ' at ' + company : ''}${dur ? ' (' + dur + ')' : ''}${desc ? ': ' + desc : ''}`)
    })

    btn.disabled = true; btnText.className = 'ai-loading-dots'; btnText.textContent = 'Generating'; resultArea.style.display = 'none'; errorArea.style.display = 'none'

    try {
        const response = await fetch('/api/ai/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('profile_token') },
            body: JSON.stringify({
                name: name, jobTitle: jobtitle, skills: skills, experience: workEntries.join('\n'), tone: 'Professional',
                instruction: userPrompt // FIXED: Now sending the user prompt to the backend
            })
        })

        if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error((typeof err.error === 'string' ? err.error : err?.error?.message) || `API error ${response.status}`) }
        const data = await response.json(); const result = data.summary
        if (!result) throw new Error('Empty response from AI.')

        aiLastResult = result; resultText.textContent = result; resultArea.style.display = 'block'
    } catch (err) {
        errorArea.innerHTML = `⚠ ${err.message || 'Something went wrong. Please try again.'}`; errorArea.style.display = 'block'
    } finally {
        btn.disabled = false; btnText.className = ''; btnText.textContent = '✦ Generate'
    }
}

function acceptAiResult() {
    if (!aiLastResult) return
    document.getElementById('f-summary').value = aiLastResult; updatePreview()
    document.getElementById('aiAssistPanel').style.display = 'none'; aiLastResult = ''
}

function discardAiResult() { document.getElementById('aiResultArea').style.display = 'none'; aiLastResult = '' }

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    let matchedSwatch = null;
    document.querySelectorAll('.color-swatch').forEach(s => { if (s.dataset.color && s.dataset.color.toLowerCase() === window.currentAccentDark.toLowerCase()) { s.classList.add('active'); matchedSwatch = s; } });
    setTimeout(() => { applyAccentColor(window.currentAccentDark, window.currentAccentLight, matchedSwatch); }, 100);
    loadResumeFromServer(); scalePreview(); window.addEventListener('resize', scalePreview);
    const templateNames = { '1': 'Classic Sidebar', '2': 'Bold Header', '3': 'Minimal', '4': 'Two Column' }
    document.getElementById('templateLabel').textContent = templateNames[templateNum] || 'Classic Sidebar'
        ;['prev-t1', 'prev-t2', 'prev-t3', 'prev-t4'].forEach((id, i) => { const el = document.getElementById(id); el.style.visibility = String(i + 1) === templateNum ? 'visible' : 'hidden'; el.style.opacity = String(i + 1) === templateNum ? '1' : '0'; el.style.zIndex = String(i + 1) === templateNum ? '1' : '0'; })
});